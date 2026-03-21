import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Users,
  Target,
  TreePine,
  Lightbulb,
  Utensils,
  Check,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.teambuilding");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TeambuildingPage() {
  const t = await getTranslations("teambuilding");

  const USPS = [
    { icon: Users, title: t("uspPersonenTitle"), text: t("uspPersonenText") },
    { icon: Target, title: t("uspOpMaatTitle"), text: t("uspOpMaatText") },
    { icon: TreePine, title: t("uspNatuurTitle"), text: t("uspNatuurText") },
    { icon: Lightbulb, title: t("uspUitgerustTitle"), text: t("uspUitgerustText") },
    { icon: Utensils, title: t("uspCateringTitle"), text: t("uspCateringText") },
  ];

  const PROGRAMS = [
    {
      title: t("programTeambuildingTitle"),
      text: t("programTeambuildingText"),
      items: [
        t("programTeambuildingItem1"),
        t("programTeambuildingItem2"),
        t("programTeambuildingItem3"),
        t("programTeambuildingItem4"),
        t("programTeambuildingItem5"),
        t("programTeambuildingItem6"),
      ],
    },
    {
      title: t("programTrainingenTitle"),
      text: t("programTrainingenText"),
      items: [
        t("programTrainingenItem1"),
        t("programTrainingenItem2"),
        t("programTrainingenItem3"),
        t("programTrainingenItem4"),
        t("programTrainingenItem5"),
        t("programTrainingenItem6"),
      ],
    },
    {
      title: t("programHeisessiesTitle"),
      text: t("programHeisessiesText"),
      items: [
        t("programHeisessiesItem1"),
        t("programHeisessiesItem2"),
        t("programHeisessiesItem3"),
        t("programHeisessiesItem4"),
        t("programHeisessiesItem5"),
        t("programHeisessiesItem6"),
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
                href="#programmas"
                className="rounded-full border border-white/30 px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-white transition-all hover:border-white/60 hover:bg-white/10"
              >
                {t("ctaMogelijkheden")}
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

        {/* Intro + image */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-terracotta">
                  {t("introTagline")}
                </p>
                <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-[2.25rem] text-[#4a524f] md:text-[2.75rem]">
                  {t("introTitle")}
                </h2>
                <p className="mb-4 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                  {t("introText1")}
                </p>
                <p className="mb-8 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                  {t("introText2")}
                </p>
                <a
                  href="/contact"
                  className="inline-flex rounded-full bg-[#6b6b63] px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-[#545959] hover:shadow-lg active:scale-[0.98]"
                >
                  {t("introCtaContact")}
                </a>
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/teambuilding.jpg"
                  alt="Teambuilding bij Orvelter Hof in Drenthe"
                  width={1024}
                  height={683}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Program cards */}
            <div id="programmas" className="grid gap-6 md:grid-cols-3">
              {PROGRAMS.map((program) => (
                <div
                  key={program.title}
                  className="rounded-2xl border border-[#ede6d8] bg-[#fbf8f6] p-8"
                >
                  <h3 className="mb-3 font-[family-name:var(--font-playfair)] text-[1.313rem] text-[#4a524f]">
                    {program.title}
                  </h3>
                  <p className="mb-5 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                    {program.text}
                  </p>
                  <hr className="mb-5 border-[#ede6d8]" />
                  <ul className="space-y-2">
                    {program.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 font-[family-name:var(--font-lato)] text-sm text-[#6b6b63]"
                      >
                        <Check size={14} className="mt-0.5 shrink-0 text-terracotta" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

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
