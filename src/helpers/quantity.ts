// Selections live in a single map keyed by `productId::variantId`.
// Products without variants use DEFAULT_VARIANT_KEY so one store hosts
// both shapes uniformly.

export const DEFAULT_VARIANT_KEY = "_default";

export const keyFor = (productId: number, variantId?: number): string =>
  `${productId}::${variantId ?? DEFAULT_VARIANT_KEY}`;

export function parseSelectionKey(
  key: string,
): { productId: number; variantId?: number } | null {
  const parts = key.split("::");
  if (parts.length !== 2) return null;
  const [productPart, variantPart] = parts;
  const productId = Number(productPart);
  if (!Number.isFinite(productId)) return null;

  if (variantPart === DEFAULT_VARIANT_KEY) {
    return { productId };
  }
  const variantId = Number(variantPart);
  if (!Number.isFinite(variantId)) return null;
  return { productId, variantId };
}
