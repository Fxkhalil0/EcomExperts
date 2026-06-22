import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { bundleReducer } from "@/helpers/bundleReducer";
import {
  EMPTY_BUNDLE_STATE,
  getQuantity,
  selectionsFromState,
  totalQuantity,
} from "@/helpers/bundleSelections";
import {
  STORAGE_KEY,
  parseStoredBundleState,
} from "@/helpers/localStorage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type {
  BundleConfiguration,
  BundleContextValue,
  BundleSelection,
  BundleState,
} from "@/types";

// Owns the entire Bundle Builder state machine and exposes the
// BundleContextValue. Persistence is explicit: `saveForLater()` writes
// the latest snapshot; nothing auto-saves on every change.
export function useBundleBuilder(
  defaultConfiguration?: BundleConfiguration,
): BundleContextValue {
  const { read, write } = useLocalStorage<BundleState>(
    STORAGE_KEY,
    parseStoredBundleState,
  );

  const [state, dispatch] = useReducer(
    bundleReducer,
    defaultConfiguration ?? EMPTY_BUNDLE_STATE,
    (fallback) => read() ?? fallback,
  );

  // Mirror state into a ref so `saveForLater` is stable (no `state` dep)
  // yet always serializes the freshest snapshot.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const incrementQuantity = useCallback(
    (productId: number, variantId?: number) => {
      dispatch({ type: "INCREMENT", productId, variantId });
    },
    [],
  );

  const decrementQuantity = useCallback(
    (productId: number, variantId?: number) => {
      dispatch({ type: "DECREMENT", productId, variantId });
    },
    [],
  );

  const changeVariant = useCallback(
    (productId: number, variantId: number) => {
      dispatch({ type: "CHANGE_VARIANT", productId, variantId });
    },
    [],
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const loadConfiguration = useCallback((config: BundleConfiguration) => {
    dispatch({
      type: "LOAD",
      state: {
        selectedVariants: { ...config.selectedVariants },
        quantities: { ...config.quantities },
      },
    });
  }, []);

  const saveForLater = useCallback(() => {
    write(stateRef.current);
  }, [write]);

  const lookupQuantity = useCallback(
    (productId: number, variantId?: number) =>
      getQuantity(state, productId, variantId),
    [state],
  );

  return useMemo<BundleContextValue>(() => {
    const selections: BundleSelection[] = selectionsFromState(state);
    return {
      selections,
      totalQuantity: totalQuantity(selections),
      selectedVariants: state.selectedVariants,
      getQuantity: lookupQuantity,
      incrementQuantity,
      decrementQuantity,
      changeVariant,
      saveForLater,
      loadConfiguration,
      reset,
    };
  }, [
    state,
    lookupQuantity,
    incrementQuantity,
    decrementQuantity,
    changeVariant,
    saveForLater,
    loadConfiguration,
    reset,
  ]);
}
