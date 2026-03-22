import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageSlider from "@/components/ImageSlider";
import {
  Wifi,
  Tv,
  UtensilsCrossed,
  TreePine,
  Sofa,
  Car,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.faciliteiten");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const INDOOR_IMAGES = [
  { src: "/images/bar-groepsaccommodatie-drenthe-orvelter-hof-1.jpg", alt: "Woonkamer Orvelter Hof" },
  { src: "/images/keuken-groepsaccommodatie-drenthe-orvelter-hof-4.jpg", alt: "Professionele keuken" },
  { src: "/images/bar-groepsaccommodatie-drenthe-orvelter-hof.jpg", alt: "Bar Orvelter Hof" },
  { src: "/images/speelzolder-groepsaccommodatie-drenthe-orvelter-hof.jpg", alt: "Speelzolder" },
];

const OUTDOOR_IMAGES = [
  { src: "/images/terras-groepsaccommodatie-drenthe-orvelter-hof-8.jpg", alt: "Terras op het zuiden" },
  { src: "/images/terras-groepsaccommodatie-drenthe-orvelter-hof-11.jpg", alt: "Terras Orvelter Hof" },
  { src: "/images/speeltuin-groepsaccommodatie-drenthe-orvelter-hof.jpg", alt: "Speeltuin" },
  { src: "/images/groepsaccommodatie-drenthe-orvelter-hof-17.jpg", alt: "Buitenruimte Orvelter Hof" },
];

export default async function FaciliteitenPage() {
  const t = await getTranslations("faciliteiten");

  return (
    <>
      <Header />
      <main>
        {/* Hero — full-width background image */}
        <section className="relative flex min-h-[50vh] flex-col items-center justify-center md:min-h-[60vh]">
          <Image
            src="/images/keuken-groepsaccommodatie-orvelter-hof.jpg"
            alt="Faciliteiten Orvelter Hof"
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
                  { label: t("navOverzicht"), href: "#overzicht" },
                  { label: t("navBinnen"), href: "#binnen" },
                  { label: t("navBuiten"), href: "#buiten" },
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
            </div>
          </div>
        </section>

        {/* Overzicht — description + USP icons */}
        <section id="overzicht" className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-terracotta">
                {t("overviewTagline")}
              </p>
              <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-[1.75rem] text-[#4a524f] md:text-[2.25rem]">
                {t("overviewTitle")}
              </h2>
              <p className="mx-auto max-w-2xl font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                {t("overviewText")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { icon: UtensilsCrossed, label: t("overviewUsp1") },
                { icon: Sofa, label: t("overviewUsp2") },
                { icon: TreePine, label: t("overviewUsp3") },
                { icon: Wifi, label: t("overviewUsp4") },
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
        </section>

        {/* Binnenruimtes — slider + text */}
        <section id="binnen" className="bg-[#fbf8f6] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
              <ImageSlider images={INDOOR_IMAGES} />

              <div>
                <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-terracotta">
                  {t("binnenTagline")}
                </p>
                <h2 className="mb-8 font-[family-name:var(--font-playfair)] text-[1.75rem] text-[#4a524f] md:text-[2.25rem]">
                  {t("binnenTitle")}
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: Tv, title: t("binnenItem1Title"), text: t("binnenItem1Text") },
                    { icon: UtensilsCrossed, title: t("binnenItem2Title"), text: t("binnenItem2Text") },
                    { icon: Sofa, title: t("binnenItem3Title"), text: t("binnenItem3Text") },
                    { icon: TreePine, title: t("binnenItem4Title"), text: t("binnenItem4Text") },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta/10">
                        <item.icon size={18} className="text-terracotta" />
                      </span>
                      <div>
                        <h4 className="mb-1 font-[family-name:var(--font-playfair)] text-base text-[#4a524f]">
                          {item.title}
                        </h4>
                        <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buitenruimtes — text + slider (reversed) */}
        <section id="buiten" className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1">
                <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-terracotta">
                  {t("buitenTagline")}
                </p>
                <h2 className="mb-8 font-[family-name:var(--font-playfair)] text-[1.75rem] text-[#4a524f] md:text-[2.25rem]">
                  {t("buitenTitle")}
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: TreePine, title: t("buitenItem1Title"), text: t("buitenItem1Text") },
                    { icon: TreePine, title: t("buitenItem2Title"), text: t("buitenItem2Text") },
                    { icon: Car, title: t("buitenItem3Title"), text: t("buitenItem3Text") },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta/10">
                        <item.icon size={18} className="text-terracotta" />
                      </span>
                      <div>
                        <h4 className="mb-1 font-[family-name:var(--font-playfair)] text-base text-[#4a524f]">
                          {item.title}
                        </h4>
                        <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <ImageSlider images={OUTDOOR_IMAGES} />
              </div>
            </div>
          </div>
        </section>

        {/* Plattegrond link */}
        <section id="plattegrond" className="bg-[#fbf8f6] py-16">
          <div className="text-center">
            <a
              href="/plattegrond"
              className="inline-flex rounded-full border border-[#ede6d8] bg-white px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-[#4a524f] shadow-sm transition-all hover:border-olive hover:bg-olive/5"
            >
              {t("viewFloorplan")}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
