import type { MinorUnits } from "@/types/common.types";

export interface ProductVariant {
  id: number;
  name: string;
  thumbnail: string;
}

// When `discount` is present, `price` MUST be absent; the active price is
// `discount.priceAfter`. Use the helpers in pricing.helper.ts to read.
export interface ProductDiscount {
  amount: number;
  priceBefore: MinorUnits;
  priceAfter: MinorUnits;
}

interface ProductBase {
  id: number;
  title: string;
  description: string;
  image: string;
  badge?: string;
  variants?: ProductVariant[];
}

export interface ProductWithoutDiscount extends ProductBase {
  price: MinorUnits;
  discount?: never;
}

export interface ProductWithDiscount extends ProductBase {
  price?: never;
  discount: ProductDiscount;
}

export type Product = ProductWithoutDiscount | ProductWithDiscount;

export interface ProductCatalog {
  cameras: Product[];
  plans: Product[];
  sensors: Product[];
  accessories: Product[];
}
