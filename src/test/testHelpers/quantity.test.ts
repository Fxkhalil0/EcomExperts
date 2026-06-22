import { describe, expect, it } from "vitest";
import {
  DEFAULT_VARIANT_KEY,
  keyFor,
  parseSelectionKey,
} from "@/helpers/quantity";

describe("keyFor", () => {
  it("uses DEFAULT_VARIANT_KEY when variantId is omitted", () => {
    expect(keyFor(1)).toBe(`1::${DEFAULT_VARIANT_KEY}`);
  });

  it("includes the variantId when provided", () => {
    expect(keyFor(1, 42)).toBe("1::42");
  });
});

describe("parseSelectionKey", () => {
  it("parses a product-only key", () => {
    expect(parseSelectionKey(keyFor(7))).toEqual({ productId: 7 });
  });

  it("parses a product+variant key", () => {
    expect(parseSelectionKey(keyFor(7, 99))).toEqual({
      productId: 7,
      variantId: 99,
    });
  });

  it("returns null for malformed keys", () => {
    expect(parseSelectionKey("invalid")).toBeNull();
    expect(parseSelectionKey("a::b::c")).toBeNull();
    expect(parseSelectionKey("abc::1")).toBeNull();
    expect(parseSelectionKey("1::xyz")).toBeNull();
  });
});
