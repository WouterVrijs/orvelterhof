"use client";

import Script from "next/script";

export default function BukazuWidget() {
  return (
    <>
      <div
        id="bukazu-app"
        className="bukazu-app"
        {...{
          "portal-code": "1a0eb5e6",
          "object-code": "NL0100",
          language: "nl",
        }}
      />
      <Script
        src="https://portal.bukazu.com/main.js"
        strategy="afterInteractive"
      />
    </>
  );
}
