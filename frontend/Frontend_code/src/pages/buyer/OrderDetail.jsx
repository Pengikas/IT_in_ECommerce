import OrderBusinessDetails from "../../components/order/OrderBusinessDetails";
import Field from "../../components/common/Field";
import { Link, useParams, useSearchParams } from "react-router-dom";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import { API_MODE } from "../../services/config";
import ProductArt from "../../components/marketplace/ProductArt";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Empty from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Notice from "../../components/common/Notice";
import Timeline from "../../components/order/OrderStatusTimeline";
import money from "../../utils/money";
import date from "../../utils/date";
export default function OrderDetail() {
  const {
    id
  } = useParams();
  const [params] = useSearchParams();
  const query = useRecords("order", id);
  const {
    db, user,
    action
  } = useApp();
  const o = query.data;
  return <div className="page">
      <State query={query}>
        {!o ? <Empty title="Order not found" text="The requested order is not available." link="/buyer/orders" action="Back to orders" /> : <>
            {params.get("justPlaced") && <Notice success>
                {API_MODE ? "Order accepted by the backend. Totals and status below come from the server." : "Order placed successfully. This demo order is saved in your browser; no real payment was made."}
              </Notice>}
            <Title eyebrow="BUYER / PROCUREMENT ORDER" title={o.id} description={"Placed " + date(o.placedAt) + " · " + o.status} action={<Link className="btn btn-secondary" to="/buyer/orders">
                  ← All orders
                </Link>} />
            {o.sampleRecord && <Notice>Sample order: company, tax reference and invoice details are illustrative demo data.</Notice>}
            <section className="card p-6">
              <h2 className="mb-6">Order status</h2>
              <Timeline status={o.status} />
            </section>
            <div className="purchase-layout">
              <section className="card p-6">
                <h2 className="mb-5">Order details</h2>
                {o.items.map((item, index) => <div className="cart-row" key={item.orderItemId || item.listingId || index}>
                    <ProductArt product={item.product} className="w-24 h-20 rounded shrink-0" />
                    <div className="flex-1">
                      <Link className="text-xs font-semibold" to={"/products/" + item.productId}>
                        {item.product?.name || item.product?.productName || item.productId}
                      </Link>
                      <p className="tiny muted mt-2">
                        Quantity {item.quantity} · P/N{" "}
                        {item.product?.partNumber}
                      </p>
                    </div>
                    <b className="mono text-xs">
                      {money(item.price * item.quantity)}
                    </b>
                  </div>)}
                {o.tax == null && <p className="tiny muted mt-4">Tax has not been quoted. The seller must confirm tax on the invoice; it is not assumed to be zero.</p>}
                <div className="summary-lines">
                  {o.shipping !== undefined && <p>
                      <span>Shipping</span>
                      <span>{money(o.shipping)}</span>
                    </p>}
                  {o.tax != null && <p><span>Tax</span><span>{money(o.tax)}</span></p>}
                  <p className="summary-total">
                    <span>Total order value</span>
                    <strong className="mono">{money(o.total)}</strong>
                  </p>
                </div>
              </section>
              <aside className="card p-6 h-fit">
                <h2 className="text-sm mb-5">Delivery & payment</h2>
                <OrderBusinessDetails order={o} />
              </aside>
            </div>
            {Object.values(o.sellerShipments || {}).some(s => s.trackingNumber) && <section className="card p-6"><h2>Shipment tracking</h2>{Object.entries(o.sellerShipments).map(([sellerId, shipment]) => <p className="muted mt-3" key={sellerId}>{shipment.carrier} · {shipment.trackingNumber}</p>)}</section>}
            {!API_MODE && <section className="card p-6">
                <h2>Need help with this order?</h2>
                <p className="muted mt-2 mb-5">
                  Record a support request in the local demo. No external
                  message will be sent.
                </p>
                {db.support.some(r => r.orderId === id && r.userId === user.id) ? <Notice success>
                    Your demo support request has been recorded locally.
                  </Notice> : <Form className="support-form" onSubmit={data => action("support:add", {
            orderId: id,
            type: data.get("type"),
            reason: data.get("reason")
          })}>
                    <Field label="Request type"><select className="input" name="type">
                      <option>Order enquiry</option>
                      {!["Shipped", "Delivered"].includes(o.status) && <option>Cancellation request</option>}
                      {o.status === "Delivered" && <option>Return / refund request</option>}
                    </select></Field>
                    <Field label="Support request details"><input className="input" aria-label="Support request details" name="reason" required placeholder="Tell us how we can help…" /></Field>
                    <Button type="submit" tone="secondary">
                      Save request
                    </Button>
                  </Form>}
              </section>}
          </>}
      </State>
    </div>;
}
