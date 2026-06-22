import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useReviewPanel } from "@/hooks/useReviewPanel";
import { testCatalogIndex } from "@/test/fixtures";
import type { BundleSelection, Category } from "@/types";

const categoryOrder: readonly Category[] = [
  "cameras",
  "plans",
  "sensors",
  "accessories",
];

const categoryLabel: Record<Category, string> = {
  cameras: "Cameras",
  plans: "Plans",
  sensors: "Sensors",
  accessories: "Accessories",
};

describe("useReviewPanel", () => {
  it("returns zero totals and empty groups for no selections", () => {
    const { result } = renderHook(() =>
      useReviewPanel({
        selections: [],
        catalog: testCatalogIndex,
        categoryOrder,
        categoryLabel,
      }),
    );
    expect(result.current.total).toBe(0);
    expect(result.current.compareAtTotal).toBe(0);
    expect(result.current.savings).toBe(0);
    expect(result.current.reviewGroups).toHaveLength(4);
  });

  it("derives counts, groups and pricing from selections", () => {
    const selections: BundleSelection[] = [
      { productId: 1, quantity: 2 }, // cameraA 19999
      { productId: 10, quantity: 3 }, // planA after=1000 before=1200
    ];
    const { result } = renderHook(() =>
      useReviewPanel({
        selections,
        catalog: testCatalogIndex,
        categoryOrder,
        categoryLabel,
      }),
    );
    expect(result.current.total).toBe(19999 * 2 + 1000 * 3);
    expect(result.current.compareAtTotal).toBe(19999 * 2 + 1200 * 3);
    expect(result.current.savings).toBe(200 * 3);
    expect(result.current.countByCategory.cameras).toBe(2);
    expect(result.current.countByCategory.plans).toBe(3);
  });

  it("memoizes the result for the same input references", () => {
    const selections: BundleSelection[] = [{ productId: 1, quantity: 1 }];
    const { result, rerender } = renderHook(
      (props: { selections: readonly BundleSelection[] }) =>
        useReviewPanel({
          selections: props.selections,
          catalog: testCatalogIndex,
          categoryOrder,
          categoryLabel,
        }),
      { initialProps: { selections } },
    );
    const first = result.current;
    rerender({ selections });
    expect(result.current).toBe(first);
  });
});
