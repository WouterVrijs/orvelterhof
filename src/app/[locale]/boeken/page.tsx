import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingCalendarWrapper from "./BookingCalendarWrapper";
import PayPalLogo from "@/components/PayPalLogo";
import { fetchCalendarData } from "@/lib/api/calendarService";
import { addMonths, todayISO } from "@/components/booking/dateUtils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.boeken");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BoekenPage() {
  const t = await getTranslations("boeken");

  // Fetch calendar data server-side if API is configured.
  // Returns null when no API is configured (falls back to mock in wrapper).
  const today = todayISO();
  const horizonEnd = addMonths(new Date(), 12);
  const apiCalendarData = await fetchCalendarData(today, horizonEnd);
  return (
    <>
      <Header />
      <main>
        {/* Hero banner */}
        <section className="bg-[#545959] pb-16 pt-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="mb-3 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[#c8835e]">
              {t("heroTagline")}
            </p>
            <h1 className="mb-4 font-[family-name:var(--font-playfair)] text-[2.25rem] text-white md:text-[3.813rem]">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto max-w-2xl font-[family-name:var(--font-lato)] text-[1rem] font-light leading-relaxed text-white/80">
              {t("heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Booking calendar */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <Suspense>
              <BookingCalendarWrapper apiCalendarData={apiCalendarData} />
            </Suspense>
          </div>
        </section>

        {/* Betaal veilig met */}
        <section className="bg-white py-10">
          <div className="mx-auto max-w-3xl px-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-olive-light" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span className="font-[family-name:var(--font-lato)] text-sm font-medium">
                  {t("paymentLabel")}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {/* iDEAL / Wero */}
                <span title="iDEAL / Wero" className="flex h-9 w-auto items-center justify-center rounded-md bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] px-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/ideal-wero.svg"
                    alt="iDEAL / Wero"
                    className="h-7 w-auto"
                  />
                </span>
                {/* PayPal */}
                <PayPalLogo />
                {/* Visa */}
                <span title="Visa" className="flex h-9 w-14 items-center justify-center rounded-md bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/visa.png"
                    alt="Visa"
                    className="h-4 w-auto"
                  />
                </span>
                {/* Mastercard */}
                <span title="Mastercard" className="flex h-9 w-14 items-center justify-center rounded-md bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/mastercard.svg"
                    alt="Mastercard"
                    className="h-6 w-auto"
                  />
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
