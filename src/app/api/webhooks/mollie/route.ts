/**
 * Mollie webhook endpoint.
 *
 * Mollie sends a POST request to this endpoint whenever a payment
 * status changes. We fetch the payment details from Mollie and
 * forward the status update to our booking system.
 */

import { NextResponse } from "next/server";
import { getPayment } from "@/lib/payment/mollie";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const paymentId = formData.get("id") as string | null;

    if (!paymentId) {
      console.error("[mollie:webhook] Missing payment ID in request");
      return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
    }

    console.log(`[mollie:webhook] Received status update for payment ${paymentId}`);

    // Fetch payment details from Mollie to verify status
    const payment = await getPayment(paymentId);

    console.log(
      `[mollie:webhook] Payment ${paymentId}: status=${payment.status}, ref=${payment.bookingReference}`,
    );

    // Forward status to booking system if configured
    const apiUrl = process.env.BOOKING_API_URL;
    const apiKey = process.env.BOOKING_API_KEY;

    if (apiUrl && payment.bookingReference) {
      try {
        const response = await fetch(`${apiUrl}/bookings/payment-status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          },
          body: JSON.stringify({
            bookingReference: payment.bookingReference,
            paymentId: payment.paymentId,
            status: payment.status,
            amount: payment.amount,
            paidAt: payment.paidAt,
          }),
        });

        if (!response.ok) {
          console.error(
            `[mollie:webhook] Failed to update booking system: ${response.status}`,
          );
        } else {
          console.log(
            `[mollie:webhook] Booking system updated for ref ${payment.bookingReference}`,
          );
        }
      } catch (err) {
        // Log but don't fail — Mollie expects a 200 response
        console.error("[mollie:webhook] Error updating booking system:", err);
      }
    }

    // Mollie expects a 200 response to confirm receipt
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[mollie:webhook] Error processing webhook:", err);
    // Still return 200 to prevent Mollie from retrying endlessly
    return NextResponse.json({ received: true });
  }
}
