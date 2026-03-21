import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function EtenDrinkenPage() {
  const t = await getTranslations("dagjeUitEten");

  const RESTAURANTS = [
    {
      title: t("restaurant1Title"),
      bullets: [t("restaurant1Bullet1"), t("restaurant1Bullet2"), t("restaurant1Bullet3")],
      logo: "/images/logo-svg-schenkerij.png",
      link: { label: t("restaurant1Link"), href: "#" },
    },
    {
      title: t("restaurant2Title"),
      bullets: [t("restaurant2Bullet1"), t("restaurant2Bullet2"), t("restaurant2Bullet3")],
      logo: "/images/logo-westerburcht.png",
      link: null,
    },
    {
      title: t("restaurant3Title"),
      bullets: [t("restaurant3Bullet1"), t("restaurant3Bullet2"), t("restaurant3Bullet3")],
      logo: "/images/Restaurant-de-ar.png",
      link: null,
    },
    {
      title: t("restaurant4Title"),
      bullets: [t("restaurant4Bullet1"), t("restaurant4Bullet2"), t("restaurant4Bullet3")],
      logo: "/images/Logo-diggels.png",
      link: null,
    },
    {
      title: t("restaurant5Title"),
      bullets: [t("restaurant5Bullet1"), t("restaurant5Bullet2"), t("restaurant5Bullet3")],
      logo: "/images/De-warrel-logo.png",
      link: null,
    },
    {
      title: t("restaurant6Title"),
      bullets: [t("restaurant6Bullet1"), t("restaurant6Bullet2"), t("restaurant6Bullet3")],
      logo: "/images/Logo-lotus.png",
      link: null,
    },
    {
      title: t("restaurant7Title"),
      bullets: [t("restaurant7Bullet1"), t("restaurant7Bullet2")],
      logo: "/images/De-turfsteker.png",
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
            {t("introText2")}
          </p>
        </section>

        {/* Restaurants grid */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {RESTAURANTS.map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5 ring-1 ring-black/5 transition-shadow hover:shadow-lg"
              >
                <div className="flex aspect-[16/10] items-center justify-center bg-[#f5f0ea] p-8">
                  <Image
                    src={item.logo}
                    alt={item.title}
                    width={200}
                    height={120}
                    className="max-h-24 w-auto object-contain"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#3a3a35]">
                    {item.title}
                  </h2>
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
