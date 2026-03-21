import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Bed,
  Bath,
  Wifi,
  Tv,
  UtensilsCrossed,
  TreePine,
  Accessibility,
  Users,
  ShowerHead,
  Check,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.kamers");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const ROOM_IMAGES = [
  { src: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-7.jpg", alt: "Slaapkamer Orvelter Hof" },
  { src: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-12.jpg", alt: "Slaapkamer met boxspring bedden" },
  { src: "/images/badkamer-groepsaccommodatie-drenthe-orvelter-hof-7.jpg", alt: "Badkamer met eigen douche" },
  { src: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-14.jpg", alt: "Luxe tweepersoonskamer" },
];

const FACILITY_IMAGES = [
  { src: "/images/bar-groepsaccommodatie-drenthe-orvelter-hof.jpg", alt: "Bar Orvelter Hof" },
  { src: "/images/keuken-groepsaccommodatie-drenthe-orvelter-hof-4.jpg", alt: "Professionele keuken" },
  { src: "/images/terras-groepsaccommodatie-drenthe-orvelter-hof-8.jpg", alt: "Terras op het zuiden" },
  { src: "/images/speelzolder-groepsaccommodatie-drenthe-orvelter-hof.jpg", alt: "Speelzolder" },
];

export default async function KamersPage() {
  const t = await getTranslations("kamers");

  const STATS = [
    { value: t("statPersonenValue"), label: t("statPersonen"), icon: Users },
    { value: t("statSlaapkamersValue"), label: t("statSlaapkamers"), icon: Bed },
    { value: t("statBadkamersValue"), label: t("statBadkamers"), icon: Bath },
  ];

  const FACILITIES = [
    { icon: Wifi, text: t("facility1") },
    { icon: Bed, text: t("facility2") },
    { icon: ShowerHead, text: t("facility3") },
    { icon: Tv, text: t("facility4") },
    { icon: UtensilsCrossed, text: t("facility5") },
    { icon: TreePine, text: t("facility6") },
  ];

  const roomFeatures = [
    t("roomFeature1"),
    t("roomFeature2"),
    t("roomFeature3"),
    t("roomFeature4"),
    t("roomFeature5"),
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
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

        {/* Stats */}
        <section className="bg-[#fbf8f6] py-12">
          <div className="mx-auto max-w-3xl px-6">
            <div className="grid grid-cols-3 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
                    <stat.icon size={22} className="text-terracotta" />
                  </span>
                  <p className="font-[family-name:var(--font-playfair)] text-3xl text-[#4a524f]">
                    {stat.value}
                  </p>
                  <p className="font-[family-name:var(--font-lato)] text-xs font-medium uppercase tracking-wider text-[#6b6b63]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kamers */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-terracotta">
                  {t("roomsTagline")}
                </p>
                <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
                  {t("roomsTitle")}
                </h2>
                <p className="mb-6 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                  {t("roomsText")}
                </p>
                <ul className="space-y-3">
                  {roomFeatures.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 font-[family-name:var(--font-lato)] text-sm text-[#6b6b63]"
                    >
                      <Check size={14} className="mt-0.5 shrink-0 text-[#5a9a5a]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image grid */}
              <div className="grid grid-cols-2 gap-3">
                {ROOM_IMAGES.map((img) => (
                  <div
                    key={img.src}
                    className="aspect-[4/3] overflow-hidden rounded-xl shadow-md"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={600}
                      height={450}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Faciliteiten */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-terracotta">
                {t("facilitiesTagline")}
              </p>
              <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
                {t("facilitiesTitle")}
              </h2>
            </div>

            <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FACILITIES.map((fac) => (
                <div
                  key={fac.text}
                  className="flex items-start gap-4 rounded-2xl border border-[#ede6d8] bg-white p-6 shadow-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta/10">
                    <fac.icon size={18} className="text-terracotta" />
                  </span>
                  <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                    {fac.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Facility images */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {FACILITY_IMAGES.map((img) => (
                <div
                  key={img.src}
                  className="aspect-[4/3] overflow-hidden rounded-xl shadow-md"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={600}
                    height={450}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Extra info */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-[#ede6d8] bg-[#fbf8f6] p-8 text-center">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
                  <Accessibility size={22} className="text-terracotta" />
                </span>
                <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                  {t("accessibilityTitle")}
                </h3>
                <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                  {t("accessibilityText")}
                </p>
              </div>

              <div className="rounded-2xl border border-[#ede6d8] bg-[#fbf8f6] p-8 text-center">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
                  <Users size={22} className="text-terracotta" />
                </span>
                <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                  {t("playroomTitle")}
                </h3>
                <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                  {t("playroomText")}
                </p>
              </div>

              <div className="rounded-2xl border border-[#ede6d8] bg-[#fbf8f6] p-8 text-center">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
                  <TreePine size={22} className="text-terracotta" />
                </span>
                <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                  {t("playgroundTitle")}
                </h3>
                <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                  {t("playgroundText")}
                </p>
              </div>
            </div>

            {/* Plattegrond link */}
            <div className="mt-10 text-center">
              <a
                href="/plattegrond"
                className="inline-flex rounded-full border border-[#ede6d8] bg-white px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-[#4a524f] shadow-sm transition-all hover:border-olive hover:bg-olive/5"
              >
                {t("viewFloorplan")}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
