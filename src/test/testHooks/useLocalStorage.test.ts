import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const KEY = "test-key";

interface Sample {
  n: number;
}

const parseSample = (raw: string | null): Sample | null => {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Sample;
    return typeof v?.n === "number" ? v : null;
  } catch {
    return null;
  }
};

describe("useLocalStorage", () => {
  it("read() returns null when nothing is stored", () => {
    const { result } = renderHook(() => useLocalStorage<Sample>(KEY, parseSample));
    expect(result.current.read()).toBeNull();
  });

  it("write() persists a value that read() can recover", () => {
    const { result } = renderHook(() => useLocalStorage<Sample>(KEY, parseSample));
    act(() => {
      expect(result.current.write({ n: 42 })).toBe(true);
    });
    expect(result.current.read()).toEqual({ n: 42 });
  });

  it("supports a custom serializer", () => {
    const serialize = vi.fn((v: Sample) => `n=${v.n}`);
    const parse = (raw: string | null): Sample | null => {
      if (!raw?.startsWith("n=")) return null;
      const n = Number(raw.slice(2));
      return Number.isFinite(n) ? { n } : null;
    };
    const { result } = renderHook(() =>
      useLocalStorage<Sample>(KEY, parse, serialize),
    );
    act(() => {
      result.current.write({ n: 7 });
    });
    expect(serialize).toHaveBeenCalledWith({ n: 7 });
    expect(window.localStorage.getItem(KEY)).toBe("n=7");
    expect(result.current.read()).toEqual({ n: 7 });
  });
});
