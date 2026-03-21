import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusinessPackages from "@/components/BusinessPackages";
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

  const USPS = [
    { icon: MapPin, title: t("uspBereikbaarTitle"), text: t("uspBereikbaarText") },
    { icon: TreePine, title: t("uspRustigTitle"), text: t("uspRustigText") },
    { icon: Lock, title: t("uspExclusiefTitle"), text: t("uspExclusiefText") },
    { icon: Car, title: t("uspParkerenTitle"), text: t("uspParkerenText") },
    { icon: Heart, title: t("uspServiceTitle"), text: t("uspServiceText") },
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
        {/* Hero */}
        <section className="relative bg-[#545959] pb-20 pt-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="mb-3 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[#c8835e]">
              {t("heroTagline")}
            </p>
            <h1 className="mb-4 font-[family-name:var(--font-playfair)] text-[2.25rem] text-white md:text-[3.813rem]">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl font-[family-name:var(--font-lato)] text-[1rem] font-light leading-relaxed text-white/80">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="rounded-full bg-terracotta px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
              >
                {t("ctaOfferte")}
              </a>
              <a
                href="#arrangementen"
                className="rounded-full border border-white/30 px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-white transition-all hover:border-white/60 hover:bg-white/10"
              >
                {t("ctaArrangementen")}
              </a>
            </div>
          </div>
        </section>

        {/* USPs */}
        <section className="bg-[#fbf8f6] py-14">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {USPS.map((usp) => (
                <div key={usp.title} className="text-center">
                  <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
                    <usp.icon size={22} className="text-terracotta" />
                  </span>
                  <h3 className="mb-1 font-[family-name:var(--font-playfair)] text-base text-[#4a524f]">
                    {usp.title}
                  </h3>
                  <p className="font-[family-name:var(--font-lato)] text-xs leading-relaxed text-[#6b6b63]">
                    {usp.text}
                  </p>
                </div>
              ))}
            </div>
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
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/vergaderlocatie-drenthe-orvelter-hof-15.jpg"
                  alt="Vergaderlocatie Orvelter Hof — zakelijke bijeenkomst"
                  width={1024}
                  height={683}
                  className="h-full w-full object-cover"
                />
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
