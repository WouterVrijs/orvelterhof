import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloorPlanTabs from "./FloorPlanTabs";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.plattegrond");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PlattegrondPage() {
  const t = await getTranslations("plattegrond");

  const outdoorItems = [
    t("outdoorVolleybal"),
    t("outdoorSpeeltuin"),
    t("outdoorLuchtkussen"),
    t("outdoorSchommel"),
    t("outdoorTerras"),
    t("outdoorParkeren"),
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-[#545959] pb-16 pt-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="mb-3 font-[family-name:var(--font-lato)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[#c8835e]">
              {t("heroTagline")}
            </p>
            <h1 className="mb-4 font-[family-name:var(--font-playfair)] text-[2.25rem] text-white md:text-[3.813rem]">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto max-w-2xl font-[family-name:var(--font-lato)] text-[1rem] font-light leading-relaxed text-white/80">
              {t("heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Floor plan tabs */}
        <section className="bg-[#fbf8f6] py-16">
          <div className="mx-auto max-w-5xl px-6">
            <FloorPlanTabs />
          </div>
        </section>

        {/* Room overview */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-8 text-center font-[family-name:var(--font-playfair)] text-2xl text-[#4a524f] md:text-3xl">
              {t("roomsTitle")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <RoomCard
                title={t("groundFloorTitle")}
                subtitle={t("groundFloorSubtitle")}
                rooms={["Orvelte", "Schoonoord", "Westerbork", "Aalden", "Emmen"]}
                note={t("groundFloorNote")}
              />
              <RoomCard
                title={t("firstFloorTitle")}
                subtitle={t("firstFloorSubtitle")}
                rooms={[
                  "Wezup", "Lhee", "Elp", "Sleen", "Diever",
                  "Zweelo", "Mantinge", "Bruntinge", "Ansen", "Ruinen", "Dwingeloo",
                ]}
              />
              <RoomCard
                title={t("communalTitle")}
                subtitle={t("communalSubtitle")}
                rooms={[
                  t("communalEetzaal"), t("communalVergaderruimte"), t("communalKeuken"), t("communalBar"),
                  t("communalSpeelzolder"), t("communalMulti"),
                ]}
              />
            </div>

            <div className="mt-8 rounded-2xl bg-[#ede6d8] p-8">
              <h3 className="mb-4 font-[family-name:var(--font-playfair)] text-xl text-[#4a524f]">
                {t("outdoorTitle")}
              </h3>
              <div className="grid gap-3 font-[family-name:var(--font-lato)] text-sm text-[#6b6b63] sm:grid-cols-2 md:grid-cols-3">
                {outdoorItems.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="text-[#b8704b]">&bull;</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function RoomCard({
  title,
  subtitle,
  rooms,
  note,
}: {
  title: string;
  subtitle: string;
  rooms: string[];
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#ede6d8] bg-[#fbf8f6] p-6">
      <h3 className="mb-1 font-[family-name:var(--font-playfair)] text-lg text-[#4a524f]">
        {title}
      </h3>
      <p className="mb-4 font-[family-name:var(--font-lato)] text-xs font-medium uppercase tracking-wider text-[#6b6b63]">
        {subtitle}
      </p>
      <div className="flex flex-wrap gap-2">
        {rooms.map((room) => (
          <span
            key={room}
            className="rounded-lg bg-white px-3 py-1.5 font-[family-name:var(--font-lato)] text-xs text-[#4a524f] shadow-sm"
          >
            {room}
          </span>
        ))}
      </div>
      {note && (
        <p className="mt-3 font-[family-name:var(--font-lato)] text-xs italic text-[#6b6b63]">
          {note}
        </p>
      )}
    </div>
  );
}
