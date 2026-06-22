import { describe, expect, it } from "vitest";
import { buildReviewGroups } from "@/helpers/grouping";
import { keyFor } from "@/helpers/quantity";
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

describe("buildReviewGroups", () => {
  it("returns empty groups when there are no selections", () => {
    const { countByCategory, reviewGroups } = buildReviewGroups(
      [],
      testCatalogIndex,
      { categoryOrder, categoryLabel },
    );
    expect(countByCategory).toEqual({
      cameras: 0,
      plans: 0,
      sensors: 0,
      accessories: 0,
    });
    expect(reviewGroups).toHaveLength(4);
    for (const g of reviewGroups) expect(g.items).toEqual([]);
  });

  it("groups selections by category and counts quantities", () => {
    const selections: BundleSelection[] = [
      { productId: 1, quantity: 2 }, // cameraA
      { productId: 2, variantId: 201, quantity: 1 }, // cameraB Black
      { productId: 10, quantity: 3 }, // planA
    ];
    const { countByCategory, reviewGroups } = buildReviewGroups(
      selections,
      testCatalogIndex,
      { categoryOrder, categoryLabel },
    );
    expect(countByCategory).toEqual({
      cameras: 3,
      plans: 3,
      sensors: 0,
      accessories: 0,
    });
    const cameras = reviewGroups.find((g) => g.id === "cameras");
    expect(cameras?.items).toHaveLength(2);
    expect(cameras?.items[0]).toMatchObject({
      id: keyFor(1),
      productId: 1,
      title: "Camera A",
      unitPrice: 19999,
      unitCompareAtPrice: undefined,
      quantity: 2,
    });
    expect(cameras?.items[1]).toMatchObject({
      productId: 2,
      variantId: 201,
      title: "Camera B",
      variantName: "Black",
      thumbnail: "/img/cam-b-black.png",
      quantity: 1,
    });
    const plans = reviewGroups.find((g) => g.id === "plans");
    expect(plans?.items[0]).toMatchObject({
      productId: 10,
      unitPrice: 1000,
      unitCompareAtPrice: 1200,
      quantity: 3,
    });
  });

  it("skips selections that reference unknown products", () => {
    const { reviewGroups, countByCategory } = buildReviewGroups(
      [{ productId: 9999, quantity: 4 }],
      testCatalogIndex,
      { categoryOrder, categoryLabel },
    );
    for (const g of reviewGroups) expect(g.items).toEqual([]);
    expect(Object.values(countByCategory).every((v) => v === 0)).toBe(true);
  });

  it("preserves the order of categoryOrder in the result", () => {
    const customOrder: readonly Category[] = [
      "accessories",
      "plans",
      "cameras",
      "sensors",
    ];
    const { reviewGroups } = buildReviewGroups([], testCatalogIndex, {
      categoryOrder: customOrder,
      categoryLabel,
    });
    expect(reviewGroups.map((g) => g.id)).toEqual(customOrder);
  });
});
