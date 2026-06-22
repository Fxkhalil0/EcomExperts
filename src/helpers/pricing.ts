import { getCompareAtPrice, getCurrentPrice } from "@/helpers/pricing.helper";
import { lookupProduct } from "@/helpers/productLookup";
import type { BundleSelection, MinorUnits, ProductLookup } from "@/types";

// All amounts are in minor units (cents) and stay integer to avoid
// floating-point rounding when summing many lines.

export function calculateTotal(
  selections: readonly BundleSelection[],
  catalog: ProductLookup,
): MinorUnits {
  let total = 0;
  for (const sel of selections) {
    const product = lookupProduct(catalog, sel.productId);
    if (!product) continue;
    total += getCurrentPrice(product) * sel.quantity;
  }
  return total;
}

export function calculateCompareAtPrice(
  selections: readonly BundleSelection[],
  catalog: ProductLookup,
): MinorUnits {
  let total = 0;
  for (const sel of selections) {
    const product = lookupProduct(catalog, sel.productId);
    if (!product) continue;
    const compareAt = getCompareAtPrice(product) ?? getCurrentPrice(product);
    total += compareAt * sel.quantity;
  }
  return total;
}

export function calculateSavings(
  selections: readonly BundleSelection[],
  catalog: ProductLookup,
): MinorUnits {
  let savings = 0;
  for (const sel of selections) {
    const product = lookupProduct(catalog, sel.productId);
    if (!product) continue;
    const compareAt = getCompareAtPrice(product);
    if (compareAt === null) continue;
    const perUnit = compareAt - getCurrentPrice(product);
    if (perUnit > 0) savings += perUnit * sel.quantity;
  }
  return savings;
}

export interface PricingTotals {
  total: MinorUnits;
  compareAtTotal: MinorUnits;
  savings: MinorUnits;
}

// Compute total + compareAtTotal + savings in a single pass. Prefer this
// when more than one is needed.
export function calculatePricing(
  selections: readonly BundleSelection[],
  catalog: ProductLookup,
): PricingTotals {
  let total = 0;
  let compareAtTotal = 0;
  let savings = 0;
  for (const sel of selections) {
    const product = lookupProduct(catalog, sel.productId);
    if (!product) continue;
    const current = getCurrentPrice(product);
    const compareAt = getCompareAtPrice(product);
    total += current * sel.quantity;
    compareAtTotal += (compareAt ?? current) * sel.quantity;
    if (compareAt !== null) {
      const perUnit = compareAt - current;
      if (perUnit > 0) savings += perUnit * sel.quantity;
    }
  }
  return { total, compareAtTotal, savings };
}
