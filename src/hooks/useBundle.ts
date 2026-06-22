import { useContext } from "react";
import { BundleContext } from "@/context/bundleStore";
import type { BundleContextValue } from "@/types";

export function useBundle(): BundleContextValue {
  const ctx = useContext(BundleContext);
  if (!ctx) {
    throw new Error("useBundle must be used within a BundleProvider");
  }
  return ctx;
}
