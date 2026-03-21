import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("common.footer");

  return (
    <footer
      id="contact"
      style={{
        background:
          "radial-gradient(ellipse at center, #5A3A25 0%, #372718 70%)",
      }}
    >
      {/* CTA section */}
      <section className="relative overflow-hidden py-24">
        {/* Decorative star shapes */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute left-[10%] top-[15%] h-6 w-6 text-white/10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16l-6.4 5.2L8 14 2 9.2h7.6z" /></svg>
          <svg className="absolute left-[20%] top-[60%] h-4 w-4 text-white/8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16l-6.4 5.2L8 14 2 9.2h7.6z" /></svg>
          <svg className="absolute right-[15%] top-[20%] h-5 w-5 text-white/10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16l-6.4 5.2L8 14 2 9.2h7.6z" /></svg>
          <svg className="absolute right-[25%] bottom-[25%] h-3 w-3 text-white/8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16l-6.4 5.2L8 14 2 9.2h7.6z" /></svg>
        </div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center px-6 lg:grid-cols-[1fr_2fr_1fr]">
          <div className="hidden justify-center lg:flex">
            <div className="h-44 w-44 overflow-hidden rounded-full border-4 border-white/10 shadow-xl">
              <Image src="/images/Handdoeken.png" alt="Sfeerbeeld Orvelter Hof" width={400} height={400} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="text-center">
            <p className="mb-3 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.25em] text-white/60">
              {t("readyToBook")}
            </p>
            <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-[2.25rem] leading-tight text-white md:text-[3rem]">
              {t("reserveYourStay")}
            </h2>
            <p className="mx-auto mb-8 max-w-md font-[family-name:var(--font-lato)] text-[1rem] font-light text-white/70">
              {t("enjoyTogether")}
            </p>
            <a
              href="/boeken"
              className="inline-block rounded-full bg-[#b8704b] px-8 py-4 font-[family-name:var(--font-lato)] text-[1rem] font-bold text-white shadow-lg transition-all hover:bg-[#a0603d] hover:shadow-xl"
            >
              {t("viewAvailability")}
            </a>
          </div>

          <div className="hidden justify-center lg:flex">
            <div className="h-44 w-44 overflow-hidden rounded-full border-4 border-white/10 shadow-xl">
              <Image src="/images/Muntthee.png" alt="Sfeerbeeld Orvelter Hof" width={400} height={400} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px" style={{ background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.25) 70%, transparent 100%)" }} />
      </div>

      {/* Main footer */}
      <div className="text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Contact */}
            <div>
              <h3 className="mb-5 font-[family-name:var(--font-playfair)] text-[1.625rem]">
                {t("contact")}
              </h3>
              <ul className="space-y-2 font-[family-name:var(--font-lato)] text-[1.0625rem] text-white/70">
                <li>
                  {t("tel")}{" "}
                  <a href="tel:+31611784975" className="transition-colors hover:text-white">
                    +31 6 11 78 49 75
                  </a>
                </li>
                <li>
                  {t("mail")}{" "}
                  <a href="mailto:info@orvelterhof.nl" className="transition-colors hover:text-white">
                    info@orvelterhof.nl
                  </a>
                </li>
                <li className="pt-2">
                  <span className="font-bold text-white/90">Mr. J.B. Kanweg 7a</span>
                  <br />
                  9439 TD Witteveen
                </li>
              </ul>
            </div>

            {/* Aanbevolen */}
            <div>
              <h3 className="mb-5 font-[family-name:var(--font-playfair)] text-[1.625rem]">
                {t("recommended")}
              </h3>
              <ul className="space-y-2 font-[family-name:var(--font-lato)] text-[1.0625rem] text-white/70">
                {[
                  [t("arrangements"), "/arrangementen"],
                  [t("floorplan"), "/plattegrond"],
                  [t("surroundings"), "/dagje-uit"],
                  [t("buffetsCatering"), "/buffetten-catering"],
                  [t("luxeBreakfast"), "/luxe-ontbijtbuffet"],
                ].map(([label, href]) => (
                  <li key={label}><a href={href} className="transition-colors hover:text-white">{label}</a></li>
                ))}
              </ul>
            </div>

            {/* Thema's */}
            <div>
              <h3 className="mb-5 font-[family-name:var(--font-playfair)] text-[1.625rem]">
                {t("themes")}
              </h3>
              <ul className="space-y-2 font-[family-name:var(--font-lato)] text-[1.0625rem] text-white/70">
                {[
                  [t("childrenTrips"), "/dagje-uit/erop-uit-met-kinderen"],
                  [t("sportExciting"), "/dagje-uit/spannend-en-sportief"],
                  [t("artsCulture"), "/dagje-uit/kunst-cultuur"],
                  [t("natureHistory"), "/dagje-uit/natuur-historie"],
                  [t("foodDrinks"), "/dagje-uit/eten-drinken"],
                ].map(([label, href]) => (
                  <li key={label}><a href={href} className="transition-colors hover:text-white">{label}</a></li>
                ))}
              </ul>
            </div>

            {/* Algemeen */}
            <div>
              <h3 className="mb-5 font-[family-name:var(--font-playfair)] text-[1.625rem]">
                {t("general")}
              </h3>
              <ul className="space-y-2 font-[family-name:var(--font-lato)] text-[1.0625rem] text-white/70">
                {[
                  [t("searchBook"), "/boeken"],
                  [t("rates"), "/tarieven"],
                  [t("addressRoute"), "https://goo.gl/maps/TaTCMhAZmYT2"],
                  [t("terms"), "/algemene-voorwaarden"],
                  [t("aboutUs"), "/over-ons"],
                  [t("contact"), "/contact"],
                ].map(([label, href]) => {
                  const isExternal = href.startsWith("http");
                  return (
                    <li key={label}>
                      <a href={href} className="transition-colors hover:text-white" {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
            <div>
              <Image src="/images/Zoover-white@2x-1024x208.png" alt="Zoover 9.7" width={160} height={32} className="h-8 w-auto opacity-80" />
            </div>
            <div className="flex items-center gap-6 font-[family-name:var(--font-lato)] text-xs text-white/50">
              <p>{t("copyright")}</p>
              <a href="#" className="transition-colors hover:text-white/70">{t("sitemap")}</a>
              <a href="#" className="transition-colors hover:text-white/70">{t("links")}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
