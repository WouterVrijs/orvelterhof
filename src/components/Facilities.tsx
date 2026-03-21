import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Facilities() {
  const t = await getTranslations("facilities");

  const rooms = [
    {
      label: t("weekend"),
      title: t("weekendLabel"),
      price: t("weekendPrice"),
      src: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-14.jpg",
      alt: "Luxe slaapkamer Orvelter Hof",
    },
    {
      label: t("midweek"),
      title: t("midweekLabel"),
      price: t("midweekPrice"),
      src: "/images/vergaderlocatie-drenthe-orvelter-hof-15.jpg",
      alt: "Vergaderlocatie Orvelter Hof",
    },
    {
      label: t("week"),
      title: t("weekLabel"),
      price: t("weekPrice"),
      src: "/images/keuken-groepsaccommodatie-drenthe-orvelter-hof-4.jpg",
      alt: "Keuken Orvelter Hof",
    },
  ];

  const highlights = [
    {
      src: "/images/bar-groepsaccommodatie-drenthe-orvelter-hof.jpg",
      alt: "Bar Orvelter Hof",
      title: t("barTitle"),
      desc: t("barText"),
    },
    {
      src: "/images/speeltuin-groepsaccommodatie-drenthe-orvelter-hof.jpg",
      alt: "Speeltuin Orvelter Hof",
      title: t("gardenTitle"),
      desc: t("gardenText"),
    },
  ];

  return (
    <section id="faciliteiten" className="bg-warm-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top section: text + image mosaic + room list */}
        <div className="grid items-center gap-12 lg:grid-cols-[4fr_5fr_3fr]">
          {/* Left — intro text */}
          <div>
            <p className="mb-3 font-[family-name:var(--font-lato)] text-[0.7rem] font-bold uppercase tracking-[0.25em] text-text-muted">
              {t("tagline")}
            </p>
            <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-[2.25rem] leading-[1.1] text-olive-dark md:text-[2.75rem]">
              {t("title")}
            </h2>
            <p className="mb-6 font-[family-name:var(--font-lato)] text-[0.9375rem] leading-relaxed text-text-muted">
              {t("description")}
            </p>

            <a
              href="/kamers"
              className="inline-flex rounded-full bg-terracotta px-8 py-3.5 font-[family-name:var(--font-lato)] text-sm font-bold text-white shadow-md transition-all hover:bg-terracotta-dark hover:shadow-lg active:scale-[0.98]"
            >
              {t("viewRooms")}
            </a>
          </div>

          {/* Center + Right — image mosaic with overlapping thumbs + room list */}
          <div className="relative lg:col-span-2">
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[5fr_4fr] md:gap-x-10">
              {/* Image mosaic */}
              <div className="relative">
                {/* Large image */}
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src="/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof.jpg"
                    alt="Slaapkamer Orvelter Hof"
                    width={800}
                    height={600}
                    className="aspect-[4/3] w-full object-cover md:aspect-[5/6]"
                  />
                </div>

                {/* Small overlapping thumbnails — hidden on mobile */}
                <div className="absolute -right-5 top-0 hidden h-full flex-col justify-evenly md:flex">
                  <div className="h-24 w-28 overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src="/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-7.jpg"
                      alt="Slaapkamer"
                      width={224}
                      height={168}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="h-24 w-28 overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src="/images/badkamer-groepsaccommodatie-drenthe-orvelter-hof-7.jpg"
                      alt="Badkamer"
                      width={224}
                      height={168}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="h-24 w-28 overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src="/images/terras-groepsaccommodatie-drenthe-orvelter-hof-8.jpg"
                      alt="Terras"
                      width={224}
                      height={168}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Room types with prices */}
              <div className="flex flex-col gap-4 md:h-full md:justify-evenly md:gap-0">
                {rooms.map((room) => (
                  <div key={room.title} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-[family-name:var(--font-lato)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-text-muted">
                        {room.label}
                      </p>
                      <p className="font-[family-name:var(--font-playfair)] text-lg text-olive-dark md:text-xl">
                        {room.title}
                      </p>
                    </div>
                    <span className="shrink-0 bg-olive-dark px-3 py-1.5 font-[family-name:var(--font-lato)] text-xs font-bold text-white md:px-4 md:py-2">
                      &euro; {room.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section: two highlight cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="relative pl-20 md:pl-24"
            >
              {/* Circle image — overlaps left edge of card */}
              <div className="absolute -left-2 top-1/2 z-10 h-28 w-28 -translate-y-1/2 overflow-hidden rounded-full border-4 border-cream bg-white shadow-md md:h-32 md:w-32">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={256}
                  height={256}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Card */}
              <div className="rounded-2xl bg-white py-8 pl-16 pr-8 shadow-sm md:pl-20">
                <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-xl text-olive-dark">
                  {item.title}
                </h3>
                <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-text-muted">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
