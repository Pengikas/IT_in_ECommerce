export default function Title({
  eyebrow = "AERORUL WORKSPACE",
  title,
  description,
  action
}) {
  return <div className="page-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="muted mt-2">{description}</p>}
      </div>
      {action}
    </div>;
}
