"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const SLIDES = [
  {
    src: "/images/groepsaccommodatie-drenthe-orvelter-hof-17-1-2.jpg",
    alt: "Orvelter Hof interieur",
  },
  {
    src: "/images/terras-groepsaccommodatie-drenthe-orvelter-hof-11.jpg",
    alt: "Terras Orvelter Hof",
  },
  {
    src: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof.jpg",
    alt: "Slaapkamer Orvelter Hof",
  },
  {
    src: "/images/keuken-groepsaccommodatie-drenthe-orvelter-hof.jpg",
    alt: "Keuken Orvelter Hof",
  },
  {
    src: "/images/Orvelter-Hof-Buiten-scaled.webp",
    alt: "Orvelter Hof buitenaanzicht",
  },
];

const INTERVAL = 6000;

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <>
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          className={`object-cover transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
          priority={i === 0}
          quality={85}
        />
      ))}
    </>
  );
}
