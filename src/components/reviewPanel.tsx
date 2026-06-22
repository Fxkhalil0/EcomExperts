import { memo, useMemo } from "react";
import type { ReactNode } from "react";
import { QuantityStepper } from "@/components/quantityStepper";
import { cn } from "@/utils/cn";
import { optimizeCloudinary } from "@/utils/cloudinary";
import { formatCurrency } from "@/utils/format";
import type { MinorUnits, ReviewPanelGroup, ReviewPanelItem } from "@/types";
import { DeliveryIcon } from "@/icons";
export type { ReviewPanelGroup, ReviewPanelItem } from "@/types";

export interface ReviewPanelProps {
  groups: ReviewPanelGroup[];
  total: MinorUnits;
  savings: MinorUnits;
  shipping?: MinorUnits;
  formatPrice?: (amountInMinorUnits: MinorUnits) => string;
  onIncrease: (item: ReviewPanelItem) => void;
  onDecrease: (item: ReviewPanelItem) => void;
  onCheckout: () => void;
  onSaveForLater?: () => void;
  checkoutLabel?: string;
  saveForLaterLabel?: string;
  emptyMessage?: string;
  className?: string;
}

export const ReviewPanel = memo(function ReviewPanel({
  groups,
  total,
  savings,
  shipping,
  formatPrice = formatCurrency,
  onIncrease,
  onDecrease,
  onCheckout,
  onSaveForLater,
  checkoutLabel = "Checkout",
  saveForLaterLabel = "Save my system for later",
  emptyMessage = "No items selected yet.",
  className,
}: ReviewPanelProps) {
  // Memoize derived view state so the JSX below stays stable when only
  // the parent re-renders without group/shipping changes.
  const { visibleGroups, isEmpty, isShippingFree } = useMemo(
    () => {
      const visible = groups.filter((g) => g.items.length > 0);
      return {
        visibleGroups: visible,
        isEmpty: visible.length === 0,
        isShippingFree: !shipping || shipping === 0,
      };
    },
    [groups, shipping],
  );
  return (
    <div aria-label="Bundle review" className={cn("flex flex-col", className)}>
      <span className="px-[15px] text-xs font-medium text-[#484848] uppercase leading-[100%] tracking-[1.6px]">
        Review
      </span>
      <div className="p-[20px_20px_31px_20px] grid lg:grid-cols-1 xl:grid-cols-3 gap-[52px]">
        <div className="lg:col-span-1 xl:col-span-2">
          <div className="flex flex-col gap-[5px] mb-[10px]">
            <h2 className="text-[#1F1F1F] lg:text-[22px] xl:text-[28px] font-semibold leading-[100%] tracking-[0.6px]">
              Your security system
            </h2>
            <p className="text-[#4F4F4F] lg:text-[14px] xl:text-[16px] font-medium leading-[130%] tracking-[0.6px]">
              Customize your security system by selecting the components that
              best
              <br />
              fit your needs.
            </p>
          </div>
          <div className="flex flex-col">
            {isEmpty ? (
              <p className="text-sm text-gray-500">{emptyMessage}</p>
            ) : (
              visibleGroups.map((group) => (
                <section
                  className="border-t border-[#CED6DE] mb-[10px] outline-none"
                  key={group.id}
                >
                  <h3 className="text-[#6B7480] text-[12px] leading-[100%] tracking-[0.36px] uppercase mt-[15px] mb-2 font-semibold">
                    {group.id}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {group.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-3 outline-none border-none">
                        <img
                          src={optimizeCloudinary(item.thumbnail, 96)}
                          alt=""
                          width={48}
                          height={48}
                          loading="lazy"
                          decoding="async"
                          className="h-12 w-12 flex-shrink-0 rounded-[5px] bg-white object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[#0B0D10] lg:text-[14px] xl:text-[18px] font-medium leading-[100%] tracking-[0.6px]">
                            {item.title}{" "}
                            {item.variantName && `- ${item.variantName}`}
                          </p>
                        </div>
                        <QuantityStepper
                          size="sm"
                          label={item.title}
                          quantity={item.quantity}
                          onIncrease={() => onIncrease(item)}
                          onDecrease={() => onDecrease(item)}
                          $isWhiteBg={true}
                        />
                        <div className="ml-1 flex flex-col items-end gap-0 xl:flex-row xl:items-baseline xl:gap-[10px]">
                          {item.unitCompareAtPrice !== undefined &&
                            item.unitCompareAtPrice > item.unitPrice && (
                              <span className="text-[14px] xl:text-base font-semibold xl:font-medium text-[#6F7882] line-through tabular-nums">
                                {formatPrice(
                                  item.unitCompareAtPrice * item.quantity,
                                )}
                              </span>
                            )}
                          <span className="text-[14px] xl:text-base font-semibold xl:font-medium text-[#4E2FD2] tabular-nums">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>
          <div className="flex flex-col gap-3 border-t border-[#CED6DE] text-gray-700 pt-[15px]">
            <SummaryRow
              icon={<DeliveryIcon />}
              label="Fast Shipping"
              value={isShippingFree ? "Free" : formatPrice(shipping ?? 0)}
            />
          </div>
        </div>
        <div className="">
          <div className="flex items-center justify-between xl:gap-[25px]">
            <figure className="w-[78px] h-[78px] xl:w-[131px] xl:h-[131px] flex-shrink-0">
              <img
                src={optimizeCloudinary("https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899569/Satisfaction_Badge-05_1_w37y5x.svg", 262)}
                alt=""
                width={131}
                height={131}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain"
              />
            </figure>
            <p className="hidden xl:block text-[#1F1F1F] text-[18px] leading-[110%] tracking-[0.6px]">
              <span className="font-semibold">30-day hassle-free returns</span>
              <br />
              <br />
              If you're not totally in love with the
              <br />
              product, we will refund you 100%.
            </p>
            <div className="flex xl:hidden flex-col items-end gap-2 mb-[10px]">
              <div className="w-fit py-[5px] px-[8px] rounded-[3px] bg-[#4E2FD2] text-white text-center text-[12px] font-normal leading-[100%] tracking-[0.6px]">
                as low as $19.99/mo
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[#6F7882] text-[18px] leading-[100%] tracking-[0.6px] font-medium line-through tabular-nums">
                  {formatPrice(total + savings)}
                </span>
                <span className="text-[#4E2FD2] font-semibold leading-[114.286%] tracking-[0.6px] text-[24px] tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden xl:flex items-center justify-between mt-4 mb-[14px]">
            <div className="p-2 rounded-[3px] bg-[#4E2FD2] text-white text-center text-[16px] leading-[100%] tracking-[0.6px]">
              as low as $19.99/mo
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[#6F7882] text-[22px] leading-[100%] tracking-[0.6px] font-medium line-through tabular-nums">
                {formatPrice(total + savings)}
              </span>
              <span className="text-[#4E2FD2] font-semibold leading-[114.286%] tracking-[0.6px] text-[28px] tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <small className="text-[#067458] text-center font-semibold lg:font-normal xl:font-semibold text-[14px] lg:text-xs xl:text-[14px] tracking-[0.6px]">
              Congrats! You’re saving $50.92 on your security bundle!
            </small>
            <button
              type="button"
              onClick={onCheckout}
              disabled={isEmpty}
              className="inline-flex w-full items-center justify-center rounded-md bg-[#4E2FD2] px-4 py-[13px] text-[17px] font-bold text-white outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {checkoutLabel}
            </button>
            {onSaveForLater && (
              <button
                type="button"
                onClick={onSaveForLater}
                className="cursor-pointer underline text-[#484848] font-italic text-[14px] tracking-[0.6px]"
              >
                {saveForLaterLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

interface SummaryRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  note?: string;
}

const SummaryRow = memo(function SummaryRow({ icon, label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="h-12 w-12 flex place-items-center justify-center flex-shrink-0 rounded-[5px] bg-white object-cover">
          {icon}
        </span>
        <p className="text-[#0B0D10] lg:text-[14px] xl:text-[18px] font-normal leading-[16px] tracking-[0.09px]">
          {label}
        </p>
      </div>
      <div className="flex lg:flex-col xl:flex-row items-center gap-[10px] lg:gap-0 xl:gap-[10px]">
        <span className="text-[#6F7882] text-right lg:text-[14px] xl:text-[16px] font-semibold line-through">
          5.99$
        </span>
        {value && (
          <span className="uppercase text-[#4E2FD2] text-center lg:text-[14px] xl:text-[16px] xl:font-semibold leading-[100%] tracking-[0.6px]">
            {value}
          </span>
        )}
      </div>
    </div>
  );
});
