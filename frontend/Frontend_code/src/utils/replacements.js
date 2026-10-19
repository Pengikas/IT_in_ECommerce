export function replacementSelection(key) {
  try { return JSON.parse(key); } catch { return { engineId: key, categoryId: "cat-engine" }; }
}
export function replacementGroup(product) {
  return product.replacementGroup || (product.categoryId === "cat-engine" ? "complete-engine" : product.partNumber);
}
export function compatibleReplacements(products, engineModel, selection, referenceProduct) {
  const reference = referenceProduct || products.find(p => String(p.id) === String(selection.productId));
  if (selection.productId && (!reference || reference.categoryId !== selection.categoryId || !reference.compatibility?.includes(engineModel))) return [];
  const group = reference ? replacementGroup(reference) : selection.categoryId === "cat-engine" ? "complete-engine" : null;
  if (!group) return [];
  return products.filter(p => p.categoryId === selection.categoryId && p.compatibility?.includes(engineModel) && replacementGroup(p) === group && p.stock > 0 && (!p.status || p.status === "Active"))
    .sort((a, b) => (Number(b.compatibilityScore || 0) - Number(b.deliveryDays || 0)) - (Number(a.compatibilityScore || 0) - Number(a.deliveryDays || 0)));
}
