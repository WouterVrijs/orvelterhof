import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentStatus from "./PaymentStatus";

export default async function BetalingPage() {
  const t = await getTranslations("bookingModule");

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-warm-white py-12 md:py-20">
        <div className="mx-auto max-w-xl px-6">
          <PaymentStatus
            labels={{
              checking: t("paymentChecking"),
              paid: t("paymentPaid"),
              paidDescription: t("paymentPaidDescription"),
              pending: t("paymentPending"),
              pendingDescription: t("paymentPendingDescription"),
              failed: t("paymentFailed"),
              failedDescription: t("paymentFailedDescription"),
              expired: t("paymentExpired"),
              expiredDescription: t("paymentExpiredDescription"),
              canceled: t("paymentCanceled"),
              canceledDescription: t("paymentCanceledDescription"),
              referenceNumber: t("referenceNumber"),
              backToHome: t("backToHome"),
              tryAgain: t("tryAgain"),
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
