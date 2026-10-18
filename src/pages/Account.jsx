import { Link } from "react-router-dom";
import { useApp } from "../services/store";
import { Title, Button, Field, Form, Notice, Empty } from "../components/UI";
import Icon from "../components/Icon";
const notifications = [
  {
    id: "rul",
    icon: "alert",
    title: "Replacement planning signal · ENG-037",
    text: "Sample predicted RUL is 18 cycles. Review compatible sourcing options.",
    to: "/buyer/recommendations?engine=ENG-037",
    time: "Fleet sample",
  },
  {
    id: "order",
    icon: "box",
    title: "Your order is on its way",
    text: "ORD-1004 is marked as shipped in the demonstration dataset.",
    to: "/buyer/orders/ORD-1004",
    time: "Order sample",
  },
  {
    id: "welcome",
    icon: "shield",
    title: "Welcome to AeroRUL",
    text: "Your workspace connects fleet insights to smarter procurement.",
    to: "/marketplace",
    time: "Workspace update",
  },
];
export function Notifications() {
  const { db, action } = useApp();
  return (
    <div className="page">
      <Title
        eyebrow="BUYER / ACTIVITY"
        title="Notifications"
        description="Fleet, sourcing and order updates in one place."
        action={
          <Button
            tone="secondary"
            onClick={() =>
              action("notifications:read", {
                ids: notifications.map((n) => n.id),
              })
            }
          >
            Mark all as read
          </Button>
        }
      />
      <div className="card overflow-hidden">
        {notifications.map((n) => (
          <div
            className={
              "notification-row " +
              (db.readNotifications.includes(n.id) ? "" : "unread")
            }
            key={n.id}
          >
            <span className="stat-icon h-fit">
              <Icon name={n.icon} />
            </span>
            <div className="flex-1">
              <Link
                className="text-xs font-semibold"
                to={n.to}
                onClick={() =>
                  action("notifications:read", {
                    ids: [...new Set([...db.readNotifications, n.id])],
                  })
                }
              >
                {n.title}
              </Link>
              <p className="muted my-2">{n.text}</p>
              <p className="eyebrow">{n.time}</p>
            </div>
            <Button
              tone="ghost"
              className="compact"
              aria-label={"Mark " + n.title + " as read"}
              onClick={() =>
                action("notifications:read", {
                  ids: [...new Set([...db.readNotifications, n.id])],
                })
              }
            >
              <Icon name="check" size={15} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
export function Profile() {
  const { db, user, action, flash } = useApp();
  const p = db.profiles[user.id] || {
    companyName: user.companyName,
    email: user.email,
    phone: "",
    taxId: "",
    address: "",
    description: "",
  };
  return (
    <div className="page">
      <Title
        eyebrow="WORKSPACE / BUSINESS PROFILE"
        title={user.role === "supplier" ? "Store profile" : "Company profile"}
        description="Keep business contact details up to date."
      />
      <Form
        className="card p-6 form-grid max-w-4xl"
        onSubmit={async (data) => {
          await action("profile:save", Object.fromEntries(data));
          flash("Business profile saved locally.");
        }}
      >
        {[
          ["Company name", "companyName", "text"],
          ["Contact email", "email", "email"],
          ["Phone", "phone", "tel"],
          ["Business / tax ID", "taxId", "text"],
        ].map(([label, name, type]) => (
          <Field
            key={name}
            label={label}
            name={name}
            type={type}
            required={name === "companyName" || name === "email"}
            defaultValue={p[name]}
          />
        ))}
        <div className="col-span-full">
          <Field label="Business address">
            <textarea
              className="input"
              name="address"
              defaultValue={p.address}
            />
          </Field>
        </div>
        <div className="col-span-full">
          <Field label="Company introduction">
            <textarea
              className="input"
              rows={4}
              name="description"
              defaultValue={p.description}
            />
          </Field>
        </div>
        <div className="col-span-full">
          <Button type="submit">Save profile</Button>
        </div>
      </Form>
    </div>
  );
  }
export function Settings() {
  const { db, user, action, flash } = useApp();
  const p = db.settings[user.id] || {
    orders: true,
    alerts: true,
    newsletter: false,
  };
  return (
    <div className="page">
      <Title
        eyebrow="WORKSPACE / PREFERENCES"
        title="Account settings"
        description="Make this workspace work for you."
      />
      <Form
        className="card p-6 max-w-3xl space-y-6"
        onSubmit={async (data) => {
          await action("settings:save", {
            orders: data.has("orders"),
            alerts: data.has("alerts"),
            newsletter: data.has("newsletter"),
          });
          flash("Preferences saved locally.");
        }}
      >
        <h2 className="form-heading">Notification preferences</h2>
        {[
          ["orders", "Order and fulfilment updates"],
          ["alerts", "RUL and replacement planning alerts"],
          ["newsletter", "Marketplace news"],
        ].map(([key, label]) => (
          <label
            className="flex justify-between items-center gap-4 text-xs"
            key={key}
          >
            {label}
            <input type="checkbox" name={key} defaultChecked={p[key]} />
          </label>
        ))}
        <div className="border-t border-slate-200 pt-5">
          <h2 className="text-sm">Account & security</h2>
          <p className="muted leading-relaxed mt-3">
            Signed in as {user.email}. This is a local demo session. Password
            changes and multi-factor authentication require a backend identity
            API.
          </p>
        </div>
        <Button type="submit">Save preferences</Button>
      </Form>
    </div>
  );
}