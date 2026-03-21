import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Intro() {
  const t = await getTranslations("intro");

  return (
    <section id="accommodatie" className="bg-warm-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-16 lg:grid-cols-[5fr_7fr]">
          {/* Image with stat badge */}
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/images/bar-groepsaccommodatie-drenthe-orvelter-hof-1.jpg"
                alt="Sfeervolle woonkamer Orvelter Hof"
                width={800}
                height={1000}
                className="aspect-[3/4] w-full object-cover"
                priority
              />
            </div>
            {/* Stat badge — overlapping bottom-left */}
            <div className="absolute -bottom-6 -left-2 flex h-32 w-32 flex-col items-center justify-center bg-terracotta text-white shadow-lg md:-left-6 md:h-36 md:w-36">
              <span className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl">
                {t("rooms")}
              </span>
              <span className="mt-1 font-[family-name:var(--font-lato)] text-[0.6rem] font-bold uppercase tracking-[0.15em]">
                {t("roomsLabel")}
              </span>
            </div>
          </div>

          {/* Text content */}
          <div className="order-1 pt-4 lg:order-2">
            <p className="mb-3 font-[family-name:var(--font-lato)] text-sm font-bold uppercase tracking-[0.2em] text-text-muted">
              {t("welcome")}
            </p>
            <h2 className="mb-8 font-[family-name:var(--font-playfair)] text-[2.25rem] leading-[1.1] text-olive-dark md:text-[3.25rem]">
              {t("title")}
            </h2>

            {/* Two-column text */}
            <div className="mb-8 grid gap-x-8 gap-y-4 font-[family-name:var(--font-lato)] text-[0.9375rem] leading-relaxed text-text-muted sm:grid-cols-2">
              <p>{t("text1")}</p>
              <p>{t("text2")}</p>
              <p>{t("text3")}</p>
              <p>{t("text4")}</p>
            </div>

            {/* Owner */}
            <div className="flex items-center gap-5 border-t border-cream-dark pt-8">
              <div className="h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src="/images/Ruurd-Doorten-scaled.jpg"
                  alt={t("ownerName")}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">
                  {t("ownerName")}
                </p>
                <p className="font-[family-name:var(--font-lato)] text-xs text-text-muted">
                  {t("ownerTitle")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
