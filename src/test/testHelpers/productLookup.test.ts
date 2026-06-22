import { describe, expect, it } from "vitest";
import { findVariant, lookupProduct } from "@/helpers/productLookup";
import { cameraA, cameraB, testProductLookup } from "@/test/fixtures";

describe("lookupProduct", () => {
  it("returns the product for a known id", () => {
    expect(lookupProduct(testProductLookup, cameraA.id)).toBe(cameraA);
  });

  it("returns undefined for an unknown id", () => {
    expect(lookupProduct(testProductLookup, 9999)).toBeUndefined();
  });
});

describe("findVariant", () => {
  it("returns undefined when the product is undefined", () => {
    expect(findVariant(undefined, 201)).toBeUndefined();
  });

  it("returns undefined when variantId is undefined", () => {
    expect(findVariant(cameraB, undefined)).toBeUndefined();
  });

  it("returns undefined when the product has no variants", () => {
    expect(findVariant(cameraA, 1)).toBeUndefined();
  });

  it("returns the matching variant", () => {
    expect(findVariant(cameraB, 202)).toEqual({
      id: 202,
      name: "White",
      thumbnail: "/img/cam-b-white.png",
    });
  });

  it("returns undefined when no variant matches", () => {
    expect(findVariant(cameraB, 999)).toBeUndefined();
  });
});
