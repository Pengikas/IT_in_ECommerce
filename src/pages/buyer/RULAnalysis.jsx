import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_MODE } from "../../services/config";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Notice from "../../components/common/Notice";
import Button from "../../components/common/Button";
import Field from "../../components/common/Field";
import Urgency from "../../components/common/Urgency";
import Icon from "../../components/common/Icon";
import Trend from "../../components/engine/RULTrendChart";
export default function RUL() {
  const [params] = useSearchParams();
  const {
    db,
    user,
    action
  } = useApp();
  const engines = useRecords("engines");
  const [engineId, setEngine] = useState(params.get("engine") || "");
  const history = useRecords("history", engineId);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  useEffect(() => {
    const rows = engines.data || [];
    if (!rows.some(e => e.id === engineId)) setEngine(rows[0]?.id || "");
  }, [engines.data]);
  useEffect(() => {
    setResult(null);
    setFile(null);
  }, [engineId]);
  async function predict() {
    if (file) {
      if (!file.name.toLowerCase().endsWith(".csv") || file.size > 5 * 1024 * 1024) throw Error("Select a CSV file smaller than 5 MB.");
      if (!API_MODE && (await file.text()).trim().split(/\r?\n/).filter(Boolean).length < 31) throw Error("Provide a header and at least 30 data rows.");
    }
    setResult(await action("rul:predict", {
      engineId,
      file
    }));
  }
  const engine = engines.data?.find(e => e.id === engineId);
  return <div className="page">
      <Title eyebrow="AI & PREDICTIVE RUL / ENGINE ANALYSIS" title="AI remaining useful life analysis" description="Review engine history and explore replacement planning signals." />
      <Notice>
        {API_MODE ? "Sensor CSV is sent to the backend for validation and inference." : "Demo analysis uses fixed sample engine history. Uploaded CSVs receive basic size/row-count checks only; no model inference is performed."}
      </Notice>
      <State query={engines}>
        {!engines.loading && !engines.data?.length && <Notice>No engines are registered to this account yet.</Notice>}
        <section className="card p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="eyebrow mb-4">01 · SELECT ENGINE</p>
              <Field label="Engine reference">
                <select className="input" required value={engineId} onChange={e => setEngine(e.target.value)}>
                  {(engines.data || []).map(e => <option value={e.id} key={e.id}>
                      {e.id} · {e.model}
                    </option>)}
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
                <b>Upload sensor CSV{API_MODE && <span className="required-marker" aria-hidden="true"> *</span>}</b>
                <span className="tiny muted">
                  Header + 30 rows · up to 5 MB
                </span>
                <input key={engineId} type="file" required={API_MODE} accept=".csv" aria-label="Upload sensor CSV" onChange={e => {
                setFile(e.target.files?.[0] || null);
                setResult(null);
              }} />
              </label>
            </div>
            <div>
              <p className="eyebrow mb-4">03 · RUN ANALYSIS</p>
              <h2 className="text-sm">Prepare an informed next step</h2>
              <p className="muted mt-3 mb-5">
                {API_MODE ? "Select an engine and attach a CSV for backend validation." : "Use sample history, or attach a CSV to exercise the upload interface."}
              </p>
              <Button disabled={!engineId || !engine || API_MODE && !file} className="w-full" onClick={predict}>
                <Icon name="chart" size={15} />
                {API_MODE ? "Run prediction" : "Run demo prediction"}
              </Button>
              <p className="tiny muted mt-3">
                {API_MODE ? "Backend inference" : "Fixed demonstration history"}{" "}
                · No fault diagnosis
              </p>
            </div>
          </div>
          <p className="required-legend"><span className="required-marker" aria-hidden="true">*</span> Required fields. Select an engine before running an analysis{API_MODE ? " and attach its sensor CSV." : ". CSV upload is optional in demo mode."}</p>
        </section>
      </State>
      {result && <section className="card p-6 result-panel">
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
          <Link className="btn btn-accent" to={"/buyer/recommendations?engine=" + engineId}>
            View compatible options <Icon name="arrow" size={13} />
          </Link>
        </section>}
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
            {API_MODE ? "History endpoint integration pending." : "Recorded in this demonstration workspace."}
          </p>
          {!API_MODE && db.analyses.filter(a => a.userId === user.id).slice(0, 5).map(a => <div className="flex justify-between border-t border-slate-200 py-4 tiny" key={a.id}>
                <b className="mono">{a.engineId}</b>
                <span>{a.predictedRul} cycles</span>
                <Urgency value={a.urgency} />
              </div>)}
          {!API_MODE && !db.analyses.some(a => a.userId === user.id) && <p className="muted">
              Run your first analysis to see history here.
            </p>}
        </section>
      </div>
    </div>;
}
