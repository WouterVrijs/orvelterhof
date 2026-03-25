"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function usePackages() {
  const t = useTranslations("packages");
  return [
    {
      name: t("pkg1Name"),
      desc: t("pkg1Desc"),
      price: "45,50",
      prefix: "",
      icon: "clock" as const,
      features: [t("feat_zaalhuur1"), t("feat_koffie"), t("feat_cake"), t("feat_koekjes"), t("feat_flipover"), t("feat_beamer"), t("feat_wifi")],
      surcharges: null,
    },
    {
      name: t("pkg2Name"),
      desc: t("pkg2Desc"),
      price: "59,50",
      prefix: "",
      icon: "calendar" as const,
      features: [t("feat_zaalhuur1"), t("feat_koffie"), t("feat_cake"), t("feat_koekjes"), t("feat_flipover"), t("feat_beamer"), t("feat_wifi"), t("feat_lunch")],
      surcharges: null,
    },
    {
      name: t("pkg3Name"),
      desc: t("pkg3Desc"),
      price: "88,50",
      prefix: "",
      icon: "calendar" as const,
      features: [t("feat_zaalhuur1"), t("feat_koffie"), t("feat_cake"), t("feat_koekjes"), t("feat_flipover"), t("feat_beamer"), t("feat_wifi"), t("feat_lunch")],
      surcharges: null,
    },
    {
      name: t("pkg4Name"),
      desc: t("pkg4Desc"),
      price: "119,50",
      prefix: "",
      icon: "clock" as const,
      features: [t("feat_zaalhuur3"), t("feat_koffie"), t("feat_cake"), t("feat_koekjes"), t("feat_flipover"), t("feat_beamer"), t("feat_wifi"), t("feat_lunch"), t("feat_diner")],
      surcharges: null,
    },
    {
      name: t("pkg5Name"),
      desc: t("pkg5Desc"),
      price: "179,50",
      prefix: t("fromPrefix"),
      icon: "clock" as const,
      features: [t("feat_24combo")],
      surcharges: [t("surcharge_single"), t("surcharge_tax")],
    },
    {
      name: t("pkg6Name"),
      desc: t("pkg6Desc"),
      price: "219,50",
      prefix: t("fromPrefix"),
      icon: "clock" as const,
      features: [t("feat_32combo")],
      surcharges: [t("surcharge_single"), t("surcharge_tax")],
    },
  ];
}

type Package = {
  name: string;
  desc: string;
  price: string;
  prefix: string;
  icon: "clock" | "calendar";
  features: string[];
  surcharges: string[] | null;
};

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-olive-light">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-olive-light">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-olive-light">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8l4 4-4 4M8 12h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  const t = useTranslations("packages");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col rounded-2xl border border-cream-dark bg-warm-white p-7 transition-shadow hover:shadow-lg">
      {/* Top row: icon + toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream">
          {pkg.icon === "clock" ? <ClockIcon /> : <CalendarIcon />}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-cream transition-colors hover:bg-cream-dark"
          aria-label={open ? t("hideDetails") : t("showDetails")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`h-5 w-5 text-olive-light transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Name & description */}
      <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-[1.313rem] text-olive-dark">
        {pkg.name}
      </h3>
      <p className="mb-5 flex-1 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-text-muted">
        {pkg.desc}
      </p>

      {/* Price */}
      <div>
        {pkg.prefix ? (
          <p className="font-[family-name:var(--font-playfair)] text-xl text-olive-dark">
            {pkg.prefix}
            {pkg.price}
          </p>
        ) : (
          <p className="font-[family-name:var(--font-playfair)] text-xl text-olive-dark">
            &euro;{pkg.price}
          </p>
        )}
        <p className="mt-1 font-[family-name:var(--font-lato)] text-sm text-text-muted">
          {t("perPerson")}
        </p>
      </div>

      {/* Expandable details */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pt-6">
            <hr className="mb-5 border-cream-dark" />
            <ul className="space-y-2">
              {pkg.features.map((f) => (
                <li
                  key={f}
                  className="font-[family-name:var(--font-lato)] text-sm text-text-muted"
                >
                  <span className="mr-2 text-text-muted/50">&bull;</span>
                  {f}
                </li>
              ))}
            </ul>

            {pkg.surcharges && (
              <div className="mt-5 rounded-lg bg-cream px-4 py-3">
                <p className="mb-1 font-[family-name:var(--font-lato)] text-sm font-medium text-text-dark">
                  {t("surcharges")}
                </p>
                {pkg.surcharges.map((s) => (
                  <p
                    key={s}
                    className="font-[family-name:var(--font-lato)] text-sm text-text-muted"
                  >
                    {s}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA — always at bottom */}
      <a
        href="#contact"
        className="mt-8 flex items-center justify-between rounded-full border border-cream-dark px-6 py-3 font-[family-name:var(--font-lato)] text-sm font-medium text-olive-dark transition-colors hover:bg-cream"
      >
        {t("bookArrangement")}
        <ArrowRight />
      </a>
    </div>
  );
}

export default function BusinessPackages() {
  const t = useTranslations("packages");
  const packages = usePackages();

  return (
    <section id="zakelijk" className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 font-[family-name:var(--font-lato)] text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
            {t("tagline")}
          </p>
          <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-xl text-olive-dark md:text-[3.813rem]">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl font-[family-name:var(--font-lato)] text-[1rem] leading-relaxed text-text-muted">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/zoek-en-boek"
            className="inline-block rounded-full bg-terracotta px-8 py-4 font-[family-name:var(--font-lato)] text-[1rem] font-bold text-white transition-colors hover:bg-terracotta-dark"
          >
            {t("requestQuote")}
          </a>
        </div>
      </div>
    </section>
  );
}
