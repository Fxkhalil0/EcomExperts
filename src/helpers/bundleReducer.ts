import { keyFor } from "@/helpers/quantity";
import { EMPTY_BUNDLE_STATE } from "@/helpers/bundleSelections";
import type { BundleAction, BundleState } from "@/types";

// Pure reducer for the Bundle Builder. Framework-agnostic so it is
// trivially unit-testable.
export function bundleReducer(
  state: BundleState,
  action: BundleAction,
): BundleState {
  switch (action.type) {
    case "INCREMENT": {
      const variantId =
        action.variantId ?? state.selectedVariants[String(action.productId)];
      const key = keyFor(action.productId, variantId);
      const current = state.quantities[key] ?? 0;
      return {
        ...state,
        quantities: { ...state.quantities, [key]: current + 1 },
      };
    }
    case "DECREMENT": {
      const variantId =
        action.variantId ?? state.selectedVariants[String(action.productId)];
      const key = keyFor(action.productId, variantId);
      const current = state.quantities[key] ?? 0;
      if (current <= 0) return state;
      const nextQuantities = { ...state.quantities };
      if (current === 1) {
        delete nextQuantities[key];
      } else {
        nextQuantities[key] = current - 1;
      }
      return { ...state, quantities: nextQuantities };
    }
    case "CHANGE_VARIANT": {
      if (
        state.selectedVariants[String(action.productId)] === action.variantId
      ) {
        return state;
      }
      return {
        ...state,
        selectedVariants: {
          ...state.selectedVariants,
          [action.productId]: action.variantId,
        },
      };
    }
    case "LOAD":
      return action.state;
    case "RESET":
      return EMPTY_BUNDLE_STATE;
    default:
      return state;
  }
}
