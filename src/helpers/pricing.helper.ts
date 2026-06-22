import type { MinorUnits, Product } from "@/types";

// UI code MUST read prices through these helpers, never by touching
// product.price / product.discount.* directly. They are the only place
// that knows the discriminated discount/no-discount shape.

export function hasDiscount(product: Product): boolean {
  return product.discount !== undefined;
}

export function getCurrentPrice(product: Product): MinorUnits {
  if (product.discount) return product.discount.priceAfter;
  return product.price;
}

export function getCompareAtPrice(product: Product): MinorUnits | null {
  if (product.discount) return product.discount.priceBefore;
  return null;
}

export function getDiscountAmount(product: Product): number {
  return product.discount?.amount ?? 0;
}
