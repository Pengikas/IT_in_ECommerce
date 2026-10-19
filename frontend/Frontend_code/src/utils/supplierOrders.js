// Server seller-order responses must already enforce supplier ownership.
export function scopeSupplierOrder(order, supplierId, apiMode = false) {
  if (apiMode) return order;
  const items = (order.items || []).filter(item => item.product?.supplierId === supplierId);
  if (!items.length) return null;
  return { ...order, items, total: items.reduce((sum, item) => sum + item.price * item.quantity, 0), status: order.sellerStatuses?.[supplierId] || order.status, shipment: order.sellerShipments?.[supplierId] || null };
}
export function scopedOrders(rows, user, apiMode = false) {
  return rows.map(order => scopeSupplierOrder(order, user.id, apiMode)).filter(Boolean);
}
