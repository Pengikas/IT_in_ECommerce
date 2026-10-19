import { Link, useParams } from "react-router-dom";
import { API_MODE } from "../../services/config";
import useRecords from "../../hooks/useRecords";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Notice from "../../components/common/Notice";
import Empty from "../../components/common/EmptyState";
import Urgency from "../../components/common/Urgency";
import date from "../../utils/date";
import Trend from "../../components/engine/RULTrendChart";
export default function EngineDetail() {
  const {
    id
  } = useParams();
  const engines = useRecords("engines");
  const history = useRecords("history", id);
  const e = engines.data?.find(e => e.id === id);
  return <div className="page">
      <State query={engines}>
        {!e ? <Empty title="Engine not found" text="This engine is not in your fleet." link="/buyer/engines" action="Back to fleet" /> : <>
            <Title eyebrow={"MY ENGINES / " + e.model} title={e.id} description={"Current cycle " + e.currentCycle?.toLocaleString()} action={<Urgency value={e.urgency} prominent />} />
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
              {API_MODE ? "Sensor history and inference results are supplied by the backend." : "Sample engine history. No live sensor source or ML model is connected in demo mode."}
            </Notice>
            <div className="flex flex-wrap gap-3">
              <Link className="btn btn-secondary" to={"/buyer/rul-analysis?engine=" + id}>
                Run new analysis
              </Link>
              <Link className="btn btn-primary" to={"/buyer/recommendations?engine=" + id}>
                View replacement options
              </Link>
            </div>
          </>}
      </State>
    </div>;
}
