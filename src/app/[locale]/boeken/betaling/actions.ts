"use server";

import { getPaymentByReference, isMollieConfigured } from "@/lib/payment/mollie";

export async function checkPaymentStatus(
  bookingReference: string,
): Promise<{ status: string } | null> {
  if (!isMollieConfigured()) {
    return null;
  }

  try {
    const payment = await getPaymentByReference(bookingReference);
    if (!payment) return null;

    return { status: payment.status };
  } catch (err) {
    console.error("[payment:check] Error checking payment status:", err);
    return null;
  }
}
