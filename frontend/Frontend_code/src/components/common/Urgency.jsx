import Icon from "./Icon";
export default function Urgency({ value, prominent = false }) {
  const danger = ["HIGH", "Replace Soon"].includes(value);
  const warning = ["Monitor", "Plan", "PLAN", "MONITOR"].includes(value);
  const tone = !value ? "neutral" : danger ? "danger" : warning ? "warn" : "success";
  return <span className={`badge ${tone} ${prominent ? "engine-status" : ""}`}>
    {prominent && <Icon name={danger ? "alert" : warning ? "clock" : "shield"} size={24} />}
    {value || "Not analysed"}
  </span>;
}
