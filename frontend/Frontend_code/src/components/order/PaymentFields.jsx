import Field from "../common/Field";
import Button from "../common/Button";
import Notice from "../common/Notice";
import { API_MODE } from "../../services/config";
import { PAYMENT_METHODS, paymentSummary } from "../../utils/payments";
export default function PaymentFields({ value, onChange, shipping }) {
  const set = (key, next) => onChange(previous => ({ ...previous, [key]: next, ...(key !== "testAuthorization" ? { testAuthorization: null } : {}) }));
  return <div className="space-y-5">
    <Notice>{API_MODE ? "Invoice and transfer instructions require server confirmation. Card checkout needs a secure payment-provider session from the backend." : "Test checkout: no money is transferred. Use sample billing information; no real card or bank credentials are requested."}</Notice>
    <fieldset className="payment-methods"><legend className="form-heading">Payment method <span className="required-marker">*</span></legend>
      {Object.entries(PAYMENT_METHODS).map(([method, label]) => <label className={`choice-card ${value.method === method ? "selected" : ""}`} key={method}><input type="radio" name="payment-choice" value={method} checked={value.method === method} onChange={() => set("method", method)} />{label}</label>)}
    </fieldset>
    <div className="form-grid payment-fields" key={value.method}>
      <Field label={value.method === "bank" ? "Payer / account holder name" : value.method === "card" ? "Cardholder name" : "Billing contact name"} required value={value.billingName} onChange={e => set("billingName", e.target.value)} autoComplete="name" />
      <Field label="Billing email" type="email" required value={value.billingEmail} onChange={e => set("billingEmail", e.target.value)} autoComplete="email" />
      <div className="col-span-full"><Field label="Billing address"><textarea className="input" rows={3} required value={value.billingAddress} onChange={e => set("billingAddress", e.target.value)} autoComplete="billing street-address" /></Field></div>
      {value.method === "invoice" && <div className="col-span-full payment-instructions"><h3>Invoice instructions</h3><p>Company: {shipping.companyName}</p><p>Business / tax ID: {shipping.taxId}</p><p>Purchase reference: {shipping.purchaseRef || "Not supplied (optional)"}</p><p>Requested terms: Net 30, subject to seller approval. An invoice request does not mark the order as paid.</p></div>}
      {value.method === "bank" && <><Field label="Transfer reference" required maxLength={80} value={value.transferReference} onChange={e => set("transferReference", e.target.value)} /><div className="col-span-full payment-instructions"><h3>Bank transfer instructions</h3><p>{API_MODE ? "The seller must provide a verified invoice and bank instructions through the backend. No bank account details are available in this frontend." : "Demo reference only: use a test reference such as AERO-TEST-001. No beneficiary account is configured and no transfer is initiated."}</p><p>The order remains awaiting transfer until the backend verifies receipt.</p></div></>}
      {value.method === "card" && <div className="col-span-full payment-instructions"><h3>Secure card checkout</h3><p>{API_MODE ? "A backend-created hosted payment session is required. Card payments are currently unavailable." : "Test Visa •••• 4242 is provided for this demo. Production card fields must be hosted by a payment provider; this app does not collect card numbers or CVV."}</p>
        <Button disabled={API_MODE || !!value.testAuthorization} onClick={() => {
          paymentSummary({ ...value, testAuthorization: "TEST-VALIDATION" }, shipping);
          set("testAuthorization", "DEMO-AUTH-" + crypto.randomUUID().slice(0, 8));
        }}>{value.testAuthorization ? "Test payment authorized" : "Authorize test payment"}</Button>
        {value.testAuthorization && <p role="status">Test authorization recorded. This is not a real charge.</p>}
      </div>}
    </div>
  </div>;
}
