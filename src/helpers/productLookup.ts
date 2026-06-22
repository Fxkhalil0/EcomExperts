import type { Product, ProductLookup, ProductVariant } from "@/types";

export function lookupProduct(
  catalog: ProductLookup,
  id: number,
): Product | undefined {
  return catalog.get(id);
}

export function findVariant(
  product: Product | undefined,
  variantId: number | undefined,
): ProductVariant | undefined {
  if (!product || variantId === undefined) return undefined;
  return product.variants?.find((v) => v.id === variantId);
}
