import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Catering() {
  const t = await getTranslations("catering");

  const smallCards = [
    {
      title: t("bbqTitle"),
      price: t("bbqPrice"),
      image: "/images/barbecue-schotels-catering-buffetten-drenthe-orvelter-hof-3.jpg",
      href: "/buffetten-catering",
    },
    {
      title: t("cateringTitle"),
      price: t("cateringPrice"),
      image: "/images/birgit-flug.webp",
      href: "/contact",
    },
    {
      title: t("workshopTitle"),
      price: t("workshopPrice"),
      image: "/images/keuken-groepsaccommodatie-drenthe-orvelter-hof-4.jpg",
      href: "/contact",
    },
  ];

  return (
    <section id="buffetten" className="bg-warm-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 font-[family-name:var(--font-lato)] text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
            {t("tagline")}
          </p>
          <h2 className="mb-5 font-[family-name:var(--font-playfair)] text-[2.25rem] leading-[1.05] text-olive-dark md:text-[3.813rem]">
            {t("title").split("\n").map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </h2>
        </div>

        {/* Two large cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          {/* Card 1 — Buffetten */}
          <a href="/buffetten-catering" className="group relative block overflow-hidden rounded-2xl">
            <Image
              src="/images/Eten-en-drinken-scaled.jpg"
              alt={t("card1Title")}
              width={800}
              height={500}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute right-5 top-5 rounded-full bg-terracotta/90 px-4 py-1.5 font-[family-name:var(--font-lato)] text-[0.7rem] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              {t("card1Price")}
            </span>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 pt-16">
              <h3 className="mb-1.5 font-[family-name:var(--font-playfair)] text-[1.5rem] text-white">
                {t("card1Title")}
              </h3>
              <div className="flex items-center gap-4 font-[family-name:var(--font-lato)] text-[0.75rem] uppercase tracking-wider text-white/80">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/70">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 20c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {t("card1Guests")}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/70">
                    <path d="M3 11h18M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  {t("card1Detail")}
                </span>
              </div>
            </div>
          </a>

          {/* Card 2 — Ontbijtbuffet */}
          <a href="/luxe-ontbijtbuffet" className="group relative block overflow-hidden rounded-2xl">
            <Image
              src="/images/Buffet-2.png"
              alt={t("card2Title")}
              width={800}
              height={500}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute right-5 top-5 rounded-full bg-terracotta/90 px-4 py-1.5 font-[family-name:var(--font-lato)] text-[0.7rem] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              {t("card2Price")}
            </span>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 pt-16">
              <h3 className="mb-1.5 font-[family-name:var(--font-playfair)] text-[1.5rem] text-white">
                {t("card2Title")}
              </h3>
              <div className="flex items-center gap-4 font-[family-name:var(--font-lato)] text-[0.75rem] uppercase tracking-wider text-white/80">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/70">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 20c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {t("card2Guests")}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/70">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {t("card2Detail")}
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Bottom row: quote + small cards */}
        <div className="grid items-start gap-10 lg:grid-cols-2">
          {/* Left — Quote */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="mb-4 font-[family-name:var(--font-playfair)] text-[4rem] leading-none text-terracotta/20">
              &ldquo;
            </span>
            <p className="mb-2 font-[family-name:var(--font-lato)] text-base leading-relaxed text-text-muted">
              {t("quoteText1")}
            </p>
            <p className="mb-8 font-[family-name:var(--font-lato)] text-base leading-relaxed text-text-muted">
              {t("quoteText2")}
            </p>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-terracotta/20">
                <Image
                  src="/images/Ruurd-Doorten-scaled.jpg"
                  alt={t("ownerName")}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">
                  {t("ownerName")}
                </p>
                <p className="font-[family-name:var(--font-lato)] text-xs font-bold uppercase tracking-wider text-text-muted">
                  {t("ownerTitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Right — 3 small cards */}
          <div className="grid grid-cols-3 gap-4">
            {smallCards.map((card) => (
              <div key={card.title} className="flex flex-col text-center">
                <div className="mb-3 overflow-hidden rounded-xl">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={300}
                    height={220}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <h4 className="mb-1 font-[family-name:var(--font-playfair)] text-base text-olive-dark">
                  {card.title}
                </h4>
                <p className="mb-3 flex-1 font-[family-name:var(--font-lato)] text-xs text-text-muted">
                  {card.price}
                </p>
                <a
                  href={card.href}
                  className="inline-block rounded-sm bg-olive-dark px-4 py-2 font-[family-name:var(--font-lato)] text-[0.65rem] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#3a3a35]"
                >
                  {t("moreInfo")}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
