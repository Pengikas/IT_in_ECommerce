import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { API_MODE } from "../services/config";
import { useApp, useRecords, useWishlist } from "../services/store";
import Icon from "../components/Icon";
import ProductArt from "../components/ProductArt";
import ProductCard, { useAddCart } from "../components/Catalog";
import { Logo } from "../components/Shell";
import {
  Title,
  Button,
  Form,
  Field,
  Notice,
  State,
  Empty,
  Badge,
  money,
} from "../components/UI";
export function Home() {
  const products = useRecords("products");
  const categories = useRecords("categories");
  const suppliers = useRecords("suppliers");
  const navigate = useNavigate();
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow text-sky-300 mb-6">
              PRECISION SOURCING. INFORMED DECISIONS.
            </p>
            <h1>The next mission starts with the right part.</h1>
            <p className="hero-copy">
              Connect your engine life insights to smarter sourcing. Discover
              compatible aviation components from verified suppliers, all in one
              workspace.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link className="btn btn-accent" to="/marketplace">
                Explore marketplace <Icon name="arrow" size={15} />
              </Link>
              <Link className="btn btn-outline" to="/buyer/rul-analysis">
                Analyse my engine
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <p className="eyebrow text-sky-200">FLEET INTELLIGENCE / ENG-037</p>
            <ProductArt
              product={{ image: "engine", name: "Turbofan engine" }}
              className="h-60"
            />
            <div className="flex items-center justify-between border-t border-white/20 pt-5">
              <div>
                <p className="tiny text-slate-300">DEMO PREDICTED RUL</p>
                <strong className="mono text-3xl">
                  18 <span className="text-xs font-normal">cycles</span>
                </strong>
              </div>
              <span className="hero-status">Replacement planning</span>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-8">
        <Form
          className="card p-4 flex gap-3"
          onSubmit={(data) =>
            navigate("/marketplace?q=" + encodeURIComponent(data.get("q")))
          }
        >
          <input
            className="input flex-1"
            name="q"
            aria-label="Find aviation parts"
            placeholder="Search part number, engine model or component…"
          />
          <Button type="submit">
            <Icon name="search" size={16} /> Search
          </Button>
        </Form>
      </section>
      <section className="container py-7">
        <div className="section-header">
          <div>
            <p className="eyebrow mb-2">BUILT AROUND YOUR FLEET</p>
            <h2>Explore aviation categories</h2>
          </div>
          <Link to="/marketplace?tab=categories">All categories →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {(categories.data || []).map((c) => (
            <Link
              key={c.id}
              className="card category-card"
              to={"/marketplace?category=" + c.id}
            >
              <Icon name="box" size={27} />
              <h3>{c.name}</h3>
              <span className="tiny muted">Explore components →</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="container py-8">
        <div className="section-header">
          <div>
            <p className="eyebrow mb-2">MISSION-READY SOURCING</p>
            <h2>Featured components</h2>
          </div>
          <Link to="/marketplace">View catalog →</Link>
        </div>
        <State query={products}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(products.data || []).slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </State>
      </section>
      <section className="container py-9">
        <div className="section-header">
          <h2>Your global supplier network</h2>
          <Link to="/marketplace?tab=suppliers">View suppliers →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {(suppliers.data || []).map((s) => (
            <Link
              className="card p-6"
              key={s.id}
              to={"/marketplace?supplier=" + s.id}
            >
              <Icon name="building" size={26} />
              <h3 className="font-semibold mt-5 mb-2">{s.name}</h3>
              <p className="muted tiny">
                {s.region} · {s.rating} / 5
              </p>
              <p className="text-accent tiny mt-4">
                {s.verified ? "Verified supplier" : "Verification pending"} →
              </p>
            </Link>
          ))}
        </div>
      </section>
      <HowItWorks compact />
    </>
  );
}
export function HowItWorks({ compact = false }) {
  return (
    <section className="container py-12">
      <div className="section-header">
        <div>
          <p className="eyebrow mb-2">FROM INSIGHT TO ACTION</p>
          {compact ? (
            <h2>A clearer path to the right component.</h2>
          ) : (
            <h1>How AeroRUL works</h1>
          )}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          [
            "chart",
            "Analyse",
            "Review engine history and remaining useful life.",
          ],
          [
            "shield",
            "Understand",
            "Translate life estimates into replacement planning priorities.",
          ],
          [
            "search",
            "Compare",
            "Explore compatible offers by availability, price and delivery.",
          ],
          [
            "cart",
            "Source",
            "Complete procurement and track supplier fulfilment.",
          ],
        ].map(([icon, title, text], i) => (
          <div className="card p-6" key={title}>
            <div className="flex justify-between items-center">
              <Icon name={icon} size={25} />
              <span className="eyebrow">0{i + 1}</span>
            </div>
            <h2 className="mt-6 mb-3">{title}</h2>
            <p className="muted leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Notice>
          {API_MODE
            ? "Backend data is used where endpoint contracts are available."
            : "This is a demonstration environment: payments and RUL predictions are simulated."}{" "}
          RUL supports planning; it does not identify failed parts or provide an
          operational airworthiness decision.
        </Notice>
      </div>
    </section>
  );
}
export function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [show, setShow] = useState(false);
  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <Logo />
        <div>
          <p className="eyebrow text-sky-300 mb-5">
            INTELLIGENT AVIATION SOURCING
          </p>
          <h2>
            Aviation parts marketplace with RUL-based replacement planning.
          </h2>
          <p className="mt-5">
            Connecting enterprise airlines, certified MROs and verified
            aerospace suppliers with intelligent procurement.
          </p>
          <div className="auth-features">
            {[
              [
                "chart",
                "Predictive replacement planning",
                "Turn remaining useful life into a sourcing priority.",
              ],
              [
                "shield",
                "Verified global suppliers",
                "Compare compatible components and seller offers.",
              ],
              [
                "plane",
                "Fast B2B procurement",
                "From replacement options to order tracking.",
              ],
            ].map(([icon, title, text]) => (
              <div className="auth-feature" key={title}>
                <Icon name={icon} />
                <div>
                  <b>{title}</b>
                  <small>{text}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="eyebrow">PRECISION PARTS. INFORMED DECISIONS.</p>
      </aside>
      <div className="auth-body">
        <div className="flex justify-between mb-10">
          <Badge>EN · English</Badge>
          <span className="tiny muted">Enterprise workspace</span>
        </div>
        <h1>Enterprise account sign in</h1>
        <p className="muted mt-3 mb-6">
          Welcome back. Continue to your AeroRUL workspace.
        </p>
        <Notice>
          {API_MODE
            ? "Use your backend account. The server determines your permissions."
            : "Interactive demo: choose a role and enter any password. No real authentication is performed."}
        </Notice>
        <Form
          className="mt-6 space-y-5"
          onSubmit={async (data) => {
            const u = await login(
              data.get("email"),
              data.get("password"),
              data.get("role") || "buyer",
            );
            const redirect = params.get("redirect");
            navigate(
              u.role === "buyer" && redirect?.startsWith("/buyer/")
                ? redirect
                : `/${u.role}/dashboard`,
            );
          }}
        >
          {!API_MODE && (
            <Field label="Workspace role">
              <select className="input" name="role">
                <option value="buyer">Buyer · Airline / MRO</option>
                <option value="supplier">Supplier · Aerospace seller</option>
                <option value="admin">Admin · Platform operations</option>
              </select>
            </Field>
          )}
          <Field
            label="Business email"
            name="email"
            type="email"
            required
            autoComplete="username"
            defaultValue={API_MODE ? "" : "procurement@skywest-demo.com"}
          />
          <Field label="Password">
            <div className="relative">
              <input
                className="input pr-16"
                name="password"
                type={show ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder={
                  API_MODE ? "Your password" : "Enter any demo password"
                }
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShow(!show)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </Field>
          <Button type="submit" className="w-full">
            Sign in <Icon name="arrow" size={14} />
          </Button>
        </Form>
        <p className="muted text-center mt-7">
          New to AeroRUL?{" "}
          <Link className="text-accent font-semibold" to="/register">
            Create a corporate account
          </Link>
        </p>
        <p className="tiny muted text-center mt-10">
          B2B aviation marketplace ·{" "}
          {API_MODE ? "API environment" : "Demo environment"}
        </p>
      </div>
    </div>
  );
}
export function Register() {
  const { register } = useApp();
  const [role, setRole] = useState("buyer");
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <p className="eyebrow mb-3">JOIN THE AVIATION NETWORK</p>
        <h1>Create your corporate account</h1>
        <p className="muted mt-3">
          One connected workspace for your next mission.
        </p>
      </div>
      <Notice>
        {API_MODE
          ? "Your registration is submitted to the backend."
          : "Demo registration creates a local profile. No server account is created."}
      </Notice>
      <Form
        className="card p-6 md:p-9 mt-6 space-y-8"
        onSubmit={async (data) => {
          if (data.get("password") !== data.get("confirm"))
            throw Error("Passwords do not match.");
          const { confirm, terms, ...form } = Object.fromEntries(data);
          const u = await register({ ...form, role });
          navigate(`/${u.role}/dashboard`);
        }}
      >
        <div>
          <h2 className="form-heading">01 · Choose your workspace</h2>
          <div className="grid grid-cols-2 gap-3">
            {["buyer", "supplier"].map((r) => (
              <button
                type="button"
                key={r}
                aria-pressed={role === r}
                onClick={() => setRole(r)}
                className={"role-card " + (role === r ? "selected" : "")}
              >
                <Icon name={r === "buyer" ? "plane" : "building"} />
                <b>
                  {r === "buyer" ? "Airline / MRO buyer" : "Aerospace supplier"}
                </b>
                <span>
                  {r === "buyer"
                    ? "Source components and monitor your fleet."
                    : "List products and fulfil customer orders."}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="form-heading">02 · Account information</h2>
          <div className="form-grid">
            <Field label="Full name" name="name" required autoComplete="name" />
            <Field
              label="Work email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
            <Field
              label="Password"
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
            />
            <Field
              label="Confirm password"
              name="confirm"
              type="password"
              required
              autoComplete="new-password"
            />
          </div>
        </div>
        <div>
          <h2 className="form-heading">03 · Company information</h2>
          <div className="form-grid">
            <Field label="Legal company name" name="companyName" required />
            <Field label="Business / tax ID" name="taxId" required />
            <Field label="Country">
              <select name="country" className="input">
                {[
                  "United States",
                  "Vietnam",
                  "United Kingdom",
                  "France",
                  "Singapore",
                  "Other",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Business phone" name="phone" type="tel" />
          </div>
        </div>
        <label className="flex items-start gap-3 muted">
          <input type="checkbox" name="terms" required />I confirm the account
          details and understand this environment does not provide real aviation
          certification or a payment gateway.
        </label>
        <Button type="submit" className="w-full">
          Create corporate account <Icon name="arrow" size={14} />
        </Button>
      </Form>
      <p className="text-center muted mt-5">
        Already registered?{" "}
        <Link className="text-accent" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
export function Marketplace() {
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
    let list = (products.data || []).filter((p) => {
      const q = params.get("q")?.toLowerCase() || "";
      return (
        [p.name, p.partNumber, ...p.compatibility, p.supplier?.name || ""].some(
          (v) => v?.toLowerCase().includes(q),
        ) &&
        (!params.get("category") || p.categoryId === params.get("category")) &&
        (!params.get("model") ||
          p.compatibility.includes(params.get("model"))) &&
        (!params.get("supplier") ||
          String(p.supplierId) === params.get("supplier")) &&
        (!params.get("condition") || p.condition === params.get("condition")) &&
        (!params.has("price") || p.price <= Number(params.get("price"))) &&
        (!params.get("stock") || p.stock > 0)
      );
    });
    if (params.get("sort") === "price-asc")
      list.sort((a, b) => a.price - b.price);
    if (params.get("sort") === "price-desc")
      list.sort((a, b) => b.price - a.price);
    if (params.get("sort") === "delivery")
      list.sort((a, b) => a.deliveryDays - b.deliveryDays);
    return list;
  }, [products.data, params]);
  const tab = params.get("tab") || "products";
  return (
    <div className="container page">
      <Title
        eyebrow="GLOBAL AVIATION SOURCING"
        title="Aviation marketplace"
        description="Precision parts. Verified suppliers. Ready for your next mission."
      />
      <div className="tabs mb-6">
        {[
          ["products", "All products"],
          ["categories", "Categories"],
          ["suppliers", "Verified suppliers"],
        ].map(([key, label]) => (
          <button
            className={tab === key ? "active" : ""}
            key={key}
            onClick={() => set("tab", key)}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "categories" ? (
        <State query={categories}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(categories.data || []).map((c) => (
              <Link
                className="card category-card"
                key={c.id}
                to={"/marketplace?category=" + c.id}
              >
                <Icon name="box" size={28} />
                <h2>{c.name}</h2>
                <p className="muted">Explore components →</p>
              </Link>
            ))}
          </div>
        </State>
      ) : tab === "suppliers" ? (
        <State query={suppliers}>
          <div className="grid md:grid-cols-3 gap-4">
            {(suppliers.data || []).map((s) => (
              <Link
                className="card p-6"
                to={"/marketplace?supplier=" + s.id}
                key={s.id}
              >
                <Icon name="building" size={28} />
                <h2 className="my-4">{s.name}</h2>
                <p className="muted">
                  {s.region} · {s.rating} / 5
                </p>
                <p className="tiny text-accent mt-3">
                  {s.verified ? "Verified supplier" : "Verification pending"} →
                </p>
              </Link>
            ))}
          </div>
        </State>
      ) : (
        <>
          <div className="toolbar">
            <Form
              className="flex gap-2 flex-1 max-w-xl"
              onSubmit={() => set("q", search)}
            >
              <input
                className="input"
                aria-label="Search marketplace"
                placeholder="Part number, engine model or product name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit" aria-label="Search products">
                <Icon name="search" size={16} />
              </Button>
            </Form>
            <button
              className="btn btn-secondary mobile-only"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <Icon name="filter" /> Filters
            </button>
            <select
              className="input w-auto"
              aria-label="Sort products"
              value={params.get("sort") || ""}
              onChange={(e) => set("sort", e.target.value)}
            >
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
                <button
                  className="text-accent tiny"
                  onClick={() => setParams({})}
                >
                  Reset all
                </button>
              </div>
              {[
                [
                  "Category",
                  "category",
                  (categories.data || []).map((c) => [c.id, c.name]),
                ],
                [
                  "Engine model",
                  "model",
                  [
                    ...new Set(
                      (products.data || []).flatMap((p) => p.compatibility),
                    ),
                  ].map((m) => [m, m]),
                ],
                [
                  "Supplier",
                  "supplier",
                  (suppliers.data || []).map((s) => [s.id, s.name]),
                ],
                [
                  "Condition",
                  "condition",
                  [
                    ["New", "New"],
                    ["Refurbished", "Refurbished"],
                    ["Exchange", "Exchange"],
                  ],
                ],
              ].map(([label, key, options]) => (
                <Field key={key} label={label}>
                  <select
                    className="input"
                    value={params.get(key) || ""}
                    onChange={(e) => set(key, e.target.value)}
                  >
                    <option value="">All {label.toLowerCase()}s</option>
                    {options.map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </Field>
              ))}
              <Field
                label="Maximum price (USD)"
                type="number"
                min="0"
                placeholder="No limit"
                value={params.get("price") || ""}
                onChange={(e) => set("price", e.target.value)}
              />
              <label className="text-xs flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={params.get("stock") === "1"}
                  onChange={(e) => set("stock", e.target.checked ? "1" : "")}
                />
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
                  {products.loading
                    ? "Finding components…"
                    : rows.length + " products available"}
                </span>
                <span>
                  USD · {API_MODE ? "Server catalog" : "Demo catalog"}
                </span>
              </p>
              <State query={products}>
                {rows.length ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {rows.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <div className="card empty">
                    <h2>No matching components</h2>
                    <p className="muted">
                      Try another part number or clear your filters.
                    </p>
                    <button
                      className="btn btn-primary mt-5"
                      onClick={() => setParams({})}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </State>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export function ProductDetail() {
  const { id } = useParams();
  const query = useRecords("product", id);
  const others = useRecords("products");
  const [params] = useSearchParams();
  const [offer, setOffer] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("Overview");
  const { db, user, action } = useApp();
  const wish = useWishlist();
  const add = useAddCart();
  useEffect(() => {
    setOffer(null);
    setQuantity(1);
    setTab("Overview");
  }, [id]);
  const p = offer || query.data;
  return (
    <div className="container page">
      <State query={query}>
        {!p ? (
          <Empty
            title="Product not found"
            text="The requested component is not available."
          />
        ) : (
          <>
            <p className="tiny muted mb-6">
              <Link to="/marketplace">Marketplace</Link> / {p.compatibility[0]}{" "}
              / {p.partNumber}
            </p>
            {params.get("from") === "recommendation" && (
              <div className="mb-5">
                <Notice>
                  Recommended for {params.get("engine") || "your engine"} based
                  on engine-model references and sourcing availability. This is
                  not a fault diagnosis or certified fitment advice.
                </Notice>
              </div>
            )}
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
                {query.data?.offers?.length > 1 && (
                  <Field label="Seller offer">
                    <select
                      className="input"
                      value={p.listingId}
                      onChange={(e) => {
                        setOffer(
                          query.data.offers.find(
                            (l) => String(l.listingId) === e.target.value,
                          ),
                        );
                        setQuantity(1);
                      }}
                    >
                      {query.data.offers.map((l) => (
                        <option key={l.listingId} value={l.listingId}>
                          {l.supplier?.name || "Seller"} · {money(l.price)} ·{" "}
                          {l.stock} available
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
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
                <Link
                  className="card p-4 flex items-center gap-3"
                  to={"/marketplace?supplier=" + p.supplierId}
                >
                  <Icon name="shield" size={25} />
                  <div>
                    <b className="text-xs">
                      {p.supplier?.name || "Seller details"}
                    </b>
                    <p className="tiny muted mt-1">
                      {p.supplier?.verified
                        ? "Verified supplier"
                        : "Verify seller documentation"}{" "}
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
                    {p.deliveryDays
                      ? p.deliveryDays + " business days"
                      : "Contact supplier"}
                  </dd>
                  <dt>Condition</dt>
                  <dd>{p.condition || "Not specified"}</dd>
                </dl>
                <div className="flex flex-wrap gap-3 items-end mt-6">
                  <Field label="Quantity">
                    <input
                      aria-label="Product quantity"
                      className="input w-20"
                      type="number"
                      min="1"
                      max={p.stock || 1}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(
                              p.stock,
                              Math.floor(Number(e.target.value) || 1),
                            ),
                          ),
                        )
                      }
                    />
                  </Field>
                  <Button disabled={!p.stock} onClick={() => add(p, quantity)}>
                    <Icon name="cart" size={14} />
                    Add to cart
                  </Button>
                  <Button
                    tone="accent"
                    disabled={!p.stock}
                    onClick={() => add(p, quantity, true)}
                  >
                    Buy now
                  </Button>
                </div>
                <Button
                  tone="ghost"
                  className="mt-3"
                  onClick={() => wish.toggle(p.id)}
                  aria-pressed={wish.ids.includes(p.id)}
                >
                  <Icon name="heart" size={14} />
                  {wish.ids.includes(p.id)
                    ? "Saved to wishlist"
                    : "Save to wishlist"}
                </Button>
              </div>
            </div>
            <div className="tabs mt-9">
              {[
                "Overview",
                "Technical specs",
                "Compatibility",
                "Shipping",
                "Supplier",
                "Reviews",
              ].map((t) => (
                <button
                  className={t === tab ? "active" : ""}
                  key={t}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <section className="card p-6 mt-5 text-xs leading-loose">
              {tab === "Overview" && (
                <>
                  <h2 className="mb-3">Precision components for your fleet</h2>
                  <p>
                    {p.description ||
                      `${p.name} is offered by ${p.supplier?.name || "the selected supplier"} for compatible ${p.compatibility.join(", ")} applications. Review applicability and release documentation before purchasing.`}
                  </p>
                </>
              )}
              {tab === "Technical specs" && (
                <dl className="specs">
                  {Object.entries({
                    "Part number": p.partNumber,
                    "Engine references": p.compatibility.join(", "),
                    Condition: p.condition,
                    "Available units": p.stock,
                    Currency: p.currency,
                  }).map(([k, v]) => (
                    <div className="contents" key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {tab === "Compatibility" && (
                <>
                  <div className="flex gap-2 mb-5">
                    {p.compatibility.map((m) => (
                      <Badge key={m}>{m}</Badge>
                    ))}
                  </div>
                  <Notice>
                    Demo references and catalog metadata do not replace
                    manufacturer-approved applicability or release documents.
                  </Notice>
                </>
              )}
              {tab === "Shipping" && (
                <p>
                  Estimated lead time is {p.deliveryDays || "not specified"}{" "}
                  business days. Confirm actual freight arrangements with the
                  supplier. Checkout shipping is an estimate until server
                  confirmation.
                </p>
              )}
              {tab === "Supplier" && (
                <>
                  <h2>{p.supplier?.name}</h2>
                  <p>
                    {p.supplier?.region} · Rating{" "}
                    {p.supplier?.rating || "not available"}
                  </p>
                  <Link
                    className="btn btn-secondary mt-4"
                    to={"/marketplace?supplier=" + p.supplierId}
                  >
                    View supplier listings →
                  </Link>
                </>
              )}
              {tab === "Reviews" &&
                (API_MODE ? (
                  <Notice>Reviews API has not been connected yet.</Notice>
                ) : (
                  <div className="space-y-5">
                    {db.reviews
                      .filter((r) => r.productId === p.id)
                      .map((r) => (
                        <div
                          className="border-b border-slate-200 pb-4"
                          key={r.id}
                        >
                          <b>
                            {r.companyName} · {r.rating}/5
                          </b>
                          <p>{r.text}</p>
                          {r.reply && (
                            <p className="muted">Store reply: {r.reply}</p>
                          )}
                        </div>
                      ))}
                    {!db.reviews.some((r) => r.productId === p.id) && (
                      <p className="muted">No reviews yet.</p>
                    )}
                    {user?.role === "buyer" ? (
                      <Form
                        className="max-w-xl space-y-3"
                        onSubmit={async (data, form) => {
                          await action("review:add", {
                            productId: p.id,
                            rating: Number(data.get("rating")),
                            text: data.get("text"),
                          });
                          form.reset();
                        }}
                      >
                        <Field label="Your rating">
                          <select className="input" name="rating">
                            {[5, 4, 3, 2, 1].map((n) => (
                              <option key={n}>{n}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Your review">
                          <textarea
                            className="input"
                            name="text"
                            required
                            maxLength={1000}
                          />
                        </Field>
                        <Button type="submit">Post demo review</Button>
                      </Form>
                    ) : (
                      <Link className="text-accent" to="/login">
                        Sign in as a buyer to leave a review
                      </Link>
                    )}
                  </div>
                ))}
            </section>
            <section className="mt-8">
              <div className="section-header">
                <h2>Related components</h2>
                <Link to="/marketplace">View catalog →</Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(others.data || [])
                  .filter((x) => x.id !== p.id)
                  .slice(0, 3)
                  .map((x) => (
                    <ProductCard key={x.id} product={x} />
                  ))}
              </div>
            </section>
          </>
        )}
      </State>
    </div>
  );
}
