"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BookingFlowStep } from "./bookingFlowTypes";

interface BookingStepIndicatorProps {
  currentStep: BookingFlowStep;
}

/**
 * Visual step indicator for the booking flow.
 *
 * Shows where the user is in the funnel. Completed steps show a
 * checkmark, the active step is highlighted, and future steps are muted.
 */
export default function BookingStepIndicator({
  currentStep,
}: BookingStepIndicatorProps) {
  const t = useTranslations("bookingModule");

  const STEPS = [
    { step: 1 as const, label: t("stepVerblijf") },
    { step: 2 as const, label: t("stepReisgezelschap") },
    { step: 3 as const, label: t("stepUpgrades") },
    { step: 4 as const, label: t("stepGegevens") },
    { step: 5 as const, label: t("stepBevestigen") },
  ] as const;

  return (
    <nav aria-label={t("stepIndicatorAriaLabel")} className="mb-8 lg:mb-10">
      <ol className="flex items-center justify-center gap-0">
        {STEPS.map(({ step, label }, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          const isLast = index === STEPS.length - 1;

          return (
            <li key={step} className="flex items-center">
              {/* Step circle + label */}
              <div className="flex items-center gap-1.5 md:gap-2.5">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-lato)] text-xs font-bold transition-colors md:h-8 md:w-8 md:text-sm ${
                    isCompleted
                      ? "bg-[#5a9a5a] text-white"
                      : isActive
                        ? "bg-olive text-white"
                        : "bg-cream-dark/60 text-olive-light/60"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                  ) : (
                    step
                  )}
                </span>
                <span
                  className={`hidden font-[family-name:var(--font-lato)] text-sm font-medium sm:inline ${
                    isCompleted
                      ? "text-[#5a9a5a]"
                      : isActive
                        ? "text-olive-dark"
                        : "text-olive-light/60"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`mx-2 h-px w-6 sm:mx-3 sm:w-10 md:mx-4 md:w-14 ${
                    isCompleted ? "bg-[#5a9a5a]" : "bg-cream-dark"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
