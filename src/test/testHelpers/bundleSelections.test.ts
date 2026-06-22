import { describe, expect, it } from "vitest";
import {
  EMPTY_BUNDLE_STATE,
  getQuantity,
  selectionsFromState,
  totalQuantity,
} from "@/helpers/bundleSelections";
import { keyFor } from "@/helpers/quantity";
import type { BundleState } from "@/types";

describe("EMPTY_BUNDLE_STATE", () => {
  it("has empty selectedVariants and quantities", () => {
    expect(EMPTY_BUNDLE_STATE).toEqual({
      selectedVariants: {},
      quantities: {},
    });
  });
});

describe("selectionsFromState", () => {
  it("returns an empty array for empty state", () => {
    expect(selectionsFromState(EMPTY_BUNDLE_STATE)).toEqual([]);
  });

  it("projects quantities into BundleSelection entries", () => {
    const state: BundleState = {
      selectedVariants: {},
      quantities: {
        [keyFor(1)]: 2,
        [keyFor(2, 201)]: 3,
      },
    };
    const result = selectionsFromState(state);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      productId: 1,
      variantId: undefined,
      quantity: 2,
    });
    expect(result).toContainEqual({
      productId: 2,
      variantId: 201,
      quantity: 3,
    });
  });

  it("skips zero and negative quantities", () => {
    const state: BundleState = {
      selectedVariants: {},
      quantities: {
        [keyFor(1)]: 0,
        [keyFor(2)]: -1,
        [keyFor(3)]: 5,
      },
    };
    expect(selectionsFromState(state)).toEqual([
      { productId: 3, variantId: undefined, quantity: 5 },
    ]);
  });

  it("skips malformed keys", () => {
    const state: BundleState = {
      selectedVariants: {},
      quantities: {
        not_a_key: 5,
        [keyFor(9)]: 1,
      },
    };
    expect(selectionsFromState(state)).toEqual([
      { productId: 9, variantId: undefined, quantity: 1 },
    ]);
  });
});

describe("totalQuantity", () => {
  it("returns 0 for an empty array", () => {
    expect(totalQuantity([])).toBe(0);
  });

  it("sums quantities across all selections", () => {
    expect(
      totalQuantity([
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 },
        { productId: 3, quantity: 1 },
      ]),
    ).toBe(6);
  });
});

describe("getQuantity", () => {
  it("returns 0 when nothing is selected", () => {
    expect(getQuantity(EMPTY_BUNDLE_STATE, 1)).toBe(0);
  });

  it("reads the quantity for a product without variants", () => {
    const state: BundleState = {
      selectedVariants: {},
      quantities: { [keyFor(1)]: 4 },
    };
    expect(getQuantity(state, 1)).toBe(4);
  });

  it("uses an explicit variantId when provided", () => {
    const state: BundleState = {
      selectedVariants: {},
      quantities: { [keyFor(2, 202)]: 7 },
    };
    expect(getQuantity(state, 2, 202)).toBe(7);
  });

  it("falls back to the selectedVariants map when variantId is omitted", () => {
    const state: BundleState = {
      selectedVariants: { "2": 201 },
      quantities: { [keyFor(2, 201)]: 5 },
    };
    expect(getQuantity(state, 2)).toBe(5);
  });
});
