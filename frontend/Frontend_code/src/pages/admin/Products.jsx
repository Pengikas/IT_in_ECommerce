import { useState } from "react";
import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Button from "../../components/common/Button";
import Notice from "../../components/common/Notice";
import Badge from "../../components/common/Badge";
import money from "../../utils/money";
import ProductArt from "../../components/marketplace/ProductArt";
export default function Products() {
  const {
    db,
    action
  } = useApp();
  const [selected, setSelected] = useState(db.products[0]?.id);
  const [search, setSearch] = useState("");
  const p = db.products.find(p => p.id === selected);
  return <div className="page">
      <Title eyebrow="ADMIN / CATALOG GOVERNANCE" title="Supplier & product moderation" description="Review component specifications and listing publication status." />
      <div className="card moderation-layout">
        <aside>
          <input aria-label="Filter listings" className="input mb-4" placeholder="Filter by part number…" value={search} onChange={e => setSearch(e.target.value)} />
          {db.products.filter(p => (p.name + p.partNumber).toLowerCase().includes(search.toLowerCase())).map(p => <button key={p.id} className={"moderation-item " + (p.id === selected ? "active" : "")} onClick={() => setSelected(p.id)}>
                <b>{p.name}</b>
                <span>
                  {p.status} · {money(p.price)}
                </span>
              </button>)}
        </aside>
        {p && <section className="p-6 space-y-5">
            <ProductArt product={p} className="h-48 rounded" />
            <h2>{p.name}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge>{p.partNumber}</Badge>
              <Badge>{p.condition}</Badge>
              <Badge>{p.status}</Badge>
            </div>
            <p className="muted leading-relaxed">
              {p.description || "Review engine-model references and seller documents for this demonstration listing."}
            </p>
            <dl className="specs">
              <dt>Compatibility</dt>
              <dd>{p.compatibility.join(", ")}</dd>
              <dt>Stock</dt>
              <dd>{p.stock}</dd>
              <dt>Unit price</dt>
              <dd>{money(p.price)}</dd>
            </dl>
            <Notice>
              Local moderation demo. Server-side authorization and document
              verification are required in production.
            </Notice>
            <div className="flex flex-wrap gap-3">
              <Button tone="secondary" onClick={() => action("product:moderate", {
            id: p.id,
            status: "Hidden"
          })}>
                Hide listing
              </Button>
              <Button tone="secondary" onClick={() => action("product:moderate", {
            id: p.id,
            status: "Draft"
          })}>
                Request changes
              </Button>
              <Button onClick={() => action("product:moderate", {
            id: p.id,
            status: "Active"
          })}>
                Approve and publish
              </Button>
            </div>
          </section>}
      </div>
    </div>;
}
