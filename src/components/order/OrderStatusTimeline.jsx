import Badge from "../common/Badge";
import stages from "../../utils/orderStages";
export default function Timeline({
  status
}) {
  const step = stages.indexOf(status);
  if (step < 0) return <Badge>{status}</Badge>;
  return <ol className="timeline" aria-label={"Order status: " + status}>
      {stages.map((s, i) => <li className={i <= step ? "done" : ""} key={s}>
          <i />
          <span>{s}</span>
        </li>)}
    </ol>;
}
