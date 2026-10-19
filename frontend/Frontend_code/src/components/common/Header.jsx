import HeaderSearch from "./HeaderSearch";
import CartButton from "../order/CartButton";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_MODE } from "../../services/config";
import useApp from "../../hooks/useApp";
import Icon from "./Icon";
import Button from "./Button";
import Logo from "./Logo";
export default function Header({
  workspace,
  onMenu, collapsed, onToggleSidebar
}) {
  const {
    user,
    logout,
    setDrawer
  } = useApp();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [publicMenu, setPublicMenu] = useState(false);
  return <header className={workspace ? "app-header" : "public-header"}>
      <div className="header-inner">
        <div className="flex items-center gap-2">
          {workspace && <button className="icon-button mobile-only" aria-label="Open navigation" onClick={onMenu}>
              <Icon name="menu" />
            </button>}
          {workspace && <button className="icon-button sidebar-toggle" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} aria-controls="workspace-navigation" onClick={onToggleSidebar}><Icon name="menu" /></button>}
          <Logo />
        </div>
        {workspace ? <HeaderSearch /> : <nav className="desktop-nav">
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/marketplace?tab=categories">Categories</Link>
            <Link to="/marketplace?tab=suppliers">Suppliers</Link>
            <Link to="/how-it-works">How it works</Link>
          </nav>}
        <div className="header-actions">
          {workspace ? <>
              {user?.role === "buyer" && <>
                  <Link className="icon-button" to="/buyer/notifications" aria-label="Notifications">
                    <Icon name="bell" />
                    {user?.id === "buyer-1" && <i className="notification-dot" />}
                  </Link>
                  <CartButton />
                </>}
              <div className="user-menu">
                <button className="user-button" aria-label="Account menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
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
                {menu && <div className="dropdown">
                    <p className="account-mode">{API_MODE ? "Server workspace" : "Demo mode · changes saved in this browser"}</p>
                    <Link to={`/${user.role}/settings`} onClick={() => setMenu(false)}>
                      Account settings
                    </Link>
                    <Button tone="ghost" onClick={async () => {
                await logout();
                navigate("/login");
              }}>
                      Sign out
                    </Button>
                  </div>}
              </div>
            </> : <>
              {user ? <Link className="btn btn-primary" to={`/${user.role}/dashboard`}>
                  Workspace <Icon name="arrow" size={13} />
                </Link> : <>
                  <Link className="btn btn-ghost" to="/login">
                    Sign in
                  </Link>
                  <Link className="btn btn-primary" to="/register">
                    Get started
                  </Link>
                </>}
              <button className="icon-button mobile-only" aria-label="Toggle navigation" aria-expanded={publicMenu} onClick={() => setPublicMenu(!publicMenu)}>
                <Icon name="menu" />
              </button>
            </>}
        </div>
      </div>
      {publicMenu && <nav className="mobile-public-nav" onClick={() => setPublicMenu(false)}>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/how-it-works">How it works</Link>
        </nav>}
    </header>;
}
