import Image from "next/image";

const rooms = [
  {
    name: "Kamer 1 - Orvelte",
    beds: "1x tweepersoons",
    capacity: 2,
    features: ["Eigen badkamer", "Begane grond"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-1.jpg",
  },
  {
    name: "Kamer 2 - Westerbork",
    beds: "1x tweepersoons",
    capacity: 2,
    features: ["Eigen badkamer", "Begane grond"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-14.jpg",
  },
  {
    name: "Kamer 3 - Schoonoord",
    beds: "1x tweepersoons + 1x eenpersoons",
    capacity: 3,
    features: ["Eigen badkamer", "1e verdieping"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-1.jpg",
  },
  {
    name: "Kamer 4 - Witteveen",
    beds: "1x tweepersoons + 1x eenpersoons",
    capacity: 3,
    features: ["Eigen badkamer", "1e verdieping"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-14.jpg",
  },
  {
    name: "Kamer 5 - Elp",
    beds: "2x tweepersoons",
    capacity: 4,
    features: ["Eigen badkamer", "1e verdieping"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-1.jpg",
  },
  {
    name: "Kamer 6 - Zwiggelte",
    beds: "1x tweepersoons",
    capacity: 2,
    features: ["Eigen badkamer", "1e verdieping"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-14.jpg",
  },
  {
    name: "Kamer 7 - Borger",
    beds: "1x tweepersoons + 1x eenpersoons",
    capacity: 3,
    features: ["Eigen badkamer", "1e verdieping"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-1.jpg",
  },
  {
    name: "Kamer 8 - Emmen",
    beds: "2x tweepersoons",
    capacity: 4,
    features: ["Eigen badkamer", "1e verdieping"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-14.jpg",
  },
  {
    name: "Kamer 9 - Assen",
    beds: "1x tweepersoons",
    capacity: 2,
    features: ["Eigen badkamer", "1e verdieping"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-1.jpg",
  },
  {
    name: "Kamer 10 - Rolde",
    beds: "1x tweepersoons + 1x eenpersoons",
    capacity: 3,
    features: ["Eigen badkamer", "2e verdieping"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-14.jpg",
  },
  {
    name: "Kamer 11 - Dwingeloo",
    beds: "1x tweepersoons",
    capacity: 2,
    features: ["Eigen badkamer", "2e verdieping"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-1.jpg",
  },
  {
    name: "Kamer 12 - Hoogeveen",
    beds: "1x tweepersoons + 1x eenpersoons",
    capacity: 3,
    features: ["Eigen badkamer", "2e verdieping"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-14.jpg",
  },
  {
    name: "Kamer 13 - Coevorden",
    beds: "1x tweepersoons + 1x eenpersoons",
    capacity: 3,
    features: ["Eigen badkamer", "2e verdieping"],
    image: "/images/slaapkamer-groepsaccommodatie-drenthe-orvelter-hof-1.jpg",
  },
];

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-olive-light">
      <path d="M3 7v11m0-4h18m0-3v7M6 7h5v4H6V7zm7 0h5v4h-5V7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-olive-light">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function RoomOverview() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <div
          key={room.name}
          className="group overflow-hidden rounded-2xl bg-warm-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="relative overflow-hidden">
            <Image
              src={room.image}
              alt={room.name}
              width={400}
              height={260}
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
              <span className="font-[family-name:var(--font-lato)] text-xs font-bold text-olive-dark">
                {room.capacity} pers.
              </span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="mb-3 font-[family-name:var(--font-playfair)] text-[1rem] text-olive-dark">
              {room.name}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-[family-name:var(--font-lato)] text-xs text-text-muted">
                <BedIcon />
                {room.beds}
              </div>
              <div className="flex items-center gap-2 font-[family-name:var(--font-lato)] text-xs text-text-muted">
                <PersonIcon />
                Max. {room.capacity} personen
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {room.features.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-cream px-3 py-1 font-[family-name:var(--font-lato)] text-xs text-olive-light"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
