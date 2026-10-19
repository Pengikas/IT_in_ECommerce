import Title from "../../components/common/PageTitle";
import Notice from "../../components/common/Notice";
import Badge from "../../components/common/Badge";
export default function SystemStatus() {
  return <div className="page">
      <Title eyebrow="ADMIN / SYSTEM HEALTH" title="RUL system status" description="Connection readiness for the prediction workflow." />
      <Notice>
        No live backend health has been verified. A configured URL does not
        establish a working server.
      </Notice>
      <div className="grid sm:grid-cols-2 gap-5">
        {[["Frontend sample analysis", "Available", "Fixed engine history with local result storage."], ["Prediction API", "Not verified", "A running Express and RUL inference service is required."], ["Sensor ingestion", "Demo check only", "CSV size/row checks are not a model preprocessing pipeline."], ["Model metadata", "Not connected", "Model version and preprocessing metadata must come from the API."]].map(([title, status, text]) => <section className="card p-6" key={title}>
            <h2>{title}</h2>
            <div className="my-4">
              <Badge>{status}</Badge>
            </div>
            <p className="muted leading-relaxed">{text}</p>
          </section>)}
      </div>
    </div>;
}
