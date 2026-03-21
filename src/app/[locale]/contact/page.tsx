import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";
import { Phone, Mail, MapPin, MessageCircle, Clock, Users } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.contact");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

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

        {/* Contact cards */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-10 text-center font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
              {t("cardsTitle")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Direct contact */}
              <div className="rounded-2xl border border-[#ede6d8] bg-white p-8 text-center shadow-sm">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10">
                  <Phone size={24} className="text-terracotta" />
                </span>
                <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                  {t("directContactTitle")}
                </h3>
                <a
                  href="tel:+31611784975"
                  className="font-[family-name:var(--font-lato)] text-base font-medium text-terracotta transition-colors hover:text-terracotta-dark"
                >
                  {t("directContactPhone")}
                </a>
              </div>

              {/* Mail */}
              <div className="rounded-2xl border border-[#ede6d8] bg-white p-8 text-center shadow-sm">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10">
                  <Mail size={24} className="text-terracotta" />
                </span>
                <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                  {t("mailTitle")}
                </h3>
                <a
                  href="mailto:info@orvelterhof.nl"
                  className="font-[family-name:var(--font-lato)] text-base font-medium text-terracotta transition-colors hover:text-terracotta-dark"
                >
                  {t("mailAddress")}
                </a>
              </div>

              {/* Locatie */}
              <div className="rounded-2xl border border-[#ede6d8] bg-white p-8 text-center shadow-sm">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10">
                  <MapPin size={24} className="text-terracotta" />
                </span>
                <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
                  {t("locationTitle")}
                </h3>
                <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                  {t("locationStreet")}
                  <br />
                  {t("locationPostal")}
                  <br />
                  <span className="text-[#4a524f]">{t("locationRegion")}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* USPs */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-8 text-center font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
              {t("uspsTitle")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5a9a5a]/10">
                  <MessageCircle size={20} className="text-[#5a9a5a]" />
                </span>
                <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                  {t("usp1")}
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5a9a5a]/10">
                  <Users size={20} className="text-[#5a9a5a]" />
                </span>
                <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                  {t("usp2")}
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5a9a5a]/10">
                  <Clock size={20} className="text-[#5a9a5a]" />
                </span>
                <p className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                  {t("usp3")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact form + map */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              {/* Form */}
              <div className="rounded-2xl border border-[#ede6d8] bg-white p-8 shadow-sm">
                <h2 className="mb-2 font-[family-name:var(--font-playfair)] text-xl text-[#4a524f] md:text-2xl">
                  {t("formTitle")}
                </h2>
                <p className="mb-6 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]">
                  {t("formSubtitle")}
                </p>
                <ContactForm />
              </div>

              {/* Map */}
              <div className="overflow-hidden rounded-2xl border border-[#ede6d8] shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d68054.36478213193!2d6.601262375477668!3d52.81206151048715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c81f9bb1eeb3a3%3A0x3d0a04e1ec5ea399!2sGroepsaccommodatie%20Orvelter%20Hof!5e0!3m2!1snl!2snl!4v1769500782245!5m2!1snl!2snl"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 450 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t("mapTitle")}
                />
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
