import type { CatalogIndex } from "@/helpers/catalog";
import { findVariant } from "@/helpers/productLookup";
import { getCompareAtPrice, getCurrentPrice } from "@/helpers/pricing.helper";
import { keyFor } from "@/helpers/quantity";
import type {
  BundleSelection,
  Category,
  ReviewPanelGroup,
  ReviewPanelItem,
} from "@/types";

export interface BuildReviewGroupsOptions {
  categoryOrder: readonly Category[];
  categoryLabel: Record<Category, string>;
}

export interface ReviewGroupingResult {
  countByCategory: Record<Category, number>;
  reviewGroups: ReviewPanelGroup[];
}

// Single-pass projection of selections into review groups + per-category
// counts. Unknown products are silently skipped.
export function buildReviewGroups(
  selections: readonly BundleSelection[],
  index: CatalogIndex,
  { categoryOrder, categoryLabel }: BuildReviewGroupsOptions,
): ReviewGroupingResult {
  const countByCategory = {} as Record<Category, number>;
  const buckets = {} as Record<Category, ReviewPanelItem[]>;
  for (const cat of categoryOrder) {
    countByCategory[cat] = 0;
    buckets[cat] = [];
  }

  for (const sel of selections) {
    const product = index.byId.get(sel.productId);
    if (!product) continue;
    const cat = index.categoryOf.get(sel.productId);
    if (!cat || !(cat in countByCategory)) continue;

    countByCategory[cat] += sel.quantity;

    const variant = findVariant(product, sel.variantId);
    const compareAt = getCompareAtPrice(product);
    buckets[cat].push({
      id: keyFor(sel.productId, sel.variantId),
      productId: sel.productId,
      variantId: sel.variantId,
      thumbnail: variant?.thumbnail ?? product.image,
      title: product.title,
      variantName: variant?.name,
      quantity: sel.quantity,
      unitPrice: getCurrentPrice(product),
      unitCompareAtPrice: compareAt ?? undefined,
    });
  }

  const reviewGroups: ReviewPanelGroup[] = categoryOrder.map((cat) => ({
    id: cat,
    label: categoryLabel[cat],
    items: buckets[cat],
  }));

  return { countByCategory, reviewGroups };
}
