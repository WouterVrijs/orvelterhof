import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import FaqAccordion from "./FaqAccordion";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.faq");
  return { title: t("title"), description: t("description") };
}

const CATEGORIES = ["algemeen", "boeken", "faciliteiten", "omgeving", "prijzen"] as const;

export default async function VeelgesteldeVragenPage() {
  const t = await getTranslations("faq");

  const faqs = [
    // Algemeen
    {
      category: "algemeen",
      question: t("q_algemeen_1"),
      answer: t("a_algemeen_1"),
    },
    {
      category: "algemeen",
      question: t("q_algemeen_2"),
      answer: t("a_algemeen_2"),
    },
    {
      category: "algemeen",
      question: t("q_algemeen_3"),
      answer: t("a_algemeen_3"),
    },
    {
      category: "algemeen",
      question: t("q_algemeen_4"),
      answer: t("a_algemeen_4"),
    },
    // Boeken
    {
      category: "boeken",
      question: t("q_boeken_1"),
      answer: t("a_boeken_1"),
    },
    {
      category: "boeken",
      question: t("q_boeken_2"),
      answer: t("a_boeken_2"),
    },
    {
      category: "boeken",
      question: t("q_boeken_3"),
      answer: t("a_boeken_3"),
    },
    {
      category: "boeken",
      question: t("q_boeken_4"),
      answer: t("a_boeken_4"),
    },
    // Faciliteiten
    {
      category: "faciliteiten",
      question: t("q_faciliteiten_1"),
      answer: t("a_faciliteiten_1"),
    },
    {
      category: "faciliteiten",
      question: t("q_faciliteiten_2"),
      answer: t("a_faciliteiten_2"),
    },
    {
      category: "faciliteiten",
      question: t("q_faciliteiten_3"),
      answer: t("a_faciliteiten_3"),
    },
    {
      category: "faciliteiten",
      question: t("q_faciliteiten_4"),
      answer: t("a_faciliteiten_4"),
    },
    // Omgeving
    {
      category: "omgeving",
      question: t("q_omgeving_1"),
      answer: t("a_omgeving_1"),
    },
    {
      category: "omgeving",
      question: t("q_omgeving_2"),
      answer: t("a_omgeving_2"),
    },
    {
      category: "omgeving",
      question: t("q_omgeving_3"),
      answer: t("a_omgeving_3"),
    },
    // Prijzen
    {
      category: "prijzen",
      question: t("q_prijzen_1"),
      answer: t("a_prijzen_1"),
    },
    {
      category: "prijzen",
      question: t("q_prijzen_2"),
      answer: t("a_prijzen_2"),
    },
    {
      category: "prijzen",
      question: t("q_prijzen_3"),
      answer: t("a_prijzen_3"),
    },
  ];

  const categoryLabels: Record<string, string> = {
    algemeen: t("catAlgemeen"),
    boeken: t("catBoeken"),
    faciliteiten: t("catFaciliteiten"),
    omgeving: t("catOmgeving"),
    prijzen: t("catPrijzen"),
  };

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

        {/* FAQ content */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-3xl px-6">
            {CATEGORIES.map((cat) => {
              const items = faqs.filter((f) => f.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="mb-12 last:mb-0">
                  <h2 className="mb-5 font-[family-name:var(--font-playfair)] text-xl text-[#4a524f] md:text-2xl">
                    {categoryLabels[cat]}
                  </h2>
                  <div className="space-y-3">
                    {items.map((faq) => (
                      <FaqAccordion
                        key={faq.question}
                        question={faq.question}
                        answer={faq.answer}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* CTA */}
            <div className="mt-16 rounded-2xl border border-[#ede6d8] bg-white p-8 text-center shadow-sm md:p-12">
              <h3 className="mb-3 font-[family-name:var(--font-playfair)] text-xl text-[#4a524f]">
                {t("ctaTitle")}
              </h3>
              <p className="mb-6 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                {t("ctaText")}
              </p>
              <a
                href="/contact"
                className="inline-flex rounded-full bg-terracotta px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
              >
                {t("ctaButton")}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
