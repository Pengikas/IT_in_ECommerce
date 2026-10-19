import { Link } from "react-router-dom";
import Icon from "./Icon";
export default function Logo() {
  return <Link to="/" className="brand">
      <span className="brand-mark">
        <Icon name="plane" size={20} />
      </span>
      <span>
        Aero<span className="text-accent">RUL</span>
        <small>AVIATION MARKETPLACE</small>
      </span>
    </Link>;
}
