import { memo, useMemo } from "react";
import type { ReactNode } from "react";
import { useAccordion } from "@/hooks/useAccordion";
import { cn } from "@/utils/cn";
import { ChevronIcon } from "@/icons";

export interface AccordionStep {
  id: string;
  title: string;
  icon: ReactNode;
  selectedCount: number;
  content: ReactNode;
}

export interface AccordionProps {
  steps: AccordionStep[];
  defaultOpenStepId?: string;
  nextLabel?: string;
  className?: string;
}

export const Accordion = memo(function Accordion({
  steps,
  defaultOpenStepId,
  nextLabel = "Next",
  className,
}: AccordionProps) {
  // Stable identity across renders so useAccordion's effect/refs don't
  // see a fresh array on every parent render.
  const stepIds = useMemo(() => steps.map((s) => s.id), [steps]);
  const { openStepId, matchesLg, open, registerHeaderRef, onHeaderKeyDown } =
    useAccordion({ stepIds, defaultOpenStepId });

  return (
    <div className={cn("w-full divide-y", className)}>
      {steps.map((step, index) => {
        const isOpen = step.id === openStepId;
        const isLast = index === steps.length - 1;
        const nextStep = steps[index + 1];
        const headerId = `accordion-header-${step.id}`;
        const panelId = `accordion-panel-${step.id}`;

        return (
          <div
            className={`w-full flex flex-col outline-none border-none mt-[13px] ${isOpen ? "bg-[#EDF4FF]" : "bg-white"} rounded-[10px] pt-[15px]`}
            key={step.id}
          >
            <span className="w-full px-[15px] pb-[5px] text-[12px] font-[Gilroy-Medium] text-[#484848] uppercase border-b-[0.5px] border-[#1F1F1F]">
              Step {index + 1} of {steps.length}
            </span>
            <div>
              <div
                className={`${isOpen ? "border-b-none" : "border-b-[0.5px] border-[#1F1F1F]"}`}
              >
                <button
                  id={headerId}
                  ref={registerHeaderRef(index)}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => open(step.id)}
                  onKeyDown={(e) => onHeaderKeyDown(e, index)}
                  className="w-full flex items-center justify-between py-5 px-[15px] text-left transition-colors outline-none"
                >
                  <div className="flex flex-1 items-center gap-2">
                    <span>{step.icon}</span>
                    <h1 className="text-[#0B0D10] font-[Gilroy-Bold] lg:text-[22px] xl:text-[28px] leading-[100%]">
                      {step.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-1">
                    {(isOpen || !matchesLg) && (
                      <span className="text-[14px] text-[#4E2FD2] font-semibold">
                        {step.selectedCount} selected
                      </span>
                    )}
                    <ChevronIcon
                      className={cn(isOpen ? "rotate-0" : "rotate-180")}
                    />
                  </div>
                </button>
              </div>
              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="px-[15px] pb-[15px]"
                >
                  {step.content}
                  {!isLast && nextStep && (
                    <div className="mt-[15px] mb-[5px] flex justify-center">
                      <button
                        type="button"
                        onClick={() => open(nextStep.id)}
                        className="rounded-[7px] border border-[#4E2FD2] text-[#4E2FD2] font-semibold text-[18px] px-6 py-[5px] outline-none"
                      >
                        {`${nextLabel}: ${nextStep.title}`}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
