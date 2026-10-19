import { RUL_HISTORY } from "../../data/mock/fleet";
function enrich(p, db) {
  return p
    ? { ...p, supplier: db.suppliers.find((s) => s.id === p.supplierId) }
    : null;
}
  export function readDemo(resource, key, db, user) {
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
          .filter(i => user?.role === "buyer" && i.buyerId === user.id)
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
              user?.role === "admin" || (user?.role === "buyer" && o.buyerId === user.id) || (user?.role === "supplier" && o.items.some((i) => i.product?.supplierId === user.id)),
          );
      case "order":
        return readDemo("orders", "", db, user).find((o) => o.id === key) || null;
      case "engines": return db.engines.filter(e => user?.role === "buyer" && e.ownerId === user.id);
      case "analyses": return db.analyses.filter(a => a.userId === user?.id);
      case "history":
        if (!db.engines.some(e => e.id === key && e.ownerId === user?.id)) return [];
        return (
          RUL_HISTORY[key] || [
            {
              cycle: db.engines.find((e) => e.id === key)?.currentCycle || 0,
              rul: db.engines.find((e) => e.id === key)?.latestRul || 0,
            },
          ]
        );
      case "recommendations": {
        const e = db.engines.find((e) => e.id === key && e.ownerId === user?.id);
        if (!e) return null;
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
