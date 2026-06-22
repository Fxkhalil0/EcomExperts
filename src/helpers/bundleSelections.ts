import { keyFor, parseSelectionKey } from "@/helpers/quantity";
import type { BundleSelection, BundleState } from "@/types";

export const EMPTY_BUNDLE_STATE: BundleState = {
  selectedVariants: {},
  quantities: {},
};

// Project reducer state into a flat list of (product, variant, quantity)
// lines. Zero/invalid entries are skipped.
export function selectionsFromState(
  state: BundleState,
): BundleSelection[] {
  const out: BundleSelection[] = [];
  for (const [key, qty] of Object.entries(state.quantities)) {
    if (qty <= 0) continue;
    const parsed = parseSelectionKey(key);
    if (!parsed) continue;
    out.push({
      productId: parsed.productId,
      variantId: parsed.variantId,
      quantity: qty,
    });
  }
  return out;
}

export function totalQuantity(
  selections: readonly BundleSelection[],
): number {
  let total = 0;
  for (const s of selections) total += s.quantity;
  return total;
}

export function getQuantity(
  state: BundleState,
  productId: number,
  variantId?: number,
): number {
  const resolvedVariant =
    variantId ?? state.selectedVariants[String(productId)];
  return state.quantities[keyFor(productId, resolvedVariant)] ?? 0;
}
