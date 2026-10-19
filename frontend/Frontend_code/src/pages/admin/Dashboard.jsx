import { Link } from "react-router-dom";
import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Stats from "../../components/common/StatsGrid";
import Button from "../../components/common/Button";
import Notice from "../../components/common/Notice";
import money from "../../utils/money";
import Sales from "../../components/charts/SalesChart";
export default function Dashboard() {
  const {
    db,
    action
  } = useApp();
  return <div className="page">
      <Title eyebrow="ADMIN / PLATFORM OVERVIEW" title="Platform dashboard" description="Marketplace activity, partner verification and system overview." />
      <Stats items={[{
      label: "SUPPLIERS",
      value: db.suppliers.length,
      detail: db.suppliers.filter(s => !s.verified).length + " awaiting verification",
      icon: "building"
    }, {
      label: "ORDERS",
      value: db.orders.length,
      detail: "Local demo transactions",
      icon: "cart"
    }, {
      label: "ORDER VALUE",
      value: money(db.orders.reduce((s, o) => s + o.total, 0)),
      detail: "Total demonstration order value",
      icon: "chart"
    }, {
      label: "PRODUCTS",
      value: db.products.length,
      detail: db.products.filter(p => p.status === "Active").length + " active listings",
      icon: "box"
    }]} />
      <div className="dashboard-columns">
        <section className="card p-6 min-w-0">
          <div className="section-header">
            <div>
              <h2>Sales and orders</h2>
              <p>Local order totals by month · USD</p>
            </div>
            <Link to="/admin/orders">View orders →</Link>
          </div>
          <Sales orders={db.orders} />
        </section>
        <section className="card p-6">
          <h2 className="mb-5">RUL service status</h2>
          <Notice>
            Live inference API is not connected. Frontend sample analysis is
            available.
          </Notice>
          <dl className="specs mt-6">
            <dt>Frontend demo</dt>
            <dd className="text-success">Available</dd>
            <dt>Prediction API</dt>
            <dd>Not connected</dd>
            <dt>Payment gateway</dt>
            <dd>Simulation only</dd>
          </dl>
          <Link className="btn btn-secondary w-full mt-6" to="/admin/rul-status">
            View system details →
          </Link>
        </section>
      </div>
      <section className="card p-6">
        <div className="section-header">
          <h2>New supplier requests</h2>
          <Link to="/admin/suppliers">View all →</Link>
        </div>
        {db.suppliers.filter(s => !s.verified).map(s => <div key={s.id} className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-slate-200">
              <div>
                <b className="text-xs">{s.name}</b>
                <p className="tiny muted mt-2">
                  Region: {s.region} · Verification pending
                </p>
              </div>
              <Button onClick={() => action("supplier:toggle", {
          id: s.id
        })}>
                Approve supplier
              </Button>
            </div>)}
        {db.suppliers.every(s => s.verified) && <p className="muted">No pending supplier requests.</p>}
      </section>
    </div>;
}
