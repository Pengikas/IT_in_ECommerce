import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp, useRecords } from "../services/store";
import {
  Title,
  Stats,
  Table,
  Button,
  Field,
  Form,
  Notice,
  Badge,
  money,
  date,
} from "../components/UI";
import { Sales } from "../components/Charts";
import ProductArt from "../components/ProductArt";
export function Dashboard() {
  const { db, action } = useApp();
  return (
    <div className="page">
      <Title
        eyebrow="ADMIN / PLATFORM OVERVIEW"
        title="Platform dashboard"
        description="Marketplace activity, partner verification and system overview."
      />
      <Stats
        items={[
          {
            label: "SUPPLIERS",
            value: db.suppliers.length,
            detail:
              db.suppliers.filter((s) => !s.verified).length +
              " awaiting verification",
            icon: "building",
          },
          {
            label: "ORDERS",
            value: db.orders.length,
            detail: "Local demo transactions",
            icon: "cart",
          },
          {
            label: "ORDER VALUE",
            value: money(db.orders.reduce((s, o) => s + o.total, 0)),
            detail: "Total demonstration order value",
            icon: "chart",
          },
          {
            label: "PRODUCTS",
            value: db.products.length,
            detail:
              db.products.filter((p) => p.status === "Active").length +
              " active listings",
            icon: "box",
          },
        ]}
      />
      <div className="dashboard-columns">
        <section className="card p-6 min-w-0">
          <div className="section-header">
            <div>
              <h2>Sales and orders</h2>
              <p>Local order totals by month · USD</p>
            </div>
            <Link to="/admin/orders">View orders →</Link>
          </div>
          <Sales orders={db.orders} />
        </section>
        <section className="card p-6">
          <h2 className="mb-5">RUL service status</h2>
          <Notice>
            Live inference API is not connected. Frontend sample analysis is
            available.
          </Notice>
          <dl className="specs mt-6">
            <dt>Frontend demo</dt>
            <dd className="text-success">Available</dd>
            <dt>Prediction API</dt>
            <dd>Not connected</dd>
            <dt>Payment gateway</dt>
            <dd>Simulation only</dd>
          </dl>
          <Link
            className="btn btn-secondary w-full mt-6"
            to="/admin/rul-status"
          >
            View system details →
          </Link>
        </section>
      </div>
      <section className="card p-6">
        <div className="section-header">
          <h2>New supplier requests</h2>
          <Link to="/admin/suppliers">View all →</Link>
        </div>
        {db.suppliers
          .filter((s) => !s.verified)
          .map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-slate-200"
            >
              <div>
                <b className="text-xs">{s.name}</b>
                <p className="tiny muted mt-2">
                  Region: {s.region} · Verification pending
                </p>
              </div>
              <Button onClick={() => action("supplier:toggle", { id: s.id })}>
                Approve supplier
              </Button>
            </div>
          ))}
        {db.suppliers.every((s) => s.verified) && (
          <p className="muted">No pending supplier requests.</p>
        )}
      </section>
    </div>
  );
}
export function Suppliers() {
  const { db, action } = useApp();
  return (
    <div className="page">
      <Title
        eyebrow="ADMIN / PARTNER NETWORK"
        title="Supplier verification"
        description="Review partners and maintain a trusted marketplace."
      />
      <Notice>
        These actions change local demo verification records only.
      </Notice>
      <Table
        rows={db.suppliers}
        columns={[
          { key: "name", label: "Business name" },
          { key: "region", label: "Region" },
          { key: "rating", label: "Demo rating" },
          {
            key: "verified",
            label: "Verification",
            render: (r) => (
              <Badge tone={r.verified ? "success" : "warn"}>
                {r.verified ? "Verified" : "Pending / suspended"}
              </Badge>
            ),
          },
          {
            key: "action",
            label: "Action",
            render: (r) => (
              <Button
                tone="secondary"
                onClick={() => action("supplier:toggle", { id: r.id })}
              >
                {r.verified ? "Suspend" : "Approve supplier"}
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
export function Products() {
  const { db, action } = useApp();
  const [selected, setSelected] = useState(db.products[0]?.id);
  const [search, setSearch] = useState("");
  const p = db.products.find((p) => p.id === selected);
  return (
    <div className="page">
      <Title
        eyebrow="ADMIN / CATALOG GOVERNANCE"
        title="Supplier & product moderation"
        description="Review component specifications and listing publication status."
      />
      <div className="card moderation-layout">
        <aside>
          <input
            aria-label="Filter listings"
            className="input mb-4"
            placeholder="Filter by part number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {db.products
            .filter((p) =>
              (p.name + p.partNumber)
                .toLowerCase()
                .includes(search.toLowerCase()),
            )
            .map((p) => (
              <button
                key={p.id}
                className={
                  "moderation-item " + (p.id === selected ? "active" : "")
                }
                onClick={() => setSelected(p.id)}
              >
                <b>{p.name}</b>
                <span>
                  {p.status} · {money(p.price)}
                </span>
              </button>
            ))}
        </aside>
        {p && (
          <section className="p-6 space-y-5">
            <ProductArt product={p} className="h-48 rounded" />
            <h2>{p.name}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge>{p.partNumber}</Badge>
              <Badge>{p.condition}</Badge>
              <Badge>{p.status}</Badge>
            </div>
            <p className="muted leading-relaxed">
              {p.description ||
                "Review engine-model references and seller documents for this demonstration listing."}
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
              <Button
                tone="secondary"
                onClick={() =>
                  action("product:moderate", { id: p.id, status: "Hidden" })
                }
              >
                Hide listing
              </Button>
              <Button
                tone="secondary"
                onClick={() =>
                  action("product:moderate", { id: p.id, status: "Draft" })
                }
              >
                Request changes
              </Button>
              <Button
                onClick={() =>
                  action("product:moderate", { id: p.id, status: "Active" })
                }
              >
                Approve and publish
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
export function Categories() {
  const { db, action } = useApp();
  const [edit, setEdit] = useState(null);
  return (
    <div className="page">
      <Title
        eyebrow="ADMIN / CATALOG"
        title="Categories"
        description="Organize the marketplace catalog."
      />
      <Form
        key={edit?.id || "new"}
        className="card p-5 flex flex-wrap gap-3"
        onSubmit={async (data, form) => {
          const name = data.get("name").trim();
          if (!name) throw Error("Enter a category name.");
          await action("category:save", { id: edit?.id, name });
          setEdit(null);
          form.reset();
        }}
      >
        <input
          className="input flex-1 w-auto"
          aria-label="Category name"
          name="name"
          required
          placeholder="Category name"
          defaultValue={edit?.name || ""}
        />
        <Button type="submit">{edit ? "Save category" : "Add category"}</Button>
        {edit && (
          <Button tone="secondary" onClick={() => setEdit(null)}>
            Cancel
          </Button>
        )}
      </Form>
      <Table
        rows={db.categories}
        columns={[
          { key: "name", label: "Category" },
          { key: "id", label: "Reference" },
          {
            key: "action",
            label: "Action",
            render: (r) => (
              <Button tone="secondary" onClick={() => setEdit(r)}>
                Edit category
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
export function Users() {
  const { db, action } = useApp();
  const [search, setSearch] = useState("");
  return (
    <div className="page">
      <Title
        eyebrow="ADMIN / ACCESS DIRECTORY"
        title="User management"
        description="Review sample accounts and their access status."
      />
      <Notice>
        This directory is a local UI demo. Suspension is not enforced by an
        identity server.
      </Notice>
      <input
        aria-label="Search users"
        className="input max-w-md"
        placeholder="Search name, company or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table
        rows={db.users.filter((u) =>
          (u.name + u.companyName + u.email)
            .toLowerCase()
            .includes(search.toLowerCase()),
        )}
        columns={[
          { key: "name", label: "User" },
          { key: "companyName", label: "Company" },
          { key: "email", label: "Business email" },
          { key: "role", label: "Role" },
          {
            key: "active",
            label: "Status",
            render: (u) => (
              <Badge tone={u.active ? "success" : "warn"}>
                {u.active ? "Active" : "Suspended"}
              </Badge>
            ),
          },
          {
            key: "action",
            label: "Action",
            render: (u) =>
              u.role !== "admin" && (
                <Button
                  tone="secondary"
                  onClick={() => action("user:toggle", { id: u.id })}
                >
                  {u.active ? "Suspend" : "Restore"}
                </Button>
              ),
          },
        ]}
      />
    </div>
  );
}
export function Companies() {
  const { db } = useApp();
  const [search, setSearch] = useState("");
  const companies = [
    ...new Map(
      db.users.map((u) => [
        u.companyName,
        {
          id: u.companyName,
          name: u.companyName,
          type:
            u.role === "buyer"
              ? "Airline / MRO buyer"
              : u.role === "supplier"
                ? "Aerospace supplier"
                : "Marketplace operator",
          email: u.email,
        },
      ]),
    ).values(),
  ];
  return (
    <div className="page">
      <Title
        eyebrow="ADMIN / BUSINESS DIRECTORY"
        title="Companies & buyers"
        description="Sample organizations participating in this marketplace."
      />
      <input
        aria-label="Search companies"
        className="input max-w-md"
        placeholder="Search companies…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table
        rows={companies.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase()),
        )}
        columns={[
          { key: "name", label: "Company" },
          { key: "type", label: "Business type" },
          { key: "email", label: "Contact email" },
        ]}
      />
    </div>
  );
}
export function Orders() {
  const { db } = useApp();
  return (
    <div className="page">
      <Title
        eyebrow="ADMIN / PROCUREMENT OVERVIEW"
        title="Orders"
        description="Observe order activity; fulfilment belongs to the assigned supplier."
      />
      <Table
        rows={db.orders}
        columns={[
          { key: "id", label: "Order reference" },
          { key: "placedAt", label: "Placed", render: (o) => date(o.placedAt) },
          { key: "total", label: "Order value", render: (o) => money(o.total) },
          {
            key: "status",
            label: "Status",
            render: (o) => <Badge>{o.status}</Badge>,
          },
        ]}
      />
    </div>
  );
}
export function Reports() {
  const { db, action } = useApp();
  return (
    <div className="page">
      <Title
        eyebrow="ADMIN / TRUST & QUALITY"
        title="Reviews & reports"
        description="Resolve sample marketplace quality reports."
      />
      <Notice>Sample moderation cases for interface demonstration.</Notice>
      <Table
        rows={db.reports}
        columns={[
          { key: "id", label: "Report" },
          { key: "subject", label: "Issue" },
          { key: "product", label: "Product" },
          { key: "status", label: "Status" },
          {
            key: "action",
            label: "Action",
            render: (r) => (
              <Button
                tone="secondary"
                onClick={() => action("report:toggle", { id: r.id })}
              >
                {r.status === "Open" ? "Resolve" : "Reopen"}
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
export function SystemStatus() {
  return (
    <div className="page">
      <Title
        eyebrow="ADMIN / SYSTEM HEALTH"
        title="RUL system status"
        description="Connection readiness for the prediction workflow."
      />
      <Notice>
        No live backend health has been verified. A configured URL does not
        establish a working server.
      </Notice>
      <div className="grid sm:grid-cols-2 gap-5">
        {[
          [
            "Frontend sample analysis",
            "Available",
            "Fixed engine history with local result storage.",
          ],
          [
            "Prediction API",
            "Not verified",
            "A running Express and RUL inference service is required.",
          ],
          [
            "Sensor ingestion",
            "Demo check only",
            "CSV size/row checks are not a model preprocessing pipeline.",
          ],
          [
            "Model metadata",
            "Not connected",
            "Model version and preprocessing metadata must come from the API.",
          ],
        ].map(([title, status, text]) => (
          <section className="card p-6" key={title}>
            <h2>{title}</h2>
            <div className="my-4">
              <Badge>{status}</Badge>
            </div>
            <p className="muted leading-relaxed">{text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
