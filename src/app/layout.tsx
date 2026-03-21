import type { Metadata } from "next";
import { Marcellus, Jost } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
});

const jost = Jost({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Orvelter Hof | Groepsaccommodatie Drenthe",
  description:
    "Sfeervolle groepsaccommodatie voor 2 tot 36 personen in het hart van Drenthe. Luxe kamers, volledig verzorgd, midden in de natuur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${marcellus.variable} ${jost.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
