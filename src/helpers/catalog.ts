import type { Category, Product, ProductCatalog } from "@/types";

export const CATALOG_CATEGORIES: readonly Category[] = Object.freeze([
  "cameras",
  "plans",
  "sensors",
  "accessories",
] as const);

// O(1) byId lookup + categoryOf reverse-mapping. Category is implicit in
// the catalog array a product lives in; Product does not carry it.
export interface CatalogIndex {
  byId: Map<number, Product>;
  categoryOf: Map<number, Category>;
}

export function buildCatalogIndex(catalog: ProductCatalog): CatalogIndex {
  const byId = new Map<number, Product>();
  const categoryOf = new Map<number, Category>();
  for (const cat of CATALOG_CATEGORIES) {
    for (const product of catalog[cat]) {
      byId.set(product.id, product);
      categoryOf.set(product.id, cat);
    }
  }
  return { byId, categoryOf };
}
