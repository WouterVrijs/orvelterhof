import type { MetadataRoute } from "next";

const BASE_URL = "https://www.orvelterhof.nl";

const routes = [
  "/",
  "/kamers",
  "/faciliteiten",
  "/vergaderlocatie",
  "/teambuilding-trainingen",
  "/arrangementen",
  "/buffetten-catering",
  "/luxe-ontbijtbuffet",
  "/tarieven",
  "/dagje-uit",
  "/dagje-uit/erop-uit-met-kinderen",
  "/dagje-uit/spannend-en-sportief",
  "/dagje-uit/natuur-historie",
  "/dagje-uit/kunst-cultuur",
  "/dagje-uit/eten-drinken",
  "/over-ons",
  "/contact",
  "/plattegrond",
  "/zoek-en-boek",
  "/algemene-voorwaarden",
  "/privacybeleid",
  "/veelgestelde-vragen",
];

const locales = ["nl", "de", "en"] as const;
const defaultLocale = "nl";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const languages: Record<string, string> = {};

    for (const locale of locales) {
      const prefix = locale === defaultLocale ? "" : `/${locale}`;
      languages[locale] = `${BASE_URL}${prefix}${route === "/" ? "" : route}`;
    }

    entries.push({
      url: `${BASE_URL}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1.0 : route.includes("dagje-uit/") ? 0.6 : 0.8,
      alternates: { languages },
    });
  }

  return entries;
}
