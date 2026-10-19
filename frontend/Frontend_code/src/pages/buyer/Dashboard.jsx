import { Link } from "react-router-dom";
import { API_MODE } from "../../services/config";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import useWishlist from "../../hooks/useWishlist";
import Title from "../../components/common/PageTitle";
import Stats from "../../components/common/StatsGrid";
import State from "../../components/common/QueryState";
import Urgency from "../../components/common/Urgency";
import Timeline from "../../components/order/OrderStatusTimeline";
import money from "../../utils/money";
import date from "../../utils/date";
import Icon from "../../components/common/Icon";
export default function Dashboard() {
  const {
    user
  } = useApp();
  const engines = useRecords("engines");
  const orders = useRecords("orders");
  const wish = useWishlist();
  const rows = engines.data || [];
  const alerts = rows.filter(e => e.latestRul <= 40);
  const high = rows.find(e => e.latestRul <= 20);
  return <div className="page">
      <Title eyebrow="FLEET COMMAND / BUYER OVERVIEW" title={"Welcome, " + user.companyName} description="Your fleet health and sourcing priorities, in one place." action={<Link className="btn btn-secondary" to="/buyer/engines">
            <Icon name="plane" size={14} />
            Manage fleet
          </Link>} />
      <State query={engines}>
        <Stats items={[{
        label: "ENGINES",
        value: rows.length,
        detail: "Registered in your fleet"
      }, {
        label: "ACTIVE ORDERS",
        value: (orders.data || []).filter(o => !["Delivered", "Cancelled"].includes(o.status)).length,
        detail: "In fulfilment or transit"
      }, {
        label: "RUL ALERTS",
        value: alerts.length,
        detail: "Review replacement priorities",
        alert: true
      }, {
        label: "WISHLIST",
        value: wish.ids.length,
        detail: "Saved components · Ready to source"
      }]} />
        {high && <div className="alert-panel">
            <div className="flex gap-3 items-start">
              <span className="alert-icon">
                <Icon name="alert" size={21} />
              </span>
              <div>
                <p className="mono text-xs font-semibold">
                  {high.id} · {high.model} · Predicted RUL{" "}
                  <span className="text-critical">{high.latestRul} cycles</span>
                </p>
                <p className="tiny muted mt-2">
                  Replacement planning recommended. Explore compatible sourcing
                  options.
                </p>
                <p className="tiny muted mt-1">
                  Decision support · Not an operational maintenance directive.
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link className="btn btn-accent compact" to={"/buyer/recommendations?engine=" + high.id}>
                View Replacement Options <Icon name="arrow" size={13} />
              </Link>
              <Link className="btn btn-secondary compact" to={"/buyer/rul-analysis?engine=" + high.id}>
                View RUL details
              </Link>
            </div>
          </div>}
        <div className="dashboard-columns">
          <section className="card p-5">
            <div className="section-header">
              <div>
                <h2>Engine fleet health</h2>
                <p>Latest analysis with replacement planning signals</p>
              </div>
              <Link to="/buyer/engines">View all →</Link>
            </div>
            <div className="table-scroll border-0">
              <table className="mini-table">
                <thead>
                  <tr>
                    {["ENGINE / MODEL", "CURRENT CYCLE", "LATEST RUL", "URGENCY", "ACTION"].map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...rows].sort((a, b) => a.latestRul - b.latestRul).map(e => <tr key={e.id}>
                        <td>
                          <b className="mono">{e.id}</b>
                          <p className="tiny muted mt-1">{e.model}</p>
                        </td>
                        <td className="mono muted">
                          {e.currentCycle?.toLocaleString()}
                        </td>
                        <td>
                          <b className={"mono " + (e.latestRul <= 20 ? "text-critical" : "")}>
                            {e.latestRul ?? "—"}{" "}
                            <span className="tiny font-normal">cycles</span>
                          </b>
                          <div className="rul-line">
                            <i style={{
                        width: Math.min(e.latestRul || 0, 100) + "%",
                        background: e.latestRul <= 20 ? "#e05b6b" : e.latestRul < 80 ? "#e5b44d" : ""
                      }} />
                          </div>
                        </td>
                        <td>
                          <Urgency value={e.urgency} />
                        </td>
                        <td>
                          <Link className="tiny text-accent" to={"/buyer/engines/" + e.id}>
                            View engine →
                          </Link>
                        </td>
                      </tr>)}
                </tbody>
              </table>
            </div>
            <p className="telemetry-note">
              <Icon name="clock" size={12} />
              {API_MODE ? "Fleet data from backend." : "Fleet telemetry uses demonstration data."}
              <Link className="ml-auto text-accent" to="/buyer/rul-analysis">
                Open analysis →
              </Link>
            </p>
          </section>
          <section className="card p-5">
            <div className="section-header">
              <div>
                <h2>Recent orders</h2>
                <p>Active procurement updates</p>
              </div>
              <Link to="/buyer/orders">View all →</Link>
            </div>
            <State query={orders}>
              {(orders.data || []).slice(0, 2).map(o => <div key={o.id} className="recent-order">
                  <div className="flex justify-between tiny">
                    <b className="mono">{o.id}</b>
                    <span className="badge">{o.status}</span>
                  </div>
                  <p className="text-xs font-semibold my-3">
                    {o.items?.[0]?.product?.name || o.items?.[0]?.product?.productName || "Procurement order"}
                  </p>
                  <p className="tiny muted mb-4">Placed {date(o.placedAt)}</p>
                  <Timeline status={o.status} />
                  <div className="flex justify-between items-center mt-5">
                    <b className="mono text-sm">{money(o.total)}</b>
                    <Link className="tiny text-accent" to={"/buyer/orders/" + o.id}>
                      Track order →
                    </Link>
                  </div>
                </div>)}
              {!orders.data?.length && <p className="muted">
                  Your procurement orders will appear here.
                </p>}
            </State>
          </section>
        </div>
      </State>
      <section className="card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">KEEP YOUR NEXT MISSION MOVING</p>
          <h2>The right component, from the right supplier.</h2>
          <p className="muted mt-2">
            Explore the aviation catalog and compare compatible offers.
          </p>
        </div>
        <Link className="btn btn-primary" to="/marketplace">
          Explore marketplace <Icon name="arrow" size={14} />
        </Link>
      </section>
    </div>;
}
