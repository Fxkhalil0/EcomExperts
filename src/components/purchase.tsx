import { useMemo } from "react";
import { formatCurrency } from "@/utils/format";
import type { BundleSelection, MinorUnits } from "@/types";

export interface PurchaseProps {
  selections: readonly BundleSelection[];
  total: MinorUnits;
  onBack: () => void;
}

interface PurchaseItem {
  id: number;
  count: number;
  variants: Array<{ id: number }>;
}

interface PurchasePayload {
  items: PurchaseItem[];
  totalPrice: MinorUnits;
}

// Collapses one row per (product, variant) into one entry per product,
// summing quantities and listing chosen variant ids.
function buildPurchasePayload(
  selections: readonly BundleSelection[],
  totalPrice: MinorUnits,
): PurchasePayload {
  const byProduct = new Map<number, PurchaseItem>();
  for (const sel of selections) {
    let item = byProduct.get(sel.productId);
    if (!item) {
      item = { id: sel.productId, count: 0, variants: [] };
      byProduct.set(sel.productId, item);
    }
    item.count += sel.quantity;
    if (sel.variantId !== undefined) {
      item.variants.push({ id: sel.variantId });
    }
  }
  return { items: Array.from(byProduct.values()), totalPrice };
}

export function Purchase({ selections, total, onBack }: PurchaseProps) {
  const payload = useMemo(
    () => buildPurchasePayload(selections, total),
    [selections, total],
  );
  const productCount = payload.items.length;

  return (
    <div className="min-h-screen px-5 py-8 lg:px-[66px] lg:py-12 xl:px-[105px]">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 cursor-pointer text-sm font-medium text-[#4E2FD2] underline"
        >
          ← Back to bundle
        </button>
        <h1 className="mb-2 text-[28px] font-semibold leading-[100%] tracking-[0.6px] text-[#1F1F1F]">
          Purchase
        </h1>
        <p className="mb-6 text-sm text-[#4F4F4F]">
          Review the payload that will be sent to your checkout API.
        </p>

        <div className="mb-6 rounded-[10px] bg-[#EDF4FF] p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-[#484848]">
              Total ({productCount} product{productCount === 1 ? "" : "s"})
            </span>
            <span className="text-[24px] font-semibold tabular-nums text-[#4E2FD2]">
              {formatCurrency(payload.totalPrice)}
            </span>
          </div>
        </div>

        <pre
          aria-label="Checkout payload"
          className="overflow-auto rounded-md bg-[#0B0D10] p-4 text-xs leading-relaxed text-[#E6EBF0]"
        >
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
    </div>
  );
}
