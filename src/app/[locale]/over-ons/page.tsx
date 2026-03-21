import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.overOns");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function OverOnsPage() {
  const t = await getTranslations("overOns");

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-[#545959] pb-16 pt-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="mb-3 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[#c8835e]">
              {t("heroTagline")}
            </p>
            <h1 className="mb-4 font-[family-name:var(--font-playfair)] text-[2.25rem] text-white md:text-[3.813rem]">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto max-w-2xl font-[family-name:var(--font-lato)] text-[1rem] font-light leading-relaxed text-white/80">
              {t("heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Ruurd intro */}
        <section className="bg-[#fbf8f6] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Photo */}
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/Ruurd-Doorten-scaled.jpg"
                    alt="Ruurd Doorten — eigenaar Orvelter Hof"
                    width={724}
                    height={1024}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                {/* Decorative shape */}
                <div className="absolute -bottom-4 -right-4 -z-10 h-24 w-24 opacity-20">
                  <Image
                    src="/images/footer-shape-4.webp"
                    alt=""
                    width={222}
                    height={222}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Text */}
              <div>
                <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
                  {t("aboutTitle")}
                </h2>
                <div className="space-y-4 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                  <p>
                    {t("aboutText1")}
                  </p>
                  <p>
                    {t("aboutText2")}
                  </p>
                  <p>
                    {t("aboutText3")}
                  </p>
                  <p className="font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                    {t("aboutSignature")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Realisatie */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Text — left on desktop */}
              <div className="order-2 lg:order-1">
                <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
                  {t("realisatieTitle")}
                </h2>
                <div className="space-y-4 font-[family-name:var(--font-lato)] text-base leading-relaxed text-[#6b6b63]">
                  <p>
                    {t("realisatieText1")}
                  </p>
                  <p>
                    {t("realisatieText2")}
                  </p>
                  <p>
                    {t("realisatieText3")}
                  </p>
                </div>
              </div>

              {/* Photo — right on desktop */}
              <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/Handdoeken.png"
                    alt="Sfeerbeeld Orvelter Hof — luxe en comfort"
                    width={1280}
                    height={956}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 -z-10 h-24 w-24 opacity-20">
                  <Image
                    src="/images/footer-shape-4.webp"
                    alt=""
                    width={222}
                    height={222}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
