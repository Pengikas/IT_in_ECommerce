import { REPORTS } from "../../data/mock/reports";
import { PRODUCTS, SUPPLIERS, CATEGORIES } from "../../data/mock/catalog";
import { ENGINES } from "../../data/mock/fleet";
import { ORDERS } from "../../data/mock/orders";
import { DEMO_USERS } from "../../data/mock/users";
export const DB_KEY = "aerorul_demo_v4";
export const SESSION_KEY = "aerorul_session_v4";
export function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export const seed = () => ({
  schemaRevision: 5,
  products: PRODUCTS.map((p) => ({ ...p, listingId: p.id, status: "Active" })),
  suppliers: SUPPLIERS,
  categories: CATEGORIES,
  engines: ENGINES.map(e => ({ ...e, ownerId: "buyer-1" })),
  orders: ORDERS,
  cart: [],
  wishlist: {},
  reviews: [],
  analyses: [],
  profiles: {},
  settings: {},
  readNotifications: {},
  support: [],
  users: DEMO_USERS,
  reports: REPORTS,
});

// Add replacement metadata/examples without resetting accounts, carts, orders or moderation.
export function upgradeDatabase(db) {
  if (db.schemaRevision >= 5) return db;
  const next = structuredClone(db);
  next.products = next.products.map(product => ({ ...product, replacementGroup: product.replacementGroup || PRODUCTS.find(p => p.id === product.id)?.replacementGroup }));
  for (const id of ["prod-107", "prod-108"]) if (!next.products.some(p => p.id === id)) next.products.push({ ...PRODUCTS.find(p => p.id === id), listingId: id, status: "Active" });
  if (next.users.some(u => u.id === "buyer-1") && !next.engines.some(e => e.id === "ENG-041")) next.engines.push({ ...ENGINES.find(e => e.id === "ENG-041"), ownerId: "buyer-1" });
  next.orders = next.orders.map(order => {
    const example = ORDERS.find(sample => sample.id === order.id && sample.buyerId === order.buyerId);
    if (!example) return order;
    return { ...order, sampleRecord: true, shippingInfo: order.shippingInfo || example.shippingInfo, payment: order.payment || example.payment };
  });
  next.schemaRevision = 5;
  return next;
}
