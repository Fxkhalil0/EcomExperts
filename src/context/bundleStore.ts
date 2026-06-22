import { createContext } from "react";
import type { BundleContextValue } from "@/types";

// The context lives in its own non-component module so both the provider
// and the consumer hook can import it without violating React Fast
// Refresh's "components only" rule.
export const BundleContext = createContext<BundleContextValue | null>(null);
