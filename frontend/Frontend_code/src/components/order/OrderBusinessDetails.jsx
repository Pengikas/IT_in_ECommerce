export default function OrderBusinessDetails({ order }) {
  const shipping = order.shippingInfo || {};
  const payment = order.payment || shipping.payment || {};
  const rows = [
    ["Buyer company", shipping.companyName || order.buyer?.companyName],
    ["Business / tax ID", shipping.taxId || order.buyer?.taxId],
    ["Purchase reference", shipping.purchaseRef],
    ["Ship to", shipping.address],
    ["Delivery method", shipping.deliveryMethod],
    ["Payment method", payment.label || shipping.paymentMethod],
    ["Payment status", payment.status],
    ["Billing contact", payment.billingName],
    ["Billing email", payment.billingEmail],
    ["Billing address", payment.billingAddress],
    ...(payment.transferReference ? [["Transfer reference", payment.transferReference]] : []),
    ...(payment.cardDisplay ? [["Test payment", payment.cardDisplay]] : [])
  ];
  return <dl className="order-business-details">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Not provided"}</dd></div>)}</dl>;
}
