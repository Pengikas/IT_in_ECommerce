import { Link } from "react-router-dom";
import Icon from "./Icon";
export default function Empty({
  title = "Nothing here yet",
  text,
  link = "/marketplace",
  action = "Explore marketplace"
}) {
  return <div className="card empty">
      <Icon name="box" size={32} />
      <h2>{title}</h2>
      <p className="muted">{text}</p>
      {link && <Link className="btn btn-primary mt-5" to={link}>
          {action} <Icon name="arrow" size={14} />
        </Link>}
    </div>;
}
