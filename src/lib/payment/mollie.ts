/**
 * Mollie payment integration.
 *
 * Creates and retrieves payments via the Mollie API.
 * Uses the official @mollie/api-client SDK.
 */

import createMollieClient, { type PaymentStatus, Locale } from "@mollie/api-client";

// ── Client ────────────────────────────────────────────────────────

function getMollieClient() {
  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) {
    throw new Error("MOLLIE_API_KEY is not configured");
  }
  return createMollieClient({ apiKey });
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/** Whether Mollie is configured (API key present). */
export function isMollieConfigured(): boolean {
  const key = process.env.MOLLIE_API_KEY;
  return !!key && key !== "test_placeholder";
}

// ── Types ─────────────────────────────────────────────────────────

export interface CreatePaymentParams {
  bookingReference: string;
  amount: number;
  description: string;
  locale?: Locale;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  paymentId: string;
  checkoutUrl: string;
  status: string;
}

export interface PaymentInfo {
  paymentId: string;
  status: PaymentStatus;
  amount: string;
  description: string;
  paidAt?: string;
  bookingReference?: string;
}

// ── Create payment ────────────────────────────────────────────────

export async function createPayment({
  bookingReference,
  amount,
  description,
  locale = Locale.nl_NL,
  metadata = {},
}: CreatePaymentParams): Promise<PaymentResult> {
  const mollie = getMollieClient();
  const siteUrl = getSiteUrl();

  const payment = await mollie.payments.create({
    amount: {
      currency: "EUR",
      value: amount.toFixed(2),
    },
    description,
    redirectUrl: `${siteUrl}/boeken/betaling?ref=${encodeURIComponent(bookingReference)}`,
    webhookUrl: `${siteUrl}/api/webhooks/mollie`,
    locale,
    metadata: {
      bookingReference,
      ...metadata,
    },
  });

  const checkoutUrl = payment.getCheckoutUrl();
  if (!checkoutUrl) {
    throw new Error("Mollie did not return a checkout URL");
  }

  return {
    paymentId: payment.id,
    checkoutUrl,
    status: payment.status,
  };
}

// ── Get payment ───────────────────────────────────────────────────

export async function getPayment(paymentId: string): Promise<PaymentInfo> {
  const mollie = getMollieClient();
  const payment = await mollie.payments.get(paymentId);

  return {
    paymentId: payment.id,
    status: payment.status,
    amount: `${payment.amount.currency} ${payment.amount.value}`,
    description: payment.description,
    paidAt: payment.paidAt ?? undefined,
    bookingReference: (payment.metadata as Record<string, string>)?.bookingReference,
  };
}

// ── Get payment by booking reference ──────────────────────────────

export async function getPaymentByReference(
  bookingReference: string,
): Promise<PaymentInfo | null> {
  const mollie = getMollieClient();

  // Mollie doesn't support filtering by metadata, so we list recent payments
  // and find the one with the matching reference.
  const payments = await mollie.payments.page({ limit: 50 });

  for (const payment of payments) {
    const meta = payment.metadata as Record<string, string> | null;
    if (meta?.bookingReference === bookingReference) {
      return {
        paymentId: payment.id,
        status: payment.status,
        amount: `${payment.amount.currency} ${payment.amount.value}`,
        description: payment.description,
        paidAt: payment.paidAt ?? undefined,
        bookingReference: meta.bookingReference,
      };
    }
  }

  return null;
}
