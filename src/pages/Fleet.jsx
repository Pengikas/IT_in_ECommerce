import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { API_MODE } from "../services/config";
import { useApp, useRecords, useWishlist } from "../services/store";
import {
  Title,
  Stats,
  State,
  Notice,
  Button,
  Field,
  Empty,
  Table,
  Urgency,
  Timeline,
  money,
  date,
} from "../components/UI";
import Icon from "../components/Icon";
import ProductArt from "../components/ProductArt";
import ProductCard from "../components/Catalog";
import { Trend } from "../components/Charts";
export function Dashboard() {
  const { user } = useApp();
  const engines = useRecords("engines");
  const orders = useRecords("orders");
  const wish = useWishlist();
  const rows = engines.data || [];
  const alerts = rows.filter((e) => e.latestRul <= 40);
  const high = rows.find((e) => e.latestRul <= 20);
  return (
    <div className="page">
      <Title
        eyebrow="FLEET COMMAND / BUYER OVERVIEW"
        title={"Welcome, " + user.companyName}
        description="Your fleet health and sourcing priorities, in one place."
        action={
          <Link className="btn btn-secondary" to="/buyer/engines">
            <Icon name="plane" size={14} />
            Manage fleet
          </Link>
        }
      />
      <State query={engines}>
        <Stats
          items={[
            {
              label: "ENGINES",
              value: rows.length,
              detail: "Registered in your fleet",
            },
            {
              label: "ACTIVE ORDERS",
              value: (orders.data || []).filter(
                (o) => !["Delivered", "Cancelled"].includes(o.status),
              ).length,
              detail: "In fulfilment or transit",
            },
            {
              label: "RUL ALERTS",
              value: alerts.length,
              detail: "Review replacement priorities",
              alert: true,
            },
            {
              label: "WISHLIST",
              value: wish.ids.length,
              detail: "Saved components · Ready to source",
            },
          ]}
        />
        {high && (
          <div className="alert-panel">
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
              <Link
                className="btn btn-accent compact"
                to={"/buyer/recommendations?engine=" + high.id}
              >
                View Replacement Options <Icon name="arrow" size={13} />
              </Link>
              <Link
                className="btn btn-secondary compact"
                to={"/buyer/rul-analysis?engine=" + high.id}
              >
                View RUL details
              </Link>
            </div>
          </div>
        )}
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
                    {[
                      "ENGINE / MODEL",
                      "CURRENT CYCLE",
                      "LATEST RUL",
                      "URGENCY",
                      "ACTION",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...rows]
                    .sort((a, b) => a.latestRul - b.latestRul)
                    .map((e) => (
                      <tr key={e.id}>
                        <td>
                          <b className="mono">{e.id}</b>
                          <p className="tiny muted mt-1">{e.model}</p>
                        </td>
                        <td className="mono muted">
                          {e.currentCycle?.toLocaleString()}
                        </td>
                        <td>
                          <b
                            className={
                              "mono " +
                              (e.latestRul <= 20 ? "text-critical" : "")
                            }
                          >
                            {e.latestRul ?? "—"}{" "}
                            <span className="tiny font-normal">cycles</span>
                          </b>
                          <div className="rul-line">
                            <i
                              style={{
                                width: Math.min(e.latestRul || 0, 100) + "%",
                                background:
                                  e.latestRul <= 20
                                    ? "#e05b6b"
                                    : e.latestRul < 80
                                      ? "#e5b44d"
                                      : "",
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <Urgency value={e.urgency} />
                        </td>
                        <td>
                          <Link
                            className="tiny text-accent"
                            to={"/buyer/engines/" + e.id}
                          >
                            View engine →
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <p className="telemetry-note">
              <Icon name="clock" size={12} />
              {API_MODE
                ? "Fleet data from backend."
                : "Fleet telemetry uses demonstration data."}
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
              {(orders.data || []).slice(0, 2).map((o) => (
                <div key={o.id} className="recent-order">
                  <div className="flex justify-between tiny">
                    <b className="mono">{o.id}</b>
                    <span className="badge">{o.status}</span>
                  </div>
                  <p className="text-xs font-semibold my-3">
                    {o.items?.[0]?.product?.name ||
                      o.items?.[0]?.product?.productName ||
                      "Procurement order"}
                  </p>
                  <p className="tiny muted mb-4">Placed {date(o.placedAt)}</p>
                  <Timeline status={o.status} />
                  <div className="flex justify-between items-center mt-5">
                    <b className="mono text-sm">{money(o.total)}</b>
                    <Link
                      className="tiny text-accent"
                      to={"/buyer/orders/" + o.id}
                    >
                      Track order →
                    </Link>
                  </div>
                </div>
              ))}
              {!orders.data?.length && (
                <p className="muted">
                  Your procurement orders will appear here.
                </p>
              )}
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
    </div>
  );
}
export function Engines() {
  const query = useRecords("engines");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const rows = query.data || [];
  return (
    <div className="page">
      <Title
        eyebrow="PROCUREMENT & FLEET / ENGINE REGISTRY"
        title="Fleet engine registry & health monitor"
        description="Review engine references, life estimates and sourcing priorities."
        action={
          <Link className="btn btn-primary" to="/buyer/rul-analysis">
            Run engine analysis →
          </Link>
        }
      />
      <State query={query}>
        <Stats
          items={[
            {
              label: "FLEET ENGINES",
              value: rows.length,
              detail: "Registered assets",
            },
            {
              label: "MONITOR",
              value: rows.filter((e) => e.urgency === "Monitor").length,
              detail: "Continue life monitoring",
              icon: "chart",
            },
            {
              label: "NORMAL",
              value: rows.filter((e) => e.urgency === "Normal").length,
              detail: "Routine monitoring",
              icon: "shield",
            },
            {
              label: "REPLACEMENT PLANNING",
              value: rows.filter((e) => e.latestRul <= 20).length,
              detail: "Review compatible options",
              alert: true,
            },
          ]}
        />
        <Notice>
          RUL supports procurement planning. It does not identify a failed
          component or determine an operational maintenance decision.
        </Notice>
        <div className="toolbar">
          <input
            className="input max-w-md"
            aria-label="Search engines"
            placeholder="Search engine ID or model…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input w-auto"
            aria-label="Filter engine urgency"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All urgency levels</option>
            {["Normal", "Monitor", "Replace Soon"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <Table
          rows={rows.filter(
            (e) =>
              (e.id + e.model).toLowerCase().includes(search.toLowerCase()) &&
              (!status || e.urgency === status),
          )}
          columns={[
            {
              key: "id",
              label: "Engine reference",
              render: (e) => (
                <Link
                  className="mono text-accent"
                  to={"/buyer/engines/" + e.id}
                >
                  {e.id}
                </Link>
              ),
            },
            { key: "model", label: "Engine model" },
            {
              key: "currentCycle",
              label: "Current cycle",
              render: (e) => e.currentCycle?.toLocaleString(),
            },
            {
              key: "latestRul",
              label: "Latest RUL",
              render: (e) => (
                <span className="mono">{e.latestRul ?? "—"} cycles</span>
              ),
            },
            {
              key: "urgency",
              label: "Urgency",
              render: (e) => <Urgency value={e.urgency} />,
            },
            {
              key: "lastAnalysis",
              label: "Last analysis",
              render: (e) => date(e.lastAnalysis),
            },
            {
              key: "action",
              label: "Action",
              render: (e) => (
                <div className="flex gap-3 tiny text-accent">
                  <Link to={"/buyer/rul-analysis?engine=" + e.id}>Analyse</Link>
                  <Link to={"/buyer/recommendations?engine=" + e.id}>
                    View options →
                  </Link>
                </div>
              ),
            },
          ]}
        />
      </State>
    </div>
  );
}
export function EngineDetail() {
  const { id } = useParams();
  const engines = useRecords("engines");
  const history = useRecords("history", id);
  const e = engines.data?.find((e) => e.id === id);
  return (
    <div className="page">
      <State query={engines}>
        {!e ? (
          <Empty
            title="Engine not found"
            text="This engine is not in your fleet."
            link="/buyer/engines"
            action="Back to fleet"
          />
        ) : (
          <>
            <Title
              eyebrow={"MY ENGINES / " + e.model}
              title={e.id}
              description={"Current cycle " + e.currentCycle?.toLocaleString()}
              action={<Urgency value={e.urgency} />}
            />
            <section className="card p-6">
              <p className="eyebrow">LATEST PREDICTED RUL</p>
              <p className="mono text-4xl font-semibold my-4">
                {e.latestRul ?? "—"}{" "}
                <span className="text-sm muted">cycles</span>
              </p>
              <p className="tiny muted">
                Latest analysis: {date(e.lastAnalysis)}
              </p>
            </section>
            <section className="card p-6 min-w-0">
              <h2 className="mb-5">RUL history</h2>
              <State query={history}>
                <Trend data={history.data || []} />
              </State>
            </section>
            <Notice>
              {API_MODE
                ? "Sensor history and inference results are supplied by the backend."
                : "Sample engine history. No live sensor source or ML model is connected in demo mode."}
            </Notice>
            <div className="flex flex-wrap gap-3">
              <Link
                className="btn btn-secondary"
                to={"/buyer/rul-analysis?engine=" + id}
              >
                Run new analysis
              </Link>
              <Link
                className="btn btn-primary"
                to={"/buyer/recommendations?engine=" + id}
              >
                View replacement options
              </Link>
            </div>
          </>
        )}
      </State>
    </div>
  );
}
export function RUL() {
  const [params] = useSearchParams();
  const { db, action } = useApp();
  const engines = useRecords("engines");
  const [engineId, setEngine] = useState(
    params.get("engine") || (API_MODE ? "" : "ENG-037"),
  );
  const history = useRecords("history", engineId);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  useEffect(() => {
    const rows = engines.data || [];
    if (rows.length && !rows.some((e) => e.id === engineId))
      setEngine(rows[0].id);
  }, [engines.data]);
  useEffect(() => {
    setResult(null);
    setFile(null);
  }, [engineId]);
  async function predict() {
    if (file) {
      if (
        !file.name.toLowerCase().endsWith(".csv") ||
        file.size > 5 * 1024 * 1024
      )
        throw Error("Select a CSV file smaller than 5 MB.");
      if (
        !API_MODE &&
        (await file.text()).trim().split(/\r?\n/).filter(Boolean).length < 31
      )
        throw Error("Provide a header and at least 30 data rows.");
    }
    setResult(await action("rul:predict", { engineId, file }));
  }
  const engine = engines.data?.find((e) => e.id === engineId);
  return (
    <div className="page">
      <Title
        eyebrow="AI & PREDICTIVE RUL / ENGINE ANALYSIS"
        title="AI remaining useful life analysis"
        description="Review engine history and explore replacement planning signals."
      />
      <Notice>
        {API_MODE
          ? "Sensor CSV is sent to the backend for validation and inference."
          : "Demo analysis uses fixed sample engine history. Uploaded CSVs receive basic size/row-count checks only; no model inference is performed."}
      </Notice>
      <State query={engines}>
        <section className="card p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="eyebrow mb-4">01 · SELECT ENGINE</p>
              <Field label="Engine reference">
                <select
                  className="input"
                  value={engineId}
                  onChange={(e) => setEngine(e.target.value)}
                >
                  {(engines.data || []).map((e) => (
                    <option value={e.id} key={e.id}>
                      {e.id} · {e.model}
                    </option>
                  ))}
                </select>
              </Field>
              <dl className="bg-slate-50 rounded p-4 mt-4 specs">
                <dt>Current cycle</dt>
                <dd className="mono">
                  {engine?.currentCycle?.toLocaleString()}
                </dd>
                <dt>Engine family</dt>
                <dd>{engine?.model}</dd>
              </dl>
            </div>
            <div>
              <p className="eyebrow mb-4">02 · SENSOR INPUT</p>
              <label className="upload-zone">
                <Icon name="upload" size={27} />
                <b>Upload sensor CSV</b>
                <span className="tiny muted">
                  Header + 30 rows · up to 5 MB
                </span>
                <input
                  key={engineId}
                  type="file"
                  accept=".csv"
                  aria-label="Upload sensor CSV"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    setResult(null);
                  }}
                />
              </label>
            </div>
            <div>
              <p className="eyebrow mb-4">03 · RUN ANALYSIS</p>
              <h2 className="text-sm">Prepare an informed next step</h2>
              <p className="muted mt-3 mb-5">
                {API_MODE
                  ? "Select an engine and attach a CSV for backend validation."
                  : "Use sample history, or attach a CSV to exercise the upload interface."}
              </p>
              <Button
                disabled={!engineId || !engine || (API_MODE && !file)}
                className="w-full"
                onClick={predict}
              >
                <Icon name="chart" size={15} />
                {API_MODE ? "Run prediction" : "Run demo prediction"}
              </Button>
              <p className="tiny muted mt-3">
                {API_MODE ? "Backend inference" : "Fixed demonstration history"}{" "}
                · No fault diagnosis
              </p>
            </div>
          </div>
        </section>
      </State>
      {result && (
        <section className="card p-6 result-panel">
          <div className="rul-result">
            <p className="eyebrow">PREDICTED RUL</p>
            <strong className="mono">{result.predictedRul}</strong>
            <p>cycles · {API_MODE ? "API" : "demo"}</p>
          </div>
          <div className="flex-1">
            <p className="eyebrow mb-2">ANALYSIS RESULT · {engineId}</p>
            <h2>
              {result.interpretation || "Review your engine life estimate"}
            </h2>
            <div className="mt-3">
              <Urgency value={result.urgency} />
            </div>
            <p className="muted mt-3">
              This is a planning signal, not an airworthiness determination or
              failed-component diagnosis.
            </p>
          </div>
          <Link
            className="btn btn-accent"
            to={"/buyer/recommendations?engine=" + engineId}
          >
            View compatible options <Icon name="arrow" size={13} />
          </Link>
        </section>
      )}
      <div className="dashboard-columns">
        <section className="card p-6 min-w-0">
          <h2>Historical RUL trend</h2>
          <p className="tiny muted mt-2 mb-5">
            {engineId} ·{" "}
            {API_MODE ? "Latest API prediction" : "Sample engine history"}
          </p>
          <State query={history}>
            <Trend data={history.data || []} />
          </State>
        </section>
        <section className="card p-6">
          <h2>Recent analyses</h2>
          <p className="tiny muted my-4">
            {API_MODE
              ? "History endpoint integration pending."
              : "Recorded in this demonstration workspace."}
          </p>
          {!API_MODE &&
            db.analyses.slice(0, 5).map((a) => (
              <div
                className="flex justify-between border-t border-slate-200 py-4 tiny"
                key={a.id}
              >
                <b className="mono">{a.engineId}</b>
                <span>{a.predictedRul} cycles</span>
                <Urgency value={a.urgency} />
              </div>
            ))}
          {!API_MODE && !db.analyses.length && (
            <p className="muted">
              Run your first analysis to see history here.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
export function Recommendations() {
  const [params] = useSearchParams();
  const engines = useRecords("engines");
  const [engineId, setEngine] = useState(
    params.get("engine") || (API_MODE ? "" : "ENG-037"),
  );
  useEffect(() => {
    if (!params.get("engine") && API_MODE && engines.data?.length)
      setEngine(engines.data[0].id);
  }, [engines.data, params]);
  const query = useRecords("recommendations", engineId);
  const data = query.data;
  const rows = data?.products || [];
  return (
    <div className="page">
      <Title
        eyebrow="AI & PREDICTIVE RUL / SOURCING"
        title="Replacement recommendations"
        description={
          data
            ? `Based on ${engineId} · ${data.engineModel || ""} · Predicted RUL ${data.predictedRul ?? "—"} cycles`
            : "Choose an engine to explore sourcing options."
        }
      />
      <Notice>
        {API_MODE
          ? "Ranking comes from the backend."
          : "Demo ranking combines engine-model references, availability and lead time."}{" "}
        Compatibility must be independently verified. RUL does not identify
        which part has failed.
      </Notice>
      <State query={query}>
        {!rows.length ? (
          <Empty
            title="No available compatible listings"
            text="Explore the full catalog or choose another engine."
          />
        ) : (
          <>
            <p className="eyebrow text-accent">
              TOP MATCH / COMPATIBILITY & AVAILABILITY
            </p>
            <div className="recommendation-grid">
              {rows.slice(0, 4).map((p, i) => (
                <div key={p.id} className={i === 0 ? "top-recommendation" : ""}>
                  <ProductCard
                    product={p}
                    context={"?from=recommendation&engine=" + engineId}
                  />
                </div>
              ))}
            </div>
            <section className="card p-6">
              <h2 className="mb-5">Compare your options</h2>
              <div className="table-scroll border-0">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Component details</th>
                      {rows.slice(0, 4).map((p) => (
                        <th key={p.id}>{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Price", (p) => money(p.price)],
                      ["Engine references", (p) => p.compatibility.join(", ")],
                      ["Condition", (p) => p.condition],
                      ["Available stock", (p) => p.stock + " units"],
                      ["Delivery estimate", (p) => p.deliveryDays + " days"],
                      ["Supplier", (p) => p.supplier?.name],
                    ].map(([label, render]) => (
                      <tr key={label}>
                        <td className="muted">{label}</td>
                        {rows.slice(0, 4).map((p) => (
                          <td key={p.id}>{render(p)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </State>
    </div>
  );
}
export function Wishlist() {
  const query = useRecords("products");
  const wish = useWishlist();
  const rows = (query.data || []).filter((p) => wish.ids.includes(p.id));
  return (
    <div className="page">
      <Title
        eyebrow="BUYER / SAVED COMPONENTS"
        title="Wishlist"
        description="Your shortlist, ready when you are."
      />
      <State query={query}>
        {rows.length ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {rows.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <Empty
            title="Your shortlist is clear"
            text="Use the heart on a product card to save components."
          />
        )}
      </State>
    </div>
  );
}
