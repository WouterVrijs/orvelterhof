import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/boeken", "/api/"],
      },
    ],
    sitemap: "https://www.orvelterhof.nl/sitemap.xml",
  };
}
