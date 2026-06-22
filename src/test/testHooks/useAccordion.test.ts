import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAccordion } from "@/hooks/useAccordion";
import type { KeyboardEvent } from "react";

const stepIds = ["a", "b", "c"];

describe("useAccordion", () => {
  it("uses defaultOpenStepId when provided", () => {
    const { result } = renderHook(() =>
      useAccordion({ stepIds, defaultOpenStepId: "b" }),
    );
    expect(result.current.openStepId).toBe("b");
  });

  it("defaults to empty (closed) below the lg breakpoint", () => {
    const { result } = renderHook(() => useAccordion({ stepIds }));
    // jsdom matchMedia polyfill returns matches=false
    expect(result.current.openStepId).toBe("");
    expect(result.current.matchesLg).toBe(false);
  });

  it("opens the first step when at or above the lg breakpoint", () => {
    const matchMediaSpy = vi
      .spyOn(window, "matchMedia")
      .mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })) as unknown as ReturnType<typeof vi.spyOn>;

    const { result } = renderHook(() => useAccordion({ stepIds }));
    expect(result.current.openStepId).toBe("a");
    expect(result.current.matchesLg).toBe(true);

    matchMediaSpy.mockRestore();
  });

  it("open() switches the active step", () => {
    const { result } = renderHook(() =>
      useAccordion({ stepIds, defaultOpenStepId: "a" }),
    );
    act(() => result.current.open("c"));
    expect(result.current.openStepId).toBe("c");
  });

  it("open() with the same id returns the previous reference", () => {
    const { result } = renderHook(() =>
      useAccordion({ stepIds, defaultOpenStepId: "a" }),
    );
    const before = result.current.openStepId;
    act(() => result.current.open("a"));
    expect(result.current.openStepId).toBe(before);
  });

  it("registerHeaderRef stores a ref callback", () => {
    const { result } = renderHook(() =>
      useAccordion({ stepIds, defaultOpenStepId: "a" }),
    );
    expect(typeof result.current.registerHeaderRef(0)).toBe("function");
  });

  it("onHeaderKeyDown handles arrow / Home / End and preventDefault", () => {
    const { result } = renderHook(() =>
      useAccordion({ stepIds, defaultOpenStepId: "a" }),
    );
    // Register fake header elements with focus spies
    const buttons: HTMLButtonElement[] = [];
    for (let i = 0; i < stepIds.length; i += 1) {
      const btn = document.createElement("button");
      buttons.push(btn);
      result.current.registerHeaderRef(i)(btn);
    }
    const focusSpies = buttons.map((b) => vi.spyOn(b, "focus"));

    const fakeEvent = (key: string): KeyboardEvent<HTMLButtonElement> => {
      const preventDefault = vi.fn();
      return { key, preventDefault } as unknown as KeyboardEvent<HTMLButtonElement>;
    };

    const down = fakeEvent("ArrowDown");
    act(() => result.current.onHeaderKeyDown(down, 0));
    expect(down.preventDefault).toHaveBeenCalled();
    expect(focusSpies[1]).toHaveBeenCalled();

    const up = fakeEvent("ArrowUp");
    act(() => result.current.onHeaderKeyDown(up, 0));
    expect(up.preventDefault).toHaveBeenCalled();
    // ArrowUp from 0 wraps to last
    expect(focusSpies[2]).toHaveBeenCalled();

    const home = fakeEvent("Home");
    act(() => result.current.onHeaderKeyDown(home, 2));
    expect(focusSpies[0]).toHaveBeenCalled();

    const end = fakeEvent("End");
    act(() => result.current.onHeaderKeyDown(end, 0));
    expect(focusSpies[2]).toHaveBeenCalledTimes(2);

    const other = fakeEvent("Tab");
    act(() => result.current.onHeaderKeyDown(other, 0));
    expect(other.preventDefault).not.toHaveBeenCalled();
  });
});
