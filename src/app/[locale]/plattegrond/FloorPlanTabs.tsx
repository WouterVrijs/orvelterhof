"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function FloorPlanTabs() {
  const t = useTranslations("plattegrond");

  const TABS = [
    {
      id: "begane-grond",
      label: t("tabBeganeGrond"),
      image: "/images/begane-grond-orvelter-hof.png",
      alt: "Plattegrond begane grond Orvelter Hof",
      width: 1235,
      height: 1115,
    },
    {
      id: "eerste-verdieping",
      label: t("tabEersteVerdieping"),
      image: "/images/eerste-verdieping-orvelter-hof.png",
      alt: "Plattegrond eerste verdieping Orvelter Hof",
      width: 1081,
      height: 758,
    },
    {
      id: "terrein",
      label: t("tabTerrein"),
      image: "/images/plattegrond-terrein.png",
      alt: "Plattegrond terrein Orvelter Hof",
      width: 1444,
      height: 1309,
    },
  ];

  const [activeTab, setActiveTab] = useState("begane-grond");
  const active = TABS.find((tab) => tab.id === activeTab)!;

  return (
    <div>
      {/* Tab buttons */}
      <div className="mb-8 flex gap-1 rounded-xl border border-[#ede6d8] bg-white p-1 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg py-2.5 font-[family-name:var(--font-lato)] text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-olive text-white shadow-sm"
                : "text-[#6b6b63] hover:bg-[#fbf8f6] hover:text-[#4a524f]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Floor plan image */}
      <div className="overflow-hidden rounded-2xl border border-[#ede6d8] bg-white p-4 shadow-sm md:p-8">
        <Image
          key={active.id}
          src={active.image}
          alt={active.alt}
          width={active.width}
          height={active.height}
          className="h-auto w-full"
          priority
        />
      </div>
    </div>
  );
}
