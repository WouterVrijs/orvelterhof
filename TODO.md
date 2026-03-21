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

### Post-MVP
- [ ] Groepskorting
- [ ] Seizoensaanbiedingen
- [ ] Meertaligheid
