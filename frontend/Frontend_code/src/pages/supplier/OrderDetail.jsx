import { Link, useParams } from "react-router-dom";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Empty from "../../components/common/EmptyState";
import Notice from "../../components/common/Notice";
import Button from "../../components/common/Button";
import Field from "../../components/common/Field";
import Form from "../../components/common/Form";
import ProductArt from "../../components/marketplace/ProductArt";
import OrderBusinessDetails from "../../components/order/OrderBusinessDetails";
import Timeline from "../../components/order/OrderStatusTimeline";
import stages from "../../utils/orderStages";
import money from "../../utils/money";
import date from "../../utils/date";
export default function SellerOrderDetail() {
  const { id } = useParams();
  const query = useRecords("seller-order", id);
  const { action, flash } = useApp();
  const order = query.data;
  const next = order && stages[stages.indexOf(order.status) + 1];
  return <div className="page"><State query={query}>
    {!order ? <Empty title="Seller order not found" text="This order is not assigned to your store." link="/supplier/orders" action="Back to seller orders" /> : <>
      <Title eyebrow="SUPPLIER / ORDER DETAILS" title={order.id} description={`Placed ${date(order.placedAt)} · ${order.status}`} action={<Link className="btn btn-secondary" to="/supplier/orders">← Seller orders</Link>} />
      {order.sampleRecord && <Notice>Sample order: company, tax reference and invoice details are illustrative demo data.</Notice>}
      <section className="card p-6"><h2 className="mb-5">Fulfilment status</h2><Timeline status={order.status} /></section>
      <div className="purchase-layout">
        <section className="card p-6"><h2 className="mb-5">Your order items</h2>
          {(order.items || []).map((item, i) => <div className="cart-row" key={item.orderItemId || i}><ProductArt product={item.product} className="w-20 h-20 shrink-0 rounded" /><div className="min-w-0 flex-1"><b className="text-xs">{item.product?.name || item.product?.productName || item.productId}</b><p className="tiny muted mt-2">P/N {item.product?.partNumber || "Not provided"} · Quantity {item.quantity}</p><p className="tiny mono mt-2">Unit price {money(item.price)}</p></div><b className="mono text-xs">{money(item.price * item.quantity)}</b></div>)}
          {!order.items?.length && <Notice>The backend has not supplied item details for this seller order.</Notice>}
          <div className="summary-lines"><p><span>Seller item subtotal</span><b className="mono">{money(order.items?.length ? order.items.reduce((s, item) => s + item.price * item.quantity, 0) : order.subtotal ?? order.total)}</b></p><p><span>Tax</span><span>{order.sellerTax != null ? money(order.sellerTax) : "Not quoted"}</span></p></div>
          <p className="tiny muted mt-4">Only your store's items are shown. Tax and freight must be confirmed on the seller invoice; missing amounts are not treated as zero.</p>
        </section>
        <aside className="card p-6 h-fit"><h2 className="mb-5">Buyer, billing & delivery</h2><OrderBusinessDetails order={order} /></aside>
      </div>
      {order.shipment && <section className="card p-6"><h2>Shipment</h2><p className="muted mt-3">{order.shipment.carrier} · {order.shipment.trackingNumber}</p></section>}
      {next && stages.includes(order.status) ? <section className="card p-6"><h2 className="mb-5">Next step: {next}</h2>
        <Form key={order.status} className="fulfilment-form" onSubmit={async data => {
          await action("order:status", { id, status: next, ...(next === "Confirmed" ? { reviewed: data.has("reviewed") } : {}), ...(next === "Shipped" ? { carrier: data.get("carrier"), trackingNumber: data.get("trackingNumber") } : {}) });
          flash(`Order updated to ${next}.`);
        }}>
          {next === "Confirmed" && <label className="review-check"><input type="checkbox" name="reviewed" required /><span><span className="required-marker">*</span> I have reviewed the items, buyer tax/billing information and delivery details.</span></label>}
          {next === "Shipped" && <div className="form-grid"><Field label="Carrier" name="carrier" required maxLength={100} /><Field label="Tracking number" name="trackingNumber" required maxLength={100} /></div>}
          <Button type="submit" disabled={!order.items?.length}>Mark {next}</Button>
        </Form>
      </section> : <Notice>There is no further fulfilment step for this order.</Notice>}
    </>}
  </State></div>;
}
