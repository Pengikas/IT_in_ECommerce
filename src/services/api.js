import { API_BASE } from "./config";
let token = sessionStorage.getItem("aerorul_access_token");
let csrf = null;
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
export async function request(path, method = "GET", body) {
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 15000);
  const multipart = body instanceof FormData;
  try {
    const response = await fetch(API_BASE + path, {
      method,
      credentials: "include",
      signal: abort.signal,
      headers: {
        Accept: "application/json",
        ...(body && !multipart ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(csrf && method !== "GET" ? { "X-CSRF-Token": csrf } : {}),
      },
      ...(body !== undefined
        ? { body: multipart ? body : JSON.stringify(body) }
        : {}),
    });
    if (response.status === 204) return null;
    const json = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : null;
    if (!response.ok || json?.success === false) {
      if (response.status === 401) {
        saveToken();
        window.dispatchEvent(new Event("aerorul-session-expired"));
      }
      throw new ApiError(
        json?.error?.message ||
          json?.message ||
          `API request failed (${response.status})`,
        response.status,
      );
    }
    if (!json)
      throw new ApiError(
        "API did not return JSON. Check the API URL and reverse proxy.",
        response.status,
      );
    return json.success === true ? json.data : json;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error.name === "AbortError"
        ? "API request timed out."
        : "Cannot reach the backend. Check the server, API URL and CORS configuration.",
    );
  } finally {
    clearTimeout(timeout);
  }
}
function saveToken(data = {}) {
  token = data.accessToken || null;
  csrf = data.csrfToken || null;
  if (token) sessionStorage.setItem("aerorul_access_token", token);
  else sessionStorage.removeItem("aerorul_access_token");
}
function userModel(data) {
  const user = data.user || data;
  if (!user.id || !["buyer", "supplier", "admin"].includes(user.role))
    throw new ApiError(
      "Invalid auth response: id and a supported role are required.",
    );
  return user;
}
export const auth = {
  async current() {
    try {
      return userModel(await request("/auth/me"));
    } catch (e) {
      if (e.status === 401) return null;
      throw e;
    }
  },
  async login(email, password) {
    const data = await request("/auth/login", "POST", { email, password });
    const user = userModel(data);
    saveToken(data);
    return user;
  },
  async register(payload) {
    const data = await request("/auth/register", "POST", payload);
    const user = userModel(data);
    saveToken(data);
    return user;
  },
  async logout() {
    await request("/auth/logout", "POST");
    saveToken();
  },
};
export const id = (value) => encodeURIComponent(String(value));
export function list(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  throw new ApiError("Expected an items array in the API response.");
}
export function product(p) {
  return {
    ...p,
    id: String(p.productId ?? p.id),
    name: p.productName ?? p.name,
    compatibility: p.compatibility || [],
    price: p.price == null ? null : Number(p.price),
    stock: Number(p.stockQuantity ?? p.stock ?? 0),
    currency: p.currency || "USD",
  };
}
export function listing(l, p = {}) {
  return product({
    ...p,
    ...l,
    productId: p.productId ?? p.id ?? l.productId,
    listingId: l.listingId ?? l.id,
  });
}
async function offers(p) {
  const rows = list(await request(`/products/${id(p.id)}/listings`)).map((l) =>
    listing(l, p),
  );
  const available = rows
    .filter((l) => l.stock > 0)
    .sort((a, b) => a.price - b.price);
  return { ...(available[0] || rows[0] || p), offers: rows };
}
export async function load(resource, key, role) {
  switch (resource) {
    case "products": {
      const rows = list(await request("/products?limit=24")).map(product);
      return Promise.all(rows.map((p) => (p.listingId ? p : offers(p))));
    }
    case "product": {
      try {
        return await offers(product(await request(`/products/${id(key)}`)));
      } catch (e) {
        if (e.status === 404) return null;
        throw e;
      }
    }
    case "categories":
      return list(await request("/categories"));
    case "suppliers":
      return list(await request("/suppliers"));
    case "listings":
      return list(await request("/supplier/listings")).map((l) => ({
        ...listing(l, l.product || l),
        id: String(l.listingId ?? l.id),
      }));
    case "engines": {
      const aircraft = list(await request("/aircraft"));
      const groups = await Promise.all(
        aircraft.map((a) =>
          request(`/aircraft/${id(a.aircraftId ?? a.id)}/engines`),
        ),
      );
      return groups.flatMap(list).map((e) => ({
        ...e,
        id: String(e.engineId ?? e.id),
        model: e.engineModel ?? e.model,
      }));
    }
    case "orders":
      return list(
        await request(role === "supplier" ? "/supplier/orders" : "/orders"),
      );
    case "order": {
      try {
        return await request(`/orders/${id(key)}`);
      } catch (e) {
        if (e.status === 404) return null;
        throw e;
      }
    }
    case "cart":
      return list(await request("/cart")).map((i) => ({
        id: String(i.cartItemId ?? i.id),
        quantity: i.quantity,
        product: listing(
          i.listing || { ...i.product, listingId: i.listingId },
          i.product || i.listing?.product || {},
        ),
      }));
    case "history": {
      try {
        const latest = await request(
          `/engines/${id(key)}/rul-predictions/latest`,
        );
        const engine = await request(`/engines/${id(key)}`);
        return [{ cycle: engine.currentCycle || 0, rul: latest.predictedRul }];
      } catch (e) {
        if (e.status === 404) return [];
        throw e;
      }
    }
    case "recommendations": {
      const data = await request(`/engines/${id(key)}/recommendations`);
      const products = await Promise.all(
        (data.recommendedParts || []).map((p) =>
          load("product", p.productId ?? p.id),
        ),
      );
      return { ...data, products: products.filter(Boolean) };
    }
    default:
      throw new ApiError(`No remote contract for ${resource}.`);
  }
}
export async function command(type, payload) {
  switch (type) {
    case "cart:add":
      return request("/cart/items", "POST", {
        listingId: payload.product.listingId,
        quantity: payload.quantity,
      });
    case "cart:update":
      return request(`/cart/items/${id(payload.id)}`, "PATCH", {
        quantity: payload.quantity,
      });
    case "cart:remove":
      return request(`/cart/items/${id(payload.id)}`, "DELETE");
    case "order:create":
      if (payload.items.some((i) => i.product.listingId == null))
        throw new ApiError(
          "The server cart must include a listingId for each item.",
        );
      return request("/orders", "POST", {
        items: payload.items.map((i) => ({
          listingId: i.product.listingId,
          quantity: i.quantity,
        })),
        shippingInfo: payload.shipping,
      });
    case "order:status":
      return request(`/supplier/orders/${id(payload.id)}`, "PATCH", {
        status: payload.status,
      });
    case "product:save": {
      const {
        id: listingId,
        productId,
        price,
        stock,
        condition,
        deliveryDays,
        status,
      } = payload;
      const body = {
        productId,
        price,
        stockQuantity: stock,
        condition,
        deliveryDays,
        status,
      };
      return request(
        listingId
          ? `/supplier/listings/${id(listingId)}`
          : "/supplier/listings",
        listingId ? "PATCH" : "POST",
        body,
      );
    }
    case "stock:update":
      return request(`/supplier/listings/${id(payload.id)}`, "PATCH", {
        stockQuantity: payload.stock,
      });
    case "rul:predict": {
      if (!payload.file) throw new ApiError("Select a sensor CSV first.");
      const form = new FormData();
      form.append("file", payload.file);
      const upload = await request(
        `/engines/${id(payload.engineId)}/sensor-uploads`,
        "POST",
        form,
      );
      const sensorUploadId = upload.sensorUploadId ?? upload.id;
      if (!sensorUploadId)
        throw new ApiError("Upload response is missing sensorUploadId.");
      return request(
        `/engines/${id(payload.engineId)}/rul-predictions`,
        "POST",
        { sensorUploadId },
      );
    }
    default:
      throw new ApiError(
        "This action has no backend contract yet. It is available in demo mode.",
      );
  }
}
