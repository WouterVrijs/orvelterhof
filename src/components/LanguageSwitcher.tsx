"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";

const FLAGS: Record<Locale, React.ReactNode> = {
  nl: (
    <svg viewBox="0 0 24 16" className="h-4 w-6">
      <rect width="24" height="5.33" fill="#AE1C28" />
      <rect y="5.33" width="24" height="5.33" fill="#FFF" />
      <rect y="10.67" width="24" height="5.33" fill="#21468B" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 24 16" className="h-4 w-6">
      <rect width="24" height="5.33" fill="#000" />
      <rect y="5.33" width="24" height="5.33" fill="#DD0000" />
      <rect y="10.67" width="24" height="5.33" fill="#FFCC00" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 24 16" className="h-4 w-6">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#FFF" strokeWidth="2.5" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.5" />
      <path d="M12 0v16M0 8h24" stroke="#FFF" strokeWidth="4" />
      <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="2.5" />
    </svg>
  ),
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 transition-colors hover:bg-white/20"
      >
        {FLAGS[locale]}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          className={`text-white/70 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-black/5">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[#f5f0ea] ${
                loc === locale ? "bg-[#f5f0ea]" : ""
              }`}
            >
              {FLAGS[loc]}
              <span className="font-[family-name:var(--font-lato)] text-sm text-[#3a3a35]">
                {loc.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
