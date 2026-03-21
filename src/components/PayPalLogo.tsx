"use client";

export default function PayPalLogo() {
  return (
    <a
      href="https://www.paypal.com/nl/webapps/mpp/paypal-popup"
      title="Hoe PayPal Werkt"
      onClick={(e) => {
        e.preventDefault();
        window.open(
          "https://www.paypal.com/nl/webapps/mpp/paypal-popup",
          "WIPaypal",
          "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1060,height=700"
        );
      }}
      className="flex h-9 w-14 items-center justify-center rounded-md bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
        alt="PayPal Logo"
        className="h-5 w-auto object-contain"
      />
    </a>
  );
}
