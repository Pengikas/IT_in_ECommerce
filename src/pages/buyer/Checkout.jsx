import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import { API_MODE } from "../../services/config";
import ProductArt from "../../components/marketplace/ProductArt";
import Icon from "../../components/common/Icon";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Empty from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Field from "../../components/common/Field";
import Form from "../../components/common/Form";
import Notice from "../../components/common/Notice";
import Steps from "../../components/order/CheckoutStepper";
import money from "../../utils/money";
export default function Checkout() {
  const query = useRecords("cart");
  const {
    user,
    action
  } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({
    companyName: user.companyName,
    taxId: "",
    purchaseRef: "",
    address: "",
    deliveryMethod: "Standard freight",
    paymentMethod: "Invoice · Net 30 (simulation)"
  });
  const items = query.data || [];
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const fee = shipping.deliveryMethod === "Express air freight" ? 650 : 250;
  const set = (key, value) => setShipping(s => ({
    ...s,
    [key]: value
  }));
  const steps = ["Shipping & company", "Delivery method", "Payment", "Review & place order"];
  async function next(data) {
    const values = {
      ...shipping,
      ...Object.fromEntries(data)
    };
    delete values.confirm;
    setShipping(values);
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    const order = await action("order:create", {
      items,
      shipping: values
    });
    if (!order?.id) throw Error("Order response is missing its ID.");
    navigate(`/buyer/orders/${order.id}?justPlaced=1`);
  }
  return <div className="page">
      <Title eyebrow="SECURE PROCUREMENT / CHECKOUT" title="Complete your order" description="Review company details and delivery preferences." />
      <State query={query}>
        {!items.length ? <Empty title="Your cart is empty" text="Add a component before checking out." /> : <>
            <Steps items={steps} current={step} />
            <div className="purchase-layout">
              <Form className="card p-6 md:p-8" onSubmit={next}>
                <h2 className="form-heading">{steps[step]}</h2>
                {step === 0 && <div className="space-y-5">
                    <Notice>
                      {API_MODE ? "Order details are submitted to the backend." : "Business information is used for this demonstration order only."}
                    </Notice>
                    <Field label="Company name" name="companyName" required defaultValue={shipping.companyName} />
                    <Field label="Business / tax ID" name="taxId" required defaultValue={shipping.taxId} />
                    <Field label="Purchase reference (optional)" name="purchaseRef" defaultValue={shipping.purchaseRef} />
                    <Field label="Shipping address">
                      <textarea className="input" rows={3} name="address" required defaultValue={shipping.address} />
                    </Field>
                  </div>}
                {step === 1 && <div className="space-y-4">
                    {[["Standard freight", "5–7 business days", 250], ["Express air freight", "2–3 business days", 650]].map(([method, desc, price]) => <label key={method} className={"choice-card " + (shipping.deliveryMethod === method ? "selected" : "")}>
                        <input type="radio" name="deliveryMethod" value={method} checked={shipping.deliveryMethod === method} onChange={() => set("deliveryMethod", method)} />
                        <div className="flex-1">
                          <b>{method}</b>
                          <p className="tiny muted mt-2">{desc} · Estimate</p>
                        </div>
                        <b className="mono">{money(price)}</b>
                      </label>)}
                  </div>}
                {step === 2 && <div className="space-y-5">
                    <Notice>
                      Payment simulation only. No charge is made by this
                      frontend. Do not enter real card or banking details.
                    </Notice>
                    {["Invoice · Net 30 (simulation)", "Demo card · 4242 (simulation)"].map(method => <label className="choice-card" key={method}>
                        <input type="radio" name="paymentMethod" value={method} checked={shipping.paymentMethod === method} onChange={() => set("paymentMethod", method)} />
                        {method}
                      </label>)}
                  </div>}
                {step === 3 && <div className="space-y-6 text-xs">
                    <div className="form-grid">
                      <div>
                        <p className="eyebrow mb-2">SHIP TO</p>
                        <b>{shipping.companyName}</b>
                        <p className="muted mt-2 whitespace-pre-line">
                          {shipping.address}
                        </p>
                      </div>
                      <div>
                        <p className="eyebrow mb-2">COMPANY DETAILS</p>
                        <p>Tax ID: {shipping.taxId}</p>
                        <p className="mt-2">
                          PO: {shipping.purchaseRef || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      <p className="eyebrow mb-2">DELIVERY & PAYMENT</p>
                      <p>{shipping.deliveryMethod}</p>
                      <p className="muted mt-2">{shipping.paymentMethod}</p>
                    </div>
                    <label className="flex items-start gap-2 muted">
                      <input type="checkbox" name="confirm" required /><span><span className="required-marker" aria-hidden="true">*</span> I confirm
                      the shipping details and understand that payment is
                      simulated.
                    </span></label>
                  </div>}
                <div className="flex justify-between mt-8 pt-5 border-t border-slate-200">
                  <Button tone="ghost" onClick={() => step ? setStep(step - 1) : navigate("/buyer/cart")}>
                    ← Back
                  </Button>
                  <Button type="submit">
                    {step === 3 ? API_MODE ? "Submit order to server" : "Place demo order" : "Continue"}
                    <Icon name="arrow" size={13} />
                  </Button>
                </div>
              </Form>
              <aside className="card p-5 checkout-summary">
                <h2 className="text-sm mb-5">Order summary</h2>
                {items.map(item => <div key={item.id} className="flex gap-3 mb-5">
                    <ProductArt product={item.product} className="w-16 h-16 shrink-0 rounded" />
                    <div className="tiny">
                      <b>{item.product.name}</b>
                      <p className="muted mt-2">
                        Qty {item.quantity} · {money(item.product.price)}
                      </p>
                    </div>
                  </div>)}
                <div className="summary-lines">
                  <p>
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </p>
                  <p>
                    <span>Estimated shipping</span>
                    <span>{money(fee)}</span>
                  </p>
                  <p className="summary-total">
                    <span>Total estimate</span>
                    <b className="mono">{money(subtotal + fee)}</b>
                  </p>
                </div>
                <p className="tiny muted mt-5">
                  USD ·{" "}
                  {API_MODE ? "Final totals come from the server. Payment gateway is not connected." : "Demo transaction. No real payment, fulfilment or tax calculation."}
                </p>
              </aside>
            </div>
          </>}
      </State>
    </div>;
}
