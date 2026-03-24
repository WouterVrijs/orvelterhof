"use server";

import { createPayment, isMollieConfigured } from "@/lib/payment/mollie";

export type BookingActionState = {
  success: boolean;
  reservationNumber?: string;
  /** Mollie checkout URL — redirect user here for payment. */
  paymentUrl?: string;
  paymentId?: string;
  error?: string;
  details?: string;
} | null;

export async function submitBooking(
  _prevState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const bookingType = formData.get("bookingType") || "verblijf";
  const paymentOption = String(formData.get("paymentOption") || "full");
  const totalPrice = Number(formData.get("totalPrice") || 0);

  const body: Record<string, unknown> = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    arrivalDate: String(formData.get("arrivalDate") ?? ""),
    departureDate: String(formData.get("departureDate") ?? ""),
    numberOfGuests: Number(formData.get("numberOfGuests") || 2),
    totalPrice,
    guestNote: String(formData.get("guestNote") ?? "") || undefined,
    paymentOption,
  };

  // Add arrangement-specific fields
  if (bookingType === "arrangement") {
    body.arrangementId = formData.get("arrangementId");
    body.arrangementName = formData.get("arrangementName");
  }

  // 1. Submit booking to booking system
  const res = await fetch(`${process.env.BOOKING_API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.BOOKING_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: data.error || `HTTP ${res.status}`,
      details: typeof data.details === "object" ? JSON.stringify(data.details) : data.details,
    };
  }

  const reservationNumber: string = data.reservationNumber;

  // 2. Create Mollie payment if configured
  if (isMollieConfigured() && totalPrice > 0) {
    const paymentAmount = paymentOption === "deposit"
      ? Math.round(totalPrice * 0.3 * 100) / 100
      : totalPrice;

    const depositLabel = paymentOption === "deposit" ? " (aanbetaling 30%)" : "";

    try {
      const payment = await createPayment({
        bookingReference: reservationNumber,
        amount: paymentAmount,
        description: `Orvelter Hof — ${reservationNumber}${depositLabel}`,
        metadata: {
          paymentOption,
          originalTotal: String(totalPrice),
        },
      });

      console.log(
        `[booking:submit] Payment created: ${payment.paymentId} for ${reservationNumber}`,
      );

      return {
        success: true,
        reservationNumber,
        paymentUrl: payment.checkoutUrl,
        paymentId: payment.paymentId,
      };
    } catch (err) {
      console.error("[booking:submit] Mollie payment creation failed:", err);
      // Booking was created but payment failed — return success without payment
      return {
        success: true,
        reservationNumber,
        error: "payment_failed",
        details: "Boeking is aangemaakt, maar de betaling kon niet worden gestart.",
      };
    }
  }

  // No Mollie configured — booking only (no payment)
  return { success: true, reservationNumber };
}
