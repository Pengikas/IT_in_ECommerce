import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
export default function Settings() {
  const {
    db,
    user,
    action,
    flash
  } = useApp();
  const p = db.settings[user.id] || {
    orders: true,
    alerts: true,
    newsletter: false
  };
  return <div className="page">
      <Title eyebrow="WORKSPACE / PREFERENCES" title="Account settings" description="Make this workspace work for you." />
      <Form className="card p-6 max-w-3xl space-y-6" onSubmit={async data => {
      await action("settings:save", {
        orders: data.has("orders"),
        alerts: data.has("alerts"),
        newsletter: data.has("newsletter")
      });
      flash("Preferences saved locally.");
    }}>
        <h2 className="form-heading">Notification preferences</h2>
        {[["orders", "Order and fulfilment updates"], ["alerts", "RUL and replacement planning alerts"], ["newsletter", "Marketplace news"]].map(([key, label]) => <label className="flex justify-between items-center gap-4 text-xs" key={key}>
            {label}
            <input type="checkbox" name={key} defaultChecked={p[key]} />
          </label>)}
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
    </div>;
}
