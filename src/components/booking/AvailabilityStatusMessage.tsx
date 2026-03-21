"use client";

import type { AvailabilityCheckStatus } from "@/lib/availability/types";
import { useTranslations } from "next-intl";
import { Check, Loader2, X, AlertTriangle, CalendarDays } from "lucide-react";

interface AvailabilityStatusMessageProps {
  status: AvailabilityCheckStatus;
  reason?: string | null;
  onRetry?: () => void;
}

interface StatusConfig {
  icon: React.ReactNode;
  label: string;
  description: string;
  actionHint?: string;
  containerClass: string;
  iconClass: string;
  labelClass: string;
}

export default function AvailabilityStatusMessage({
  status,
  reason,
  onRetry,
}: AvailabilityStatusMessageProps) {
  const t = useTranslations("bookingModule");

  const STATUS_CONFIG: Record<AvailabilityCheckStatus, StatusConfig> = {
    idle: {
      icon: <CalendarDays size={16} />,
      label: t("choosePeriod"),
      description: t("choosePeriodDescription"),
      containerClass: "border-cream-dark bg-cream/50",
      iconClass: "text-olive-light",
      labelClass: "text-olive-dark",
    },
    checking: {
      icon: <Loader2 size={16} className="animate-spin" />,
      label: t("checkingAvailability"),
      description: t("checkingAvailabilityMessage"),
      containerClass: "border-terracotta/20 bg-terracotta/5",
      iconClass: "text-terracotta",
      labelClass: "text-terracotta-dark",
    },
    available: {
      icon: <Check size={16} />,
      label: t("goodNewsAvailable"),
      description: t("availableDescription"),
      containerClass: "border-green-200 bg-green-50",
      iconClass: "text-green-600",
      labelClass: "text-green-800",
    },
    unavailable: {
      icon: <X size={16} />,
      label: t("unavailableLabel"),
      description: t("unavailableDescription"),
      actionHint: t("unavailableActionHint"),
      containerClass: "border-red-200 bg-red-50",
      iconClass: "text-red-500",
      labelClass: "text-red-800",
    },
    invalid: {
      icon: <AlertTriangle size={16} />,
      label: t("invalidSelectionLabel"),
      description: t("invalidSelectionDescription"),
      actionHint: t("invalidSelectionActionHint"),
      containerClass: "border-amber-200 bg-amber-50",
      iconClass: "text-amber-500",
      labelClass: "text-amber-800",
    },
    error: {
      icon: <AlertTriangle size={16} />,
      label: t("errorLabel"),
      description: t("errorDescription"),
      actionHint: t("errorActionHint"),
      containerClass: "border-amber-200 bg-amber-50",
      iconClass: "text-amber-500",
      labelClass: "text-amber-800",
    },
  };

  const config = STATUS_CONFIG[status];
  const description = reason ?? config.description;
  const actionHint = config.actionHint;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`mb-5 flex min-h-[4.5rem] items-start gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 ${config.containerClass}`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center ${config.iconClass}`}
        aria-hidden="true"
      >
        {config.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`font-[family-name:var(--font-lato)] text-sm font-semibold ${config.labelClass}`}
        >
          {config.label}
        </p>
        <p className="mt-0.5 font-[family-name:var(--font-lato)] text-xs leading-relaxed text-text-muted">
          {description}
        </p>
        {actionHint && (
          <p className="mt-1 font-[family-name:var(--font-lato)] text-xs leading-relaxed text-text-muted">
            {actionHint}
          </p>
        )}
        {status === "error" && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1.5 font-[family-name:var(--font-lato)] text-xs font-semibold text-terracotta transition-colors hover:text-terracotta-dark focus:outline-none focus-visible:underline"
          >
            {t("retryButton")}
          </button>
        )}
      </div>
    </div>
  );
}
