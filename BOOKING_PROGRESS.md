# Boekingsmodule — Voortgang

> Laatste update: 2026-03-20

## Boekingsflow

De boekingsmodule bestaat uit 4 stappen:

| Stap | Naam | Omschrijving |
|------|------|-------------|
| 1 | Verblijf | Periode/arrangement + gasten kiezen |
| 2 | Upgrades | Extra's bij het verblijf (placeholder) |
| 3 | Gegevens | Contactformulier |
| 4 | Bevestigen | Overzicht + bevestiging + betaling |

## Functionaliteiten

| # | Functionaliteit | Status | Stap |
|---|----------------|--------|------|
| 1 | Aankomst- en vertrekdatum kiezen | Gereed | 1 |
| 2 | Beschikbaarheid controleren | Gereed | 1 |
| 3 | Aantal gasten invoeren | Gereed | 1 |
| 4 | Verblijfsinformatie tonen | Gereed | 1 |
| 5 | Prijsindicatie tonen | Gereed | 1 |
| 6 | Upgrades / extra's | Deels gereed | 2 |
| 7 | Aanvraagformulier | Gereed | 3 |
| 8 | Bevestigingsoverzicht | Gereed | 4 |
| 9 | Verzendactie naar het boekingssysteem | Gereed | 4 |
| 10 | Bevestigingsscherm na verzending | Gereed | 4 |
| 11 | Automatische bevestigingsmail | Open | 4 |
| 12 | Foutafhandeling en validatie | Gereed | 1-4 |
| 13 | Mobiele optimalisatie | Deels gereed | 1-4 |
| 14 | Koppeling met de centrale beschikbaarheid | Deels gereed | 1-4 |
| 15 | Online betalingen | Open | 4 |
| 16 | Arrangementen boeken | Deels gereed | 1-4 |
| — | Post-MVP functionaliteiten | Open | — |

---

## 1. Aankomst- en vertrekdatum kiezen — `GEREED`

- [x] Kalenderweergave met twee maanden naast elkaar (desktop) / gestapeld (mobiel)
- [x] Datum-range selectie met fase-sturing (check-in → check-out → complete)
- [x] Datumvalidatie (min 2 nachten, geen overlap met bezette dagen, horizon 12 maanden)
- [x] Hover-preview met live nacht-telling
- [x] Maandnavigatie met pijlen en maandlabel

**Kernbestanden:** `BookingCalendar.tsx`, `CalendarMonth.tsx`, `CalendarDay.tsx`, `useBookingState.ts`, `dateUtils.ts`, `bookingConfig.ts`

---

## 2. Beschikbaarheid controleren — `GEREED`

- [x] Server-side availability check met overlap-detectie (half-open intervals)
- [x] Blocking statuses: confirmed, reserved, blocked blokkeren; cancelled, expired niet
- [x] Beschikbaarheidsstatus communiceren in UI (6 states met iconen, kleuren, copy)
- [x] State-transities en loading feedback (debounce, request versioning, stale response filtering)
- [x] Server-side hercontrole bij elke vervolgstap (confirmAvailabilityAction)
- [x] Error handling: geen false positives, gecontroleerde foutresponses

**Kernbestanden:** `lib/availability/checkAvailability.ts`, `lib/availability/actions.ts`, `lib/availability/types.ts`, `useAvailabilityCheck.ts`, `AvailabilityStatusMessage.tsx`

---

## 3. Aantal gasten invoeren — `GEREED`

- [x] Gastselectie dropdown (2–36 personen) in sidebar
- [x] Gastaantal doorgeven via URL params door alle stappen
- [x] Gasten meenemen in dynamische prijsberekening (bedlinnen, energie, heffingen)

**Kernbestanden:** `BookingSummary.tsx`, `useBookingState.ts`

---

## 4. Verblijfsinformatie tonen — `GEREED`

- [x] Verblijfsduur automatisch berekenen (getNightCount)
- [x] Aankomst-/vertrekdatums in sidebar met Nederlandse datumformattering
- [x] Nachten-indicator met hover-preview ("3 nachten (preview)")
- [x] 4-staps flow indicator (Verblijf → Upgrades → Gegevens → Bevestigen)

**Kernbestanden:** `BookingSummary.tsx`, `dateUtils.ts`, `BookingStepIndicator.tsx`

---

## 5. Prijsindicatie tonen — `GEREED`

- [x] Prijs per nacht in elke kalenderdag
- [x] Seizoensprijzen in mock data (laag/midden/hoogseizoen)
- [x] Prijsoverzicht in sidebar (gemiddelde prijs × nachten = totaal)
- [x] Dynamische totaalberekening inclusief bijkomende kosten (eindschoonmaak, bedlinnen, energie, heffingen als aparte regels)
- [x] Kortingsindicatie met hover-tooltip ("Laagseizoen −15%") op kortingsdagen in de kalender

**Kernbestanden:** `BookingSummary.tsx`, `useBookingState.ts`, `mockData.ts`, `CalendarDay.tsx`

---

## 6. Upgrades / extra's — `DEELS GEREED`

- [x] Stap 2 placeholder component met "Binnenkort beschikbaar" melding
- [x] Routing en navigatie (terug naar stap 1, verder naar stap 3)
- [x] Availability re-check bij openen stap 2
- [x] BookingUpgrades type en EMPTY_UPGRADES placeholder
- [x] Upgrades doorgeven via URL params (JSON-encoded)
- [ ] **Upgrade-opties definiëren** — concrete extra's bepalen (bijv. bedlinnen, handdoeken, ontbijt, borrelplank, activiteiten)
- [ ] **Upgrade-selectie UI** — kaarten/checkboxen per upgrade-optie met prijs en beschrijving
- [ ] **Upgrades meenemen in prijsberekening** — geselecteerde upgrades optellen bij het totaalbedrag

**Kernbestanden:** `BookingUpgrades.tsx`, `bookingFlowTypes.ts`

---

## 7. Aanvraagformulier — `GEREED`

- [x] Stap 3 contactformulier (voornaam, achternaam, email, telefoon, adres, postcode, stad)
- [x] Optionele velden: organisatie/groepsnaam, opmerkingen/bijzonderheden
- [x] Client-side validatie per veld (met directe foutmeldingen, aria-invalid, focus-op-eerste-fout)
- [x] Server-side validatie (email regex, telefoon regex, NL postcode regex)
- [x] Contact opslaan in sessionStorage voor stap 4
- [x] "Terug naar upgrades" link die state behoudt

**Kernbestanden:** `BookingDetails.tsx`, `lib/booking/submitBooking.ts`

---

## 8. Bevestigingsoverzicht — `GEREED`

- [x] Stap 4 overzichtspagina met alle boekingsdetails
- [x] Verblijf-sectie met datums, nachten, gasten (met "Wijzig" link naar stap 1)
- [x] Upgrades-sectie (met "Wijzig" link naar stap 2)
- [x] Gegevens-sectie met naam, email, telefoon, adres in read-only (met "Wijzig" link naar stap 3)
- [x] Voorwaarden-checkbox en "Bevestig boeking" CTA
- [x] Compact prijsoverzicht in sidebar

**Kernbestanden:** `BookingConfirmation.tsx`

---

## 9. Verzendactie naar het boekingssysteem — `GEREED`

- [x] Server Action structuur (submitBookingAction)
- [x] Mock booking reference generatie (OH-YYMM-XXXXX) als fallback
- [x] Server-side logging van submissions (incl. upgrades)
- [x] Dual-mode: POST naar API wanneer `BOOKING_API_URL` gezet is, anders mock
- [x] Foutafhandeling bij API-communicatie (timeouts, network errors, HTTP errors → gebruikersvriendelijke meldingen)
- [x] Reserveringsstatus en referentie uit API response teruglezen

**Kernbestanden:** `lib/booking/submitBooking.ts`, `lib/api/bookingApiClient.ts`

---

## 10. Bevestigingsscherm na verzending — `GEREED`

- [x] Succespagina met referentienummer en boekingssamenvatting
- [x] E-mail bevestigingstekst ("Een bevestiging is verzonden naar...")
- [x] Unavailable-at-submit afvangscherm met teruglink
- [x] sessionStorage opschonen na succesvolle boeking
- [ ] **Bevestigingspagina verrijken** (optioneel) — aanvullen met: wat nu te verwachten (tijdlijn), contactgegevens Orvelterhof, link naar routebeschrijving

**Kernbestanden:** `BookingConfirmation.tsx` (success state)

---

## 11. Automatische bevestigingsmail naar de bezoeker — `OPEN`

- [ ] **E-mail verzendservice opzetten** — koppeling met e-mailprovider (bijv. Resend, SendGrid, of eigen SMTP) via Server Action
- [ ] **E-mail template ontwerpen** — HTML-template met boekingsdetails, huisstijl Orvelterhof, praktische info
- [ ] **E-mail triggeren na succesvolle boeking** — automatisch verzenden wanneer submitBookingAction succesvol is
- [ ] **Foutafhandeling bij e-mail** — boeking mag niet falen als e-mail niet verstuurd kan worden

---

## 12. Foutafhandeling en validatie — `GEREED`

- [x] Input validatie (datums, contactgegevens) — client-side en server-side
- [x] Server error handling (try/catch, gecontroleerde responses, geen stacktraces naar frontend)
- [x] Race condition bescherming (request versioning, debounce, stale response filtering)
- [x] Unavailable-at-confirm flow op elke stap (verse server-side check)
- [x] conflictIds strippen uit frontend-response (toClientResult)
- [x] Logging met prefixes ([availability], [availability:confirm], [booking:submit])

**Kernbestanden:** `lib/availability/actions.ts`, `lib/booking/submitBooking.ts`, `useAvailabilityCheck.ts`, `useBookingState.ts`

---

## 13. Mobiele optimalisatie — `DEELS GEREED`

- [x] Responsive kalender (gestapeld op mobiel, naast elkaar op md+)
- [x] Sticky mobile CTA bar (altijd zichtbaar, fase-aware)
- [x] Touch-vriendelijke tap targets (48px+ inner circles)
- [x] Safe area insets voor notch/home indicator
- [x] Responsive formulier in stap 3
- [x] Step indicator responsief (labels verborgen op klein scherm, alleen nummers)
- [ ] **Testen op echte devices** — handmatig testen op iPhone SE, iPhone 15, Android, iPad
- [ ] **Scroll-naar-content bij stapwisseling** — op mobiel na laden van een nieuwe stap automatisch naar de content scrollen
- [ ] **Toetsenbord-aware layout** — voorkomen dat het toetsenbord de submit-knop verbergt

**Kernbestanden:** `BookingCalendar.tsx`, `BookingDetails.tsx`, `BookingStepIndicator.tsx`, `CalendarDay.tsx`

---

## 14. Koppeling met de centrale beschikbaarheid — `DEELS GEREED`

- [x] Architectuur voorbereid (getBookingsInRange interface, Booking type, BLOCKING_STATUSES)
- [x] Mock data die dezelfde patronen volgt als de kalender
- [x] API client met timeout, error handling, auth header (`lib/api/bookingApiClient.ts`)
- [x] API types en mapping functies (`lib/api/types.ts`)
- [x] bookingRepository.ts dual-mode: API wanneer `BOOKING_API_URL` gezet is, anders mock
- [x] Kalenderdata server-side ophalen via `fetchCalendarData()`, fallback naar mock
- [x] submitBooking.ts dual-mode: POST naar API of mock
- [x] `.env.example` met documentatie van benodigde env vars
- [x] API-contract gedefinieerd (GET /bookings, GET /calendar, POST /bookings)
- [ ] **API bouwen aan boekingssysteem-kant** — endpoints implementeren conform het contract
- [ ] **Caching strategie** — bepalen hoe lang beschikbaarheidsdata gecacht mag worden (ISR, revalidate)
- [ ] **End-to-end testen met echte API** — integratie valideren wanneer het boekingssysteem live is

**Kernbestanden:** `lib/api/bookingApiClient.ts`, `lib/api/types.ts`, `lib/api/calendarService.ts`, `lib/availability/bookingRepository.ts`, `lib/booking/submitBooking.ts`

---

## 15. Online betalingen — `OPEN`

- [ ] **Mollie integreren** — Mollie SDK installeren, API keys in env vars (`MOLLIE_API_KEY`). Server Action voor het aanmaken van betalingen. Webhook endpoint voor statusupdates
- [ ] **Betaalflow in stap 4 inbouwen** — na "Bevestig boeking" doorsturen naar Mollie betaalpagina (hosted checkout). Na betaling terugsturen naar bevestigingspagina met statuscheck
- [ ] **Aanbetaling vs. volledig bedrag** — logica voor aanbetaling (bijv. 30%) of volledig bedrag. Keuze aanbieden aan de bezoeker of vast percentage hanteren
- [ ] **Betaalstatus bijhouden** — betaalstatus (pending, paid, failed, refunded) opslaan in het boekingssysteem. Mollie webhook verwerken via API route (`/api/webhooks/mollie`)
- [ ] **Betaalbevestiging tonen** — na succesvolle betaling een bevestigingspagina met betaalbewijs, referentienummer en vervolgstappen
- [ ] **Foutafhandeling bij betaling** — mislukte betalingen, timeouts, en afgebroken sessies afvangen. Gebruiker terugsturen naar de boekingsflow met duidelijke melding
- [ ] **Terugbetalingen / annuleringen** — annuleringsbeleid implementeren. Automatische of handmatige refund via Mollie API

---

## 16. Arrangementen boeken — `DEELS GEREED`

- [x] **Boekingstype kiezen (verblijf of arrangement)** — type-selector bovenaan stap 1: "Verblijf boeken" / "Arrangement boeken". URL param `type=verblijf|arrangement`. Default: verblijf
- [x] **Arrangement selecteren** — 6 arrangementen als selecteerbare kaarten met radio-selectie, uitklapbare details, datum-picker en gastenteller in sidebar. Prijs berekent automatisch
- [x] **Prijsberekening voor arrangementen** — prijs = basispijs × personen. Sidebar prijsoverzicht aangepast. Toeslagen getoond bij 24/32-uurs
- [x] **Arrangement-data door de flow heen voeren** — BookingRequest type uitgebreid met arrangement-velden. State-overdracht via URL params (JSON-encoded). Stap 3 en 4 tonen arrangement-info. Server action stuurt arrangement-type mee
- [x] **Arrangement-specifieke bevestiging** — stap 4 overzicht toont arrangement-details. Sidebar met arrangement-prijs. Success-state met arrangement-naam
- [ ] **Arrangement-specifieke datumkeuze verfijnen** — beschikbaarheidscheck op gekozen datum. Bij 24-uurs en 32-uurs: automatisch overnachting(en) berekenen
- [ ] **Arrangement-specifieke e-mail** — bevestigingsmail met arrangement-specifieke informatie

**Arrangementen:**
| Arrangement | Prijs p.p. | Inclusief |
|------------|-----------|-----------|
| 4-uurs | €45,50 | Dagdeel zaalhuur, koffie/thee, gebak, beamer, WiFi |
| 4-uurs met lunch | €59,50 | + uitgebreide lunch |
| 8-uurs met lunch | €88,50 | Volledige dag + lunch |
| 12-uurs | €119,50 | 3 dagdelen + lunch + 3-gangen diner |
| 24-uurs | vanaf €179,50 | 12-uurs + overnachting met ontbijt |
| 32-uurs | vanaf €219,50 | 24-uurs + 8-uurs arrangement |

**Kernbestanden:** `BookingCalendarWrapper.tsx`, `bookingFlowTypes.ts`, `BusinessPackages.tsx`, `BookingSummary.tsx`, `BookingConfirmation.tsx`

---

## Post-MVP functionaliteiten — `OPEN`

- [ ] Nog te definiëren (bijv. groepskorting, seizoensaanbiedingen, meertaligheid)

---

## Architectuur

### State-overdracht tussen stappen

| Van → Naar | Methode |
|-----------|---------|
| Stap 1 → 2 | URL params: `aankomst`, `vertrek`, `personen`, `type=verblijf\|arrangement`, `arrangement=...`, `stap=2` |
| Stap 2 → 3 | URL params + `upgrades` (JSON-encoded) |
| Stap 3 → 4 | URL params + contactgegevens in `sessionStorage` |
| Wijzig-links | Navigeert terug met URL params behoud |

### Kernbestanden per stap

| Stap | Component | Sidebar |
|------|-----------|---------|
| 1 Verblijf | `BookingCalendar.tsx` | `BookingSummary.tsx` |
| 2 Upgrades | `BookingUpgrades.tsx` | `BookingFlowSummary.tsx` |
| 3 Gegevens | `BookingDetails.tsx` | `BookingFlowSummary.tsx` |
| 4 Bevestigen | `BookingConfirmation.tsx` | Prijsoverzicht (inline) |

### Routing

`BookingCalendarWrapper.tsx` leest `?stap=` URL param en rendert het juiste component.
