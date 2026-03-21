import Image from "next/image";
import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function RoomShowcase() {
  const t = await getTranslations("showcase");

  const highlights = [
    t("highlight1"),
    t("highlight2"),
    t("highlight3"),
    t("highlight4"),
  ];

  return (
    <section className="w-full bg-white py-0">
      {/* Bento grid — full width */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[300px_300px]">
        {/* Text block — top-left */}
        <div className="flex flex-col justify-center bg-terracotta/20 p-8 md:p-10">
          <p className="mb-2 font-[family-name:var(--font-lato)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-terracotta">
            {t("tagline")}
          </p>
          <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-[1.5rem] leading-tight text-[#4a524f] md:text-[1.75rem]">
            {t("title")}
          </h2>
          <p className="mb-6 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
            {t("description")}
          </p>
          <a
            href="/dagje-uit"
            className="inline-flex w-fit items-center gap-2 font-[family-name:var(--font-lato)] text-sm font-bold text-terracotta transition-colors hover:text-terracotta-dark"
          >
            {t("viewActivities")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Image — Wandelen, large center (2 rows on desktop) */}
        <div className="relative md:row-span-2">
          <Image
            src="/images/Groep-wandelen-scaled.webp"
            alt="Groep wandelen door de Drentse natuur"
            width={800}
            height={600}
            className="h-56 w-full object-cover md:absolute md:inset-0 md:h-full"
          />
        </div>

        {/* Image — Boomkroonpad, top-right wide */}
        <div className="relative col-span-2 hidden md:block">
          <Image
            src="/images/Boomkroonpad.png"
            alt="Boomkroonpad Drouwen"
            fill
            className="object-cover"
          />
        </div>

        {/* Image — Bubbel voetbal, hidden on mobile */}
        <div className="relative hidden md:block">
          <Image
            src="/images/Bubbel-voetbal.webp"
            alt="Bubbel voetbal"
            fill
            className="object-cover"
          />
        </div>

        {/* Info card */}
        <div className="flex flex-col justify-center bg-terracotta/80 p-8 md:p-10">
          <h3 className="mb-4 font-[family-name:var(--font-playfair)] text-[1.5rem] text-white">
            {t("infoTitle")}
          </h3>
          <ul className="space-y-2.5">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 font-[family-name:var(--font-lato)] text-sm text-white/90"
              >
                <Check size={15} className="shrink-0 text-white" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Image — Natuur/bos, hidden on mobile */}
        <div className="relative hidden md:block">
          <Image
            src="/images/Foerst-drenthe-scaled.webp"
            alt="Bossen en natuur in Drenthe"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
