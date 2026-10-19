import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_MODE } from "../../services/config";
import useRecords from "../../hooks/useRecords";
import Icon from "../../components/common/Icon";
import ProductCard from "../../components/marketplace/ProductCard";
import Title from "../../components/common/PageTitle";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Field from "../../components/common/Field";
import Notice from "../../components/common/Notice";
import State from "../../components/common/QueryState";
export default function Marketplace() {
  const [params, setParams] = useSearchParams();
  const products = useRecords("products");
  const categories = useRecords("categories");
  const suppliers = useRecords("suppliers");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(params.get("q") || "");
  useEffect(() => setSearch(params.get("q") || ""), [params]);
  const set = (key, value) => {
    const p = new URLSearchParams(params);
    value ? p.set(key, value) : p.delete(key);
    setParams(p);
  };
  const rows = useMemo(() => {
    let list = (products.data || []).filter(p => {
      const q = params.get("q")?.toLowerCase() || "";
      return [p.name, p.partNumber, ...p.compatibility, p.supplier?.name || ""].some(v => v?.toLowerCase().includes(q)) && (!params.get("category") || p.categoryId === params.get("category")) && (!params.get("model") || p.compatibility.includes(params.get("model"))) && (!params.get("supplier") || String(p.supplierId) === params.get("supplier")) && (!params.get("condition") || p.condition === params.get("condition")) && (!params.has("price") || p.price <= Number(params.get("price"))) && (!params.get("stock") || p.stock > 0);
    });
    if (params.get("sort") === "price-asc") list.sort((a, b) => a.price - b.price);
    if (params.get("sort") === "price-desc") list.sort((a, b) => b.price - a.price);
    if (params.get("sort") === "delivery") list.sort((a, b) => a.deliveryDays - b.deliveryDays);
    return list;
  }, [products.data, params]);
  const tab = params.get("tab") || "products";
  return <div className="container page">
      <Title eyebrow="GLOBAL AVIATION SOURCING" title="Aviation marketplace" description="Precision parts. Verified suppliers. Ready for your next mission." />
      <div className="tabs mb-6">
        {[["products", "All products"], ["categories", "Categories"], ["suppliers", "Verified suppliers"]].map(([key, label]) => <button className={tab === key ? "active" : ""} key={key} onClick={() => set("tab", key)}>
            {label}
          </button>)}
      </div>
      {tab === "categories" ? <State query={categories}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(categories.data || []).map(c => <Link className="card category-card" key={c.id} to={"/marketplace?category=" + c.id}>
                <Icon name="box" size={28} />
                <h2>{c.name}</h2>
                <p className="muted">Explore components →</p>
              </Link>)}
          </div>
        </State> : tab === "suppliers" ? <State query={suppliers}>
          <div className="grid md:grid-cols-3 gap-4">
            {(suppliers.data || []).map(s => <Link className="card p-6" to={"/marketplace?supplier=" + s.id} key={s.id}>
                <Icon name="building" size={28} />
                <h2 className="my-4">{s.name}</h2>
                <p className="muted">
                  {s.region} · {s.rating} / 5
                </p>
                <p className="tiny text-accent mt-3">
                  {s.verified ? "Verified supplier" : "Verification pending"} →
                </p>
              </Link>)}
          </div>
        </State> : <>
          <div className="toolbar">
            <Form className="flex gap-2 flex-1 max-w-xl" onSubmit={() => set("q", search)}>
              <input className="input" aria-label="Search marketplace" placeholder="Part number, engine model or product name…" value={search} onChange={e => setSearch(e.target.value)} />
              <Button type="submit" aria-label="Search products">
                <Icon name="search" size={16} />
              </Button>
            </Form>
            <button className="btn btn-secondary mobile-only" aria-expanded={open} onClick={() => setOpen(!open)}>
              <Icon name="filter" /> Filters
            </button>
            <select className="input w-auto" aria-label="Sort products" value={params.get("sort") || ""} onChange={e => set("sort", e.target.value)}>
              <option value="">Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="delivery">Fastest delivery</option>
            </select>
          </div>
          <div className="catalog-layout">
            <aside className={"card filter-panel " + (open ? "expanded" : "")}>
              <div className="flex justify-between mb-6">
                <h2 className="text-sm">Filters</h2>
                <button className="text-accent tiny" onClick={() => setParams({})}>
                  Reset all
                </button>
              </div>
              {[["Category", "category", (categories.data || []).map(c => [c.id, c.name])], ["Engine model", "model", [...new Set((products.data || []).flatMap(p => p.compatibility))].map(m => [m, m])], ["Supplier", "supplier", (suppliers.data || []).map(s => [s.id, s.name])], ["Condition", "condition", [["New", "New"], ["Refurbished", "Refurbished"], ["Exchange", "Exchange"]]]].map(([label, key, options]) => <Field key={key} label={label}>
                  <select className="input" value={params.get(key) || ""} onChange={e => set(key, e.target.value)}>
                    <option value="">All {label.toLowerCase()}s</option>
                    {options.map(([id, name]) => <option key={id} value={id}>
                        {name}
                      </option>)}
                  </select>
                </Field>)}
              <Field label="Maximum price (USD)" type="number" min="0" placeholder="No limit" value={params.get("price") || ""} onChange={e => set("price", e.target.value)} />
              <label className="text-xs flex items-center gap-2">
                <input type="checkbox" checked={params.get("stock") === "1"} onChange={e => set("stock", e.target.checked ? "1" : "")} />
                In stock only
              </label>
              <Notice>
                Review compatibility and seller documentation before an
                operational purchase.
              </Notice>
            </aside>
            <div className="min-w-0">
              <p className="tiny muted flex justify-between mb-4">
                <span role="status">
                  {products.loading ? "Finding components…" : rows.length + " products available"}
                </span>
                <span>
                  USD · {API_MODE ? "Server catalog" : "Demo catalog"}
                </span>
              </p>
              <State query={products}>
                {rows.length ? <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {rows.map(p => <ProductCard key={p.id} product={p} />)}
                  </div> : <div className="card empty">
                    <h2>No matching components</h2>
                    <p className="muted">
                      Try another part number or clear your filters.
                    </p>
                    <button className="btn btn-primary mt-5" onClick={() => setParams({})}>
                      Clear filters
                    </button>
                  </div>}
              </State>
            </div>
          </div>
        </>}
    </div>;
}
