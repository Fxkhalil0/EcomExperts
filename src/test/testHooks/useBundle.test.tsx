import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ReactNode } from "react";
import { BundleProvider } from "@/context/bundleContext";
import { useBundle } from "@/hooks/useBundle";
import { keyFor } from "@/helpers/quantity";

describe("useBundle", () => {
  it("throws when used outside BundleProvider", () => {
    expect(() => renderHook(() => useBundle())).toThrow(
      /useBundle must be used within a BundleProvider/,
    );
  });

  it("returns the context value when wrapped in BundleProvider", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BundleProvider
        defaultConfiguration={{
          selectedVariants: { "2": 201 },
          quantities: { [keyFor(2, 201)]: 3 },
        }}
      >
        {children}
      </BundleProvider>
    );
    const { result } = renderHook(() => useBundle(), { wrapper });
    expect(result.current.totalQuantity).toBe(3);
    expect(result.current.getQuantity(2, 201)).toBe(3);
    expect(typeof result.current.incrementQuantity).toBe("function");
  });
});
