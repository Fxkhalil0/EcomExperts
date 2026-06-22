import type { MinorUnits } from "@/types/common.types";

export interface ReviewPanelItem {
  id: string;
  productId: number;
  variantId?: number;
  thumbnail: string;
  title: string;
  variantName?: string;
  quantity: number;
  unitPrice: MinorUnits;
  unitCompareAtPrice?: MinorUnits;
}

export interface ReviewPanelGroup {
  id: string;
  label: string;
  items: ReviewPanelItem[];
}
