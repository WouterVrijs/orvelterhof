import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Coffee, Croissant, Egg, Apple, Milk, Sun } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.ontbijtbuffet");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LuxeOntbijtbuffetPage() {
  const t = await getTranslations("ontbijtbuffet");

  const HIGHLIGHTS = [
    {
      icon: Croissant,
      title: t("highlightBroodTitle"),
      text: t("highlightBroodText"),
    },
    {
      icon: Egg,
      title: t("highlightWarmTitle"),
      text: t("highlightWarmText"),
    },
    {
      icon: Apple,
      title: t("highlightFruitTitle"),
      text: t("highlightFruitText"),
    },
    {
      icon: Milk,
      title: t("highlightZuivelTitle"),
      text: t("highlightZuivelText"),
    },
    {
      icon: Coffee,
      title: t("highlightKoffieTitle"),
      text: t("highlightKoffieText"),
    },
    {
      icon: Sun,
      title: t("highlightVerzorgdTitle"),
      text: t("highlightVerzorgdText"),
    },
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

        {/* Intro */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
                  {t("introTitle")}
                </h2>
                <p className="mb-4 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                  {t("introText1")}
                </p>
                <p className="mb-8 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                  {t("introText2")}
                </p>
                <div className="inline-flex items-baseline gap-2 rounded-2xl border border-[#ede6d8] bg-white px-8 py-5 shadow-sm">
                  <span className="font-[family-name:var(--font-playfair)] text-3xl text-[#4a524f]">
                    {t("priceAmount")}
                  </span>
                  <span className="font-[family-name:var(--font-lato)] text-sm text-[#6b6b63]">
                    {t("priceUnit")}
                  </span>
                </div>
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/keuken-groepsaccommodatie-orvelter-hof.jpg"
                  alt="Keuken Orvelter Hof"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-10 text-center font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
              {t("highlightsTitle")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#ede6d8] bg-[#fbf8f6] p-6"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10">
                    <item.icon size={20} className="text-terracotta" />
                  </span>
                  <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-base text-[#4a524f]">
                    {item.title}
                  </h3>
                  <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
              {t("ctaTitle")}
            </h2>
            <p className="mb-8 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
              {t("ctaText")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/boeken"
                className="rounded-full bg-terracotta px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
              >
                {t("ctaBoek")}
              </a>
              <a
                href="/contact"
                className="rounded-full border border-[#ede6d8] bg-white px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-[#4a524f] shadow-sm transition-all hover:border-olive hover:bg-olive/5"
              >
                {t("ctaContact")}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
