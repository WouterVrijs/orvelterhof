import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BukazuWidget from "@/components/BukazuWidget";

import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("meta.zoekEnBoek");
  return { title: t("title"), description: t("description") };
}

export default async function ZoekEnBoekPage() {
  const t = await getTranslations("zoekEnBoek");

  return (
    <>
      <Header />
      <main>
        {/* Hero banner */}
        <section className="bg-[#545959] pb-16 pt-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="mb-3 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-terracotta-light">
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

        {/* Bukazu booking widget */}
        <section className="bg-warm-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <BukazuWidget />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
