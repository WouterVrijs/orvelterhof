import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Bike, Footprints, Route } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NatuurHistoriePage() {
  const t = await getTranslations("dagjeUitNatuur");

  const HIGHLIGHTS = [
    {
      title: t("highlight1Title"),
      bullets: [t("highlight1Bullet1"), t("highlight1Bullet2"), t("highlight1Bullet3")],
      image: "/images/Orvelter-Hof-Dagje-uit.webp",
      link: { label: t("highlight1Link"), href: "#" },
    },
    {
      title: t("highlight2Title"),
      bullets: [t("highlight2Bullet1"), t("highlight2Bullet2"), t("highlight2Bullet3")],
      image: "/images/AdobeStock_648283160-scaled.webp",
      link: null,
    },
    {
      title: t("highlight3Title"),
      bullets: [t("highlight3Bullet1"), t("highlight3Bullet2"), t("highlight3Bullet3")],
      image: "/images/Groep-wandelen-scaled.webp",
      link: null,
    },
    {
      title: t("highlight4Title"),
      bullets: [t("highlight4Bullet1"), t("highlight4Bullet2"), t("highlight4Bullet3")],
      image: "/images/Nationaal-Park-Dwingelderveld.webp",
      link: null,
    },
    {
      title: t("highlight5Title"),
      bullets: [t("highlight5Bullet1"), t("highlight5Bullet2"), t("highlight5Bullet3")],
      image: "/images/ben-berwers-lJvvIMB1_-w-unsplash-scaled.jpg",
      link: null,
    },
  ];

  const FIETSROUTES = [
    t("fietsroute1"),
    t("fietsroute2"),
    t("fietsroute3"),
  ];

  const WANDELROUTES = [
    t("wandelroute1"),
    t("wandelroute2"),
    t("wandelroute3"),
    t("wandelroute4"),
    t("wandelroute5"),
    t("wandelroute6"),
    t("wandelroute7"),
  ];

  const LANGE_AFSTANDEN = [
    t("langeAfstand1"),
    t("langeAfstand2"),
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
          <p className="mt-4 font-[family-name:var(--font-lato)] text-lg leading-relaxed text-[#3a3a35]/80">
            {t("introText3")}
          </p>
        </section>

        {/* Highlights grid */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
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

        {/* Routes section */}
        <section className="bg-[#f5f0ea] px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 md:grid-cols-3">
              {/* Fietsroutes */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10">
                    <Bike size={20} className="text-terracotta" />
                  </div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#3a3a35]">
                    {t("fietsroutesTitle")}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {FIETSROUTES.map((r) => (
                    <li
                      key={r}
                      className="rounded-xl bg-white px-5 py-3 font-[family-name:var(--font-lato)] text-sm text-[#3a3a35]/80 shadow-sm ring-1 ring-black/5"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Wandelroutes */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10">
                    <Footprints size={20} className="text-terracotta" />
                  </div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#3a3a35]">
                    {t("wandelroutesTitle")}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {WANDELROUTES.map((r) => (
                    <li
                      key={r}
                      className="rounded-xl bg-white px-5 py-3 font-[family-name:var(--font-lato)] text-sm text-[#3a3a35]/80 shadow-sm ring-1 ring-black/5"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lange afstanden */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10">
                    <Route size={20} className="text-terracotta" />
                  </div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#3a3a35]">
                    {t("langeAfstandenTitle")}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {LANGE_AFSTANDEN.map((r) => (
                    <li
                      key={r}
                      className="rounded-xl bg-white px-5 py-3 font-[family-name:var(--font-lato)] text-sm text-[#3a3a35]/80 shadow-sm ring-1 ring-black/5"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
