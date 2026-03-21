import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function ArrangementenPage() {
  const t = await getTranslations("arrangementen");

  const ARRANGEMENTS = [
    {
      title: t("arrangement1Title"),
      description: t("arrangement1Desc"),
      image: "/images/groepsaccommodatie-drenthe-orvelter-hof-15-400x250.jpg",
      price: null,
    },
    {
      title: t("arrangement2Title"),
      description: t("arrangement2Desc"),
      image: "/images/taribush-400x250.jpg",
      price: t("arrangement2Price"),
    },
    {
      title: t("arrangement3Title"),
      description: t("arrangement3Desc"),
      image: "/images/klootschieten-orvelter-hof-400x250.jpg",
      price: t("arrangement3Price"),
    },
    {
      title: t("arrangement4Title"),
      description: t("arrangement4Desc"),
      image: "/images/golf-orvelter-hof-400x250.jpg",
      price: null,
    },
    {
      title: t("arrangement5Title"),
      description: t("arrangement5Desc"),
      image: "/images/ottenhoes-orvelte-poort-400x250.jpg",
      price: t("arrangement5Price"),
    },
    {
      title: t("arrangement6Title"),
      description: t("arrangement6Desc"),
      image: "/images/solex-orvelter-hof-400x250.jpg",
      price: null,
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Hero */}
        <section className="bg-[#545959] px-6 py-16 text-center text-white">
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-[family-name:var(--font-lato)] text-lg text-white/80">
            {t("heroSubtitle")}
          </p>
        </section>

        {/* Arrangements grid */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ARRANGEMENTS.map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5 ring-1 ring-black/5 transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#3a3a35]">
                    {item.title}
                  </h2>
                  <p className="mt-3 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#3a3a35]/70">
                    {item.description}
                  </p>
                  {item.price && (
                    <p className="mt-4 font-[family-name:var(--font-lato)] text-sm font-bold text-terracotta">
                      {item.price}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
