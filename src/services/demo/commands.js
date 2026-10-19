// Demo authorization and account-owned mutations. Server mode enforces permissions in the backend.
export function runDemoCommand(type, payload, db, user) {
    if (!user || !db.users.some(u => u.id === user.id && u.active)) throw Error("Sign in with an active account to continue.");
    const role = db.users.find(u => u.id === user.id).role;
    if (["supplier:toggle", "product:moderate", "category:save", "user:toggle", "report:toggle"].includes(type) && role !== "admin") throw Error("Administrator access required.");
    if (["product:save", "stock:update", "review:reply"].includes(type) && role !== "supplier") throw Error("Supplier access required.");
    if (["cart:add", "cart:update", "cart:remove", "order:create", "rul:predict", "review:add", "wishlist:toggle"].includes(type) && role !== "buyer") throw Error("Buyer access required.");
    if (type === "order:status" && !["supplier", "admin"].includes(role)) throw Error("Supplier or administrator access required.");
    const next = structuredClone(db);
    let result;
    switch (type) {
      case "cart:add": {
        const p = next.products.find((p) => p.id === payload.product.id);
        if (!p || p.status !== "Active" || !p.stock) throw Error("This component is out of stock.");
        const old = next.cart.find((i) => i.productId === p.id && i.buyerId === user.id);
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
            buyerId: user.id,
            quantity,
          });
        break;
      }
      case "cart:update": {
        const item = next.cart.find((i) => i.id === payload.id && i.buyerId === user.id);
        const p = next.products.find((p) => p.id === item?.productId);
        if (
          !item ||
          !Number.isInteger(payload.quantity) ||
          payload.quantity < 1 ||
          payload.quantity > (p?.stock || 0)
        )
          throw Error(
            "Quantity must be a whole number within available stock.",
          );
        item.quantity = payload.quantity;
        break;
      }
      case "cart:remove":
        next.cart = next.cart.filter((i) => i.id !== payload.id || i.buyerId !== user.id);
        break;
      case "wishlist:toggle": {
        const ids = next.wishlist[user.id] || [];
        next.wishlist[user.id] = ids.includes(payload.id) ? ids.filter(id => id !== payload.id) : [...ids, payload.id];
        break;
      }
      case "order:create": {
        const ownCart = next.cart.filter(i => i.buyerId === user.id);
        if (!ownCart.length) throw Error("Your cart is empty.");
        const items = ownCart.map((i) => {
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
          id: "ORD-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
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
        next.cart = next.cart.filter(i => i.buyerId !== user.id);
        break;
      }
      case "order:status": {
        if (!["Placed", "Confirmed", "Processing", "Shipped", "Delivered"].includes(payload.status)) throw Error("Invalid order status.");
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
        const e = next.engines.find((e) => e.id === payload.engineId && e.ownerId === user.id);
        if (!e) throw Error("Engine not found.");
        result = {
          id: crypto.randomUUID(),
          engineId: e.id,
          userId: user.id,
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
          userId: user.id,
        });
        break;
      case "review:reply": {
        const review = next.reviews.find(x => x.id === payload.id);
        if (!review || !next.products.some(p => p.id === review.productId && p.supplierId === user.id)) throw Error("Review not found in your store.");
        review.reply = payload.reply;
        break;
      }
      case "profile:save":
        next.profiles[user.id] = payload;
        break;
      case "settings:save":
        next.settings[user.id] = payload;
        break;
      case "notifications:read":
        next.readNotifications[user.id] = payload.ids;
        break;
      case "support:add":
        if (role !== "buyer" || !next.orders.some(o => o.id === payload.orderId && o.buyerId === user.id)) throw Error("Order not found in your account.");
        next.support.push({
          ...payload,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          userId: user.id,
        });
        break;
      default:
        throw Error("Unsupported action.");
    }

 return { next, result };
}
