import Sidebar from "../components/common/Sidebar";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { API_MODE } from "../services/config";
import useApp from "../hooks/useApp";
import Notice from "../components/common/Notice";
import Logo from "../components/common/Logo";
import Header from "../components/common/Header";
export default function Layout({
  role
}) {
  const {
    user,
    notice,
    setNotice
  } = useApp();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("aerorul_sidebar_collapsed") === "true");
  const toggleSidebar = () => setCollapsed(previous => { localStorage.setItem("aerorul_sidebar_collapsed", String(!previous)); return !previous; });
  const workspace = !!role || !!user && (location.pathname === "/marketplace" || location.pathname.startsWith("/products/"));
  const activeRole = role || user?.role;
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const panel = document.getElementById("workspace-navigation");
    const focusables = () => [...panel.querySelectorAll("a,button")].filter(n => n.getClientRects().length);
    focusables()[0]?.focus();
    const close = e => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const nodes = focusables();
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", close);
      previous?.focus();
    };
  }, [open]);
  const pending = API_MODE && (location.pathname.startsWith("/admin/") || /^\/(buyer|supplier)\/(notifications|company-profile|store-profile|settings|reviews|analytics)/.test(location.pathname));
  return <div className={workspace ? "workspace" : "public-site"}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header workspace={workspace} onMenu={() => setOpen(true)} collapsed={collapsed} onToggleSidebar={toggleSidebar} />
      {API_MODE && <div className="api-mode-notice">
          REST API mode · Server data only; failures do not load sample data.
        </div>}
      {notice && <div className="global-notice">
          <Notice error={notice.error}>
            {notice.message}
            <button className="ml-3 underline" onClick={() => setNotice(null)}>
              Dismiss
            </button>
          </Notice>
        </div>}
      <div className={workspace ? "workspace-body" : ""}>
        {workspace && <>
            {open && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
<Sidebar activeRole={activeRole} open={open} setOpen={setOpen} collapsed={collapsed} />
          </>}
        <main id="main" className={workspace ? "workspace-main" : "public-main"}>
          {pending ? <div className="card p-8">
              <h1>API integration pending</h1>
              <div className="mt-5">
                <Notice>
                  This screen needs a backend contract. API mode does not
                  display or save sample administration data. Use demo mode to
                  explore the interface.
                </Notice>
              </div>
            </div> : <Outlet />}
        </main>
      </div>
      {!workspace && <footer className="site-footer">
          <div className="container flex flex-wrap items-center justify-between gap-5">
            <Logo />
            <p>© 2026 AeroRUL. All rights reserved.</p>
            <p>Precision sourcing. Intelligent decisions.</p>
          </div>
        </footer>}
    </div>;
}
