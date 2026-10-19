import { NavLink, useNavigate } from "react-router-dom";
import { API_MODE } from "../../services/config";
import { navigation } from "../../app/navigation";
import useApp from "../../hooks/useApp";
import Icon from "./Icon";
import Button from "./Button";
export default function Sidebar({ activeRole, open, setOpen, collapsed }) {
 const { logout } = useApp();
 const navigate = useNavigate();
 return (            <aside className={"sidebar " + (open ? "open " : "") + (collapsed ? "collapsed" : "")} id="workspace-navigation" aria-label="Workspace navigation">
              <div className="sidebar-mobile-header mobile-only"><b>Navigation</b><button className="icon-button" aria-label="Close navigation" onClick={() => setOpen(false)}><Icon name="close" /></button></div>
              <nav>
                {navigation[activeRole]?.map(([group, label, path, icon]) => <div key={path}>
                    {group && <p className="nav-group">{group}</p>}
                    <NavLink aria-label={label} title={collapsed ? label : undefined} end={path === "products"} className={({
                isActive
              }) => "nav-item " + (isActive ? "active" : "")} to={path.startsWith("/") ? path : `/${activeRole}/${path}`} onClick={() => setOpen(false)}>
                      <Icon name={icon} size={17} />
                      <span className="nav-label">{label}</span>
                    </NavLink>
                  </div>)}
              </nav>
              <div className="sidebar-bottom">
                <p className="connection">
                  <i />
                  {API_MODE ? "REST API configured" : "Demo data · local workspace"}
                </p>
                <Button tone="ghost" aria-label="Sign out" title={collapsed ? "Sign out" : undefined} onClick={async () => {
              await logout();
              navigate("/login");
            }}>
                  <Icon name="logout" size={15} /> <span className="nav-label">Sign out</span>
                </Button>
              </div>
            </aside>);
}
