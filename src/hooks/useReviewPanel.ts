import { useMemo } from "react";
import type { CatalogIndex } from "@/helpers/catalog";
import { buildReviewGroups } from "@/helpers/grouping";
import { calculatePricing } from "@/helpers/pricing";
import type {
  BundleSelection,
  Category,
  MinorUnits,
  ReviewPanelGroup,
} from "@/types";

export interface UseReviewPanelOptions {
  selections: readonly BundleSelection[];
  catalog: CatalogIndex;
  categoryOrder: readonly Category[];
  categoryLabel: Record<Category, string>;
}

export interface UseReviewPanelResult {
  countByCategory: Record<Category, number>;
  reviewGroups: ReviewPanelGroup[];
  total: MinorUnits;
  compareAtTotal: MinorUnits;
  savings: MinorUnits;
}

// Single-pass derivation of grouping + pricing. `catalog`, `categoryOrder`
// and `categoryLabel` MUST be referentially stable (hoist to module scope)
// or the memo will defeat itself.
export function useReviewPanel({
  selections,
  catalog,
  categoryOrder,
  categoryLabel,
}: UseReviewPanelOptions): UseReviewPanelResult {
  return useMemo(() => {
    const { countByCategory, reviewGroups } = buildReviewGroups(
      selections,
      catalog,
      { categoryOrder, categoryLabel },
    );
    const { total, compareAtTotal, savings } = calculatePricing(
      selections,
      catalog.byId,
    );
    return {
      countByCategory,
      reviewGroups,
      total,
      compareAtTotal,
      savings,
    };
  }, [selections, catalog, categoryOrder, categoryLabel]);
}
