import { describe, expect, it } from "vitest";
import {
  calculateCompareAtPrice,
  calculatePricing,
  calculateSavings,
  calculateTotal,
} from "@/helpers/pricing";
import { testProductLookup } from "@/test/fixtures";
import type { BundleSelection } from "@/types";

// cameraA price=19999 (no discount)
// planA  priceAfter=1000, priceBefore=1200 (discount of 200/unit)
const selections: BundleSelection[] = [
  { productId: 1, quantity: 2 }, // cameraA  -> 19999 * 2
  { productId: 10, quantity: 3 }, // planA   -> 1000 * 3 (savings 200 * 3)
];

describe("calculateTotal", () => {
  it("returns 0 for no selections", () => {
    expect(calculateTotal([], testProductLookup)).toBe(0);
  });

  it("sums current prices across all selections", () => {
    expect(calculateTotal(selections, testProductLookup)).toBe(
      19999 * 2 + 1000 * 3,
    );
  });

  it("skips selections for unknown product ids", () => {
    expect(
      calculateTotal(
        [{ productId: 9999, quantity: 5 }, ...selections],
        testProductLookup,
      ),
    ).toBe(19999 * 2 + 1000 * 3);
  });
});

describe("calculateCompareAtPrice", () => {
  it("uses compareAt when present, otherwise current price", () => {
    expect(calculateCompareAtPrice(selections, testProductLookup)).toBe(
      19999 * 2 + 1200 * 3,
    );
  });
});

describe("calculateSavings", () => {
  it("returns 0 when no selection has a discount", () => {
    expect(
      calculateSavings([{ productId: 1, quantity: 5 }], testProductLookup),
    ).toBe(0);
  });

  it("sums per-unit savings across discounted selections", () => {
    expect(calculateSavings(selections, testProductLookup)).toBe(200 * 3);
  });
});

describe("calculatePricing", () => {
  it("returns total, compareAtTotal and savings in a single pass", () => {
    expect(calculatePricing(selections, testProductLookup)).toEqual({
      total: 19999 * 2 + 1000 * 3,
      compareAtTotal: 19999 * 2 + 1200 * 3,
      savings: 200 * 3,
    });
  });

  it("returns zeroes for empty selections", () => {
    expect(calculatePricing([], testProductLookup)).toEqual({
      total: 0,
      compareAtTotal: 0,
      savings: 0,
    });
  });
});
