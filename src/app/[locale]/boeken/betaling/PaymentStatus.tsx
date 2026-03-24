"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Check, AlertTriangle, XCircle, Clock } from "lucide-react";
import { checkPaymentStatus } from "./actions";

interface PaymentStatusLabels {
  checking: string;
  paid: string;
  paidDescription: string;
  pending: string;
  pendingDescription: string;
  failed: string;
  failedDescription: string;
  expired: string;
  expiredDescription: string;
  canceled: string;
  canceledDescription: string;
  referenceNumber: string;
  backToHome: string;
  tryAgain: string;
}

type Status = "checking" | "paid" | "pending" | "failed" | "expired" | "canceled" | "error";

export default function PaymentStatus({ labels }: { labels: PaymentStatusLabels }) {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";

  const [status, setStatus] = useState<Status>("checking");
  const [pollCount, setPollCount] = useState(0);

  const checkStatus = useCallback(async () => {
    if (!ref) {
      setStatus("error");
      return;
    }

    try {
      const result = await checkPaymentStatus(ref);
      if (!result) {
        setStatus("pending");
        return;
      }

      switch (result.status) {
        case "paid":
          setStatus("paid");
          // Clear booking session data
          try {
            sessionStorage.removeItem("orvelterhof_booking_contact");
            sessionStorage.removeItem("orvelterhof_payment_ref");
            sessionStorage.removeItem("orvelterhof_payment_id");
          } catch { /* ignore */ }
          break;
        case "failed":
          setStatus("failed");
          break;
        case "expired":
          setStatus("expired");
          break;
        case "canceled":
          setStatus("canceled");
          break;
        default:
          setStatus("pending");
      }
    } catch {
      setStatus("error");
    }
  }, [ref]);

  // Poll for status on mount and every 3 seconds for pending
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    if (status !== "checking" && status !== "pending") return;
    if (pollCount >= 20) return; // Stop after ~60 seconds

    const timer = setTimeout(() => {
      setPollCount((c) => c + 1);
      checkStatus();
    }, 3000);

    return () => clearTimeout(timer);
  }, [status, pollCount, checkStatus]);

  return (
    <div className="text-center">
      {status === "checking" && (
        <>
          <div className="mb-6 flex justify-center">
            <Loader2 size={40} className="animate-spin text-terracotta" />
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
            {labels.checking}
          </h2>
        </>
      )}

      {status === "paid" && (
        <>
          <div className="mb-6 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5a9a5a]/10">
              <Check size={32} className="text-[#5a9a5a]" />
            </span>
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl text-olive-dark md:text-3xl">
            {labels.paid}
          </h2>
          <p className="mb-4 font-[family-name:var(--font-lato)] text-base leading-relaxed text-text-muted">
            {labels.paidDescription}
          </p>
          {ref && (
            <p className="mb-6 font-[family-name:var(--font-lato)] text-sm text-olive-light">
              {labels.referenceNumber}{" "}
              <span className="font-bold text-olive-dark">{ref}</span>
            </p>
          )}
          <a
            href="/"
            className="inline-flex rounded-full bg-terracotta px-8 py-3 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg"
          >
            {labels.backToHome}
          </a>
        </>
      )}

      {status === "pending" && (
        <>
          <div className="mb-6 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10">
              <Clock size={32} className="text-terracotta" />
            </span>
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
            {labels.pending}
          </h2>
          <p className="mb-6 font-[family-name:var(--font-lato)] text-base leading-relaxed text-text-muted">
            {labels.pendingDescription}
          </p>
          {ref && (
            <p className="font-[family-name:var(--font-lato)] text-sm text-olive-light">
              {labels.referenceNumber}{" "}
              <span className="font-bold text-olive-dark">{ref}</span>
            </p>
          )}
        </>
      )}

      {(status === "failed" || status === "error") && (
        <>
          <div className="mb-6 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle size={32} className="text-red-500" />
            </span>
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
            {labels.failed}
          </h2>
          <p className="mb-6 font-[family-name:var(--font-lato)] text-base leading-relaxed text-text-muted">
            {labels.failedDescription}
          </p>
          <a
            href="/boeken"
            className="inline-flex rounded-full bg-terracotta px-8 py-3 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg"
          >
            {labels.tryAgain}
          </a>
        </>
      )}

      {status === "expired" && (
        <>
          <div className="mb-6 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle size={32} className="text-red-500" />
            </span>
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
            {labels.expired}
          </h2>
          <p className="mb-6 font-[family-name:var(--font-lato)] text-base leading-relaxed text-text-muted">
            {labels.expiredDescription}
          </p>
          <a
            href="/boeken"
            className="inline-flex rounded-full bg-terracotta px-8 py-3 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg"
          >
            {labels.tryAgain}
          </a>
        </>
      )}

      {status === "canceled" && (
        <>
          <div className="mb-6 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle size={32} className="text-red-500" />
            </span>
          </div>
          <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl text-olive-dark">
            {labels.canceled}
          </h2>
          <p className="mb-6 font-[family-name:var(--font-lato)] text-base leading-relaxed text-text-muted">
            {labels.canceledDescription}
          </p>
          <a
            href="/boeken"
            className="inline-flex rounded-full bg-terracotta px-8 py-3 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg"
          >
            {labels.tryAgain}
          </a>
        </>
      )}
    </div>
  );
}
