import Badge from "./Badge";
export default function Urgency({
  value
}) {
  return <Badge tone={["HIGH", "Replace Soon"].includes(value) ? "danger" : ["Monitor", "Plan", "PLAN", "MONITOR"].includes(value) ? "warn" : "success"}>
      {value || "Not analysed"}
    </Badge>;
}
