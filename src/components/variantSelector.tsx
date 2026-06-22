import { memo } from "react";
import { cn } from "@/utils/cn";
import { optimizeCloudinary } from "@/utils/cloudinary";

export interface VariantOption {
  id: number;
  name: string;
  thumbnail: string;
}

export interface VariantSelectorProps {
  variants: VariantOption[];
  selectedVariantId?: number;
  onChange: (variantId: number) => void;
  ariaLabel?: string;
  getQuantity?: (variantId: number) => number;
  className?: string;
}

export const VariantSelector = memo(function VariantSelector({
  variants,
  selectedVariantId,
  onChange,
  ariaLabel = "Variants",
  getQuantity,
  className,
}: VariantSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap items-center gap-[8px]", className)}
    >
      {variants.map((variant) => {
        const isActive = variant.id === selectedVariantId;
        const qty = getQuantity?.(variant.id) ?? 0;
        const isSelected = qty > 0;

        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={
              qty > 0 ? `${variant.name}, quantity ${qty}` : variant.name
            }
            title={variant.name}
            onClick={() => {
              if (!isActive) onChange(variant.id);
            }}
            style={
              isSelected
                ? {
                    borderColor: "#0AA288",
                    backgroundColor: "rgba(29, 240, 187, 0.04)",
                  }
                : undefined
            }
            className={cn(
              "inline-flex min-h-[28px] shrink-0 items-center gap-2 rounded-[2px] border bg-white px-[6px] py-[3px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(78,47,210,0.70)]",
              !isSelected &&
                (isActive
                  ? "border-gray-900"
                  : "border-gray-200 hover:border-gray-400"),
            )}
          >
            <figure className="block h-[28px] w-[28px] lg:h-[24px] lg:w-[24px] xl:h-[28px] xl:w-[28px] shrink-0 overflow-hidden rounded-sm bg-gray-50">
              <img
                src={optimizeCloudinary(variant.thumbnail, 96)}
                alt=""
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </figure>
            <span className="whitespace-nowrap text-left text-xs lg:text-[10px] xl:text-xs font-medium text-gray-800">
              {variant.name}
            </span>
          </button>
        );
      })}
    </div>
  );
});
