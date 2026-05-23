'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Container } from '@/components/ui/Container';

export default function CTA() {
  const router = useRouter();

  return (
    <section id="contact" className="py-16 bg-[#0C0C0C] relative border-t border-white/5">
      <Container className="flex flex-col md:flex-row gap-16 items-center">
        
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h4 className="text-[#D4AF37] font-mono text-sm tracking-widest mb-6">CONNECT</h4>
          <SectionTitle className="mb-8">
            BEGIN YOUR ESCAPE
          </SectionTitle>
          <p className="text-gray-400 font-sans font-light max-w-md text-lg leading-relaxed">
            Reach out to our dedicated concierge team to start designing your bespoke luxury experience.
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <GlassPanel className="p-8 md:p-16 flex flex-col items-center justify-center text-center space-y-8 min-h-[300px]">
            <p className="text-white font-serif text-3xl tracking-wide">Ready to craft your journey?</p>
            <p className="text-gray-400 font-sans text-sm max-w-xs">Share your dreams and let our experts curate an unforgettable experience.</p>
            <Button onClick={() => router.push('/inquiry')} variant="outline" size="lg" className="mt-4">
              START INQUIRY
            </Button>
          </GlassPanel>
        </div>
        
      </Container>
    </section>
  );
}
