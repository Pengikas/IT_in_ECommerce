import { Link } from "react-router-dom";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import { API_MODE } from "../../services/config";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Stats from "../../components/common/StatsGrid";
import Badge from "../../components/common/Badge";
import money from "../../utils/money";
import ProductArt from "../../components/marketplace/ProductArt";
import Sales from "../../components/charts/SalesChart";
export default function Dashboard() {
  const listings = useRecords("listings");
  const orders = useRecords("orders");
  const {
    user
  } = useApp();
  const rows = listings.data || [];
  const mine = scopedOrders(orders.data || [], user);
  const low = rows.filter(p => p.stock <= 5);
  return <div className="page">
      <Title eyebrow="SUPPLIER WORKSPACE / OVERVIEW" title="Supplier dashboard" description="Monitor sales performance, store activity and fulfilment priorities." action={<Link className="btn btn-primary" to="/supplier/products/new">
            + Add product
          </Link>} />
      <State query={listings}>
        <Stats items={[{
        label: "ORDER REVENUE",
        value: money(mine.reduce((s, o) => s + o.total, 0)),
        detail: "Item revenue · All time",
        icon: "chart"
      }, {
        label: "ACTIVE ORDERS",
        value: mine.filter(o => o.status !== "Delivered").length,
        detail: "Orders assigned to your store"
      }, {
        label: "ACTIVE LISTINGS",
        value: rows.filter(p => p.status === "Active").length,
        detail: "Published catalog offers",
        icon: "box"
      }, {
        label: "LOW STOCK",
        value: low.length,
        detail: "Listings with 5 or fewer units",
        alert: low.length > 0,
        icon: "alert"
      }]} />
        <div className="dashboard-columns">
          <section className="card p-6 min-w-0">
            <div className="section-header">
              <div>
                <h2>Sales performance</h2>
                <p>Recorded order item revenue · USD</p>
              </div>
              <Link to="/supplier/analytics">Analytics →</Link>
            </div>
            <State query={orders}>
              <Sales orders={mine} />
              <div className="section-header mt-6">
                <h2>Recent orders</h2>
                <Link to="/supplier/orders">Manage →</Link>
              </div>
              {mine.slice(0, 5).map(o => <div key={o.id} className="flex justify-between items-center gap-3 py-4 border-t border-slate-200 text-xs">
                  <b className="mono">{o.id}</b>
                  <Badge>{o.status}</Badge>
                  <strong>{money(o.total)}</strong>
                </div>)}
            </State>
          </section>
          <section className="card p-6">
            <div className="section-header">
              <h2>Your product catalog</h2>
              <Link to="/supplier/products">Manage →</Link>
            </div>
            {rows.slice(0, 4).map(p => <Link className="flex items-center gap-3 py-4 border-t border-slate-200" key={p.id} to={`/supplier/products/${p.id}/edit`}>
                <ProductArt product={p} className="w-16 h-14 shrink-0 rounded" />
                <div>
                  <p className="tiny font-semibold">{p.name}</p>
                  <p className="tiny muted mt-2">
                    {p.stock} available · {money(p.price)}
                  </p>
                </div>
              </Link>)}
            <h2 className="mt-7 mb-4">Low-stock alerts</h2>
            {low.map(p => <Link className="flex justify-between tiny py-3 border-t border-slate-200" key={p.id} to="/supplier/inventory">
                <span>{p.partNumber}</span>
                <span className="text-critical">{p.stock} left →</span>
              </Link>)}
            {!low.length && <p className="muted">All listings are sufficiently stocked.</p>}
          </section>
        </div>
      </State>
    </div>;
}
function scopedOrders(rows, user) {
  return rows.map(o => {
    if (API_MODE) return o;
    const items = o.items.filter(i => i.product?.supplierId === user.id);
    return {
      ...o,
      items,
      total: items.reduce((s, i) => s + i.price * i.quantity, 0),
      status: o.sellerStatuses?.[user.id] || o.status
    };
  }).filter(o => API_MODE || o.items.length);
}
