import { memo } from "react";
import type { ReactNode } from "react";
import { VariantSelector } from "@/components/variantSelector";
import type { VariantOption } from "@/components/variantSelector";
import { QuantityStepper } from "@/components/quantityStepper";
import { cn } from "@/utils/cn";
import { cloudinarySrcSet, optimizeCloudinary } from "@/utils/cloudinary";
import { formatCurrency } from "@/utils/format";
import type { MinorUnits } from "@/types";

// Card border color when quantity > 0.
const SELECTED_BORDER_COLOR = "rgba(78, 47, 210, 0.70)";

export type ProductCardVariant = VariantOption;

export interface ProductCardProps {
  badge?: string;
  discountAmount?: number;
  image: string;
  imageAlt?: string;
  title: string;
  description?: string;
  learnMoreHref?: string;
  onLearnMore?: () => void;
  learnMoreLabel?: string;
  variants?: ProductCardVariant[];
  selectedVariantId?: number;
  onVariantChange?: (variantId: number) => void;
  getVariantQuantity?: (variantId: number) => number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  maxQuantityReached?: boolean;
  /** Active selling price in minor currency units (already resolved via pricing helpers). */
  price: MinorUnits;
  /** Optional original price in minor units. `null`/undefined hides the strike-through. */
  compareAtPrice?: MinorUnits | null;
  /** Override "selected" visual state. Defaults to `quantity > 0`. */
  selected?: boolean;
  formatPrice?: (amountInMinorUnits: MinorUnits) => string;
  className?: string;
  footer?: ReactNode;
  /** When true, the image is loaded eagerly with high fetch priority (use for LCP). */
  priority?: boolean;
}

export const ProductCard = memo(function ProductCard({
  discountAmount,
  image,
  imageAlt,
  title,
  description,
  learnMoreHref = "#",
  onLearnMore,
  learnMoreLabel = "Learn More",
  variants,
  selectedVariantId,
  onVariantChange,
  getVariantQuantity,
  quantity,
  onIncrease,
  onDecrease,
  maxQuantityReached = false,
  price,
  compareAtPrice,
  selected,
  formatPrice = formatCurrency,
  className,
  footer,
  priority = false,
}: ProductCardProps) {
  const isSelected = selected ?? quantity > 0;
  const hasVariants = variants !== undefined && variants.length > 0;
  const hasDiscountBadge = discountAmount !== undefined && discountAmount > 0;
  const hasCompareAt =
    compareAtPrice !== undefined &&
    compareAtPrice !== null &&
    compareAtPrice > price;

  return (
    <div
      data-selected={isSelected ? "true" : "false"}
      style={{
        borderColor: isSelected ? SELECTED_BORDER_COLOR : "transparent",
      }}
      className={cn(
        "flex h-full flex-col lg:flex-row lg:relative xl:flex-col items-center justify-center self-stretch overflow-hidden rounded-[10px] border-2 bg-white px-[11px] py-[15px] transition-colors",
        "gap-[19px]",
        className,
      )}
    >
      <div className="w-full lg:w-[25%] xl:w-full relative lg:static xl:self-stretch">
        {hasDiscountBadge && (
          <span className="absolute left-2 top-2 z-10 rounded-[10px] bg-[#4E2FD2] px-[6px] py-[2px] text-xs tracking-wide text-white">
            Save {discountAmount}%
          </span>
        )}
        <div className="w-full rounded-[5px] bg-gray-50 aspect-[107/62]">
          {(() => {
            const srcSet = cloudinarySrcSet(image, [320, 480, 640, 960]);
            return (
              <img
                src={optimizeCloudinary(image, 600)}
                {...(srcSet
                  ? {
                      srcSet,
                      sizes:
                        "(min-width: 1280px) 220px, (min-width: 1024px) 25vw, 100vw",
                    }
                  : null)}
                alt={imageAlt ?? title}
                width={640}
                height={371}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={priority ? "high" : "low"}
                className="h-full lg:h-auto xl:h-full w-full object-contain"
              />
            );
          })()}
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col gap-3 self-stretch">
        <div className="flex flex-col gap-2">
          <h3 className="text-[#1F1F1F] lg:text-[16px] xl:text-[18px] leading-[100%] font-semibold">
            {title}
          </h3>
          {description && (
            <p className="text-[rgb(31_31_31_/_75%)] lg:text-[12px] xl:text-[14px] leading-[130%] tracking-[0.6px]">
              {description}{" "}
              <a
                href={learnMoreHref}
                onClick={onLearnMore}
                className="font-medium text-[#00E] underline"
              >
                {learnMoreLabel}
              </a>
            </p>
          )}
        </div>
        {hasVariants && variants && (
          <VariantSelector
            variants={variants}
            selectedVariantId={selectedVariantId}
            onChange={(id) => onVariantChange?.(id)}
            ariaLabel={`${title} variants`}
            getQuantity={getVariantQuantity}
          />
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <QuantityStepper
            quantity={quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            max={maxQuantityReached ? quantity : undefined}
            label={title}
          />
          <div className="flex lg:flex-col xl:flex-row items-baseline gap-[3px] lg:gap-0 xl:gap-[3px]">
            {hasCompareAt && (
              <span className="text-base text-[#D8392B] line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
            <span className="text-base text-[#575757]">
              {formatPrice(price)}
            </span>
          </div>
        </div>
        {footer}
      </div>
    </div>
  );
});
