import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Users, Baby, Zap, Trees, Palette, UtensilsCrossed } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function DagjeUitPage() {
  const t = await getTranslations("dagjeUit");

  const CATEGORIES = [
    {
      title: t("cat1Title"),
      subtitle: t("cat1Subtitle"),
      bullets: [t("cat1Bullet1"), t("cat1Bullet2")],
      image: "/images/Bubbel-voetbal.webp",
      icon: Users,
      href: "#",
    },
    {
      title: t("cat2Title"),
      subtitle: t("cat2Subtitle"),
      bullets: [t("cat2Bullet1"), t("cat2Bullet2")],
      image:
        "/images/Firefly_Gemini-Flash_A-small-group-of-children-walking-together-along-a-winding-forest-path-in-Drenthe-ex-622040-scaled.png",
      icon: Baby,
      href: "/dagje-uit/erop-uit-met-kinderen",
    },
    {
      title: t("cat3Title"),
      subtitle: t("cat3Subtitle"),
      bullets: [t("cat3Bullet1"), t("cat3Bullet2")],
      image: "/images/Pitch-putt.webp",
      icon: Zap,
      href: "/dagje-uit/spannend-en-sportief",
    },
    {
      title: t("cat4Title"),
      subtitle: t("cat4Subtitle"),
      bullets: [t("cat4Bullet1"), t("cat4Bullet2")],
      image: "/images/Foerst-drenthe-scaled.webp",
      icon: Trees,
      href: "/dagje-uit/natuur-historie",
    },
    {
      title: t("cat5Title"),
      subtitle: t("cat5Subtitle"),
      bullets: [t("cat5Bullet1"), t("cat5Bullet2")],
      image: "/images/denise-jans-vlgrj87NiJw-unsplash-scaled.jpg",
      icon: Palette,
      href: "/dagje-uit/kunst-cultuur",
    },
    {
      title: t("cat6Title"),
      subtitle: t("cat6Subtitle"),
      bullets: [t("cat6Bullet1"), t("cat6Bullet2")],
      image: "/images/Eten-en-drinken-scaled.jpg",
      icon: UtensilsCrossed,
      href: "/dagje-uit/eten-drinken",
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

        {/* Categories grid */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.title}
                  href={cat.href}
                  className="group overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5 ring-1 ring-black/5 transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10">
                        <Icon size={20} className="text-terracotta" />
                      </div>
                      <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#3a3a35]">
                        {cat.title}
                      </h2>
                    </div>
                    <p className="mb-2 font-[family-name:var(--font-lato)] text-sm font-medium text-[#3a3a35]/80">
                      {cat.subtitle}
                    </p>
                    <ul className="space-y-1">
                      {cat.bullets.map((b) => (
                        <li
                          key={b}
                          className="font-[family-name:var(--font-lato)] text-sm text-[#3a3a35]/60"
                        >
                          &bull; {b}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 font-[family-name:var(--font-lato)] text-sm font-bold text-terracotta">
                      {t("moreInfo")} &rarr;
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
