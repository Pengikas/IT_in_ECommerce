import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { API_MODE } from "../services/config";
import { useApp, useRecords } from "../services/store";
import Icon from "./Icon";
import ProductArt from "./ProductArt";
import { Button, Notice, Loading, Empty, money } from "./UI";
export function Logo() {
  return (
    <Link to="/" className="brand">
      <span className="brand-mark">
        <Icon name="plane" size={20} />
      </span>
      <span>
        Aero<span className="text-accent">RUL</span>
        <small>AVIATION MARKETPLACE</small>
      </span>
    </Link>
  );
}
const navigation = {
  buyer: [
    ["WORKSPACE", "Dashboard", "dashboard", "dashboard"],
    ["", "Marketplace", "/marketplace", "box"],
    ["", "My Engines", "engines", "plane"],
    ["AI & PREDICTIVE RUL", "RUL Analysis", "rul-analysis", "chart"],
    ["", "Replacement Recommendations", "recommendations", "shield"],
    ["COMMERCE", "Wishlist", "wishlist", "heart"],
    ["", "Orders", "orders", "box"],
    ["", "Notifications", "notifications", "bell"],
    ["SETTINGS", "Company Profile", "company-profile", "building"],
    ["", "Account Settings", "settings", "settings"],
  ],
  supplier: [
    ["SELLER WORKSPACE", "Dashboard", "dashboard", "dashboard"],
    ["", "Products", "products", "box"],
    ["", "Add Product", "products/new", "upload"],
    ["", "Inventory", "inventory", "building"],
    ["", "Orders", "orders", "cart"],
    ["INSIGHTS", "Reviews", "reviews", "star"],
    ["", "Analytics", "analytics", "chart"],
    ["SETTINGS", "Store Profile", "store-profile", "building"],
    ["", "Settings", "settings", "settings"],
  ],
  admin: [
    ["PLATFORM MANAGEMENT", "Dashboard", "dashboard", "dashboard"],
    ["", "Users", "users", "users"],
    ["", "Companies / Buyers", "companies", "building"],
    ["", "Suppliers", "suppliers", "shield"],
    ["", "Products", "products", "box"],
    ["", "Categories", "categories", "filter"],
    ["", "Orders", "orders", "cart"],
    ["", "Reviews / Reports", "reports", "alert"],
    ["SYSTEM", "RUL System Status", "rul-status", "chart"],
    ["", "System Settings", "settings", "settings"],
  ],
};
export function Guard({ role }) {
  const { user, loading } = useApp();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role)
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  return <Outlet />;
}
function Header({ workspace, onMenu }) {
  const { user, logout, setDrawer } = useApp();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [publicMenu, setPublicMenu] = useState(false);
  return (
    <header className={workspace ? "app-header" : "public-header"}>
      <div className="header-inner">
        <div className="flex items-center gap-2">
          {workspace && (
            <button
              className="icon-button mobile-only"
              aria-label="Open navigation"
              onClick={onMenu}
            >
              <Icon name="menu" />
            </button>
          )}
          <Logo />
        </div>
        {workspace ? (
          <form
            className="header-search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(
                "/marketplace?q=" +
                  encodeURIComponent(new FormData(e.currentTarget).get("q")),
              );
            }}
          >
            <Icon name="search" size={15} />
            <input
              name="q"
              aria-label="Global product search"
              placeholder="Search part number, engine model or supplier…"
            />
            <kbd>↵</kbd>
          </form>
        ) : (
          <nav className="desktop-nav">
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/marketplace?tab=categories">Categories</Link>
            <Link to="/marketplace?tab=suppliers">Suppliers</Link>
            <Link to="/how-it-works">How it works</Link>
          </nav>
        )}
        <div className="header-actions">
          {workspace ? (
            <>
              <span className="mode-label">
                {API_MODE ? "API WORKSPACE" : "DEMO WORKSPACE"}
              </span>
              {user?.role === "buyer" && (
                <>
                  <Link
                    className="icon-button"
                    to="/buyer/notifications"
                    aria-label="Notifications"
                  >
                    <Icon name="bell" />
                    <i className="notification-dot" />
                  </Link>
                  <button
                    className="icon-button"
                    aria-label="Cart"
                    onClick={() => setDrawer(true)}
                  >
                    <Icon name="cart" />
                  </button>
                </>
              )}
              <div className="user-menu">
                <button
                  className="user-button"
                  aria-label="Account menu"
                  aria-expanded={menu}
                  onClick={() => setMenu(!menu)}
                >
                  <span className="avatar">
                    {user?.companyName?.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="user-caption">
                    <b>{user?.name}</b>
                    <small>
                      {user?.companyName} · {user?.role}
                    </small>
                  </span>
                  <span>⌄</span>
                </button>
                {menu && (
                  <div className="dropdown">
                    <Link
                      to={`/${user.role}/settings`}
                      onClick={() => setMenu(false)}
                    >
                      Account settings
                    </Link>
                    <Button
                      tone="ghost"
                      onClick={async () => {
                        await logout();
                        navigate("/login");
                      }}
                    >
                      Sign out
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {user ? (
                <Link
                  className="btn btn-primary"
                  to={`/${user.role}/dashboard`}
                >
                  Workspace <Icon name="arrow" size={13} />
                </Link>
              ) : (
                <>
                  <Link className="btn btn-ghost" to="/login">
                    Sign in
                  </Link>
                  <Link className="btn btn-primary" to="/register">
                    Get started
                  </Link>
                </>
              )}
              <button
                className="icon-button mobile-only"
                aria-label="Toggle navigation"
                aria-expanded={publicMenu}
                onClick={() => setPublicMenu(!publicMenu)}
              >
                <Icon name="menu" />
              </button>
            </>
          )}
        </div>
      </div>
      {publicMenu && (
        <nav className="mobile-public-nav" onClick={() => setPublicMenu(false)}>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/how-it-works">How it works</Link>
        </nav>
      )}
    </header>
  );
}
export function Layout({ role }) {
  const { user, notice, setNotice, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const workspace =
    !!role ||
    (!!user &&
      (location.pathname === "/marketplace" ||
        location.pathname.startsWith("/products/")));
  const activeRole = role || user?.role;
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", close);
      previous?.focus();
    };
  }, [open]);
  const pending =
    API_MODE &&
    (location.pathname.startsWith("/admin/") ||
      /^\/(buyer|supplier)\/(notifications|company-profile|store-profile|settings|reviews|analytics)/.test(
        location.pathname,
      ));
  return (
    <div className={workspace ? "workspace" : "public-site"}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header workspace={workspace} onMenu={() => setOpen(true)} />
      {API_MODE && (
        <div className="api-mode-notice">
          REST API mode · Server data only; failures do not load sample data.
        </div>
      )}
      {notice && (
        <div className="global-notice">
          <Notice error={notice.error}>
            {notice.message}
            <button className="ml-3 underline" onClick={() => setNotice(null)}>
              Dismiss
            </button>
          </Notice>
        </div>
      )}
      <div className={workspace ? "workspace-body" : ""}>
        {workspace && (
          <>
            {open && (
              <button
                className="sidebar-backdrop"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              />
            )}
            <aside className={"sidebar " + (open ? "open" : "")}>
              <div className="sidebar-company">
                <span className="stat-icon">
                  <Icon name="building" />
                </span>
                <div>
                  <b>{user?.companyName}</b>
                  <small>
                    {activeRole === "buyer"
                      ? "Procurement & fleet"
                      : activeRole === "supplier"
                        ? "Certified supplier"
                        : "Platform administration"}
                  </small>
                </div>
                <button
                  className="icon-button mobile-only"
                  aria-label="Close navigation"
                  onClick={() => setOpen(false)}
                >
                  <Icon name="close" />
                </button>
              </div>
              <nav>
                {navigation[activeRole]?.map(([group, label, path, icon]) => (
                  <div key={path}>
                    {group && <p className="nav-group">{group}</p>}
                    <NavLink
                      end={path === "products"}
                      className={({ isActive }) =>
                        "nav-item " + (isActive ? "active" : "")
                      }
                      to={
                        path.startsWith("/") ? path : `/${activeRole}/${path}`
                      }
                      onClick={() => setOpen(false)}
                    >
                      <Icon name={icon} size={17} />
                      <span>{label}</span>
                    </NavLink>
                  </div>
                ))}
              </nav>
              <div className="sidebar-bottom">
                <p className="connection">
                  <i />
                  {API_MODE
                    ? "REST API configured"
                    : "Demo data · local workspace"}
                </p>
                <Button
                  tone="ghost"
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                  }}
                >
                  <Icon name="logout" size={15} /> Sign out
                </Button>
              </div>
            </aside>
          </>
        )}
        <main
          id="main"
          className={workspace ? "workspace-main" : "public-main"}
        >
          {pending ? (
            <div className="card p-8">
              <h1>API integration pending</h1>
              <div className="mt-5">
                <Notice>
                  This screen needs a backend contract. API mode does not
                  display or save sample administration data. Use demo mode to
                  explore the interface.
                </Notice>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
      {!workspace && (
        <footer className="site-footer">
          <div className="container flex flex-wrap items-center justify-between gap-5">
            <Logo />
            <p>© 2026 AeroRUL. All rights reserved.</p>
            <p>Precision sourcing. Intelligent decisions.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
export function CartDrawer() {
  const { drawer } = useApp();
  return drawer ? <DrawerContent /> : null;
}
function DrawerContent() {
  const { drawer, setDrawer, user, action } = useApp();
  const query = useRecords("cart");
  const items = query.data || [];
  const ref = useRef(null);
  useEffect(() => {
    if (!drawer) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") setDrawer(false);
      if (e.key === "Tab") {
        const nodes = ref.current.querySelectorAll("a,button,input");
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [drawer]);
  if (!drawer) return null;
  return (
    <div className="dialog-overlay" onClick={() => setDrawer(false)}>
      <section
        className="drawer"
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="drawer-header">
          <div>
            <p className="eyebrow">PROCUREMENT</p>
            <h2 id="cart-title">
              Your cart ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            className="icon-button"
            aria-label="Close cart"
            onClick={() => setDrawer(false)}
          >
            <Icon name="close" />
          </button>
        </header>
        <div className="drawer-body">
          {query.loading ? (
            <Loading />
          ) : query.error ? (
            <Notice error>{query.error}</Notice>
          ) : !items.length ? (
            <Empty
              title="Your cart is empty"
              text="Find the right component for your next mission."
              link={null}
            />
          ) : (
            items.map((item) => (
              <div key={item.id} className="drawer-item">
                <ProductArt
                  product={item.product}
                  className="h-20 w-20 shrink-0 rounded"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/products/${item.product.id}`}
                    onClick={() => setDrawer(false)}
                    className="text-xs font-semibold"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mono tiny my-2">{money(item.product.price)}</p>
                  <div className="flex justify-between items-center gap-3">
                    <label className="tiny">
                      Qty{" "}
                      <input
                        className="input quantity"
                        aria-label={`Quantity for ${item.product.name}`}
                        type="number"
                        min="1"
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const quantity = Number(e.target.value);
                          if (Number.isInteger(quantity) && quantity > 0)
                            action("cart:update", {
                              id: item.id,
                              quantity,
                            }).catch(() => {});
                        }}
                      />
                    </label>
                    <Button
                      tone="ghost"
                      className="compact text-critical"
                      onClick={() => action("cart:remove", { id: item.id })}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <footer className="drawer-footer">
          <div className="flex justify-between font-semibold text-sm">
            <span>Subtotal</span>
            <span className="mono">
              {money(
                items.reduce((s, i) => s + i.product.price * i.quantity, 0),
              )}
            </span>
          </div>
          <p className="tiny muted my-4">
            Shipping calculated at checkout · USD
          </p>
          {items.length > 0 ? (
            <Link
              className="btn btn-primary w-full"
              onClick={() => setDrawer(false)}
              to={user ? "/buyer/checkout" : "/login?redirect=/buyer/checkout"}
            >
              Proceed to checkout <Icon name="arrow" size={14} />
            </Link>
          ) : (
            <Link
              className="btn btn-primary w-full"
              onClick={() => setDrawer(false)}
              to="/marketplace"
            >
              Browse marketplace
            </Link>
          )}
        </footer>
      </section>
    </div>
  );
}
