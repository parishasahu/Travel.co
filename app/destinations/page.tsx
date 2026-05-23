'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const allDestinations = [
  {
    id: 'maldives',
    title: 'MALDIVES',
    description: 'Bioluminescent escapes over crystal waters. A sanctuary of peace and ultimate privacy in the Indian Ocean.',
    price: 'Starting from $15,000',
    duration: '7 Days / 6 Nights',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2065&q=80',
  },
  {
    id: 'santorini',
    title: 'SANTORINI',
    description: 'Aegean sunsets and white cliffside architecture. Experience the romance and myth of the Greek islands.',
    price: 'Starting from $8,500',
    duration: '5 Days / 4 Nights',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'bali',
    title: 'BALI',
    description: 'Spiritual retreats hidden in lush jungle canopies. Reconnect with nature in luxury villas.',
    price: 'Starting from $6,000',
    duration: '10 Days / 9 Nights',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80',
  },
  {
    id: 'swiss-alps',
    title: 'SWISS ALPS',
    description: 'Unparalleled alpine luxury. Ski-in, ski-out chalets with panoramic views of snow-capped peaks.',
    price: 'Starting from $22,000',
    duration: '7 Days / 6 Nights',
    image: 'https://images.unsplash.com/photo-1531366936337-775928d00e54?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'dubai',
    title: 'DUBAI',
    description: 'Futuristic opulence in the desert. Penthouse suites and private yacht tours in the Arabian Gulf.',
    price: 'Starting from $12,000',
    duration: '4 Days / 3 Nights',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'kyoto',
    title: 'KYOTO',
    description: 'Ancient tranquility in cinematic street scenes. Exclusive ryokan stays with private onsen.',
    price: 'Starting from $14,000',
    duration: '8 Days / 7 Nights',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 'paris',
    title: 'PARIS',
    description: 'The epitome of romance and haute couture. Private tours of the Louvre and Michelin-starred dining.',
    price: 'Starting from $10,500',
    duration: '5 Days / 4 Nights',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80',
  },
  {
    id: 'iceland',
    title: 'ICELAND',
    description: 'Otherworldly landscapes under the Northern Lights. Private helicopter tours over glaciers and volcanoes.',
    price: 'Starting from $18,000',
    duration: '6 Days / 5 Nights',
    image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2159&q=80',
  }
];

export default function DestinationsPage() {
  return (
    <main className="bg-[#0C0C0C] min-h-screen pt-32 pb-24">
      {/* Hero Section */}
      <section className="h-[60vh] flex flex-col items-center justify-center text-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="z-10"
        >
          <h4 className="text-[#D4AF37] font-mono text-sm tracking-[0.3em] mb-6">PORTFOLIO</h4>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-widest mb-6">
            CURATED <br className="hidden md:block"/> ESCAPES
          </h1>
          <p className="text-gray-400 font-sans font-light max-w-xl mx-auto text-lg md:text-xl">
            A handpicked collection of the world's most extraordinary destinations, designed for the discerning traveler.
          </p>
        </motion.div>
      </section>

      {/* Destinations List */}
      <section className="px-6 md:px-12 lg:px-24 flex flex-col gap-32 mt-16">
        {allDestinations.map((dest, index) => {
          const isEven = index % 2 === 0;
          return (
            <DestinationRow key={dest.id} dest={dest} isEven={isEven} />
          );
        })}
      </section>
    </main>
  );
}

function DestinationRow({ dest, isEven }: { dest: typeof allDestinations[0], isEven: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity }}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 lg:gap-24 items-center group`}
    >
      {/* Image Container with Parallax */}
      <div className="w-full md:w-3/5 h-[50vh] md:h-[80vh] relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-1000" />
        <motion.img 
          style={{ y, scale: 1.1 }}
          src={dest.image}
          alt={dest.title}
          className="absolute inset-0 w-full h-full object-cover origin-center"
        />
      </div>

      {/* Text Content */}
      <div className="w-full md:w-2/5 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-6 opacity-60">
            <span className="w-12 h-[1px] bg-[#D4AF37]"></span>
            <p className="text-[#D4AF37] font-mono tracking-widest text-sm uppercase">{dest.duration}</p>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-widest mb-6">
            {dest.title}
          </h2>
          
          <p className="text-gray-400 font-sans font-light text-lg leading-relaxed mb-8">
            {dest.description}
          </p>

          <p className="text-white font-mono tracking-widest text-sm mb-12">
            {dest.price}
          </p>

          <Button variant="outline" size="lg" className="w-fit" onClick={() => router.push(`/destinations/${dest.id}`)}>
            EXPLORE JOURNEY
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
