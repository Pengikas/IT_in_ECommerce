import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useApp from "../../hooks/useApp";
import { read } from "../../services/demo/database";
import Icon from "./Icon";
export default function HeaderSearch() {
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const key = `aerorul_searches_${user?.id || "guest"}`;
  const [value, setValue] = useState("");
  const [history, setHistory] = useState(() => read(key, []));
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  useEffect(() => setHistory(read(key, [])), [key]);
  useEffect(() => {
    setOpen(false);
    if (location.pathname === "/marketplace") setValue(new URLSearchParams(location.search).get("q") || "");
  }, [location.pathname, location.search]);
  useEffect(() => {
    const outside = e => { if (!root.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  function search(text) {
    const q = text.trim();
    if (q) {
      const next = [q, ...history.filter(item => item.toLowerCase() !== q.toLowerCase())].slice(0, 5);
      localStorage.setItem(key, JSON.stringify(next)); setHistory(next);
    }
    setValue(q); setOpen(false);
    navigate("/marketplace" + (q ? "?q=" + encodeURIComponent(q) : ""));
  }
  const suggestions = history.filter(q => q.toLowerCase().includes(value.trim().toLowerCase()));
  return <div className="header-search-container" ref={root}>
    <form className="header-search" autoComplete="off" onSubmit={e => { e.preventDefault(); search(value); }}>
      <Icon name="search" size={16} />
      <input type="search" name="aerorul-catalog-query" autoComplete="off" spellCheck={false} aria-label="Global product search" aria-controls={open && suggestions.length ? "recent-searches" : undefined} aria-expanded={open && suggestions.length > 0} placeholder="Search part number, engine model or supplier…" value={value} onChange={e => { setValue(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={e => { if (e.key === "Escape") setOpen(false); }} />
      <button type="submit" className="search-submit" aria-label="Search products" title="Search products"><Icon name="arrow" size={16} /></button>
    </form>
    {open && suggestions.length > 0 && <section id="recent-searches" className="recent-searches" aria-label="Recent searches" onKeyDown={e => { if (e.key === "Escape") { setOpen(false); root.current.querySelector("input").focus(); } }}>
      <p>Recent searches</p>
      {suggestions.map(q => <button key={q} type="button" onClick={() => search(q)}><Icon name="clock" size={15} /><span>{q}</span><Icon name="arrow" size={14} /></button>)}
      <button type="button" className="clear-searches" onClick={() => { localStorage.removeItem(key); setHistory([]); setOpen(false); }}>Clear search history</button>
    </section>}
  </div>;
}
