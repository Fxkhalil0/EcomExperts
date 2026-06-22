import type { ReactNode } from "react";
import type { Product } from "@/types/product.types";

export interface BundleSelection {
  productId: number;
  variantId?: number;
  quantity: number;
}

// Reducer state. `quantities` is keyed by `keyFor(productId, variantId)`
// (see helpers/quantity.ts).
export interface BundleState {
  selectedVariants: Record<string, number>;
  quantities: Record<string, number>;
}

export interface BundleConfiguration {
  selectedVariants: Record<string, number>;
  quantities: Record<string, number>;
}

export type BundleAction =
  | { type: "INCREMENT"; productId: number; variantId?: number }
  | { type: "DECREMENT"; productId: number; variantId?: number }
  | { type: "CHANGE_VARIANT"; productId: number; variantId: number }
  | { type: "LOAD"; state: BundleState }
  | { type: "RESET" };

export interface BundleContextValue {
  selections: BundleSelection[];
  totalQuantity: number;
  selectedVariants: Record<string, number>;
  getQuantity: (productId: number, variantId?: number) => number;
  incrementQuantity: (productId: number, variantId?: number) => void;
  decrementQuantity: (productId: number, variantId?: number) => void;
  changeVariant: (productId: number, variantId: number) => void;
  saveForLater: () => void;
  loadConfiguration: (config: BundleConfiguration) => void;
  reset: () => void;
}

export interface BundleProviderProps {
  children: ReactNode;
  defaultConfiguration?: BundleConfiguration;
}

export type ProductLookup = Map<number, Product>;
