import { describe, expect, it } from "vitest";
import {
  getCompareAtPrice,
  getCurrentPrice,
  getDiscountAmount,
  hasDiscount,
} from "@/helpers/pricing.helper";
import { cameraA, planA } from "@/test/fixtures";

describe("hasDiscount", () => {
  it("returns false for a product without a discount", () => {
    expect(hasDiscount(cameraA)).toBe(false);
  });

  it("returns true for a product with a discount", () => {
    expect(hasDiscount(planA)).toBe(true);
  });
});

describe("getCurrentPrice", () => {
  it("returns price for a product without a discount", () => {
    expect(getCurrentPrice(cameraA)).toBe(19999);
  });

  it("returns priceAfter for a discounted product", () => {
    expect(getCurrentPrice(planA)).toBe(1000);
  });
});

describe("getCompareAtPrice", () => {
  it("returns null for a product without a discount", () => {
    expect(getCompareAtPrice(cameraA)).toBeNull();
  });

  it("returns priceBefore for a discounted product", () => {
    expect(getCompareAtPrice(planA)).toBe(1200);
  });
});

describe("getDiscountAmount", () => {
  it("returns 0 for a product without a discount", () => {
    expect(getDiscountAmount(cameraA)).toBe(0);
  });

  it("returns the discount amount for a discounted product", () => {
    expect(getDiscountAmount(planA)).toBe(200);
  });
});
