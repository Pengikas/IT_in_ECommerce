import { useState, useRef, useEffect } from "react";
import Notice from "./Notice";
export default function Form({
  children,
  onSubmit,
  className = ""
}) {
  const ref = useRef(null);
  const [required, setRequired] = useState(false);
  useEffect(() => { setRequired(!!ref.current?.querySelector("[required]")); });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <form ref={ref} className={className} onSubmit={async e => {
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
  }}>
      <fieldset disabled={busy} className="contents">
        {children}
        {error && <div className="col-span-full">
            <Notice error>{error}</Notice>
          </div>}
        <span className="sr-only" role="status">
          {busy ? "Saving…" : ""}
        </span>
      </fieldset>
      {required && <p className="required-legend"><span className="required-marker" aria-hidden="true">*</span> Required fields. Complete these fields before continuing.</p>}
    </form>;
}
