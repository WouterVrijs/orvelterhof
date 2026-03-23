# Orvelterhof Website — Todo's

> Laatste update: 2026-03-20

---

## Boekingsmodule

### Upgrades / extra's
- [ ] Upgrade-opties definiëren (bijv. bedlinnen, handdoeken, ontbijt, borrelplank, activiteiten)
- [ ] Upgrade-selectie UI bouwen (kaarten/checkboxen per optie met prijs en beschrijving)
- [ ] Upgrades meenemen in prijsberekening (optellen bij totaalbedrag)

### Bevestigingsscherm
- [ ] Bevestigingspagina verrijken: wat nu te verwachten (tijdlijn), contactgegevens Orvelterhof, link naar routebeschrijving

### Automatische bevestigingsmail
- [ ] E-mail verzendservice opzetten (bijv. Resend, SendGrid, of eigen SMTP)
- [ ] E-mail template ontwerpen (boekingsdetails, huisstijl, praktische info)
- [ ] E-mail triggeren na succesvolle boeking
- [ ] Foutafhandeling bij e-mail (boeking mag niet falen als e-mail niet lukt)

### Mobiele optimalisatie
- [ ] Testen op echte devices (iPhone SE, iPhone 15, Android, iPad)
- [ ] Scroll-naar-content bij stapwisseling op mobiel
- [ ] Toetsenbord-aware layout (submit-knop niet verbergen)

### Koppeling met boekingssysteem
- [ ] API bouwen aan boekingssysteem-kant (endpoints conform het contract)
- [ ] Caching strategie bepalen (ISR, revalidate, of real-time)
- [ ] End-to-end testen met echte API
- [ ] Beschikbaarheidscheck ("controle niet gelukt") fixen — de availability check faalt momenteel bij elke datumselectie

### Online betalingen (Mollie)
- [ ] Mollie SDK installeren en integreren (API keys in env vars)
- [ ] Betaalflow in stap 4 inbouwen (hosted checkout → terugkeer)
- [ ] Aanbetaling vs. volledig bedrag logica bepalen
- [ ] Betaalstatus bijhouden (webhook via `/api/webhooks/mollie`)
- [ ] Betaalbevestiging tonen na succesvolle betaling
- [ ] Foutafhandeling bij betaling (mislukt, timeout, afgebroken)
- [ ] Terugbetalingen / annuleringen via Mollie API

---

## Contactpagina

- [ ] Contactformulier koppelen aan echte verzendservice (email API, Formspree, of server action)

---

## Website-breed

### Content & pagina's
- [ ] Prijzen & seizoenen pagina (verwijderd van /boeken, eventueel aparte pagina of op homepage)

### SEO & Metadata

#### Epic 1: Technische SEO-basis
> *Als website-eigenaar wil ik dat zoekmachines alle pagina's correct kunnen indexeren zodat we organisch vindbaar zijn.*

- [x] **Sitemap genereren** — dynamische `sitemap.xml` via Next.js (`app/sitemap.ts`) met alle publieke pagina's en taalvarianten
- [x] **Robots.txt configureren** — `app/robots.ts` met crawl-regels, verwijzing naar sitemap, blokkeer `/boeken` en `/api`
- [ ] **Canonical URLs instellen** — `<link rel="canonical">` per pagina om duplicate content tussen taalversies te voorkomen
- [ ] **Hreflang tags toevoegen** — `<link rel="alternate" hreflang="nl|en|de">` op elke pagina voor meertalige SEO
- [ ] **Trailing slash / redirect-beleid** — consistente URL-structuur afdwingen (met of zonder trailing slash)
- [ ] **404-pagina optimaliseren** — custom not-found pagina met navigatie en zoeksuggesties

#### Epic 2: Metadata per pagina
> *Als bezoeker wil ik in zoekresultaten een duidelijke titel en beschrijving zien zodat ik weet wat ik kan verwachten.*

- [ ] **Unieke title tags per pagina** — elke pagina een unieke, beschrijvende `<title>` (max 60 tekens), patroon: `Paginanaam | Orvelter Hof`
- [ ] **Meta descriptions per pagina** — unieke beschrijving per pagina (max 155 tekens) met call-to-action
- [ ] **Open Graph tags** — `og:title`, `og:description`, `og:image`, `og:url`, `og:type` per pagina voor social sharing
- [ ] **Twitter Card tags** — `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` per pagina
- [ ] **OG images genereren** — per pagina een passende social share afbeelding (1200x630), eventueel dynamisch via `opengraph-image.tsx`

#### Epic 3: Structured Data (Schema.org)
> *Als website-eigenaar wil ik rich results in Google zodat we opvallen tussen zoekresultaten.*

- [ ] **LodgingBusiness schema** — JSON-LD op de homepage met naam, adres, afbeeldingen, sterren, contactgegevens
- [ ] **MeetingRoom schema** — JSON-LD op de vergaderlocatie-pagina met capaciteit en faciliteiten
- [ ] **FAQ schema** — veelgestelde vragen markeren (indien FAQ-sectie aanwezig) voor rich snippets
- [ ] **BreadcrumbList schema** — breadcrumb-navigatie markeren voor betere zoekresultaatweergave
- [ ] **Event/Offer schema** — arrangementen markeren met prijs, beschrijving en beschikbaarheid

#### Epic 4: Performance & Core Web Vitals
> *Als bezoeker wil ik dat de website snel laadt zodat ik niet afhaakt.*

- [ ] **Lighthouse audit uitvoeren** — baseline meting van LCP, FID/INP, CLS op alle key pages
- [ ] **Afbeeldingen optimaliseren** — WebP/AVIF formaat, juiste `sizes` attributen, lazy loading voor below-the-fold
- [ ] **Font loading optimaliseren** — `font-display: swap`, preload kritieke fonts, subset waar mogelijk
- [ ] **Ongebruikte JS/CSS verminderen** — bundle analyse, tree shaking, dynamic imports voor zware componenten

#### Epic 5: Lokale SEO
> *Als lokale ondernemer wil ik gevonden worden door mensen die zoeken naar accommodaties en vergaderlocaties in Drenthe.*

- [ ] **Google Business Profile koppelen** — profiel aanmaken/claimen, NAP-gegevens consistent houden
- [ ] **Lokale zoekwoorden integreren** — "groepsaccommodatie Drenthe", "vergaderlocatie Drenthe", "overnachten Orvelte" verwerken in content
- [ ] **NAP-gegevens consistent tonen** — naam, adres, telefoonnummer op elke pagina (footer) en in structured data

### Post-MVP
- [ ] Groepskorting
- [ ] Seizoensaanbiedingen
- [ ] Meertaligheid
