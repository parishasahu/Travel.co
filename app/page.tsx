import Hero from '@/components/hero/Hero';
import DestinationsGrid from '@/components/destinations/DestinationsGrid';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="w-full bg-[#0C0C0C]">
      <Hero />
      <DestinationsGrid />
      <CTA />
      <Footer />
    </main>
  );
}
