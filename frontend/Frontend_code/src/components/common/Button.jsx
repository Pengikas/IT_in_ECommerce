import { useState } from "react";
import useApp from "../../hooks/useApp";
export default function Button({
  children,
  onClick,
  tone = "primary",
  className = "",
  type = "button",
  disabled,
  ...props
}) {
  const [busy, setBusy] = useState(false);
  const {
    flash
  } = useApp();
  return <button type={type} disabled={disabled || busy} className={`btn btn-${tone} ${className}`} onClick={onClick ? async e => {
    setBusy(true);
    try {
      await onClick(e);
    } catch (error) {
      flash(error.message, true);
    } finally {
      setBusy(false);
    }
  } : undefined} {...props}>
      {busy ? "Working…" : children}
    </button>;
}
