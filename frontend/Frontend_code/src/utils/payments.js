export const PAYMENT_METHODS = {
  invoice: "Invoice · Net 30",
  bank: "Bank transfer",
  card: "Card"
};
export function paymentSummary(payment, shipping, apiMode = false) {
  if (!PAYMENT_METHODS[payment.method]) throw Error("Choose a payment method.");
  const billingName = String(payment.billingName || "").trim();
  const billingEmail = String(payment.billingEmail || "").trim();
  const billingAddress = String(payment.billingAddress || shipping.address || "").trim();
  if (!billingName || !billingAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail)) throw Error("Complete the required billing information.");
  if (payment.method === "bank" && !String(payment.transferReference || "").trim()) throw Error("Enter your transfer reference.");
  if (payment.method === "card" && (apiMode || !payment.testAuthorization)) throw Error(apiMode ? "Card payment requires a backend payment-session endpoint and a payment provider." : "Authorize the test payment before continuing.");
  // Explicit allow-list: never persist card numbers, CVV, bank credentials or provider secrets.
  return { method: payment.method, label: PAYMENT_METHODS[payment.method], billingName, billingEmail, billingAddress,
    ...(payment.method === "invoice" ? { purchaseRef: shipping.purchaseRef || "", terms: "Net 30" } : {}),
    ...(payment.method === "bank" ? { payerName: billingName, transferReference: payment.transferReference.trim() } : {}),
    ...(payment.method === "card" ? { testAuthorization: payment.testAuthorization, cardDisplay: "Test Visa •••• 4242" } : {}),
    status: apiMode ? "Pending server confirmation" : payment.method === "card" ? "Test authorization recorded" : payment.method === "bank" ? "Awaiting bank transfer" : "Awaiting invoice approval",
    simulated: !apiMode
  };
}
