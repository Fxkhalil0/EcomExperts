import { useCallback, useMemo, useState } from "react";
import { Accordion } from "@/components/accordion";
import type { AccordionStep } from "@/components/accordion";
import { CategoryProducts } from "@/components/categoryProducts";
import { Purchase } from "@/components/purchase";
import { ReviewPanel } from "@/components/reviewPanel";
import { useBundle } from "@/hooks/useBundle";
import { useReviewPanel } from "@/hooks/useReviewPanel";
import { categories, productCatalog } from "@/data/products";
import { categoryIcons } from "@/data/categoryIcons";
import { buildCatalogIndex } from "@/helpers/catalog";
import type { Category, ReviewPanelItem } from "@/types";

type View = "builder" | "purchase";

// Module-scope derivations: built once at import time so each render reuses
// the same references and any memo deps that include them stay stable.
const catalogIndex = buildCatalogIndex(productCatalog);

const categoryLabel = categories.reduce<Record<Category, string>>(
  (acc, c) => {
    acc[c.id] = c.label;
    return acc;
  },
  { cameras: "", plans: "", sensors: "", accessories: "" },
);

const reviewCategoryOrder: readonly Category[] = Object.freeze([
  "cameras",
  "sensors",
  "accessories",
  "plans",
] as const);

function App() {
  const { selections, incrementQuantity, decrementQuantity, saveForLater } =
    useBundle();

  const [view, setView] = useState<View>("builder");

  const { countByCategory, reviewGroups, total, savings } = useReviewPanel({
    selections,
    catalog: catalogIndex,
    categoryOrder: reviewCategoryOrder,
    categoryLabel,
  });

  const steps = useMemo<AccordionStep[]>(
    () =>
      categories.map((c) => ({
        id: c.id,
        title: c.label,
        icon: categoryIcons[c.id],
        selectedCount: countByCategory[c.id],
        content: <CategoryProducts products={productCatalog[c.id]} />,
      })),
    [countByCategory],
  );

  const handleIncrease = useCallback(
    (item: ReviewPanelItem) =>
      incrementQuantity(item.productId, item.variantId),
    [incrementQuantity],
  );
  const handleDecrease = useCallback(
    (item: ReviewPanelItem) =>
      decrementQuantity(item.productId, item.variantId),
    [decrementQuantity],
  );
  const handleCheckout = useCallback(() => setView("purchase"), []);
  const handleBackToBuilder = useCallback(() => setView("builder"), []);

  if (view === "purchase") {
    return (
      <Purchase
        selections={selections}
        total={total}
        onBack={handleBackToBuilder}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full pt-[31px] lg:px-[66px] lg:pt-[49.36px] lg:pb-[49.64px] xl:pl-[105px] xl:pr-[122px] xl:pt-[49.32px] xl:pb-[62px]">
        <h1 className="block lg:hidden m-0 p-0 text-[#1F1F1F] text-center text-[31.875px] font-bold leading-[110%] tracking-[-0.064px]">
          Let’s get started!
        </h1>
        <div className="block lg:grid lg:grid-cols-[minmax(0,2fr)_380px] lg:items-start lg:gap-[29px] xl:block">
          <Accordion steps={steps} />
          <div className="block mt-[15px] lg:sticky xl:block lg:mt-[15px] xl:mt-[33.58px] pt-[15px] bg-[#EDF4FF] rounded-[10px]">
            <ReviewPanel
              groups={reviewGroups}
              total={total}
              savings={savings}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onCheckout={handleCheckout}
              onSaveForLater={saveForLater}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
