import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Utensils, Beer, Flame, ChefHat } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.buffettenCatering");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BuffettenCateringPage() {
  const t = await getTranslations("buffettenCatering");

  const BUFFETS = [
    { name: t("buffetOostersName"), description: t("buffetOostersDesc") },
    { name: t("buffetStamppotName"), description: t("buffetStamppotDesc") },
    { name: t("buffetItaliaansName"), description: t("buffetItaliaansDesc") },
    { name: t("buffetBbqName"), description: t("buffetBbqDesc") },
    { name: t("buffetThuisName"), description: t("buffetThuisDesc") },
    { name: t("buffetThuisLuxeName"), description: t("buffetThuisLuxeDesc") },
    { name: t("buffetArabischName"), description: t("buffetArabischDesc") },
    { name: t("buffetIndonesischName"), description: t("buffetIndonesischDesc") },
  ];

  const BIEREN = [
    { naam: t("bierHeineken20"), formaat: t("bierHeineken20Formaat"), prijs: t("bierHeineken20Prijs") },
    { naam: t("bierMoretti"), formaat: t("bierMorettiFormaat"), prijs: t("bierMorettiPrijs") },
    { naam: t("bierHeineken8"), formaat: t("bierHeineken8Formaat"), prijs: t("bierHeineken8Prijs") },
    { naam: t("bierAffligem"), formaat: t("bierAffligemFormaat"), prijs: t("bierAffligemPrijs") },
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
                <p className="mb-6 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                  {t("introText2")}
                </p>
                <a
                  href="/contact"
                  className="inline-flex rounded-full bg-terracotta px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
                >
                  {t("introCtaContact")}
                </a>
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/barbecue-schotels-catering-buffetten-drenthe-orvelter-hof-3.jpg"
                  alt="Catering bij Orvelter Hof"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Buffetten */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-terracotta">
                {t("aanbodTagline")}
              </p>
              <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
                {t("aanbodTitle")}
              </h2>
              <p className="mx-auto max-w-2xl font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                {t("aanbodSubtitle")}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {BUFFETS.map((buffet) => (
                <div
                  key={buffet.name}
                  className="rounded-2xl border border-[#ede6d8] bg-[#fbf8f6] p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta/10">
                      <Utensils size={18} className="text-terracotta" />
                    </span>
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                      {buffet.name}
                    </h3>
                  </div>
                  <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                    {buffet.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ontbijt + BBQ + Bieren */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Ontbijt */}
              <div className="rounded-2xl border border-[#ede6d8] bg-white p-8 shadow-sm">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
                  <ChefHat size={22} className="text-terracotta" />
                </span>
                <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                  {t("ontbijtTitle")}
                </h3>
                <p className="mb-4 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                  {t("ontbijtText")}
                </p>
                <p className="font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f]">
                  {t("ontbijtPrice")}
                  <span className="font-[family-name:var(--font-lato)] text-sm font-normal text-[#6b6b63]">
                    {" "}{t("ontbijtUnit")}
                  </span>
                </p>
              </div>

              {/* BBQ */}
              <div className="rounded-2xl border border-[#ede6d8] bg-white p-8 shadow-sm">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
                  <Flame size={22} className="text-terracotta" />
                </span>
                <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                  {t("bbqTitle")}
                </h3>
                <p className="mb-4 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                  {t("bbqText")}
                </p>
                <p className="font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f]">
                  {t("bbqPrice")}
                </p>
              </div>

              {/* Bieren */}
              <div className="rounded-2xl border border-[#ede6d8] bg-white p-8 shadow-sm">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
                  <Beer size={22} className="text-terracotta" />
                </span>
                <h3 className="mb-3 font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                  {t("bierenTitle")}
                </h3>
                <ul className="space-y-2">
                  {BIEREN.map((bier) => (
                    <li
                      key={bier.naam}
                      className="flex items-center justify-between gap-2 font-[family-name:var(--font-lato)] text-sm text-[#6b6b63]"
                    >
                      <span>
                        {bier.naam}{" "}
                        <span className="text-xs">({bier.formaat})</span>
                      </span>
                      <span className="whitespace-nowrap font-bold text-[#3a3a35]">
                        &euro; {bier.prijs}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Kookworkshop CTA */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
              {t("kookworkshopTitle")}
            </h2>
            <p className="mb-8 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
              {t("kookworkshopText")}
            </p>
            <a
              href="/contact"
              className="inline-flex rounded-full bg-terracotta px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
            >
              {t("kookworkshopCta")}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
