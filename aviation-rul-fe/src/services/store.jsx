import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_MODE } from "./config";
import * as remote from "./api";
import {
  PRODUCTS,
  SUPPLIERS,
  CATEGORIES,
  ENGINES,
  ORDERS,
  RUL_HISTORY,
} from "./seed";
const Context = createContext(null);
const DB_KEY = "aerorul_demo_v3";
function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
const seed = () => ({
  products: PRODUCTS.map((p) => ({ ...p, listingId: p.id, status: "Active" })),
  suppliers: SUPPLIERS,
  categories: CATEGORIES,
  engines: ENGINES,
  orders: ORDERS,
  cart: [],
  wishlist: [],
  reviews: [],
  analyses: [],
  profiles: {},
  settings: {},
  readNotifications: [],
  support: [],
  users: [
    {
      id: "buyer-1",
      name: "John Doe",
      email: "procurement@skywest-demo.com",
      companyName: "SkyWest Airlines",
      role: "buyer",
      active: true,
    },
    {
      id: "sup-1",
      name: "Safran Store Manager",
      email: "seller@safran-demo.com",
      companyName: "Safran Certified Aerospace",
      role: "supplier",
      active: true,
    },
    {
      id: "admin-1",
      name: "Platform Admin",
      email: "admin@aerorul-demo.com",
      companyName: "AeroRUL Operations",
      role: "admin",
      active: true,
    },
  ],
  reports: [
    {
      id: "RPT-001",
      subject: "Verify release certificate reference",
      product: "CFM56-7B HPT Blade Set",
      status: "Open",
    },
    {
      id: "RPT-002",
      subject: "Review engine compatibility evidence",
      product: "V2500 Compressor Rotor",
      status: "Open",
    },
  ],
});
const demoAccounts = {
  buyer: { id: "buyer-1", name: "John Doe", companyName: "SkyWest Airlines" },
  supplier: {
    id: "sup-1",
    name: "Safran Store Manager",
    companyName: "Safran Certified Aerospace",
  },
  admin: {
    id: "admin-1",
    name: "Platform Admin",
    companyName: "AeroRUL Operations",
  },
};
function enrich(p, db) {
  return p
    ? { ...p, supplier: db.suppliers.find((s) => s.id === p.supplierId) }
    : null;
}
export function Provider({ children }) {
  const [db, setDB] = useState(() => read(DB_KEY, seed()));
  const [user, setUser] = useState(() =>
    API_MODE ? null : read("aerorul_user", null),
  );
  const [loading, setLoading] = useState(API_MODE);
  const [version, setVersion] = useState(0);
  const [notice, setNotice] = useState(null);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => {
    if (!API_MODE) localStorage.setItem(DB_KEY, JSON.stringify(db));
  }, [db]);
  useEffect(() => {
    if (!API_MODE) return;
    let active = true;
    remote.auth
      .current()
      .then((u) => {
        if (active) setUser(u);
      })
      .catch((e) => {
        if (active) setNotice({ message: e.message, error: true });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    const expired = () => {
      setUser(null);
      setVersion((v) => v + 1);
    };
    window.addEventListener("aerorul-session-expired", expired);
    return () => {
      active = false;
      window.removeEventListener("aerorul-session-expired", expired);
    };
  }, []);
  useEffect(() => {
    function sync(e) {
      if (e.key === DB_KEY) setDB(read(DB_KEY, seed()));
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  async function login(email, password, role) {
    const u = API_MODE
      ? await remote.auth.login(email, password)
      : { ...demoAccounts[role], role, email };
    setUser(u);
    if (!API_MODE) localStorage.setItem("aerorul_user", JSON.stringify(u));
    setVersion((v) => v + 1);
    return u;
  }
  async function register(payload) {
    const u = API_MODE
      ? await remote.auth.register(payload)
      : { ...payload, id: crypto.randomUUID() };
    if (!API_MODE) {
      const { password, ...safe } = u;
      setUser(safe);
      localStorage.setItem("aerorul_user", JSON.stringify(safe));
      return safe;
    }
    setUser(u);
    return u;
  }
  async function logout() {
    if (API_MODE) await remote.auth.logout();
    else localStorage.removeItem("aerorul_user");
    setUser(null);
    setDrawer(false);
    setVersion((v) => v + 1);
  }
  const flash = (message, error = false) => setNotice({ message, error });
  function demoLoad(resource, key) {
    switch (resource) {
      case "products":
        return db.products
          .filter((p) => p.status === "Active")
          .map((p) => enrich(p, db));
      case "product":
        return enrich(
          db.products.find((p) => p.id === key),
          db,
        );
      case "listings":
        return db.products
          .filter((p) => p.supplierId === user?.id)
          .map((p) => enrich(p, db));
      case "cart":
        return db.cart
          .map((i) => ({
            ...i,
            product: enrich(
              db.products.find((p) => p.id === i.productId),
              db,
            ),
          }))
          .filter((i) => i.product);
      case "orders":
        return db.orders
          .map((o) => ({
            ...o,
            items: o.items.map((i) => ({
              ...i,
              product:
                i.product ||
                enrich(
                  db.products.find((p) => p.id === i.productId),
                  db,
                ),
            })),
          }))
          .filter(
            (o) =>
              user?.role !== "supplier" ||
              o.items.some((i) => i.product?.supplierId === user.id),
          );
      case "order":
        return demoLoad("orders").find((o) => o.id === key) || null;
      case "history":
        return (
          RUL_HISTORY[key] || [
            {
              cycle: db.engines.find((e) => e.id === key)?.currentCycle || 0,
              rul: db.engines.find((e) => e.id === key)?.latestRul || 0,
            },
          ]
        );
      case "recommendations": {
        const e = db.engines.find((e) => e.id === key);
        return {
          engineId: key,
          predictedRul: e?.latestRul,
          engineModel: e?.model,
          products: db.products
            .filter(
              (p) =>
                p.status === "Active" &&
                p.stock > 0 &&
                p.compatibility.includes(e?.model),
            )
            .sort(
              (a, b) =>
                b.compatibilityScore -
                b.deliveryDays -
                (a.compatibilityScore - a.deliveryDays),
            )
            .map((p) => enrich(p, db)),
        };
      }
      default:
        return db[resource] || [];
    }
  }
  async function action(type, payload = {}) {
    if (API_MODE && !["wishlist:toggle"].includes(type)) {
      const value = await remote.command(type, payload);
      setVersion((v) => v + 1);
      return value;
    }
    const next = structuredClone(db);
    let result;
    switch (type) {
      case "cart:add": {
        const p = next.products.find((p) => p.id === payload.product.id);
        if (!p || !p.stock) throw Error("This component is out of stock.");
        const old = next.cart.find((i) => i.productId === p.id);
        const quantity = Number(payload.quantity || 1);
        if (!Number.isInteger(quantity) || quantity < 1)
          throw Error("Quantity must be a positive whole number.");
        if ((old?.quantity || 0) + quantity > p.stock)
          throw Error(`Only ${p.stock} units are available.`);
        if (old) old.quantity += quantity;
        else
          next.cart.push({
            id: crypto.randomUUID(),
            productId: p.id,
            quantity,
          });
        break;
      }
      case "cart:update": {
        const item = next.cart.find((i) => i.id === payload.id);
        const p = next.products.find((p) => p.id === item?.productId);
        if (
          !item ||
          !Number.isInteger(payload.quantity) ||
          payload.quantity < 1 ||
          payload.quantity > p.stock
        )
          throw Error(
            "Quantity must be a whole number within available stock.",
          );
        item.quantity = payload.quantity;
        break;
      }
      case "cart:remove":
        next.cart = next.cart.filter((i) => i.id !== payload.id);
        break;
      case "wishlist:toggle":
        next.wishlist = next.wishlist.includes(payload.id)
          ? next.wishlist.filter((id) => id !== payload.id)
          : [...next.wishlist, payload.id];
        break;
      case "order:create": {
        if (!next.cart.length) throw Error("Your cart is empty.");
        const items = next.cart.map((i) => {
          const p = next.products.find((p) => p.id === i.productId);
          if (!p || p.status !== "Active" || p.stock < i.quantity)
            throw Error("Stock changed. Review your cart.");
          return {
            productId: p.id,
            listingId: p.listingId,
            product: { ...p },
            quantity: i.quantity,
            price: p.price,
          };
        });
        const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
        const shipping =
          payload.shipping.deliveryMethod === "Express air freight" ? 650 : 250;
        result = {
          id: "ORD-" + Date.now().toString().slice(-8),
          buyerId: user?.id,
          placedAt: new Date().toISOString(),
          status: "Placed",
          items,
          subtotal,
          shipping,
          total: subtotal + shipping,
          shippingInfo: payload.shipping,
          sellerStatuses: {},
        };
        items.forEach((i) => {
          next.products.find((p) => p.id === i.productId).stock -= i.quantity;
        });
        next.orders.unshift(result);
        next.cart = [];
        break;
      }
      case "order:status": {
        const order = next.orders.find((o) => o.id === payload.id);
        if (!order) throw Error("Order not found.");
        const belongs = (i) =>
          (i.product || next.products.find((p) => p.id === i.productId))
            ?.supplierId;
        if (user?.role === "supplier") {
          if (!order.items.some((i) => belongs(i) === user.id))
            throw Error("This seller order is not in your store.");
          const stages = [
            "Placed",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered",
          ];
          const previous = order.status;
          order.sellerStatuses = {
            ...order.sellerStatuses,
            [user.id]: payload.status,
          };
          const sellers = [...new Set(order.items.map(belongs))];
          order.status =
            stages[
              Math.min(
                ...sellers.map((s) =>
                  Math.max(
                    0,
                    stages.indexOf(order.sellerStatuses[s] || previous),
                  ),
                ),
              )
            ];
        } else order.status = payload.status;
        break;
      }
      case "product:save": {
        const index = next.products.findIndex((p) => p.id === payload.id);
        if (index >= 0 && next.products[index].supplierId !== user.id)
          throw Error("This listing does not belong to your store.");
        result = {
          rating: 0,
          compatibilityScore: 0,
          currency: "USD",
          image: "engine",
          ...payload,
          supplierId: user.id,
          id: payload.id || "prod-" + crypto.randomUUID(),
        };
        result.listingId = result.id;
        if (index < 0) next.products.push(result);
        else next.products[index] = result;
        break;
      }
      case "stock:update": {
        if (!Number.isInteger(payload.stock) || payload.stock < 0)
          throw Error("Stock must be a non-negative whole number.");
        const p = next.products.find(
          (p) => p.id === payload.id && p.supplierId === user.id,
        );
        if (!p) throw Error("Listing not found in your store.");
        p.stock = payload.stock;
        break;
      }
      case "rul:predict": {
        const e = next.engines.find((e) => e.id === payload.engineId);
        if (!e) throw Error("Engine not found.");
        result = {
          id: crypto.randomUUID(),
          engineId: e.id,
          predictedRul: e.latestRul,
          urgency:
            e.latestRul <= 20
              ? "HIGH"
              : e.latestRul <= 40
                ? "PLAN"
                : e.latestRul <= 80
                  ? "MONITOR"
                  : "NORMAL",
          interpretation:
            e.latestRul <= 20
              ? "Prioritize replacement planning"
              : e.latestRul <= 40
                ? "Prepare replacement options"
                : "Continue monitoring engine life",
          createdAt: new Date().toISOString(),
        };
        next.analyses.unshift(result);
        break;
      }
      case "supplier:toggle": {
        const s = next.suppliers.find((s) => s.id === payload.id);
        s.verified = !s.verified;
        break;
      }
      case "product:moderate":
        next.products.find((p) => p.id === payload.id).status = payload.status;
        break;
      case "category:save": {
        const c = next.categories.find((c) => c.id === payload.id);
        if (c) c.name = payload.name;
        else
          next.categories.push({ id: crypto.randomUUID(), name: payload.name });
        break;
      }
      case "user:toggle": {
        const u = next.users.find((u) => u.id === payload.id);
        if (u.role === "admin")
          throw Error("The demo administrator cannot be suspended.");
        u.active = !u.active;
        break;
      }
      case "report:toggle": {
        const report = next.reports.find((x) => x.id === payload.id);
        report.status = report.status === "Open" ? "Resolved" : "Open";
        break;
      }
      case "review:add":
        next.reviews.unshift({
          ...payload,
          id: crypto.randomUUID(),
          companyName: user.companyName,
        });
        break;
      case "review:reply":
        next.reviews.find((x) => x.id === payload.id).reply = payload.reply;
        break;
      case "profile:save":
        next.profiles[user.id] = payload;
        break;
      case "settings:save":
        next.settings[user.id] = payload;
        break;
      case "notifications:read":
        next.readNotifications = payload.ids;
        break;
      case "support:add":
        next.support.push({
          ...payload,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        });
        break;
      default:
        throw Error("Unsupported action.");
    }
    setDB(next);
    return result;
  }
  return (
    <Context.Provider
      value={{
        db,
        user,
        loading,
        version,
        notice,
        setNotice,
        flash,
        drawer,
        setDrawer,
        login,
        register,
        logout,
        action,
        demoLoad,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  return useContext(Context);
}
export function useRecords(resource, key = "") {
  const app = useApp();
  const [state, setState] = useState({
    data: null,
    loading: API_MODE,
    error: "",
  });
  useEffect(() => {
    if (!API_MODE) return;
    if (!key && ["history", "recommendations"].includes(resource)) {
      setState({
        data: resource === "history" ? [] : null,
        loading: false,
        error: "",
      });
      return;
    }
    let active = true;
    setState({ data: null, loading: true, error: "" });
    remote
      .load(resource, key, app.user?.role)
      .then((data) => {
        if (active) setState({ data, loading: false, error: "" });
      })
      .catch((e) => {
        if (active) setState({ data: null, loading: false, error: e.message });
      });
    return () => {
      active = false;
    };
  }, [resource, key, app.version, app.user?.id, app.user?.role]);
  return API_MODE
    ? state
    : { data: app.demoLoad(resource, key), loading: false, error: "" };
}
export function useWishlist() {
  const { db, action } = useApp();
  const [saved, setSaved] = useState(() => read("aerorul_api_wishlist", []));
  return {
    ids: API_MODE ? saved : db.wishlist,
    toggle: async (id) => {
      if (API_MODE) {
        const value = saved.includes(id)
          ? saved.filter((x) => x !== id)
          : [...saved, id];
        localStorage.setItem("aerorul_api_wishlist", JSON.stringify(value));
        setSaved(value);
      } else await action("wishlist:toggle", { id });
    },
  };
}
