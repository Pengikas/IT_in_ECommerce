import { useState } from "react";
import { Link } from "react-router-dom";
import useRecords from "../../hooks/useRecords";
import Title from "../../components/common/PageTitle";
import Stats from "../../components/common/StatsGrid";
import State from "../../components/common/QueryState";
import Notice from "../../components/common/Notice";
import Table from "../../components/common/DataTable";
import Urgency from "../../components/common/Urgency";
import date from "../../utils/date";
export default function Engines() {
  const query = useRecords("engines");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const rows = query.data || [];
  return <div className="page">
      <Title eyebrow="PROCUREMENT & FLEET / ENGINE REGISTRY" title="Fleet engine registry & health monitor" description="Review engine references, life estimates and sourcing priorities." action={<Link className="btn btn-primary" to="/buyer/rul-analysis">
            Run engine analysis →
          </Link>} />
      <State query={query}>
        <Stats items={[{
        label: "FLEET ENGINES",
        value: rows.length,
        detail: "Registered assets"
      }, {
        label: "MONITOR",
        value: rows.filter(e => e.urgency === "Monitor").length,
        detail: "Continue life monitoring",
        icon: "chart"
      }, {
        label: "NORMAL",
        value: rows.filter(e => e.urgency === "Normal").length,
        detail: "Routine monitoring",
        icon: "shield"
      }, {
        label: "REPLACEMENT PLANNING",
        value: rows.filter(e => e.latestRul <= 20).length,
        detail: "Review compatible options",
        alert: true
      }]} />
        <Notice>
          RUL supports procurement planning. It does not identify a failed
          component or determine an operational maintenance decision.
        </Notice>
        <div className="toolbar">
          <input className="input max-w-md" aria-label="Search engines" placeholder="Search engine ID or model…" value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input w-auto" aria-label="Filter engine urgency" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All urgency levels</option>
            {["Normal", "Monitor", "Replace Soon"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <Table rows={rows.filter(e => (e.id + e.model).toLowerCase().includes(search.toLowerCase()) && (!status || e.urgency === status))} columns={[{
        key: "id",
        label: "Engine reference",
        render: e => <Link className="mono text-accent" to={"/buyer/engines/" + e.id}>
                  {e.id}
                </Link>
      }, {
        key: "model",
        label: "Engine model"
      }, {
        key: "currentCycle",
        label: "Current cycle",
        render: e => e.currentCycle?.toLocaleString()
      }, {
        key: "latestRul",
        label: "Latest RUL",
        render: e => <span className="mono">{e.latestRul ?? "—"} cycles</span>
      }, {
        key: "urgency",
        label: "Urgency",
        render: e => <Urgency value={e.urgency} />
      }, {
        key: "lastAnalysis",
        label: "Last analysis",
        render: e => date(e.lastAnalysis)
      }, {
        key: "action",
        label: "Action",
        render: e => <div className="flex gap-3 tiny text-accent">
                  <Link to={"/buyer/rul-analysis?engine=" + e.id}>Analyse</Link>
                  <Link to={"/buyer/recommendations?engine=" + e.id}>
                    View options →
                  </Link>
                </div>
      }]} />
      </State>
    </div>;
}
