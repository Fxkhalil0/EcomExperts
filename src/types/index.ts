// Barrel re-export for shared Bundle Builder types. Prefer importing
// from `../types` so relationships stay centralized.
export type {
  Category,
  CategoryDescriptor,
  ClassValue,
  MinorUnits,
} from "@/types/common.types";

export type {
  Product,
  ProductCatalog,
  ProductDiscount,
  ProductVariant,
  ProductWithDiscount,
  ProductWithoutDiscount,
} from "@/types/product.types";

export type {
  BundleAction,
  BundleConfiguration,
  BundleContextValue,
  BundleProviderProps,
  BundleSelection,
  BundleState,
  ProductLookup,
} from "@/types/bundle.types";

export type { ReviewPanelGroup, ReviewPanelItem } from "@/types/review.types";
