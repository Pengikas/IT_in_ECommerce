  ## Stack (per spec section 11)

React + Vite · Tailwind CSS · React Router · Recharts for the RUL trend
chart. No backend yet — `src/services/*Api.js` currently return mock data.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. There's no real backend, so:

- **Login** (`/login`) accepts any email/password — pick a role (Buyer /
  Supplier / Admin) and you're in.
- **Register** (`/register`) creates a mock Buyer or Supplier account.
## Setting library
```bash
npm install react-router-dom@6 recharts
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

## What's implemented

Built as a vertical slice, in priority order from spec section 17:

**P0 — done**
- Public: Home, Marketplace (search/filter), Product Detail, Login, Register
- Buyer: Dashboard, My Engines, Engine Detail, RUL Analysis, Replacement
  Recommendations, Cart (drawer + page), Checkout (4-step), Orders, Order Detail

**P1 — done**
- Supplier: Dashboard, Products, Add/Edit Product form, Inventory, Orders
- Admin: Dashboard, Suppliers (approve/suspend), Products, Categories, Orders

**P1/P2 — stubbed as placeholder pages** (routed, but not built out):
Wishlist, Notifications, Reviews, Analytics, Reports, Users, Companies,
System Settings. Company Profile / Store Profile have a basic form.

## End-to-end demo path (spec section 18)

Log in as **Buyer** → Dashboard shows `ENG-037` with low RUL → "View
Replacement Options" → Recommendations page → open a product → Add to Cart
→ Checkout (shipping → delivery → payment → review) → Place Order → Order
Detail with status timeline.

Log in as **Supplier** to see that same order under Supplier → Orders.

## Structure

```
src/
├── 
├── layouts/                        # Public / Buyer / Supplier / Admin
├── components/                     # common, marketplace, engine/RUL, order
├── pages/{public,buyer,supplier,admin}/
├── services/                       # apiClient + mock *Api.js modules (swap-in point for real API)
└── hooks/                          # useAuth, useCart
```

## Known gaps / next steps

- Wire `src/services/apiClient.js` and each `*Api.js` to the real Express
  API once it exists; page code doesn't need to change.
- Replace the demo auth in `authApi.js` with real JWT/session handling.
- Product images are emoji placeholders — swap in real assets.
- Wishlist, Notifications, Reviews, Analytics, Users/Companies admin pages
  are intentionally left as stubs (P2 per the spec) — build these after the
  P0/P1 happy path is solid.
