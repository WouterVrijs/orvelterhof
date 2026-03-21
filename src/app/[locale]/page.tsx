import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import RoomShowcase from "@/components/RoomShowcase";
import Facilities from "@/components/Facilities";
import Catering from "@/components/Catering";
import BusinessPackages from "@/components/BusinessPackages";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <Facilities />
        <Catering />
        <RoomShowcase />
        <BusinessPackages />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
