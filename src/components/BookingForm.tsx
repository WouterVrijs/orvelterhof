"use client";

import { useState } from "react";

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-cream p-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-olive/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-olive">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mb-3 font-[family-name:var(--font-playfair)] text-[1.688rem] text-olive-dark">
          Aanvraag verzonden
        </h3>
        <p className="font-[family-name:var(--font-lato)] text-[1rem] leading-relaxed text-text-muted">
          Bedankt voor uw aanvraag. Wij nemen binnen 24 uur contact met u op om
          de beschikbaarheid te bevestigen en uw boeking af te ronden.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
      <div className="rounded-2xl bg-white p-8 shadow-sm md:p-12">
        <h2 className="mb-8 font-[family-name:var(--font-playfair)] text-[1.688rem] text-olive-dark">
          Beschikbaarheid aanvragen
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Aankomst */}
          <div>
            <label
              htmlFor="checkin"
              className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-bold text-text-dark"
            >
              Aankomstdatum
            </label>
            <input
              type="date"
              id="checkin"
              name="checkin"
              required
              className="w-full rounded-xl border border-cream-dark bg-warm-white px-4 py-3 font-[family-name:var(--font-lato)] text-sm text-text-dark outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
            />
          </div>

          {/* Vertrek */}
          <div>
            <label
              htmlFor="checkout"
              className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-bold text-text-dark"
            >
              Vertrekdatum
            </label>
            <input
              type="date"
              id="checkout"
              name="checkout"
              required
              className="w-full rounded-xl border border-cream-dark bg-warm-white px-4 py-3 font-[family-name:var(--font-lato)] text-sm text-text-dark outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
            />
          </div>

          {/* Aantal personen */}
          <div>
            <label
              htmlFor="guests"
              className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-bold text-text-dark"
            >
              Aantal personen
            </label>
            <select
              id="guests"
              name="guests"
              required
              className="w-full rounded-xl border border-cream-dark bg-warm-white px-4 py-3 font-[family-name:var(--font-lato)] text-sm text-text-dark outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
            >
              <option value="">Selecteer...</option>
              {Array.from({ length: 35 }, (_, i) => i + 2).map((n) => (
                <option key={n} value={n}>
                  {n} personen
                </option>
              ))}
            </select>
          </div>

          {/* Type verblijf */}
          <div>
            <label
              htmlFor="type"
              className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-bold text-text-dark"
            >
              Type verblijf
            </label>
            <select
              id="type"
              name="type"
              required
              className="w-full rounded-xl border border-cream-dark bg-warm-white px-4 py-3 font-[family-name:var(--font-lato)] text-sm text-text-dark outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
            >
              <option value="">Selecteer...</option>
              <option value="weekend">Weekend (vr-zo)</option>
              <option value="midweek">Midweek (ma-vr)</option>
              <option value="week">Hele week (ma-zo)</option>
              <option value="anders">Anders</option>
            </select>
          </div>

          {/* Naam */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-bold text-text-dark"
            >
              Naam
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Uw volledige naam"
              className="w-full rounded-xl border border-cream-dark bg-warm-white px-4 py-3 font-[family-name:var(--font-lato)] text-sm text-text-dark placeholder:text-text-muted/50 outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
            />
          </div>

          {/* E-mail */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-bold text-text-dark"
            >
              E-mailadres
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="uw@email.nl"
              className="w-full rounded-xl border border-cream-dark bg-warm-white px-4 py-3 font-[family-name:var(--font-lato)] text-sm text-text-dark placeholder:text-text-muted/50 outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
            />
          </div>

          {/* Telefoon */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-bold text-text-dark"
            >
              Telefoonnummer
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="06-12345678"
              className="w-full rounded-xl border border-cream-dark bg-warm-white px-4 py-3 font-[family-name:var(--font-lato)] text-sm text-text-dark placeholder:text-text-muted/50 outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
            />
          </div>

          {/* Gelegenheid */}
          <div>
            <label
              htmlFor="occasion"
              className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-bold text-text-dark"
            >
              Gelegenheid
            </label>
            <select
              id="occasion"
              name="occasion"
              className="w-full rounded-xl border border-cream-dark bg-warm-white px-4 py-3 font-[family-name:var(--font-lato)] text-sm text-text-dark outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
            >
              <option value="">Selecteer (optioneel)...</option>
              <option value="familieweekend">Familieweekend</option>
              <option value="vriendengroep">Vriendengroep</option>
              <option value="vrijgezellenfeest">Vrijgezellenfeest</option>
              <option value="teambuilding">Teambuilding</option>
              <option value="vergadering">Vergadering / Training</option>
              <option value="feest">Feest / Jubileum</option>
              <option value="anders">Anders</option>
            </select>
          </div>
        </div>

        {/* Opmerkingen */}
        <div className="mt-6">
          <label
            htmlFor="message"
            className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-bold text-text-dark"
          >
            Opmerkingen of wensen
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Heeft u speciale wensen? Denk aan catering, activiteiten, of andere verzoeken..."
            className="w-full resize-none rounded-xl border border-cream-dark bg-warm-white px-4 py-3 font-[family-name:var(--font-lato)] text-sm text-text-dark placeholder:text-text-muted/50 outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
          />
        </div>

        {/* Checkboxes */}
        <div className="mt-6 space-y-3">
          <label className="flex items-start gap-3 font-[family-name:var(--font-lato)] text-sm text-text-muted">
            <input
              type="checkbox"
              name="catering"
              className="mt-0.5 h-4 w-4 rounded border-cream-dark accent-terracotta"
            />
            Ik heb interesse in catering / buffetten
          </label>
          <label className="flex items-start gap-3 font-[family-name:var(--font-lato)] text-sm text-text-muted">
            <input
              type="checkbox"
              name="zakelijk"
              className="mt-0.5 h-4 w-4 rounded border-cream-dark accent-terracotta"
            />
            Dit is een zakelijke boeking
          </label>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <button
            type="submit"
            className="rounded-full bg-terracotta px-10 py-4 font-[family-name:var(--font-lato)] text-[1rem] font-bold text-white transition-colors hover:bg-terracotta-dark"
          >
            Beschikbaarheid aanvragen
          </button>
          <p className="mt-3 font-[family-name:var(--font-lato)] text-xs text-text-muted">
            U ontvangt binnen 24 uur een reactie van ons.
          </p>
        </div>
      </div>
    </form>
  );
}
