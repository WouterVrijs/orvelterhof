"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const REVIEWS = [
  { name: "Jorien", score: 9, titleKey: "review1Title", textKey: "review1Text" },
  { name: "Leonie van Gompel", score: 10, titleKey: "review2Title", textKey: "review2Text" },
  { name: "Jimmy", score: 9, titleKey: "review3Title", textKey: "review3Text" },
  { name: "Bernadet", score: 10, titleKey: "review4Title", textKey: "review4Text" },
  { name: "Joke Noorlander", score: 10, titleKey: "review5Title", textKey: "review5Text" },
  { name: "Anoniem", score: 10, titleKey: "review6Title", textKey: "review6Text" },
];

function ScoreStars({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.round(score / 2) ? "fill-terracotta text-terracotta" : "text-cream-dark"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const t = useTranslations("reviews");
  const [current, setCurrent] = useState(0);

  function next() {
    setCurrent((c) => (c + 1) % REVIEWS.length);
  }

  function prev() {
    setCurrent((c) => (c - 1 + REVIEWS.length) % REVIEWS.length);
  }

  const review = REVIEWS[current];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — image + text */}
          <div>
            <div className="mb-8 overflow-hidden rounded-2xl">
              <Image
                src="/images/terras-groepsaccommodatie-drenthe-orvelter-hof-11.jpg"
                alt="Gasten genieten bij Orvelter Hof"
                width={800}
                height={600}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <p className="mb-3 font-[family-name:var(--font-lato)] text-[0.7rem] font-bold uppercase tracking-[0.25em] text-terracotta">
              {t("tagline")}
            </p>
            <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-[2.25rem] leading-[1.1] text-olive-dark md:text-[2.75rem]">
              {t("title")}
            </h2>
            <p className="mb-6 font-[family-name:var(--font-lato)] text-[0.9375rem] leading-relaxed text-text-muted">
              {t("subtitle")}
            </p>
            <a
              href="https://www.zoover.nl/a/398375/groepsaccommodatie-orvelter-hof"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl bg-[#543723] px-5 py-3"
            >
              <Image
                src="/images/zoover-badge.webp"
                alt="Zoover 9.7"
                width={160}
                height={33}
                className="h-8 w-auto"
              />
            </a>
          </div>

          {/* Right — review + image */}
          <div>
            {/* Review card */}
            <div className="mb-8 text-center">
              {/* Quote text */}
              <p className="mb-8 font-[family-name:var(--font-playfair)] text-[1.25rem] leading-relaxed text-olive-dark md:text-[1.5rem]">
                &ldquo;{t(review.textKey)}&rdquo;
              </p>

              {/* Navigation + author */}
              <div className="flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={prev}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-dark transition-colors hover:bg-cream"
                >
                  <ChevronLeft size={18} className="text-olive-dark" />
                </button>

                {/* Author */}
                <div className="flex flex-col items-center">
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-terracotta/20 bg-terracotta/10 font-[family-name:var(--font-playfair)] text-xl font-bold text-terracotta">
                    {review.name.charAt(0)}
                  </div>
                  <p className="font-[family-name:var(--font-playfair)] text-base text-olive-dark">
                    {review.name}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <ScoreStars score={review.score} />
                    <span className="font-[family-name:var(--font-lato)] text-xs font-bold text-terracotta">
                      {review.score}/10
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={next}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-dark transition-colors hover:bg-cream"
                >
                  <ChevronRight size={18} className="text-olive-dark" />
                </button>
              </div>

              {/* Dots */}
              <div className="mt-6 flex justify-center gap-1.5">
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === current ? "w-5 bg-terracotta" : "w-1.5 bg-cream-dark"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom image */}
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-12.jpg"
                alt="Luxe slaapkamer Orvelter Hof"
                width={800}
                height={500}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
