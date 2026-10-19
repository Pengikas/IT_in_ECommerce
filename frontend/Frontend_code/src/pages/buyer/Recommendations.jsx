import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useRecords from "../../hooks/useRecords";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Notice from "../../components/common/Notice";
import Empty from "../../components/common/EmptyState";
import Field from "../../components/common/Field";
import Button from "../../components/common/Button";
import ProductCard from "../../components/marketplace/ProductCard";
import money from "../../utils/money";
export default function Recommendations() {
  const [params, setParams] = useSearchParams();
  const engines = useRecords("engines");
  const catalog = useRecords("products");
  const categories = useRecords("categories");
  const [engineId, setEngine] = useState(params.get("engine") || "");
  const [categoryId, setCategory] = useState(params.get("category") || "cat-engine");
  const [productId, setProduct] = useState(params.get("product") || "");
  const [applied, setApplied] = useState(() => params.get("engine") ? JSON.stringify({ engineId: params.get("engine"), categoryId: params.get("category") || "cat-engine", productId: params.get("product") || "" }) : "");
  useEffect(() => { if (!engineId && engines.data?.length) setEngine(engines.data[0].id); }, [engines.data, engineId]);
  useEffect(() => {
    const id = params.get("engine");
    if (!id) return;
    const selection = { engineId: id, categoryId: params.get("category") || "cat-engine", productId: params.get("product") || "" };
    setEngine(selection.engineId); setCategory(selection.categoryId); setProduct(selection.productId); setApplied(JSON.stringify(selection));
  }, [params]);
  const query = useRecords("recommendations", applied);
  const engine = engines.data?.find(e => e.id === engineId);
  const references = (catalog.data || []).filter(p => p.compatibility.includes(engine?.model) && p.categoryId === categoryId);
  const current = JSON.stringify({ engineId, categoryId, productId });
  const changed = current !== applied;
  const data = query.data;
  const rows = data?.products || [];
  function find(e) {
    e.preventDefault();
    setApplied(current);
    setParams({ engine: engineId, category: categoryId, ...(productId ? { product: productId } : {}) });
  }
  return <div className="page">
    <Title eyebrow="AI & PREDICTIVE RUL / SOURCING" title="Replacement recommendations" description="Compare compatible alternatives for the same type of engine or component." />
    <Notice>RUL indicates replacement timing; it does not diagnose a failed component. Select the category and reference product you intend to replace. Compatibility and interchangeability must be independently verified.</Notice>
    <State query={engines}><State query={catalog}><State query={categories}>
      <form className="card p-5 replacement-search" onSubmit={find}>
        <Field label="Engine reference"><select className="input" required value={engineId} onChange={e => { setEngine(e.target.value); setProduct(""); }}><option value="">Select your engine</option>{(engines.data || []).map(e => <option key={e.id} value={e.id}>{e.id} · {e.model}</option>)}</select></Field>
        <Field label="Replacement category"><select className="input" required value={categoryId} onChange={e => { setCategory(e.target.value); setProduct(""); }}><option value="">Select a category</option>{(categories.data || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="Reference product"><select className="input" required={categoryId !== "cat-engine"} value={productId} onChange={e => setProduct(e.target.value)}><option value="">{categoryId === "cat-engine" ? "Complete compatible engine" : "Select the component to replace"}</option>{references.map(p => <option key={p.id} value={p.id}>{p.name} · {p.partNumber}</option>)}</select></Field>
        <Button type="submit" disabled={!engine || !categoryId || (categoryId !== "cat-engine" && !productId)}>Find replacement</Button>
        <p className="required-legend"><span className="required-marker">*</span> Required fields. Component comparisons require a reference product of the same type.</p>
      </form>
    </State></State></State>
    {changed || !applied ? <Notice>{applied ? "Selection changed. Click Find replacement to update the results." : "Choose your engine and replacement type, then click Find replacement."}</Notice> : <State query={query}>
      {!rows.length ? <Empty title="No available compatible listings" text="No interchangeable products match this engine, category and reference. Try another selection or browse the catalog." /> : <>
        <p className="eyebrow text-accent">{data.engineId} · {data.engineModel} · RUL {data.predictedRul ?? "—"} cycles · {rows.length} matching options</p>
        <div className="recommendation-grid">{rows.slice(0, 4).map((p, i) => <div key={p.id} className={i === 0 ? "top-recommendation" : ""}><ProductCard product={p} context={`?from=recommendation&engine=${data.engineId}`} /></div>)}</div>
        <section className="card p-6"><h2 className="mb-5">Compare your options</h2>{rows.length === 1 && <p className="muted mb-4">Only one compatible option is currently available for this selection.</p>}
          <div className="table-scroll border-0"><table className="comparison-table"><thead><tr><th>Component details</th>{rows.slice(0, 4).map(p => <th key={p.id}>{p.name}</th>)}</tr></thead><tbody>{[["Price", p => money(p.price)], ["Engine references", p => p.compatibility.join(", ")], ["Part number", p => p.partNumber], ["Condition", p => p.condition], ["Available stock", p => p.stock + " units"], ["Delivery estimate", p => p.deliveryDays + " days"], ["Supplier", p => p.supplier?.name]].map(([label, render]) => <tr key={label}><td>{label}</td>{rows.slice(0, 4).map(p => <td key={p.id}>{render(p)}</td>)}</tr>)}</tbody></table></div>
        </section>
      </>}
    </State>}
  </div>;
}
