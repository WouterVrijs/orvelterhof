import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("meta.voorwaarden");
  return { title: t("title"), description: t("description") };
}

const SECTIONS = [
  {
    title: "1 Definities",
    content: `In deze voorwaarden wordt verstaan onder:

a. **Groepsaccommodatie:** het totaal aan of een gedeelte van gebouwen en/of onderkomens met alle toebehoren, inventaris en meegehuurde zaken.
b. **Verhuurder:** de persoon, het bedrijf, de instelling of vereniging die de groepsaccommodatie aan de contractant ter beschikking stelt.
c. **Contractant:** degene die namens een groep de overeenkomst afsluit.
d. **Groep:** het geheel aan individuen dat krachtens de overeenkomst het recht heeft in de groepsaccommodatie te verblijven.
e. **Groepsleden:** degene die onderdeel uitmaken van de groep.
f. **Overeengekomen prijs:** de vergoeding die betaald wordt voor het gebruik van de groepsaccommodatie; hierbij dient schriftelijk vermeld te worden wat wel en niet in de prijs inbegrepen is.
g. **Informatie:** schriftelijke of elektronisch aangereikte gegevens over het gebruik van de groepsaccommodatie, de voorzieningen en de regels omtrent het verblijf.
h. **Annulering:** de schriftelijke beëindiging van de overeenkomst door de contractant vóór de ingangsdatum van het verblijf.`,
  },
  {
    title: "2 Inhoud overeenkomst",
    items: [
      "De verhuurder stelt voor recreatieve en/of zakelijke doeleinden, dus niet voor permanente bewoning, aan de groep ter beschikking de overeengekomen groepsaccommodatie voor de overeengekomen periode en de overeengekomen prijs.",
      "De verhuurder is verplicht de schriftelijke informatie op basis waarvan deze overeenkomst mede wordt gesloten vooraf aan de recreant te verstrekken. De verhuurder maakt wijzigingen hierin steeds tijdig schriftelijk aan de contractant bekend.",
      "Indien de informatie ingrijpend afwijkt ten opzichte van de informatie zoals die verstrekt is bij het aangaan van de overeenkomst, heeft de recreant het recht de overeenkomst zonder kosten te annuleren.",
      "De contractant heeft de verplichting de overeenkomst en de regels in de bijbehorende informatie na te leven. Hij draagt er zorg voor, dat de groepsleden de overeenkomst en de regels in de bijbehorende informatie naleven.",
      "De verhuurder gaat er van uit dat de contractant met instemming van de groepsleden deze overeenkomst aangaat.",
    ],
  },
  {
    title: "3 Duur en afloop van de overeenkomst",
    content:
      "De overeenkomst eindigt van rechtswege van het verstrijken van de overeengekomen periode, zonder dat daar een opzegging is vereist.",
  },
  {
    title: "4 Prijs en prijswijzigingen",
    items: [
      "De prijs wordt overeengekomen op basis van de op dat moment geldende tarieven, welke door de verhuurder zijn vastgesteld.",
      "Indien na vaststelling van de overeengekomen prijs, door een lastenverzwaring aan de zijde van de verhuurder, extra kosten ontstaan als gevolg van een wijziging van lasten en/of heffingen, die direct op de accommodatie of de contractant en/of de groepsleden betrekking hebben, kunnen deze aan de contractant worden doorberekend, ook na de afsluiting van de overeenkomst.",
    ],
  },
  {
    title: "5 Betaling",
    items: [
      "De contractant dient de betaling in euro's te verrichten, tenzij anders overeengekomen.",
      "50% van de totaalprijs (inclusief borg) dient voldaan te zijn binnen 30 dagen na ontvangst van onze reserveringbevestiging.",
      "Het restant van de totaalprijs dient voldaan te zijn uiterlijk 30 dagen vóór de dag van aankomst.",
      "Bij reserveringen binnen 8 weken vóór de dag van aankomst dient de gehele totaalprijs direct te worden voldaan.",
      "Indien de verhuurder op de dag van de aankomst niet in het bezit is van het totale verschuldigde bedrag, is hij gerechtigd de contractant en de groepsleden de toegang tot de groepsaccommodatie te ontzeggen, onverminderd het recht van de verhuurder op volledige betaling van de overeengekomen prijs.",
      "Indien de contractant, ondanks voorafgaande schriftelijke aanmaning, zijn betalingsverplichting binnen een termijn van twee weken na de schriftelijke aanmaning niet of behoorlijk nakomt, heeft de verhuurder het recht de overeenkomst met onmiddellijke ingang op te zeggen, onverminderd het recht van de verhuurder op volledige betaling van de overeengekomen prijs.",
      "De door verhuurder in redelijkheid gemaakte buitengerechtelijke kosten, na een ingebrekestelling, komen ten laste van de contractant. Indien het totale bedrag niet tijdig is voldaan, zal na schriftelijke sommatie het wettelijke vastgestelde rentepercentage over het nog openstaande bedrag in rekening worden gebracht.",
    ],
  },
  {
    title: "6 Annulering",
    content:
      "Bij annulering dient de totale huursom voldaan te worden. Wij raden u aan een annuleringsverzekering af te sluiten.",
  },
  {
    title: "7 Gebruik",
    items: [
      "Het is verboden de gehuurde accommodatie te gebruiken anders dan voor het (recreatieve) doel waarvoor het is bestemd.",
      "Het is verboden de accommodatie te gebruiken met meer dan 36 personen. Bij gebruik van de accommodatie met meer dan 36 personen dient u vooraf toestemming te hebben van de verhuurder.",
      "De groep is verplicht de groepsaccommodatie en het terrein rondom de groepsaccommodatie gedurende de looptijd van de overeenkomst in dezelfde staat te houden als waarin de groep het heeft ontvangen of betreden.",
      "Het is de contractant en de groepsleden niet toegestaan op het terrein rondom de groepsaccommodatie te graven, bomen te kappen, struiken te snoeien of enige ander activiteit van een dergelijke aard uit te voeren.",
      "De contractant en de groepsleden zijn verplicht om alle voorschriften in de groepsaccommodatie en op het terrein rondom de groepsaccommodatie strikt na te leven. De groep draagt er tevens zorg voor, dat derde(n) die hem bezoeken en/of bij hem verblijven in de accommodatie en op het terrein rondom de groepsaccommodatie, deze voorschriften strikt naleven.",
      "De accommodatie dient bij vertrek bezemschoon achter gelaten te worden, het gasstel moet schoon zijn en de afwas moet gedaan zijn en in de kast staan.",
      "De verhuurder behoudt zich het recht voor bij niet juist gebruik en/of niet correct achterlaten van de accommodatie aanvullende kosten aan de contractant in rekening te brengen.",
      "De verhuurder heeft altijd het recht de verhuurde accommodatie te betreden voor inspectie en/of om onderhoudswerkzaamheden te doen verrichten, zonder dat de contractant daarvoor recht krijgt op gehele of gedeeltelijke restitutie van de betaalde huursom.",
      "De contractant is verplicht bij veroorzaakte schade, door de contractant en/of groepsleden, de verhuurder hiervan op de hoogte te stellen.",
      "De accommodatie is op dag van aankomst beschikbaar vanaf 17.00 uur.",
      "De accommodatie dient op dag van vertrek voor 10.00 uur verlaten te zijn op vrijdag en maandag.",
      "De accommodatie dient voor 19.00 uur verlaten te zijn op zondagen.",
      "In overleg met de verhuurder kunnen aankomst- en vertrektijden afwijken van de algemene tijden.",
    ],
  },
  {
    title: "8 Gebruik door derden",
    items: [
      "Gebruik door derden van de groepsaccommodatie is slechts toegestaan indien de verhuurder daarvoor schriftelijke toestemming heeft gegeven.",
      "Aan de gegeven toestemming kunnen voorwaarden worden gesteld, welke alsdan tevoren schriftelijk dienen te zijn vastgesteld.",
    ],
  },
  {
    title: "9 Aansprakelijkheid",
    items: [
      "De verhuurder is niet aansprakelijk voor een ongeval, diefstal, of schade op zijn terrein, tenzij dit het gevolg is van een tekortkoming die aan de verhuurder is toe te rekenen.",
      "De verhuurder is niet aansprakelijk voor de gevolgen van extreme weersinvloeden of andere vormen van overmacht.",
      "De verhuurder is aansprakelijk voor storingen in de nutsvoorzieningen, tenzij hij een beroep kan doen op overmacht.",
      "Indien de gehuurde groepsaccommodatie buiten de schuld van de verhuurder teniet is gegaan of tijdelijk niet gebruikt kan worden, hebben de verhuurder en de contractant het recht de overeenkomst te ontbinden.",
      "De contractant is jegens de ondernemer aansprakelijk voor schade die is veroorzaakt door het doen of (na)laten van hemzelf en/of (een van) de groepsleden, voor zover het gaat om schade die aan de contractant en/of (een van) de groepsleden kan worden toegerekend.",
    ],
  },
  {
    title: "10 Voortijdig vertrek van de contractant",
    content:
      "De contractant is de volledige prijs voor de overeengekomen prijs verschuldigd.",
  },
  {
    title: "11 Waarborgsom en verrekening",
    items: [
      "De waarborgsom wordt per periode voor de gehuurde groepsaccommodatie in rekening gebracht.",
      "Openstaande posten en eventuele schade worden met deze borg verrekend. Zo nodig zal een aanvullende factuur nagezonden worden.",
      "De borg wordt uiterlijk binnen 15 dagen ná het vertrek teruggestort mits de accommodatie achtergelaten wordt conform de voorschriften en er geen (schade)bedragen ter verrekening meer openstaan.",
      "Door het terugstorten van de waarborgsom wordt geen afstand gedaan van enige schadevordering of schadevergoeding in welke vorm dan ook.",
    ],
  },
  {
    title:
      "12 Tussentijdse beëindiging door de ondernemer en ontruiming bij een toerekenbare tekortkoming en/of onrechtmatige daad",
    items: [
      "De verhuurder kan de overeenkomst met onmiddellijke ingang opzeggen:\n\nA. Indien de contractant en/of de groepsleden de verplichtingen uit de overeenkomst, de regels uit de bijbehorende informatie en/of overheidsvoorschriften, ondanks waarschuwing vooraf, niet of niet behoorlijk naleeft of naleven en wel in zodanige mate dat naar maatstaven van redelijkheid en billijkheid van de verhuurder niet kan worden gevergd, dat de overeenkomst wordt voortgezet.\n\nB. Indien de contractant en/of de groepsleden ondanks voorafgaande waarschuwing, overlast aan de verhuurder en/of anderen bezorgt/bezorgen, of indien de contractant en/of groepsleden de goede sfeer op, of in de directe omgeving van het terrein bederft/bederven.\n\nC. Indien de contractant en/of de groepsleden, ondanks voorafgaande waarschuwing door gebruik van het groepsverblijf in strijd met de bestemming van het terrein handelt/handelen.",
      "Indien de verhuurder tussentijdse opzegging en ontruiming wenst, moet hij dit de contractant bij persoonlijk overhandigde brief laten weten. De schriftelijke waarschuwing kan in dringende gevallen achterwege worden gelaten.",
      "Na opzegging dient de contractant ervoor te zorgen dat de groepsaccommodatie is ontruimd en de groep dan wel de betreffende groepsleden het terrein ten spoedigste hebben verlaten, doch uiterlijk binnen 4 uur.",
      "Indien de contractant nalaat de groepsaccommodatie te ontruimen, is de verhuurder gerechtigd de groepsaccommodatie op kosten van de contractant te ontruimen.",
      "De contractant blijft in beginsel gehouden de totaalprijs te betalen.",
    ],
  },
] as const;

export default async function AlgemeneVoorwaardenPage() {
  const t = await getTranslations("voorwaarden");

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
                    <ol className="list-none space-y-3">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-3 font-[family-name:var(--font-lato)] text-sm leading-relaxed text-[#6b6b63]"
                        >
                          <span className="mt-0.5 shrink-0 font-bold text-[#4a524f]">
                            {i + 1}.
                          </span>
                          <span className="whitespace-pre-line">{item}</span>
                        </li>
                      ))}
                    </ol>
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
