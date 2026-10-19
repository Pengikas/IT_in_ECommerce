import Icon from "./Icon";
export default function Stats({
  items
}) {
  return <div className="stats-grid">
      {items.map((k, i) => <div key={k.label} className={"stat " + (k.alert ? "stat-alert" : "")}>
          <div className="flex justify-between gap-2">
            <p className="eyebrow">{k.label}</p>
            <span className="stat-icon">
              <Icon name={k.icon || ["plane", "box", "alert", "heart"][i % 4]} />
            </span>
          </div>
          <strong>{k.value}</strong>
          <p className="stat-detail">{k.detail}</p>
        </div>)}
    </div>;
}
