import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingTabs from "./PricingTabs";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.tarieven");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PrijzenPage() {
  const t = await getTranslations("tarieven");

  const exclusiveItems = [
    [t("exclusiveEindschoonmaak"), t("exclusiveEindschoonmaakPrice")],
    [t("exclusiveBedlinnen"), t("exclusiveBedlinnenPrice")],
    [t("exclusiveEnergie"), t("exclusiveEnergiePrice")],
    [t("exclusiveToeristenbelasting"), t("exclusiveToeristenbelastingPrice")],
    [t("exclusiveHanddoeken"), t("exclusiveHanddoekenPrice")],
    [t("exclusiveKeukenpakket"), t("exclusiveKeukenpakketPrice")],
    [t("exclusiveAnnulering"), t("exclusiveAnnuleringPrice")],
    [t("exclusiveKinderbedje"), t("exclusiveKinderbedjePrice")],
    [t("exclusiveBarbecue"), t("exclusiveBarbecuePrice")],
    [t("exclusiveBierfust"), t("exclusiveBierfustPrice")],
  ];

  const practicalInfo = [
    { label: t("aankomstWeekend"), value: t("aankomstWeekendTime") },
    { label: t("vertrekWeekend"), value: t("vertrekWeekendTime") },
    { label: t("aankomstMidweek"), value: t("aankomstMidweekTime") },
    { label: t("vertrekMidweek"), value: t("vertrekMidweekTime") },
  ];

  const goedOmTeWeten = [
    t("goedOmTeWeten1"),
    t("goedOmTeWeten2"),
    t("goedOmTeWeten3"),
    t("goedOmTeWeten4"),
    t("goedOmTeWeten5"),
    t("goedOmTeWeten6"),
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

        {/* Pricing tabs */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-5xl px-6">
            <PricingTabs />
          </div>
        </section>

        {/* Inclusief / Exclusief */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-[#ede6d8] bg-[#fbf8f6] p-8">
                <h3 className="mb-4 font-[family-name:var(--font-playfair)] text-xl text-[#4a524f]">
                  {t("inclusiveTitle")}
                </h3>
                <ul className="space-y-2 font-[family-name:var(--font-lato)] text-sm text-[#6b6b63]">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#5a625f]">&#10003;</span>
                    {t("inclusiveWifi")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#5a625f]">&#10003;</span>
                    {t("inclusiveReservation")}
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[#ede6d8] bg-[#fbf8f6] p-8">
                <h3 className="mb-4 font-[family-name:var(--font-playfair)] text-xl text-[#4a524f]">
                  {t("exclusiveTitle")}
                </h3>
                <ul className="space-y-2 font-[family-name:var(--font-lato)] text-sm text-[#6b6b63]">
                  {exclusiveItems.map(([label, price]) => (
                    <li key={label} className="flex items-center justify-between gap-4">
                      <span>{label}</span>
                      <span className="whitespace-nowrap font-bold text-[#3a3a35]">
                        {price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Borgsom */}
            <div className="mt-8 rounded-2xl border border-[#ede6d8] bg-[#fbf8f6] p-8">
              <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-xl text-[#4a524f]">
                {t("borgsomTitle")}
              </h3>
              <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                <span className="font-bold text-[#3a3a35]">{t("borgsomAmount")}</span> — {t("borgsomText")}
              </p>
            </div>
          </div>
        </section>

        {/* Praktische informatie */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-8 text-center font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
              {t("praktischeInfoTitle")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {practicalInfo.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#ede6d8] bg-white p-6 text-center shadow-sm"
                >
                  <p className="mb-1 font-[family-name:var(--font-lato)] text-xs font-bold uppercase tracking-wider text-[#6b6b63]">
                    {item.label}
                  </p>
                  <p className="font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-[#ede6d8] p-8">
              <h3 className="mb-4 font-[family-name:var(--font-playfair)] text-xl text-[#4a524f]">
                {t("goedOmTeWetenTitle")}
              </h3>
              <ul className="grid gap-3 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63] md:grid-cols-2">
                {goedOmTeWeten.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-[#b8704b]">&bull;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
