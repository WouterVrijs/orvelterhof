import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageSlider from "@/components/ImageSlider";
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
        {/* Hero — full-width background image */}
        <section className="relative flex min-h-[50vh] flex-col items-center justify-center md:min-h-[60vh]">
          <Image
            src="/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof.jpg"
            alt="Kamers Orvelter Hof"
            fill
            className="object-cover"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-black/50" />
          <div className="relative z-10 px-6 text-center">
            <p className="mb-3 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.25em] text-white/70">
              {t("heroTagline")}
            </p>
            <div className="mx-auto mb-4 h-px w-10 bg-white/40" />
            <h1 className="mb-4 font-[family-name:var(--font-playfair)] text-[2.5rem] text-white md:text-[3.5rem] lg:text-[4rem]">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto max-w-xl font-[family-name:var(--font-lato)] text-[1rem] font-light leading-relaxed text-white/80">
              {t("heroSubtitle")}
            </p>
          </div>

          {/* Page navbar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/60 to-transparent">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
              <nav className="flex gap-8">
                {[
                  { label: t("navKamers"), href: "#kamers" },
                  { label: t("navExtra"), href: "#extra" },
                  { label: t("navPlattegrond"), href: "#plattegrond" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="hidden font-[family-name:var(--font-lato)] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white sm:block"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <a
                href="/boeken"
                className="font-[family-name:var(--font-lato)] text-white"
              >
                <span className="font-[family-name:var(--font-playfair)] text-3xl">36</span>
                <span className="ml-1 text-[0.7rem] uppercase tracking-wider text-white/70">/ {t("statPersonen")}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Kamers — description + gallery */}
        <section id="kamers" className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Image slider */}
              <ImageSlider images={ROOM_IMAGES} />

              {/* Text content */}
              <div>
                <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-terracotta">
                  {t("roomsTagline")}
                </p>
                <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-[1.75rem] text-[#4a524f] md:text-[2.25rem]">
                  {t("roomsTitle")}
                </h2>
                <p className="mb-8 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                  {t("roomsText")}
                </p>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  {[
                    { icon: Users, label: t("roomFeature1Short") },
                    { icon: Bed, label: t("roomFeature2Short") },
                    { icon: ShowerHead, label: t("roomFeature3Short") },
                    { icon: Accessibility, label: t("roomFeature4Short") },
                  ].map((usp) => (
                    <div key={usp.label} className="flex flex-col items-center text-center">
                      <usp.icon size={36} strokeWidth={1} className="mb-2 text-[#b0ada8]" />
                      <p className="font-[family-name:var(--font-lato)] text-[0.7rem] font-medium uppercase tracking-wider text-[#6b6b63]">
                        {usp.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Extra info */}
        <section id="extra" className="bg-white py-16 md:py-20">
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
            <div id="plattegrond" className="mt-10 text-center">
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
