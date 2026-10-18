import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp, useRecords } from "../services/store";
import { API_MODE } from "../services/config";
import {
  Title,
  State,
  Stats,
  Table,
  Button,
  Form,
  Field,
  Notice,
  Badge,
  Empty,
  money,
  date,
  stages,
} from "../components/UI";
import ProductArt from "../components/ProductArt";
import { Sales } from "../components/Charts";
function scopedOrders(rows, user) {
  return rows
    .map((o) => {
      if (API_MODE) return o;
      const items = o.items.filter((i) => i.product?.supplierId === user.id);
      return {
        ...o,
        items,
        total: items.reduce((s, i) => s + i.price * i.quantity, 0),
        status: o.sellerStatuses?.[user.id] || o.status,
      };
    })
    .filter((o) => API_MODE || o.items.length);
}
export function Dashboard() {
  const listings = useRecords("listings");
  const orders = useRecords("orders");
  const { user } = useApp();
  const rows = listings.data || [];
  const mine = scopedOrders(orders.data || [], user);
  const low = rows.filter((p) => p.stock <= 5);
  return (
    <div className="page">
      <Title
        eyebrow="SUPPLIER WORKSPACE / OVERVIEW"
        title="Supplier dashboard"
        description="Monitor sales performance, store activity and fulfilment priorities."
        action={
          <Link className="btn btn-primary" to="/supplier/products/new">
            + Add product
          </Link>
        }
      />
      <State query={listings}>
        <Stats
          items={[
            {
              label: "ORDER REVENUE",
              value: money(mine.reduce((s, o) => s + o.total, 0)),
              detail: "Item revenue · All time",
              icon: "chart",
            },
            {
              label: "ACTIVE ORDERS",
              value: mine.filter((o) => o.status !== "Delivered").length,
              detail: "Orders assigned to your store",
            },
            {
              label: "ACTIVE LISTINGS",
              value: rows.filter((p) => p.status === "Active").length,
              detail: "Published catalog offers",
              icon: "box",
            },
            {
              label: "LOW STOCK",
              value: low.length,
              detail: "Listings with 5 or fewer units",
              alert: low.length > 0,
              icon: "alert",
            },
          ]}
        />
        <div className="dashboard-columns">
          <section className="card p-6 min-w-0">
            <div className="section-header">
              <div>
                <h2>Sales performance</h2>
                <p>Recorded order item revenue · USD</p>
              </div>
              <Link to="/supplier/analytics">Analytics →</Link>
            </div>
            <State query={orders}>
              <Sales orders={mine} />
              <div className="section-header mt-6">
                <h2>Recent orders</h2>
                <Link to="/supplier/orders">Manage →</Link>
              </div>
              {mine.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  className="flex justify-between items-center gap-3 py-4 border-t border-slate-200 text-xs"
                >
                  <b className="mono">{o.id}</b>
                  <Badge>{o.status}</Badge>
                  <strong>{money(o.total)}</strong>
                </div>
              ))}
            </State>
          </section>
          <section className="card p-6">
            <div className="section-header">
              <h2>Your product catalog</h2>
              <Link to="/supplier/products">Manage →</Link>
            </div>
            {rows.slice(0, 4).map((p) => (
              <Link
                className="flex items-center gap-3 py-4 border-t border-slate-200"
                key={p.id}
                to={`/supplier/products/${p.id}/edit`}
              >
                <ProductArt
                  product={p}
                  className="w-16 h-14 shrink-0 rounded"
                />
                <div>
                  <p className="tiny font-semibold">{p.name}</p>
                  <p className="tiny muted mt-2">
                    {p.stock} available · {money(p.price)}
                  </p>
                </div>
              </Link>
            ))}
            <h2 className="mt-7 mb-4">Low-stock alerts</h2>
            {low.map((p) => (
              <Link
                className="flex justify-between tiny py-3 border-t border-slate-200"
                key={p.id}
                to="/supplier/inventory"
              >
                <span>{p.partNumber}</span>
                <span className="text-critical">{p.stock} left →</span>
              </Link>
            ))}
            {!low.length && (
              <p className="muted">All listings are sufficiently stocked.</p>
            )}
          </section>
        </div>
      </State>
    </div>
  );
}
export function Products() {
  const query = useRecords("listings");
  const [search, setSearch] = useState("");
  const rows = (query.data || []).filter((p) =>
    (p.name + p.partNumber).toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="page">
      <Title
        eyebrow="SUPPLIER / PRODUCT CATALOG"
        title="Products"
        description="Manage your component listings and seller offers."
        action={
          <Link className="btn btn-primary" to="/supplier/products/new">
            Add product
          </Link>
        }
      />
      <input
        aria-label="Search listings"
        className="input max-w-md"
        placeholder="Search product or part number…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <State query={query}>
        <Table
          rows={rows}
          columns={[
            { key: "name", label: "Component" },
            {
              key: "partNumber",
              label: "Part number",
              render: (p) => <span className="mono tiny">{p.partNumber}</span>,
            },
            {
              key: "price",
              label: "Unit price",
              render: (p) => money(p.price),
            },
            { key: "stock", label: "Stock" },
            {
              key: "status",
              label: "Status",
              render: (p) => (
                <Badge tone={p.status === "Active" ? "success" : ""}>
                  {p.status || "Active"}
                </Badge>
              ),
            },
            {
              key: "action",
              label: "Action",
              render: (p) => (
                <Link
                  className="text-accent"
                  to={`/supplier/products/${p.id}/edit`}
                >
                  Edit listing →
                </Link>
              ),
            },
          ]}
        />
      </State>
    </div>
  );
}
export function ProductForm() {
  const { id } = useParams();
  const query = useRecords("listings");
  const catalog = useRecords("products");
  const categories = useRecords("categories");
  const { action } = useApp();
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");
  const p = id
    ? query.data?.find((p) => p.id === id)
    : {
        productId: "",
        name: "",
        partNumber: "",
        categoryId: "cat-turbine",
        compatibility: [],
        price: "",
        stock: 0,
        deliveryDays: 5,
        condition: "New",
        status: "Draft",
        description: "",
      };
  return (
    <div className="page">
      <Title
        eyebrow="SUPPLIER / SELLER OFFER"
        title={
          id
            ? "Edit product"
            : API_MODE
              ? "Create seller listing"
              : "Add product"
        }
        description={
          API_MODE
            ? "Create an offer for an existing catalog product."
            : "Publish precise component details and engine references."
        }
      />
      <State query={query}>
        {!p ? (
          <Empty
            title="Listing not found"
            text="This offer is not in your store."
            link="/supplier/products"
            action="Back to products"
          />
        ) : (
          <Form
            key={id || "new"}
            className="card p-6 md:p-8 form-grid"
            onSubmit={async (data) => {
              const values = Object.fromEntries(data);
              const compatibility = API_MODE
                ? p.compatibility
                : values.compatibility
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
              if (!API_MODE && !compatibility.length)
                throw Error("Enter at least one engine reference.");
              const product = catalog.data?.find(
                (p) => p.id === values.productId,
              );
              await action("product:save", {
                ...p,
                ...values,
                id,
                productId: product?.productId ?? values.productId,
                price: Number(values.price),
                stock: Number(values.stock),
                deliveryDays: Number(values.deliveryDays),
                compatibility,
              });
              navigate("/supplier/products");
            }}
          >
            {API_MODE ? (
              <div className="col-span-full">
                <Field label="Catalog product">
                  <select
                    className="input"
                    name="productId"
                    required
                    defaultValue={p.productId}
                    disabled={!!id}
                  >
                    <option value="">Select a catalog product</option>
                    {(catalog.data || []).map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} · {product.partNumber}
                      </option>
                    ))}
                  </select>
                </Field>
                <p className="tiny muted mt-2">
                  Catalog product creation needs an admin API; this form creates
                  a seller offer.
                </p>
              </div>
            ) : (
              <>
                <Field
                  label="Product name"
                  name="name"
                  required
                  defaultValue={p.name}
                />
                <Field
                  label="Part number / SKU"
                  name="partNumber"
                  required
                  defaultValue={p.partNumber}
                />
                <Field label="Category">
                  <select
                    className="input"
                    name="categoryId"
                    defaultValue={p.categoryId}
                  >
                    {(categories.data || []).map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Compatible engines (comma separated)"
                  name="compatibility"
                  required
                  defaultValue={p.compatibility.join(", ")}
                />
                <div className="col-span-full">
                  <Field label="Description">
                    <textarea
                      className="input"
                      name="description"
                      rows={4}
                      defaultValue={p.description}
                    />
                  </Field>
                </div>
              </>
            )}
            {[
              ["Unit price (USD)", "price", "0.01"],
              ["Available stock", "stock", "1"],
              ["Delivery estimate (days)", "deliveryDays", "1"],
            ].map(([label, name, step]) => (
              <Field
                key={name}
                label={label}
                name={name}
                type="number"
                required
                min={name === "stock" ? 0 : name === "price" ? 0.01 : 1}
                step={step}
                defaultValue={p[name]}
              />
            ))}
            <Field label="Condition">
              <select
                className="input"
                name="condition"
                defaultValue={p.condition}
              >
                {["New", "Refurbished", "Exchange"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Listing status">
              <select className="input" name="status" defaultValue={p.status}>
                {["Draft", "Active", "Hidden"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <div>
              <Field label="Product photo preview">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 2 * 1024 * 1024) return;
                    const reader = new FileReader();
                    reader.onload = () => setPreview(reader.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </Field>
              <p className="tiny muted mt-2">
                Preview only, up to 2 MB. Persistent uploads need the media API.
              </p>
            </div>
            {preview && (
              <img
                className="h-32 object-contain"
                src={preview}
                alt="Selected product preview"
              />
            )}
            <div className="col-span-full">
              <Notice>
                {API_MODE
                  ? "The backend must enforce supplier ownership and validate listing changes."
                  : "Changes are saved in the local demonstration catalog only."}
              </Notice>
            </div>
            <div className="flex flex-wrap gap-3 col-span-full">
              <Button type="submit">
                {id
                  ? "Save changes"
                  : API_MODE
                    ? "Save listing to server"
                    : "Create product"}
              </Button>
              <Link className="btn btn-secondary" to="/supplier/products">
                Cancel
              </Link>
            </div>
          </Form>
        )}
      </State>
    </div>
  );
}
export function Inventory() {
  const query = useRecords("listings");
  const { action, flash } = useApp();
  const [draft, setDraft] = useState({});
  return (
    <div className="page">
      <Title
        eyebrow="SUPPLIER / INVENTORY"
        title="Inventory"
        description="Keep marketplace stock accurate and ready for procurement."
      />
      <State query={query}>
        <Table
          rows={query.data || []}
          columns={[
            { key: "name", label: "Component" },
            { key: "partNumber", label: "Part number" },
            {
              key: "stock",
              label: "Available units",
              render: (p) => (
                <input
                  className="input w-24"
                  type="number"
                  min="0"
                  step="1"
                  aria-label={"Stock for " + p.name}
                  value={draft[p.id] ?? p.stock}
                  onChange={(e) =>
                    setDraft({ ...draft, [p.id]: e.target.value })
                  }
                />
              ),
            },
            {
              key: "action",
              label: "Action",
              render: (p) => (
                <Button
                  tone="secondary"
                  onClick={async () => {
                    await action("stock:update", {
                      id: p.id,
                      stock: Number(draft[p.id] ?? p.stock),
                    });
                    flash("Stock updated for " + p.partNumber);
                  }}
                >
                  Update stock
                </Button>
              ),
            },
          ]}
        />
      </State>
    </div>
  );
}
export function SellerOrders() {
  const query = useRecords("orders");
  const { user, action } = useApp();
  const [filter, setFilter] = useState("");
  const rows = scopedOrders(query.data || [], user).filter(
    (o) => !filter || o.status === filter,
  );
  return (
    <div className="page">
      <Title
        eyebrow="SUPPLIER / FULFILMENT"
        title="Orders"
        description="Process the items assigned to your store."
      />
      <select
        aria-label="Filter seller order status"
        className="input w-auto max-w-xs"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">All statuses</option>
        {stages.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <State query={query}>
        <Table
          rows={rows}
          columns={[
            { key: "id", label: "Seller order" },
            {
              key: "placedAt",
              label: "Placed",
              render: (o) => date(o.placedAt),
            },
            {
              key: "items",
              label: "Your items",
              render: (o) => (
                <span className="whitespace-normal text-xs">
                  {o.items
                    ?.map(
                      (i) =>
                        `${i.product?.name || i.productId} × ${i.quantity}`,
                    )
                    .join(", ") || "Server seller order"}
                </span>
              ),
            },
            {
              key: "total",
              label: "Item subtotal",
              render: (o) => money(o.total),
            },
            {
              key: "status",
              label: "Status",
              render: (o) => <Badge>{o.status}</Badge>,
            },
            {
              key: "action",
              label: "Next action",
              render: (o) => {
                const index = stages.indexOf(o.status);
                return index >= 0 && index < 4 ? (
                  <Button
                    className="compact"
                    onClick={() =>
                      action("order:status", {
                        id: o.id,
                        status: stages[index + 1],
                      })
                    }
                  >
                    Mark {stages[index + 1]}
                  </Button>
                ) : (
                  <span className="text-success tiny">Complete</span>
                );
              },
            },
          ]}
        />
      </State>
    </div>
  );
}
export function Analytics() {
  const query = useRecords("listings");
  const orders = useRecords("orders");
  const { user } = useApp();
  const mine = scopedOrders(orders.data || [], user);
  const rows = (query.data || []).map((p) => {
    const items = mine
      .flatMap((o) => o.items || [])
      .filter((i) => i.productId === p.id);
    return {
      ...p,
      units: items.reduce((s, i) => s + i.quantity, 0),
      revenue: items.reduce((s, i) => s + i.quantity * i.price, 0),
    };
  });
  return (
    <div className="page">
      <Title
        eyebrow="SUPPLIER / BUSINESS INSIGHTS"
        title="Sales analytics"
        description="Understand store performance from recorded demo orders."
      />
      <Stats
        items={[
          {
            label: "TOTAL REVENUE",
            value: money(rows.reduce((s, p) => s + p.revenue, 0)),
            detail: "Recorded order item revenue",
            icon: "chart",
          },
          {
            label: "UNITS SOLD",
            value: rows.reduce((s, p) => s + p.units, 0),
            detail: "All demo orders",
            icon: "box",
          },
          {
            label: "SELLER ORDERS",
            value: mine.length,
            detail: "Containing your products",
            icon: "cart",
          },
          {
            label: "LISTINGS",
            value: rows.length,
            detail: "Across all statuses",
            icon: "box",
          },
        ]}
      />
      <section className="card p-6 min-w-0">
        <h2>Revenue over time</h2>
        <Sales orders={mine} />
      </section>
      <Table
        rows={rows.sort((a, b) => b.revenue - a.revenue)}
        columns={[
          { key: "name", label: "Product" },
          { key: "units", label: "Units sold" },
          { key: "revenue", label: "Revenue", render: (r) => money(r.revenue) },
          { key: "stock", label: "Current stock" },
        ]}
      />
      <Notice>Analytics summarize demonstration orders, not real sales.</Notice>
    </div>
  );
}
export function Reviews() {
  const { db, user, action } = useApp();
  const rows = db.reviews.filter((r) =>
    db.products.some((p) => p.id === r.productId && p.supplierId === user.id),
  );
  return (
    <div className="page">
      <Title
        eyebrow="SUPPLIER / CUSTOMER EXPERIENCE"
        title="Customer reviews"
        description="Read buyer feedback and respond from your store."
      />
      {!rows.length ? (
        <Empty
          title="No reviews yet"
          text="Buyer feedback on your products will appear here."
          link={null}
        />
      ) : (
        rows.map((r) => (
          <section key={r.id} className="card p-6">
            <b className="text-xs">
              {r.companyName} · {r.rating} / 5
            </b>
            <p className="tiny text-accent mt-2">
              {db.products.find((p) => p.id === r.productId)?.name}
            </p>
            <p className="text-sm my-5">{r.text}</p>
            {r.reply ? (
              <Notice>Store reply: {r.reply}</Notice>
            ) : (
              <Form
                className="flex gap-3"
                onSubmit={(data) =>
                  action("review:reply", { id: r.id, reply: data.get("reply") })
                }
              >
                <input
                  className="input"
                  name="reply"
                  aria-label="Store reply"
                  required
                  placeholder="Write a reply…"
                />
                <Button type="submit">Reply</Button>
              </Form>
            )}
          </section>
        ))
      )}
    </div>
  );
}
