import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useApp, useRecords } from "../services/store";
import { API_MODE } from "../services/config";
import ProductArt from "../components/ProductArt";
import Icon from "../components/Icon";
import {
  Title,
  State,
  Empty,
  Button,
  Field,
  Form,
  Notice,
  Steps,
  Table,
  Timeline,
  money,
  date,
  stages,
} from "../components/UI";
export function Cart() {
  const query = useRecords("cart");
  const { action, flash } = useApp();
  const items = query.data || [];
  return (
    <div className="page">
      <Title
        eyebrow="PROCUREMENT / CART"
        title={`Your cart (${items.reduce((s, i) => s + i.quantity, 0)} items)`}
        description="Review your selected components before checkout."
        action={
          <Link className="btn btn-secondary" to="/marketplace">
            Continue sourcing →
          </Link>
        }
      />
      <State query={query}>
        {!items.length ? (
          <Empty
            title="Your next mission starts here"
            text="Your cart is empty. Explore the catalog to find compatible components."
          />
        ) : (
          <div className="purchase-layout">
            <section className="card p-5">
              {items.map((item) => (
                <div key={item.id} className="cart-row">
                  <ProductArt
                    product={item.product}
                    className="w-24 h-24 rounded shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      className="text-xs font-semibold"
                      to={"/products/" + item.product.id}
                    >
                      {item.product.name}
                    </Link>
                    <p className="tiny mono muted my-2">
                      {item.product.partNumber}
                    </p>
                    <p className="tiny text-success">
                      {item.product.stock} available · {item.product.condition}
                    </p>
                    <Button
                      tone="ghost"
                      className="compact text-critical mt-2"
                      onClick={() => action("cart:remove", { id: item.id })}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="cart-price">
                    <b className="mono text-xs">
                      {money(item.product.price * item.quantity)}
                    </b>
                    <Field label="Quantity">
                      <input
                        aria-label={"Quantity " + item.product.name}
                        className="input w-20"
                        type="number"
                        min="1"
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const quantity = Number(e.target.value);
                          if (Number.isInteger(quantity) && quantity > 0)
                            action("cart:update", {
                              id: item.id,
                              quantity,
                            }).catch((e) => flash(e.message, true));
                        }}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </section>
            <aside className="card p-6 h-fit">
              <h2 className="mb-6">Order summary</h2>
              <p className="flex justify-between text-xs mb-4">
                <span>Subtotal</span>
                <b className="mono">
                  {money(
                    items.reduce((s, i) => s + i.product.price * i.quantity, 0),
                  )}
                </b>
              </p>
              <p className="tiny muted mb-5">
                Shipping calculated at checkout.
              </p>
              <Link className="btn btn-primary w-full" to="/buyer/checkout">
                Proceed to checkout <Icon name="arrow" size={14} />
              </Link>
              <div className="mt-5">
                <Notice>
                  {API_MODE
                    ? "The server revalidates stock and final prices."
                    : "Demo procurement · No real charge."}
                </Notice>
              </div>
            </aside>
          </div>
        )}
      </State>
    </div>
  );
}
export function Checkout() {
  const query = useRecords("cart");
  const { user, action } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({
    companyName: user.companyName,
    taxId: "",
    purchaseRef: "",
    address: "",
    deliveryMethod: "Standard freight",
    paymentMethod: "Invoice · Net 30 (simulation)",
  });
  const items = query.data || [];
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const fee = shipping.deliveryMethod === "Express air freight" ? 650 : 250;
  const set = (key, value) => setShipping((s) => ({ ...s, [key]: value }));
  const steps = [
    "Shipping & company",
    "Delivery method",
    "Payment",
    "Review & place order",
  ];
  async function next(data) {
    const values = { ...shipping, ...Object.fromEntries(data) };
    delete values.confirm;
    setShipping(values);
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    const order = await action("order:create", { items, shipping: values });
    if (!order?.id) throw Error("Order response is missing its ID.");
    navigate(`/buyer/orders/${order.id}?justPlaced=1`);
  }
  return (
    <div className="page">
      <Title
        eyebrow="SECURE PROCUREMENT / CHECKOUT"
        title="Complete your order"
        description="Review company details and delivery preferences."
      />
      <State query={query}>
        {!items.length ? (
          <Empty
            title="Your cart is empty"
            text="Add a component before checking out."
          />
        ) : (
          <>
            <Steps items={steps} current={step} />
            <div className="purchase-layout">
              <Form className="card p-6 md:p-8" onSubmit={next}>
                <h2 className="form-heading">{steps[step]}</h2>
                {step === 0 && (
                  <div className="space-y-5">
                    <Notice>
                      {API_MODE
                        ? "Order details are submitted to the backend."
                        : "Business information is used for this demonstration order only."}
                    </Notice>
                    <Field
                      label="Company name"
                      name="companyName"
                      required
                      defaultValue={shipping.companyName}
                    />
                    <Field
                      label="Business / tax ID"
                      name="taxId"
                      required
                      defaultValue={shipping.taxId}
                    />
                    <Field
                      label="Purchase reference (optional)"
                      name="purchaseRef"
                      defaultValue={shipping.purchaseRef}
                    />
                    <Field label="Shipping address">
                      <textarea
                        className="input"
                        rows={3}
                        name="address"
                        required
                        defaultValue={shipping.address}
                      />
                    </Field>
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-4">
                    {[
                      ["Standard freight", "5–7 business days", 250],
                      ["Express air freight", "2–3 business days", 650],
                    ].map(([method, desc, price]) => (
                      <label
                        key={method}
                        className={
                          "choice-card " +
                          (shipping.deliveryMethod === method ? "selected" : "")
                        }
                      >
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value={method}
                          checked={shipping.deliveryMethod === method}
                          onChange={() => set("deliveryMethod", method)}
                        />
                        <div className="flex-1">
                          <b>{method}</b>
                          <p className="tiny muted mt-2">{desc} · Estimate</p>
                        </div>
                        <b className="mono">{money(price)}</b>
                      </label>
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-5">
                    <Notice>
                      Payment simulation only. No charge is made by this
                      frontend. Do not enter real card or banking details.
                    </Notice>
                    {[
                      "Invoice · Net 30 (simulation)",
                      "Demo card · 4242 (simulation)",
                    ].map((method) => (
                      <label className="choice-card" key={method}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={shipping.paymentMethod === method}
                          onChange={() => set("paymentMethod", method)}
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-6 text-xs">
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
                      <input type="checkbox" name="confirm" required />I confirm
                      the shipping details and understand that payment is
                      simulated.
                    </label>
                  </div>
                )}
                <div className="flex justify-between mt-8 pt-5 border-t border-slate-200">
                  <Button
                    tone="ghost"
                    onClick={() =>
                      step ? setStep(step - 1) : navigate("/buyer/cart")
                    }
                  >
                    ← Back
                  </Button>
                  <Button type="submit">
                    {step === 3
                      ? API_MODE
                        ? "Submit order to server"
                        : "Place demo order"
                      : "Continue"}
                    <Icon name="arrow" size={13} />
                  </Button>
                </div>
              </Form>
              <aside className="card p-5 checkout-summary">
                <h2 className="text-sm mb-5">Order summary</h2>
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 mb-5">
                    <ProductArt
                      product={item.product}
                      className="w-16 h-16 shrink-0 rounded"
                    />
                    <div className="tiny">
                      <b>{item.product.name}</b>
                      <p className="muted mt-2">
                        Qty {item.quantity} · {money(item.product.price)}
                      </p>
                    </div>
                  </div>
                ))}
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
                  {API_MODE
                    ? "Final totals come from the server. Payment gateway is not connected."
                    : "Demo transaction. No real payment, fulfilment or tax calculation."}
                </p>
              </aside>
            </div>
          </>
        )}
      </State>
    </div>
  );
}
export function Orders() {
  const query = useRecords("orders");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const rows = (query.data || []).filter(
    (o) =>
      (!filter || o.status === filter) &&
      o.id.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="page">
      <Title
        eyebrow="BUYER / PROCUREMENT"
        title="Orders"
        description="Track your sourcing activity from placement to delivery."
      />
      <div className="toolbar">
        <input
          aria-label="Search orders"
          className="input max-w-md"
          placeholder="Search order reference…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input w-auto"
          aria-label="Filter order status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {stages.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <State query={query}>
        <Table
          rows={rows}
          columns={[
            {
              key: "id",
              label: "Order reference",
              render: (o) => (
                <Link className="mono text-accent" to={"/buyer/orders/" + o.id}>
                  {o.id}
                </Link>
              ),
            },
            {
              key: "placedAt",
              label: "Placed",
              render: (o) => date(o.placedAt),
            },
            { key: "total", label: "Total", render: (o) => money(o.total) },
            {
              key: "status",
              label: "Order progress",
              render: (o) => <Timeline status={o.status} />,
            },
          ]}
        />
      </State>
    </div>
  );
}
export function OrderDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const query = useRecords("order", id);
  const { db, action } = useApp();
  const o = query.data;
  return (
    <div className="page">
      <State query={query}>
        {!o ? (
          <Empty
            title="Order not found"
            text="The requested order is not available."
            link="/buyer/orders"
            action="Back to orders"
          />
        ) : (
          <>
            {params.get("justPlaced") && (
              <Notice success>
                {API_MODE
                  ? "Order accepted by the backend. Totals and status below come from the server."
                  : "Order placed successfully. This demo order is saved in your browser; no real payment was made."}
              </Notice>
            )}
            <Title
              eyebrow="BUYER / PROCUREMENT ORDER"
              title={o.id}
              description={"Placed " + date(o.placedAt) + " · " + o.status}
              action={
                <Link className="btn btn-secondary" to="/buyer/orders">
                  ← All orders
                </Link>
              }
            />
            <section className="card p-6">
              <h2 className="mb-6">Order status</h2>
              <Timeline status={o.status} />
            </section>
            <div className="purchase-layout">
              <section className="card p-6">
                <h2 className="mb-5">Order details</h2>
                {o.items.map((item, index) => (
                  <div
                    className="cart-row"
                    key={item.orderItemId || item.listingId || index}
                  >
                    <ProductArt
                      product={item.product}
                      className="w-24 h-20 rounded shrink-0"
                    />
                    <div className="flex-1">
                      <Link
                        className="text-xs font-semibold"
                        to={"/products/" + item.productId}
                      >
                        {item.product?.name ||
                          item.product?.productName ||
                          item.productId}
                      </Link>
                      <p className="tiny muted mt-2">
                        Quantity {item.quantity} · P/N{" "}
                        {item.product?.partNumber}
                      </p>
                    </div>
                    <b className="mono text-xs">
                      {money(item.price * item.quantity)}
                    </b>
                  </div>
                ))}
                <div className="summary-lines">
                  {o.shipping !== undefined && (
                    <p>
                      <span>Shipping</span>
                      <span>{money(o.shipping)}</span>
                    </p>
                  )}
                  <p className="summary-total">
                    <span>Total order value</span>
                    <strong className="mono">{money(o.total)}</strong>
                  </p>
                </div>
              </section>
              <aside className="card p-6 h-fit">
                <h2 className="text-sm mb-5">Delivery & payment</h2>
                <b className="text-xs">
                  {o.shippingInfo?.companyName || "Buyer company"}
                </b>
                <p className="tiny muted whitespace-pre-line mt-3 leading-relaxed">
                  {o.shippingInfo?.address || "Shipping address not provided"}
                </p>
                <hr className="border-slate-200 my-5" />
                <p className="tiny muted">
                  {o.shippingInfo?.deliveryMethod || "Standard freight"}
                </p>
                <p className="tiny muted mt-3">
                  {o.shippingInfo?.paymentMethod || "Demo payment"}
                </p>
                <p className="tiny muted mt-3">
                  PO: {o.shippingInfo?.purchaseRef || "Not provided"}
                </p>
              </aside>
            </div>
            {!API_MODE && (
              <section className="card p-6">
                <h2>Need help with this order?</h2>
                <p className="muted mt-2 mb-5">
                  Record a support request in the local demo. No external
                  message will be sent.
                </p>
                {db.support.some((r) => r.orderId === id) ? (
                  <Notice success>
                    Your demo support request has been recorded locally.
                  </Notice>
                ) : (
                  <Form
                    className="support-form"
                    onSubmit={(data) =>
                      action("support:add", {
                        orderId: id,
                        type: data.get("type"),
                        reason: data.get("reason"),
                      })
                    }
                  >
                    <select
                      aria-label="Request type"
                      className="input"
                      name="type"
                    >
                      <option>Order enquiry</option>
                      {!["Shipped", "Delivered"].includes(o.status) && (
                        <option>Cancellation request</option>
                      )}
                      {o.status === "Delivered" && (
                        <option>Return / refund request</option>
                      )}
                    </select>
                    <input
                      className="input"
                      aria-label="Support request details"
                      name="reason"
                      required
                      placeholder="Tell us how we can help…"
                    />
                    <Button type="submit" tone="secondary">
                      Save request
                    </Button>
                  </Form>
                )}
              </section>
            )}
          </>
        )}
      </State>
    </div>
  );
}
