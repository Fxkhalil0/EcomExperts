import { BundleContext } from "@/context/bundleStore";
import { useBundleBuilder } from "@/hooks/useBundleBuilder";
import type { BundleProviderProps } from "@/types";

export function BundleProvider({
  children,
  defaultConfiguration,
}: BundleProviderProps) {
  const value = useBundleBuilder(defaultConfiguration);
  return (
    <BundleContext.Provider value={value}>{children}</BundleContext.Provider>
  );
}
