'use client';

import { destinations } from '@/lib/destinations';
import DestinationCard from './DestinationCard';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function DestinationsGrid() {
  return (
    <section id="destinations" className="py-16 bg-[#0C0C0C] relative">
      <Container>
        <SectionTitle className="mb-20 text-center">
          CURATED ESCAPES
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-5 md:grid-rows-3 gap-6 lg:gap-8 min-h-[120vh] md:min-h-[90vh]">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} dest={dest} />
          ))}
        </div>
      </Container>
    </section>
  );
}
