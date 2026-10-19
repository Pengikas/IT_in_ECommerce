import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { API_MODE } from "../../services/config";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import useWishlist from "../../hooks/useWishlist";
import Icon from "../../components/common/Icon";
import ProductArt from "../../components/marketplace/ProductArt";
import ProductCard from "../../components/marketplace/ProductCard";
import useAddCart from "../../hooks/useAddCart";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Field from "../../components/common/Field";
import Notice from "../../components/common/Notice";
import State from "../../components/common/QueryState";
import Empty from "../../components/common/EmptyState";
import Badge from "../../components/common/Badge";
import money from "../../utils/money";
export default function ProductDetail() {
  const {
    id
  } = useParams();
  const query = useRecords("product", id);
  const others = useRecords("products");
  const [params] = useSearchParams();
  const [offer, setOffer] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("Overview");
  const {
    db,
    user,
    action
  } = useApp();
  const wish = useWishlist();
  const add = useAddCart();
  useEffect(() => {
    setOffer(null);
    setQuantity(1);
    setTab("Overview");
  }, [id]);
  const p = offer || query.data;
  return <div className="container page">
      <State query={query}>
        {!p ? <Empty title="Product not found" text="The requested component is not available." /> : <>
            <p className="tiny muted mb-6">
              <Link to="/marketplace">Marketplace</Link> / {p.compatibility[0]}{" "}
              / {p.partNumber}
            </p>
            {params.get("from") === "recommendation" && <div className="mb-5">
                <Notice>
                  Recommended for {params.get("engine") || "your engine"} based
                  on engine-model references and sourcing availability. This is
                  not a fault diagnosis or certified fitment advice.
                </Notice>
              </div>}
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <ProductArt product={p} className="detail-art" />
                <div className="mt-4">
                  <Notice>
                    Component illustration · Original product photography can
                    replace this vector asset.
                  </Notice>
                </div>
              </div>
              <div>
                <div className="flex gap-2 mb-4">
                  <Badge>{p.condition || "Seller offers"}</Badge>
                  <Badge tone={p.stock ? "success" : "danger"}>
                    {p.stock ? "In stock" : "No available stock"}
                  </Badge>
                </div>
                <h1 className="text-3xl">{p.name}</h1>
                <p className="mono tiny muted mt-3">
                  PART NUMBER: {p.partNumber}
                </p>
                {query.data?.offers?.length > 1 && <Field label="Seller offer">
                    <select className="input" value={p.listingId} onChange={e => {
                setOffer(query.data.offers.find(l => String(l.listingId) === e.target.value));
                setQuantity(1);
              }}>
                      {query.data.offers.map(l => <option key={l.listingId} value={l.listingId}>
                          {l.supplier?.name || "Seller"} · {money(l.price)} ·{" "}
                          {l.stock} available
                        </option>)}
                    </select>
                  </Field>}
                <div className="border-y border-slate-200 my-5 py-5">
                  <p className="mono text-3xl font-semibold">
                    {money(p.price)}{" "}
                    <span className="tiny muted font-normal">USD / unit</span>
                  </p>
                  <p className="tiny muted mt-3">
                    {p.rating ? p.rating + " / 5" : "No ratings yet"} ·{" "}
                    {p.stock} units available
                  </p>
                </div>
                <Link className="card p-4 flex items-center gap-3" to={"/marketplace?supplier=" + p.supplierId}>
                  <Icon name="shield" size={25} />
                  <div>
                    <b className="text-xs">
                      {p.supplier?.name || "Seller details"}
                    </b>
                    <p className="tiny muted mt-1">
                      {p.supplier?.verified ? "Verified supplier" : "Verify seller documentation"}{" "}
                      · {p.supplier?.region}
                    </p>
                  </div>
                  <Icon className="ml-auto" name="arrow" size={14} />
                </Link>
                <dl className="specs mt-5">
                  <dt>Compatibility</dt>
                  <dd>
                    {p.compatibility.join(", ") || "Confirm with supplier"}
                  </dd>
                  <dt>Delivery estimate</dt>
                  <dd>
                    {p.deliveryDays ? p.deliveryDays + " business days" : "Contact supplier"}
                  </dd>
                  <dt>Condition</dt>
                  <dd>{p.condition || "Not specified"}</dd>
                </dl>
                <div className="flex flex-wrap gap-3 items-end mt-6">
                  <Field label="Quantity">
                    <input aria-label="Product quantity" className="input w-20" type="number" min="1" max={p.stock || 1} value={quantity} onChange={e => setQuantity(Math.max(1, Math.min(p.stock, Math.floor(Number(e.target.value) || 1))))} />
                  </Field>
                  <Button disabled={!p.stock} onClick={() => add(p, quantity)}>
                    <Icon name="cart" size={14} />
                    Add to cart
                  </Button>
                  <Button tone="accent" disabled={!p.stock} onClick={() => add(p, quantity, true)}>
                    Buy now
                  </Button>
                </div>
                <Button tone="ghost" className="mt-3" onClick={() => wish.toggle(p.id)} aria-pressed={wish.ids.includes(p.id)}>
                  <Icon name="heart" size={14} />
                  {wish.ids.includes(p.id) ? "Saved to wishlist" : "Save to wishlist"}
                </Button>
              </div>
            </div>
            <div className="tabs mt-9">
              {["Overview", "Technical specs", "Compatibility", "Shipping", "Supplier", "Reviews"].map(t => <button className={t === tab ? "active" : ""} key={t} onClick={() => setTab(t)}>
                  {t}
                </button>)}
            </div>
            <section className="card p-6 mt-5 text-xs leading-loose">
              {tab === "Overview" && <>
                  <h2 className="mb-3">Precision components for your fleet</h2>
                  <p>
                    {p.description || `${p.name} is offered by ${p.supplier?.name || "the selected supplier"} for compatible ${p.compatibility.join(", ")} applications. Review applicability and release documentation before purchasing.`}
                  </p>
                </>}
              {tab === "Technical specs" && <dl className="specs">
                  {Object.entries({
              "Part number": p.partNumber,
              "Engine references": p.compatibility.join(", "),
              Condition: p.condition,
              "Available units": p.stock,
              Currency: p.currency
            }).map(([k, v]) => <div className="contents" key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>)}
                </dl>}
              {tab === "Compatibility" && <>
                  <div className="flex gap-2 mb-5">
                    {p.compatibility.map(m => <Badge key={m}>{m}</Badge>)}
                  </div>
                  <Notice>
                    Demo references and catalog metadata do not replace
                    manufacturer-approved applicability or release documents.
                  </Notice>
                </>}
              {tab === "Shipping" && <p>
                  Estimated lead time is {p.deliveryDays || "not specified"}{" "}
                  business days. Confirm actual freight arrangements with the
                  supplier. Checkout shipping is an estimate until server
                  confirmation.
                </p>}
              {tab === "Supplier" && <>
                  <h2>{p.supplier?.name}</h2>
                  <p>
                    {p.supplier?.region} · Rating{" "}
                    {p.supplier?.rating || "not available"}
                  </p>
                  <Link className="btn btn-secondary mt-4" to={"/marketplace?supplier=" + p.supplierId}>
                    View supplier listings →
                  </Link>
                </>}
              {tab === "Reviews" && (API_MODE ? <Notice>Reviews API has not been connected yet.</Notice> : <div className="space-y-5">
                    {db.reviews.filter(r => r.productId === p.id).map(r => <div className="border-b border-slate-200 pb-4" key={r.id}>
                          <b>
                            {r.companyName} · {r.rating}/5
                          </b>
                          <p>{r.text}</p>
                          {r.reply && <p className="muted">Store reply: {r.reply}</p>}
                        </div>)}
                    {!db.reviews.some(r => r.productId === p.id) && <p className="muted">No reviews yet.</p>}
                    {user?.role === "buyer" ? <Form className="max-w-xl space-y-3" onSubmit={async (data, form) => {
              await action("review:add", {
                productId: p.id,
                rating: Number(data.get("rating")),
                text: data.get("text")
              });
              form.reset();
            }}>
                        <Field label="Your rating">
                          <select className="input" name="rating">
                            {[5, 4, 3, 2, 1].map(n => <option key={n}>{n}</option>)}
                          </select>
                        </Field>
                        <Field label="Your review">
                          <textarea className="input" name="text" required maxLength={1000} />
                        </Field>
                        <Button type="submit">Post demo review</Button>
                      </Form> : <Link className="text-accent" to="/login">
                        Sign in as a buyer to leave a review
                      </Link>}
                  </div>)}
            </section>
            <section className="mt-8">
              <div className="section-header">
                <h2>Related components</h2>
                <Link to="/marketplace">View catalog →</Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(others.data || []).filter(x => x.id !== p.id).slice(0, 3).map(x => <ProductCard key={x.id} product={x} />)}
              </div>
            </section>
          </>}
      </State>
    </div>;
}
