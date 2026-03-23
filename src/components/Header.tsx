"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

function useNavItems(): NavItem[] {
  const t = useTranslations("common.nav");
  return [
    {
      label: t("stijlvolVerblijven"),
      children: [
        { label: t("kamers"), href: "/kamers" },
        { label: t("faciliteiten"), href: "/faciliteiten" },
        { label: t("plattegrond"), href: "/plattegrond" },
        { label: t("tarieven"), href: "/tarieven" },
        { label: t("buffettenCatering"), href: "/buffetten-catering" },
      ],
    },
    {
      label: t("vergaderlocatie"),
      children: [
        { label: t("vergaderlocatieDrenthe"), href: "/vergaderlocatie" },
        { label: t("teambuildingTrainingen"), href: "/teambuilding-trainingen" },
        { label: t("arrangementen"), href: "/vergaderlocatie#arrangementen" },
        { label: t("contact"), href: "/contact" },
      ],
    },
    {
      label: t("dagjeUit"),
      children: [
        { label: t("overzicht"), href: "/dagje-uit" },
        { label: t("eropuitMetKinderen"), href: "/dagje-uit/erop-uit-met-kinderen" },
        { label: t("spannendEnSportief"), href: "/dagje-uit/spannend-en-sportief" },
        { label: t("natuurHistorie"), href: "/dagje-uit/natuur-historie" },
        { label: t("kunstCultuur"), href: "/dagje-uit/kunst-cultuur" },
        { label: t("etenDrinken"), href: "/dagje-uit/eten-drinken" },
      ],
    },
    {
      label: t("contact"),
      children: [
        { label: t("contactOpnemen"), href: "#contact" },
        { label: t("routebeschrijving"), href: "#contact" },
      ],
    },
  ];
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DesktopDropdown({ item }: { item: NavItem }) {
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

  if (!item.children) {
    return (
      <a
        href={item.href}
        className="font-[family-name:var(--font-lato)] text-[16px] font-bold tracking-wide text-white/80 transition-colors hover:text-white"
      >
        {item.label}
      </a>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 font-[family-name:var(--font-lato)] text-[16px] font-bold tracking-wide text-white/80 transition-colors hover:text-white"
      >
        {item.label}
        <ChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 rounded-xl bg-white py-2 shadow-xl shadow-black/10 ring-1 ring-black/5">
          {item.children.map((child) => (
            <a
              key={child.label}
              href={child.href}
              onClick={() => setOpen(false)}
              className="block whitespace-nowrap px-5 py-2.5 font-[family-name:var(--font-lato)] text-sm text-[#3a3a35] transition-colors hover:bg-[#f5f0ea]"
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const navItems = useNavItems();
  const t = useTranslations("common.nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;

      if (currentY < 50) {
        setVisible(true);
        return;
      }

      if (currentY !== lastScrollY) {
        setVisible(false);
      }
      lastScrollY = currentY;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setVisible(true);
      }, 150);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 overflow-visible bg-[#545959]/95 shadow-md shadow-black/10 backdrop-blur-sm transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
        <a href="/" className="relative z-10">
          <Image
            src="/images/orvelterhof-logo.svg"
            alt="Orvelter Hof"
            width={240}
            height={96}
            className="h-20 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <DesktopDropdown key={item.label} item={item} />
          ))}
          <a
            href="/boeken"
            className="flex items-center gap-2 rounded-full bg-terracotta px-5 py-2 font-[family-name:var(--font-lato)] text-sm font-bold text-white transition-colors hover:bg-terracotta-dark"
          >
            <CalendarDays size={16} />
            {t("zoekEnBoek")}
          </a>
          <LanguageSwitcher />
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 lg:hidden"
          aria-label="Menu"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-white/10 bg-[#545959] px-6 pb-6 lg:hidden">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpanded(
                        mobileExpanded === item.label ? null : item.label
                      )
                    }
                    className="flex w-full items-center justify-between py-3 font-[family-name:var(--font-lato)] text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                    <ChevronDown
                      className={`transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="mb-2 ml-4 border-l border-white/10 pl-4">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={() => setMenuOpen(false)}
                          className="block py-2 font-[family-name:var(--font-lato)] text-sm text-white/60 transition-colors hover:text-white"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 font-[family-name:var(--font-lato)] text-white/80 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
          <div className="mt-3 flex items-center gap-4">
            <a
              href="/boeken"
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2 font-[family-name:var(--font-lato)] text-sm font-bold text-white"
            >
              <CalendarDays size={16} />
              {t("zoekEnBoek")}
            </a>
            <LanguageSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}
