import { describe, expect, it } from "vitest";
import { bundleReducer } from "@/helpers/bundleReducer";
import { EMPTY_BUNDLE_STATE } from "@/helpers/bundleSelections";
import { keyFor } from "@/helpers/quantity";
import type { BundleState } from "@/types";

describe("bundleReducer", () => {
  describe("INCREMENT", () => {
    it("adds a new entry when one does not exist", () => {
      const next = bundleReducer(EMPTY_BUNDLE_STATE, {
        type: "INCREMENT",
        productId: 1,
      });
      expect(next.quantities[keyFor(1)]).toBe(1);
    });

    it("increments an existing entry", () => {
      const start: BundleState = {
        selectedVariants: {},
        quantities: { [keyFor(1)]: 2 },
      };
      const next = bundleReducer(start, { type: "INCREMENT", productId: 1 });
      expect(next.quantities[keyFor(1)]).toBe(3);
    });

    it("uses selectedVariants when variantId is omitted", () => {
      const start: BundleState = {
        selectedVariants: { "2": 201 },
        quantities: {},
      };
      const next = bundleReducer(start, { type: "INCREMENT", productId: 2 });
      expect(next.quantities[keyFor(2, 201)]).toBe(1);
    });

    it("uses an explicit variantId when provided", () => {
      const next = bundleReducer(EMPTY_BUNDLE_STATE, {
        type: "INCREMENT",
        productId: 2,
        variantId: 202,
      });
      expect(next.quantities[keyFor(2, 202)]).toBe(1);
    });
  });

  describe("DECREMENT", () => {
    it("returns the same state when current quantity is 0", () => {
      const next = bundleReducer(EMPTY_BUNDLE_STATE, {
        type: "DECREMENT",
        productId: 1,
      });
      expect(next).toBe(EMPTY_BUNDLE_STATE);
    });

    it("decrements an existing entry", () => {
      const start: BundleState = {
        selectedVariants: {},
        quantities: { [keyFor(1)]: 3 },
      };
      const next = bundleReducer(start, { type: "DECREMENT", productId: 1 });
      expect(next.quantities[keyFor(1)]).toBe(2);
    });

    it("removes the entry when decremented from 1", () => {
      const start: BundleState = {
        selectedVariants: {},
        quantities: { [keyFor(1)]: 1 },
      };
      const next = bundleReducer(start, { type: "DECREMENT", productId: 1 });
      expect(next.quantities[keyFor(1)]).toBeUndefined();
    });
  });

  describe("CHANGE_VARIANT", () => {
    it("sets the selected variant for a product", () => {
      const next = bundleReducer(EMPTY_BUNDLE_STATE, {
        type: "CHANGE_VARIANT",
        productId: 2,
        variantId: 201,
      });
      expect(next.selectedVariants["2"]).toBe(201);
    });

    it("returns the same state when the variant is unchanged", () => {
      const start: BundleState = {
        selectedVariants: { "2": 201 },
        quantities: {},
      };
      const next = bundleReducer(start, {
        type: "CHANGE_VARIANT",
        productId: 2,
        variantId: 201,
      });
      expect(next).toBe(start);
    });
  });

  describe("LOAD", () => {
    it("replaces the entire state with the loaded payload", () => {
      const loaded: BundleState = {
        selectedVariants: { "9": 99 },
        quantities: { [keyFor(9, 99)]: 4 },
      };
      const next = bundleReducer(EMPTY_BUNDLE_STATE, {
        type: "LOAD",
        state: loaded,
      });
      expect(next).toBe(loaded);
    });
  });

  describe("RESET", () => {
    it("returns EMPTY_BUNDLE_STATE", () => {
      const start: BundleState = {
        selectedVariants: { "2": 201 },
        quantities: { [keyFor(2, 201)]: 5 },
      };
      expect(bundleReducer(start, { type: "RESET" })).toBe(EMPTY_BUNDLE_STATE);
    });
  });
});
