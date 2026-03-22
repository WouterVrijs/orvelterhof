import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusinessPackages from "@/components/BusinessPackages";
import { HeroSearchBar } from "@/components/HeroSearchBar";
import { fetchCalendarData } from "@/lib/api/calendarService";
import { addMonths, todayISO } from "@/components/booking/dateUtils";
import {
  MapPin,
  TreePine,
  Lock,
  Car,
  Heart,
  Monitor,
  Bed,
  Wind,
  Check,
  SlidersHorizontal,
  Zap,
  UtensilsCrossed,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.vergaderlocatie");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function VergaderlocatiePage() {
  const t = await getTranslations("vergaderlocatie");

  // Fetch availability data for the search bar calendar
  const calendarData = await fetchCalendarData(todayISO(), addMonths(new Date(), 12));
  const unavailableDates = calendarData
    ?.filter((day) => day.status === "booked")
    .map((day) => day.date) ?? [];

  const USPS = [
    { icon: MapPin, text: t("uspBereikbaarText") },
    { icon: TreePine, text: t("uspRustigText") },
    { icon: Lock, text: t("uspExclusiefText") },
    { icon: Car, text: t("uspParkerenText") },
    { icon: Heart, text: t("uspServiceText") },
  ];

  const STATS = [
    { value: "17", label: t("statKamers") },
    { value: "30", label: t("statPersonen") },
    { value: "6", label: t("statArrangementen") },
    { value: "100%", label: t("statExclusief") },
  ];

  const FEATURES = [
    {
      title: t("featureVergaderenTitle"),
      icon: Monitor,
      text: t("featureVergaderenText"),
      items: [
        t("featureVergaderenItem1"),
        t("featureVergaderenItem2"),
        t("featureVergaderenItem3"),
        t("featureVergaderenItem4"),
        t("featureVergaderenItem5"),
        t("featureVergaderenItem6"),
      ],
    },
    {
      title: t("featureOvernachtenTitle"),
      icon: Bed,
      text: t("featureOvernachtenText"),
      items: [
        t("featureOvernachtenItem1"),
        t("featureOvernachtenItem2"),
        t("featureOvernachtenItem3"),
        t("featureOvernachtenItem4"),
        t("featureOvernachtenItem5"),
        t("featureOvernachtenItem6"),
      ],
    },
    {
      title: t("featureFocusTitle"),
      icon: Wind,
      text: t("featureFocusText"),
      items: [
        t("featureFocusItem1"),
        t("featureFocusItem2"),
        t("featureFocusItem3"),
        t("featureFocusItem4"),
        t("featureFocusItem5"),
        t("featureFocusItem6"),
      ],
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero — full-screen with background image */}
        <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-visible md:min-h-screen">
          {/* Background image */}
          <Image
            src="/images/vergaderlocatie-drenthe-orvelter-hof-11-1024x683.jpg"
            alt="Vergaderlocatie Orvelter Hof"
            fill
            className="object-cover"
            priority
          />

          {/* Dark overlay */}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-black/40" />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <p className="mb-4 font-[family-name:var(--font-lato)] text-[0.7rem] font-bold uppercase tracking-[0.3em] text-white/80">
              {t("heroTagline")}
            </p>
            <div className="mx-auto mb-6 h-px w-10 bg-white/50" />
            <h1 className="mb-6 font-[family-name:var(--font-playfair)] text-[2.5rem] uppercase leading-[1.1] tracking-wide text-white md:text-[3.5rem] lg:text-[4.5rem]">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto mb-10 max-w-2xl font-[family-name:var(--font-lato)] text-[1rem] font-light leading-relaxed text-white/80">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#arrangementen"
                className="border border-white/60 px-8 py-3 font-[family-name:var(--font-lato)] text-[0.7rem] font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-white hover:text-[#3a3a35]"
              >
                {t("ctaArrangementen")}
              </a>
            </div>
          </div>

          {/* Search bar — bottom */}
          <div className="absolute bottom-12 left-0 right-0 z-10 flex justify-center px-4">
            <HeroSearchBar unavailableDates={unavailableDates} mode="zakelijk" />
          </div>
        </section>

        {/* USPs */}
        <section className="bg-[#2a2a25]">
          <div className="mx-auto flex max-w-7xl overflow-x-auto">
            {USPS.map((usp) => (
              <div
                key={usp.text}
                className="flex min-w-[200px] flex-1 items-center gap-4 px-5 py-5"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <usp.icon size={18} className="text-terracotta" />
                </span>
                <p className="font-[family-name:var(--font-lato)] text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/60">
                  {usp.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Zakelijk verblijf + features */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            {/* Intro + foto */}
            <div className="mb-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-terracotta">
                  {t("introTagline")}
                </p>
                <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-[2.25rem] text-[#4a524f] md:text-[2.75rem]">
                  {t("introTitle")}
                </h2>
                <p className="mb-8 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                  {t("introText")}
                </p>
                <a
                  href="/contact"
                  className="inline-flex rounded-full bg-[#6b6b63] px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-[#545959] hover:shadow-lg active:scale-[0.98]"
                >
                  {t("introCtaOfferte")}
                </a>
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/vergaderlocatie-drenthe-orvelter-hof-15.jpg"
                  alt="Vergaderlocatie Orvelter Hof — zakelijke bijeenkomst"
                  width={1024}
                  height={683}
                  className="h-full w-full object-cover"
                />
                {/* Stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-terracotta/90 backdrop-blur-sm">
                  <div className="grid grid-cols-4 divide-x divide-white/20 px-4 py-5">
                    {STATS.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white md:text-3xl">
                          {stat.value}
                        </span>
                        <p className="mt-1 font-[family-name:var(--font-lato)] text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/80">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid gap-6 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-[#ede6d8] bg-[#fbf8f6] p-8"
                >
                  <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-cream">
                    <feature.icon size={20} className="text-olive-light" />
                  </span>
                  <h3 className="mb-3 font-[family-name:var(--font-playfair)] text-[1.313rem] text-[#4a524f]">
                    {feature.title}
                  </h3>
                  <p className="mb-5 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                    {feature.text}
                  </p>
                  <hr className="mb-5 border-[#ede6d8]" />
                  <ul className="space-y-2">
                    {feature.items.map((item) => (
                      <li
                        key={item}
                        className="font-[family-name:var(--font-lato)] text-sm text-[#6b6b63]"
                      >
                        <span className="mr-2 text-[#6b6b63]/50">&bull;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vergaderen sectie */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Left — image with facilities badge */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/images/vergaderlocatie-drenthe-orvelter-hof-11-1024x683.jpg"
                    alt="Vergaderzaal Orvelter Hof"
                    width={1024}
                    height={683}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Facilities badge */}
                <div className="absolute -bottom-6 right-6 flex flex-col items-center rounded-xl bg-[#2a2a25] px-8 py-6 shadow-xl md:-right-6">
                  <Monitor size={28} className="mb-2 text-white/70" />
                  <span className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-white">
                    30
                  </span>
                  <span className="font-[family-name:var(--font-lato)] text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/60">
                    {t("statPersonen")}
                  </span>
                </div>
              </div>

              {/* Right — text content */}
              <div>
                <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-terracotta">
                  {t("featureVergaderenTitle")}
                </p>
                <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-[2.25rem] text-[#4a524f] md:text-[2.75rem]">
                  {t("vergaderenSectieTitle")}
                </h2>
                <p className="mb-8 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                  {t("vergaderenSectieText")}
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    { icon: SlidersHorizontal, title: t("vergaderenUsp1Title"), text: t("vergaderenUsp1Text") },
                    { icon: Zap, title: t("vergaderenUsp2Title"), text: t("vergaderenUsp2Text") },
                    { icon: UtensilsCrossed, title: t("vergaderenUsp3Title"), text: t("vergaderenUsp3Text") },
                    { icon: Bed, title: t("vergaderenUsp4Title"), text: t("vergaderenUsp4Text") },
                  ].map((usp) => (
                    <div key={usp.title}>
                      <usp.icon size={20} className="mb-2 text-terracotta" />
                      <h4 className="mb-1 font-[family-name:var(--font-playfair)] text-base text-[#4a524f]">
                        {usp.title}
                      </h4>
                      <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                        {usp.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Focus & ontspanning — bento grid */}
        <section className="w-full bg-white py-0">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[300px_300px]">
            {/* Text block — top-left */}
            <div className="flex flex-col justify-center bg-terracotta/20 p-8 md:p-10">
              <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-terracotta">
                {t("featureFocusTitle")}
              </p>
              <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-[1.5rem] leading-tight text-[#4a524f] md:text-[1.75rem]">
                {t("featureFocusText")}
              </h2>
            </div>

            {/* Image — Nationaal Park, tall (2 rows) */}
            <div className="relative md:row-span-2">
              <Image
                src="/images/bryan-dijkhuizen-cDt3minJLoA-unsplash-2.webp"
                alt="Fietsen door de Drentse natuur"
                width={800}
                height={600}
                className="h-56 w-full object-cover md:absolute md:inset-0 md:h-full"
              />
            </div>

            {/* Image — Fietsen, top-right wide */}
            <div className="relative col-span-2 hidden md:block">
              <Image
                src="/images/Pitch-putt.webp"
                alt="Pitch & putt in de omgeving"
                fill
                className="object-cover"
              />
            </div>

            {/* Image — Orvelter Hof omgeving */}
            <div className="relative hidden md:block">
              <Image
                src="/images/Nationaal-Park-Dwingelderveld.webp"
                alt="Nationaal Park Dwingelderveld"
                fill
                className="object-cover"
              />
            </div>

            {/* Info card */}
            <div className="flex flex-col justify-center bg-terracotta/80 p-8 md:p-10">
              <h3 className="mb-4 font-[family-name:var(--font-playfair)] text-[1.5rem] text-white">
                {t("featureFocusTitle")}
              </h3>
              <ul className="space-y-2.5">
                {[
                  t("featureFocusItem1"),
                  t("featureFocusItem2"),
                  t("featureFocusItem3"),
                  t("featureFocusItem4"),
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 font-[family-name:var(--font-lato)] text-sm text-white/90"
                  >
                    <Check size={15} className="shrink-0 text-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Image — Fietsen Drenthe */}
            <div className="relative hidden md:block">
              <Image
                src="/images/andrei-popescu-87AAW39CZoU-unsplash-scaled.jpg"
                alt="Fietsen door Drenthe"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Arrangementen — hergebruikt homepage-component */}
        <div id="arrangementen">
          <BusinessPackages />
        </div>

        {/* CTA */}
        <section className="bg-[#545959] py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-2xl text-white md:text-3xl">
              {t("ctaTitle")}
            </h2>
            <p className="mb-8 font-[family-name:var(--font-lato)] text-base leading-relaxed text-white/80">
              {t("ctaText")}
            </p>
            <a
              href="/contact"
              className="inline-flex rounded-full bg-terracotta px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
            >
              {t("ctaButton")}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
