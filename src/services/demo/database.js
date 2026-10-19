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
