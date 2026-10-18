import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../services/store";
import Icon from "./Icon";
export const money = (value, currency = "USD") =>
  value == null || !Number.isFinite(Number(value))
    ? "No offer"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
export const date = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Not available";
export function Title({
  eyebrow = "AERORUL WORKSPACE",
  title,
  description,
  action,
}) {
  return (
    <div className="page-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="muted mt-2">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Button({
  children,
  onClick,
  tone = "primary",
  className = "",
  type = "button",
  disabled,
  ...props
}) {
  const [busy, setBusy] = useState(false);
  const { flash } = useApp();
  return (
    <button
      type={type}
      disabled={disabled || busy}
      className={`btn btn-${tone} ${className}`}
      onClick={
        onClick
          ? async (e) => {
              setBusy(true);
              try {
                await onClick(e);
              } catch (error) {
                flash(error.message, true);
              } finally {
                setBusy(false);
              }
            }
          : undefined
      }
      {...props}
    >
      {busy ? "Working…" : children}
    </button>
  );
}
export function Form({ children, onSubmit, className = "" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className={className}
      onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setBusy(true);
        setError("");
        try {
          await onSubmit(data, e.currentTarget);
        } catch (error) {
          setError(error.message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <fieldset disabled={busy} className="contents">
        {children}
        {error && (
          <div className="col-span-full">
            <Notice error>{error}</Notice>
          </div>
        )}
        <span className="sr-only" role="status">
          {busy ? "Saving…" : ""}
        </span>
      </fieldset>
    </form>
  );
}
export function Field({ label, children, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children || <input className="input" {...props} />}
    </label>
  );
}
export function Notice({ children, error = false, success = false }) {
  return (
    <div
      role={error ? "alert" : "status"}
      className={
        "notice " + (error ? "notice-error" : success ? "notice-success" : "")
      }
    >
      <Icon name={error ? "alert" : "shield"} size={16} />
      <div>{children}</div>
    </div>
  );
}
export function Loading() {
  return (
    <div className="card p-8 animate-pulse" role="status">
      Loading workspace…
    </div>
  );
}
export function State({ query, children }) {
  if (query.loading) return <Loading />;
  if (query.error)
    return (
      <Notice error>
        {query.error}{" "}
        <button className="underline" onClick={() => location.reload()}>
          Retry
        </button>
      </Notice>
    );
  return children;
}
export function Empty({
  title = "Nothing here yet",
  text,
  link = "/marketplace",
  action = "Explore marketplace",
}) {
  return (
    <div className="card empty">
      <Icon name="box" size={32} />
      <h2>{title}</h2>
      <p className="muted">{text}</p>
      {link && (
        <Link className="btn btn-primary mt-5" to={link}>
          {action} <Icon name="arrow" size={14} />
        </Link>
      )}
    </div>
  );
}
export function Stats({ items }) {
  return (
    <div className="stats-grid">
      {items.map((k, i) => (
        <div key={k.label} className={"stat " + (k.alert ? "stat-alert" : "")}>
          <div className="flex justify-between gap-2">
            <p className="eyebrow">{k.label}</p>
            <span className="stat-icon">
              <Icon
                name={k.icon || ["plane", "box", "alert", "heart"][i % 4]}
              />
            </span>
          </div>
          <strong>{k.value}</strong>
          <p className="stat-detail">{k.detail}</p>
        </div>
      ))}
    </div>
  );
}
export function Badge({ children, tone = "" }) {
  return <span className={"badge " + tone}>{children}</span>;
}
export function Urgency({ value }) {
  return (
    <Badge
      tone={
        ["HIGH", "Replace Soon"].includes(value)
          ? "danger"
          : ["Monitor", "Plan", "PLAN", "MONITOR"].includes(value)
            ? "warn"
            : "success"
      }
    >
      {value || "Not analysed"}
    </Badge>
  );
}
export function Table({
  columns,
  rows = [],
  empty = "No records match your filters.",
}) {
  if (!rows.length)
    return <Empty title="No matching records" text={empty} link={null} />;
  return (
    <div
      className="card table-scroll"
      tabIndex={0}
      aria-label="Scrollable data table"
    >
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export const stages = [
  "Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];
export function Timeline({ status }) {
  const step = stages.indexOf(status);
  if (step < 0) return <Badge>{status}</Badge>;
  return (
    <ol className="timeline" aria-label={"Order status: " + status}>
      {stages.map((s, i) => (
        <li className={i <= step ? "done" : ""} key={s}>
          <i />
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}
export function Steps({ items, current }) {
  return (
    <ol className="steps">
      {items.map((s, i) => (
        <li key={s} aria-current={i === current ? "step" : undefined}>
          <b className={i <= current ? "done" : ""}>
            {i < current ? "✓" : i + 1}
          </b>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}
