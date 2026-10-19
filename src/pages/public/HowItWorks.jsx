import { API_MODE } from "../../services/config";
import Icon from "../../components/common/Icon";
import Notice from "../../components/common/Notice";
export default function HowItWorks({
  compact = false
}) {
  return <section className="container py-12">
      <div className="section-header">
        <div>
          <p className="eyebrow mb-2">FROM INSIGHT TO ACTION</p>
          {compact ? <h2>A clearer path to the right component.</h2> : <h1>How AeroRUL works</h1>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[["chart", "Analyse", "Review engine history and remaining useful life."], ["shield", "Understand", "Translate life estimates into replacement planning priorities."], ["search", "Compare", "Explore compatible offers by availability, price and delivery."], ["cart", "Source", "Complete procurement and track supplier fulfilment."]].map(([icon, title, text], i) => <div className="card p-6" key={title}>
            <div className="flex justify-between items-center">
              <Icon name={icon} size={25} />
              <span className="eyebrow">0{i + 1}</span>
            </div>
            <h2 className="mt-6 mb-3">{title}</h2>
            <p className="muted leading-relaxed">{text}</p>
          </div>)}
      </div>
      <div className="mt-5">
        <Notice>
          {API_MODE ? "Backend data is used where endpoint contracts are available." : "This is a demonstration environment: payments and RUL predictions are simulated."}{" "}
          RUL supports planning; it does not identify failed parts or provide an
          operational airworthiness decision.
        </Notice>
      </div>
    </section>;
}
