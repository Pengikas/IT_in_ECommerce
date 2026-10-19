import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_MODE } from "../../services/config";
import useRecords from "../../hooks/useRecords";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Notice from "../../components/common/Notice";
import Empty from "../../components/common/EmptyState";
import Field from "../../components/common/Field";
import money from "../../utils/money";
import ProductCard from "../../components/marketplace/ProductCard";
export default function Recommendations() {
  const [params] = useSearchParams();
  const engines = useRecords("engines");
  const [engineId, setEngine] = useState(params.get("engine") || "");
  useEffect(() => {
    if (!params.get("engine") && engines.data?.length) setEngine(engines.data[0].id);
  }, [engines.data, params]);
  const query = useRecords("recommendations", engineId);
  const data = query.data;
  const rows = data?.products || [];
  return <div className="page">
      <Title eyebrow="AI & PREDICTIVE RUL / SOURCING" title="Replacement recommendations" description={data ? `Based on ${engineId} · ${data.engineModel || ""} · Predicted RUL ${data.predictedRul ?? "—"} cycles` : "Choose an engine to explore sourcing options."} />
      <Notice>
        {API_MODE ? "Ranking comes from the backend." : "Demo ranking combines engine-model references, availability and lead time."}{" "}
        Compatibility must be independently verified. RUL does not identify
        which part has failed.
      </Notice>
      <Field label="Engine reference"><select className="input" value={engineId} onChange={e => setEngine(e.target.value)}><option value="">Select your engine</option>{(engines.data || []).map(e => <option key={e.id} value={e.id}>{e.id} · {e.model}</option>)}</select></Field>
      <State query={query}>
        {!rows.length ? <Empty title="No available compatible listings" text="Explore the full catalog or choose another engine." /> : <>
            <p className="eyebrow text-accent">
              TOP MATCH / COMPATIBILITY & AVAILABILITY
            </p>
            <div className="recommendation-grid">
              {rows.slice(0, 4).map((p, i) => <div key={p.id} className={i === 0 ? "top-recommendation" : ""}>
                  <ProductCard product={p} context={"?from=recommendation&engine=" + engineId} />
                </div>)}
            </div>
            <section className="card p-6">
              <h2 className="mb-5">Compare your options</h2>
              <div className="table-scroll border-0">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Component details</th>
                      {rows.slice(0, 4).map(p => <th key={p.id}>{p.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[["Price", p => money(p.price)], ["Engine references", p => p.compatibility.join(", ")], ["Condition", p => p.condition], ["Available stock", p => p.stock + " units"], ["Delivery estimate", p => p.deliveryDays + " days"], ["Supplier", p => p.supplier?.name]].map(([label, render]) => <tr key={label}>
                        <td className="muted">{label}</td>
                        {rows.slice(0, 4).map(p => <td key={p.id}>{render(p)}</td>)}
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </section>
          </>}
      </State>
    </div>;
}
