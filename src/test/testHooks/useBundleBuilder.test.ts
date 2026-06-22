import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useBundleBuilder } from "@/hooks/useBundleBuilder";
import { STORAGE_KEY } from "@/helpers/localStorage";
import { keyFor } from "@/helpers/quantity";

describe("useBundleBuilder", () => {
  it("starts empty when no default configuration and nothing in storage", () => {
    const { result } = renderHook(() => useBundleBuilder());
    expect(result.current.selections).toEqual([]);
    expect(result.current.totalQuantity).toBe(0);
    expect(result.current.selectedVariants).toEqual({});
  });

  it("seeds from the provided defaultConfiguration", () => {
    const { result } = renderHook(() =>
      useBundleBuilder({
        selectedVariants: { "2": 201 },
        quantities: { [keyFor(2, 201)]: 2 },
      }),
    );
    expect(result.current.totalQuantity).toBe(2);
    expect(result.current.getQuantity(2, 201)).toBe(2);
  });

  it("prefers a stored configuration over the default", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedVariants: { "9": 99 },
        quantities: { [keyFor(9, 99)]: 4 },
      }),
    );
    const { result } = renderHook(() =>
      useBundleBuilder({
        selectedVariants: {},
        quantities: { [keyFor(1)]: 1 },
      }),
    );
    expect(result.current.getQuantity(9, 99)).toBe(4);
    expect(result.current.getQuantity(1)).toBe(0);
  });

  it("incrementQuantity / decrementQuantity update selections", () => {
    const { result } = renderHook(() => useBundleBuilder());
    act(() => result.current.incrementQuantity(1));
    act(() => result.current.incrementQuantity(1));
    expect(result.current.getQuantity(1)).toBe(2);
    act(() => result.current.decrementQuantity(1));
    expect(result.current.getQuantity(1)).toBe(1);
    act(() => result.current.decrementQuantity(1));
    expect(result.current.getQuantity(1)).toBe(0);
  });

  it("changeVariant sets the active variant for a product", () => {
    const { result } = renderHook(() => useBundleBuilder());
    act(() => result.current.changeVariant(2, 202));
    expect(result.current.selectedVariants["2"]).toBe(202);
    act(() => result.current.incrementQuantity(2));
    expect(result.current.getQuantity(2, 202)).toBe(1);
  });

  it("loadConfiguration replaces the current state", () => {
    const { result } = renderHook(() => useBundleBuilder());
    act(() => result.current.incrementQuantity(1));
    act(() =>
      result.current.loadConfiguration({
        selectedVariants: { "2": 201 },
        quantities: { [keyFor(2, 201)]: 5 },
      }),
    );
    expect(result.current.getQuantity(1)).toBe(0);
    expect(result.current.getQuantity(2, 201)).toBe(5);
  });

  it("reset() clears the state", () => {
    const { result } = renderHook(() => useBundleBuilder());
    act(() => result.current.incrementQuantity(1));
    expect(result.current.totalQuantity).toBe(1);
    act(() => result.current.reset());
    expect(result.current.totalQuantity).toBe(0);
    expect(result.current.selections).toEqual([]);
  });

  it("saveForLater() writes the latest snapshot to localStorage", () => {
    const { result } = renderHook(() => useBundleBuilder());
    act(() => result.current.incrementQuantity(1));
    act(() => result.current.incrementQuantity(1));
    act(() => result.current.saveForLater());
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!) as {
      quantities: Record<string, number>;
    };
    expect(parsed.quantities[keyFor(1)]).toBe(2);
  });
});
