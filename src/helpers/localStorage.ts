import type { BundleState } from "@/types";

export const STORAGE_KEY = "bundle-builder:configuration:v1";

// Never-throws read/write so SSR, private mode, and security errors
// degrade gracefully.
export function safeReadString(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeWriteString(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

// Validates a stored blob and returns a usable BundleState, or null when
// missing/malformed. Quantities are floored to integers.
export function parseStoredBundleState(
  raw: string | null,
): BundleState | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const candidate = parsed as Partial<BundleState>;
    if (
      !candidate.selectedVariants ||
      typeof candidate.selectedVariants !== "object" ||
      !candidate.quantities ||
      typeof candidate.quantities !== "object"
    ) {
      return null;
    }
    const quantities: Record<string, number> = {};
    for (const [k, v] of Object.entries(candidate.quantities)) {
      if (typeof v === "number" && Number.isFinite(v) && v > 0) {
        quantities[k] = Math.floor(v);
      }
    }
    const selectedVariants: Record<string, number> = {};
    for (const [k, v] of Object.entries(candidate.selectedVariants)) {
      if (typeof v === "number" && Number.isFinite(v)) {
        selectedVariants[k] = Math.floor(v);
      }
    }
    return { selectedVariants, quantities };
  } catch {
    return null;
  }
}
