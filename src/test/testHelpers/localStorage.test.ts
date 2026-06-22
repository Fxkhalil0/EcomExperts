import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  STORAGE_KEY,
  parseStoredBundleState,
  safeReadString,
  safeWriteString,
} from "@/helpers/localStorage";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("STORAGE_KEY", () => {
  it("is versioned", () => {
    expect(STORAGE_KEY).toBe("bundle-builder:configuration:v1");
  });
});

describe("safeReadString", () => {
  it("returns the stored string", () => {
    window.localStorage.setItem("foo", "bar");
    expect(safeReadString("foo")).toBe("bar");
  });

  it("returns null when the key is missing", () => {
    expect(safeReadString("missing")).toBeNull();
  });

  it("returns null when reading throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("boom");
    });
    expect(safeReadString("foo")).toBeNull();
  });
});

describe("safeWriteString", () => {
  it("writes the value and returns true", () => {
    expect(safeWriteString("foo", "bar")).toBe(true);
    expect(window.localStorage.getItem("foo")).toBe("bar");
  });

  it("returns false when writing throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(safeWriteString("foo", "bar")).toBe(false);
  });
});

describe("parseStoredBundleState", () => {
  it("returns null for null input", () => {
    expect(parseStoredBundleState(null)).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    expect(parseStoredBundleState("{not json")).toBeNull();
  });

  it("returns null for non-object payloads", () => {
    expect(parseStoredBundleState(JSON.stringify("string"))).toBeNull();
    expect(parseStoredBundleState(JSON.stringify(123))).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    expect(parseStoredBundleState(JSON.stringify({}))).toBeNull();
    expect(
      parseStoredBundleState(JSON.stringify({ selectedVariants: {} })),
    ).toBeNull();
  });

  it("parses a valid payload and floors numeric values", () => {
    const raw = JSON.stringify({
      selectedVariants: { "2": 201.7 },
      quantities: { "1::_default": 3.9 },
    });
    expect(parseStoredBundleState(raw)).toEqual({
      selectedVariants: { "2": 201 },
      quantities: { "1::_default": 3 },
    });
  });

  it("drops non-numeric and non-positive quantities", () => {
    const raw = JSON.stringify({
      selectedVariants: {},
      quantities: {
        a: "not a number",
        b: 0,
        c: -1,
        d: Number.POSITIVE_INFINITY,
        e: 2,
      },
    });
    expect(parseStoredBundleState(raw)).toEqual({
      selectedVariants: {},
      quantities: { e: 2 },
    });
  });

  it("drops non-finite selectedVariants entries", () => {
    const raw = JSON.stringify({
      selectedVariants: { good: 5, bad: "x", inf: Number.POSITIVE_INFINITY },
      quantities: {},
    });
    expect(parseStoredBundleState(raw)).toEqual({
      selectedVariants: { good: 5 },
      quantities: {},
    });
  });
});
