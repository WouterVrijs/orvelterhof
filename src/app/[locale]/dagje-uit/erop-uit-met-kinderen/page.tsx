import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Waves } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function EropUitMetKinderenPage() {
  const t = await getTranslations("dagjeUitKinderen");

  const ACTIVITIES = [
    {
      title: t("activity1Title"),
      bullets: [t("activity1Bullet1"), t("activity1Bullet2"), t("activity1Bullet3")],
      image: "/images/Orvelter-Hof-Dagje-uit.webp",
      link: { label: t("activity1Link"), href: "#" },
    },
    {
      title: t("activity2Title"),
      bullets: [t("activity2Bullet1"), t("activity2Bullet2"), t("activity2Bullet3")],
      image: "/images/Ellert-en-Brammert.webp",
      link: null,
    },
    {
      title: t("activity3Title"),
      bullets: [t("activity3Bullet1"), t("activity3Bullet2"), t("activity3Bullet3")],
      image: "/images/artem-verbo-rAyIvNqlwCY-unsplash-scaled.jpg",
      link: { label: t("activity3Link"), href: "#" },
    },
    {
      title: t("activity4Title"),
      bullets: [t("activity4Bullet1"), t("activity4Bullet2"), t("activity4Bullet3")],
      image: "/images/hasmik-ghazaryan-olson-N_GrR8c2EMk-unsplash-scaled.jpg",
      link: null,
    },
    {
      title: t("activity5Title"),
      bullets: [t("activity5Bullet1"), t("activity5Bullet2"), t("activity5Bullet3")],
      image: "/images/screenroad-FquDp5N1Gw0-unsplash-scaled.jpg",
      link: null,
    },
    {
      title: t("activity6Title"),
      bullets: [t("activity6Bullet1"), t("activity6Bullet2"), t("activity6Bullet3")],
      image: "/images/Wildlands.png",
      link: null,
    },
    {
      title: t("activity7Title"),
      bullets: [t("activity7Bullet1"), t("activity7Bullet2"), t("activity7Bullet3")],
      image: "/images/Boomkroonpad.png",
      link: null,
    },
    {
      title: t("activity8Title"),
      bullets: [t("activity8Bullet1"), t("activity8Bullet2"), t("activity8Bullet3")],
      image: "/images/emiliano-bar-PaKHbtTDqt0-unsplash-scaled.jpg",
      link: null,
    },
    {
      title: t("activity9Title"),
      bullets: [t("activity9Bullet1"), t("activity9Bullet2"), t("activity9Bullet3")],
      image: "/images/hakim-menikh-iZPMBzPZ6Kc-unsplash-scaled.jpg",
      link: null,
    },
  ];

  const ZWEMBADEN = [
    { name: t("zwembad1"), href: "#" },
    { name: t("zwembad2"), href: "#" },
    { name: t("zwembad3"), href: "#" },
    { name: t("zwembad4"), href: "#" },
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
          <p className="mx-auto mt-4 max-w-2xl font-[family-name:var(--font-lato)] text-lg text-white/80">
            {t("heroSubtitle")}
          </p>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="font-[family-name:var(--font-lato)] text-lg leading-relaxed text-[#3a3a35]/80">
            {t("introText")}
          </p>
        </section>

        {/* Activities grid */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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

        {/* Zwembaden */}
        <section className="bg-[#f5f0ea] px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10">
                <Waves size={28} className="text-terracotta" />
              </div>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#3a3a35]">
              {t("zwembadTitle")}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {ZWEMBADEN.map((z) => (
                <li key={z.name}>
                  <a
                    href={z.href}
                    className="block rounded-xl bg-white px-6 py-4 font-[family-name:var(--font-lato)] text-[#3a3a35] shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md"
                  >
                    {z.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
