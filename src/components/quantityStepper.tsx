import { memo } from "react";
import { cn } from "@/utils/cn";

export interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max?: number;
  min?: number;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  $isWhiteBg?: boolean;
}

export const QuantityStepper = memo(function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  max,
  min = 0,
  label = "item",
  disabled = false,
  size: _size = "md",
  className,
  $isWhiteBg = false,
}: QuantityStepperProps) {
  void _size;
  const decreaseDisabled = disabled || quantity <= min;
  const increaseDisabled = disabled || (max !== undefined && quantity >= max);

  const buttonBase =
    "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[4px] text-sm leading-none text-gray-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2",
        disabled && "opacity-60",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={decreaseDisabled}
        aria-label={`Decrease quantity of ${label}`}
        className={cn(
          buttonBase,
          `${$isWhiteBg ? "border-none" : "border-2 border-[#E6EBF0]"} bg-white hover:bg-gray-50`,
        )}
      >
        <span aria-hidden="true">−</span>
      </button>
      <span
        aria-live="polite"
        className="text-center text-base font-medium text-[#0B0D10]"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={increaseDisabled}
        aria-label={`Increase quantity of ${label}`}
        className={cn(
          buttonBase,
          $isWhiteBg ? "bg-white" : "bg-[#F0F4F7] hover:bg-[#E6EBF0]",
        )}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
});
