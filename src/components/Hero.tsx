import { getTranslations } from "next-intl/server";
import { HeroSearchBar } from "./HeroSearchBar";
import HeroSlideshow from "./HeroSlideshow";

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-visible">
      {/* Background slideshow */}
      <HeroSlideshow />

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/40" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="mb-4 font-[family-name:var(--font-lato)] text-[0.7rem] font-bold uppercase tracking-[0.3em] text-white/80">
          {t("subtitle")}
        </p>
        <div className="mx-auto mb-6 h-px w-10 bg-white/50" />
        <h1 className="mb-8 font-[family-name:var(--font-playfair)] text-[2.5rem] uppercase leading-[1.1] tracking-wide text-white md:text-[3.5rem] lg:text-[4.5rem]">
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </h1>
        <a
          href="/kamers"
          className="border border-white/60 px-8 py-3 font-[family-name:var(--font-lato)] text-[0.7rem] font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-white hover:text-[#3a3a35]"
        >
          {t("cta")}
        </a>
      </div>

      {/* Search bar — bottom, raised slightly */}
      <div className="absolute bottom-12 left-0 right-0 z-10 flex justify-center px-4">
        <HeroSearchBar unavailableDates={[]} />
      </div>
    </section>
  );
}
