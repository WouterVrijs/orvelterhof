import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function SpannendEnSportiefPage() {
  const t = await getTranslations("dagjeUitSportief");

  const ACTIVITIES = [
    {
      title: t("activity1Title"),
      description: t("activity1Desc"),
      bullets: [t("activity1Bullet1"), t("activity1Bullet2"), t("activity1Bullet3")],
      image: "/images/andrei-popescu-87AAW39CZoU-unsplash-scaled.jpg",
      link: { label: t("activity1Link"), href: "#" },
    },
    {
      title: t("activity2Title"),
      description: t("activity2Desc"),
      bullets: [t("activity2Bullet1"), t("activity2Bullet2"), t("activity2Bullet3")],
      image: "/images/bryan-dijkhuizen-cDt3minJLoA-unsplash-2.webp",
      link: null,
    },
    {
      title: t("activity3Title"),
      description: null,
      bullets: [t("activity3Bullet1"), t("activity3Bullet2"), t("activity3Bullet3")],
      image: "/images/jorgen-hendriksen-x9s5tVMncPg-unsplash-scaled.jpg",
      link: null,
    },
    {
      title: t("activity4Title"),
      description: null,
      bullets: [t("activity4Bullet1"), t("activity4Bullet2"), t("activity4Bullet3")],
      image: "/images/mick-haupt-m0iXio5FF7M-unsplash-scaled.jpg",
      link: null,
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Hero */}
        <section className="bg-[#545959] px-6 py-16 text-center text-white">
          <p className="mb-3 font-[family-name:var(--font-lato)] text-xs font-bold uppercase tracking-[0.25em] text-white/60">
            {t("heroOverline")}
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl">
            {t("heroTitle")}
          </h1>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="font-[family-name:var(--font-lato)] text-lg leading-relaxed text-[#3a3a35]/80">
            {t("introText1")}
          </p>
          <p className="mt-4 font-[family-name:var(--font-lato)] text-lg leading-relaxed text-[#3a3a35]/80">
            {t.rich("introText2", {
              bold: (chunks) => <span className="font-bold text-[#3a3a35]">{chunks}</span>,
            })}
          </p>
        </section>

        {/* Activities grid */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-8 md:grid-cols-2">
            {ACTIVITIES.map((item) => (
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
                  {item.description && (
                    <p className="mt-3 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#3a3a35]/70">
                      {item.description}
                    </p>
                  )}
                  <ul className="mt-3 space-y-1">
                    {item.bullets.map((b) => (
                      <li
                        key={b}
                        className="font-[family-name:var(--font-lato)] text-sm text-[#3a3a35]/60"
                      >
                        &bull; {b}
                      </li>
                    ))}
                  </ul>
                  {item.link && (
                    <a
                      href={item.link.href}
                      className="mt-4 inline-block font-[family-name:var(--font-lato)] text-sm font-bold text-terracotta"
                    >
                      {item.link.label} &rarr;
                    </a>
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
