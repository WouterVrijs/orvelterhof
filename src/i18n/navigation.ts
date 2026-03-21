import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: {
    mode: "as-needed", // no /nl/ prefix for Dutch
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
