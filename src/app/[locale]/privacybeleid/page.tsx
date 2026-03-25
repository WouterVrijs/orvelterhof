import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.privacy");
  return { title: t("title"), description: t("description") };
}

const SECTIONS = [
  {
    title: "1. Verantwoordelijke",
    content: `Groepsaccommodatie Orvelter Hof
Mr. J.B. Kanweg 7a
9439 TD Witteveen
Telefoon: 06-11 78 49 75
E-mail: info@orvelterhof.nl

Orvelter Hof is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in dit privacybeleid.`,
  },
  {
    title: "2. Welke gegevens verzamelen wij",
    content: `Wij verwerken persoonsgegevens doordat u gebruik maakt van onze diensten en/of doordat u deze zelf aan ons verstrekt. Hieronder een overzicht van de gegevens die wij verwerken:`,
    items: [
      "Voor- en achternaam",
      "Adresgegevens",
      "Telefoonnummer",
      "E-mailadres",
      "Organisatie of groepsnaam",
      "Betaalgegevens (via Mollie, wij slaan geen bankgegevens op)",
      "Gegevens over uw verblijf (aankomst, vertrek, aantal gasten, gekozen arrangement)",
      "Opmerkingen of bijzonderheden die u zelf invult bij uw boeking",
    ],
  },
  {
    title: "3. Waarvoor gebruiken wij uw gegevens",
    content: `Orvelter Hof verwerkt uw persoonsgegevens voor de volgende doeleinden:`,
    items: [
      "Het verwerken en bevestigen van uw boeking",
      "Het afhandelen van uw betaling (via betalingsprovider Mollie)",
      "U te informeren over wijzigingen van onze diensten",
      "Contact met u op te nemen per telefoon of e-mail indien dit nodig is om onze dienstverlening uit te kunnen voeren",
      "U te informeren over praktische zaken rondom uw verblijf",
      "Het voldoen aan wettelijke verplichtingen, zoals de belastingaangifte en het bijhouden van een nachtregister",
    ],
  },
  {
    title: "4. Bewaartermijn",
    content: `Orvelter Hof bewaart uw persoonsgegevens niet langer dan strikt noodzakelijk om de doelen te realiseren waarvoor uw gegevens worden verzameld. Wij hanteren de volgende bewaartermijnen:

• **Boekingsgegevens:** 7 jaar na het verblijf (wettelijke bewaarplicht fiscale administratie)
• **Contactgegevens voor marketing:** tot u zich afmeldt
• **Website analytics:** 26 maanden (geanonimiseerd)`,
  },
  {
    title: "5. Delen met derden",
    content: `Orvelter Hof verstrekt uw gegevens uitsluitend aan derden als dit nodig is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting. Met bedrijven die uw gegevens verwerken in onze opdracht, sluiten wij een verwerkersovereenkomst om te zorgen voor eenzelfde niveau van beveiliging en vertrouwelijkheid van uw gegevens.

Wij maken gebruik van de volgende diensten van derden:`,
    items: [
      "**Mollie** — voor het verwerken van online betalingen",
      "**Vercel** — voor het hosten van onze website",
      "**Sanity** — voor het beheren van website-content",
    ],
  },
  {
    title: "6. Cookies",
    content: `Onze website maakt gebruik van functionele cookies die noodzakelijk zijn voor het technisch functioneren van de website. Wij plaatsen geen tracking- of marketingcookies zonder uw toestemming.

**Functionele cookies** worden gebruikt voor:
• Het onthouden van uw taalvoorkeur
• Het bijhouden van uw boekingssessie
• Het correct laten functioneren van de website

Deze cookies worden niet gebruikt om u te volgen of profielen op te bouwen.`,
  },
  {
    title: "7. Beveiliging",
    content: `Orvelter Hof neemt de bescherming van uw gegevens serieus en neemt passende maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan.

Onze website maakt gebruik van een beveiligde SSL-verbinding (HTTPS). Betalingen worden verwerkt via Mollie, een gecertificeerde betalingsprovider die voldoet aan de PCI DSS-standaard.

Als u de indruk heeft dat uw gegevens niet goed beveiligd zijn of er aanwijzingen zijn van misbruik, neem dan contact op via info@orvelterhof.nl.`,
  },
  {
    title: "8. Uw rechten",
    content: `U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Daarnaast heeft u het recht om uw eventuele toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking van uw persoonsgegevens.

U kunt een verzoek tot inzage, correctie, verwijdering of gegevensoverdraging van uw persoonsgegevens sturen naar **info@orvelterhof.nl**.

Om er zeker van te zijn dat het verzoek tot inzage door u is gedaan, vragen wij u een kopie van uw identiteitsbewijs met het verzoek mee te sturen. Wij reageren zo snel mogelijk, maar uiterlijk binnen vier weken, op uw verzoek.

Orvelter Hof wil u er tevens op wijzen dat u de mogelijkheid heeft om een klacht in te dienen bij de nationale toezichthouder, de Autoriteit Persoonsgegevens. Dat kan via: https://autoriteitpersoonsgegevens.nl`,
  },
  {
    title: "9. Wijzigingen",
    content: `Orvelter Hof behoudt zich het recht voor om dit privacybeleid aan te passen. Wijzigingen worden op deze pagina gepubliceerd. Wij raden u aan deze pagina regelmatig te raadplegen zodat u op de hoogte bent van eventuele wijzigingen.

Dit privacybeleid is voor het laatst bijgewerkt op 25 maart 2026.`,
  },
] as const;

export default async function PrivacybeleidPage() {
  const t = await getTranslations("privacy");

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

        {/* Content */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-3xl px-6">
            <div className="rounded-2xl border border-[#ede6d8] bg-white p-8 shadow-sm md:p-12">
              {SECTIONS.map((section) => (
                <article key={section.title} className="mb-10 last:mb-0">
                  <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-lg text-[#4a524f] md:text-xl">
                    {section.title}
                  </h2>

                  {"content" in section && section.content && (
                    <div className="font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63] whitespace-pre-line">
                      {section.content.split("**").map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i} className="font-semibold text-[#3a3a35]">
                            {part}
                          </strong>
                        ) : (
                          <span key={i}>{part}</span>
                        ),
                      )}
                    </div>
                  )}

                  {"items" in section && section.items && (
                    <ul className="mt-3 list-none space-y-2">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-3 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]"
                        >
                          <span className="mt-0.5 shrink-0 text-[#6b6b63]/50">&bull;</span>
                          <span>
                            {item.split("**").map((part, j) =>
                              j % 2 === 1 ? (
                                <strong key={j} className="font-semibold text-[#3a3a35]">
                                  {part}
                                </strong>
                              ) : (
                                <span key={j}>{part}</span>
                              ),
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
