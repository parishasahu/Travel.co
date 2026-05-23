'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const journals = [
  {
    id: '1',
    title: '48 Hours in Santorini',
    category: 'DESTINATION GUIDE',
    date: 'May 12, 2026',
    excerpt: 'Discovering the hidden cliffside paths and private cellars of the Aegean\'s most iconic island.',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: true
  },
  {
    id: '2',
    title: 'Inside the Maldives Private Villas',
    category: 'LUXURY STAYS',
    date: 'April 28, 2026',
    excerpt: 'An exclusive look at the architectural marvels floating above the bioluminescent waters of the Indian Ocean.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2065&q=80',
    featured: false
  },
  {
    id: '3',
    title: 'The Art of Slow Luxury Travel',
    category: 'EDITORIAL',
    date: 'April 15, 2026',
    excerpt: 'Why the new ultimate luxury is having the time to immerse completely in local culture without an itinerary.',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: false
  },
  {
    id: '4',
    title: 'Hidden Escapes of Kyoto',
    category: 'CULTURE',
    date: 'March 30, 2026',
    excerpt: 'Beyond the golden pavilion: discovering exclusive ryokans and private tea ceremonies in Japan\'s ancient capital.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: false
  }
];

export default function JournalsPage() {
  return (
    <main className="bg-[#0C0C0C] min-h-screen pt-32 pb-24">
      {/* Editorial Header */}
      <section className="px-6 md:px-12 lg:px-24 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="max-w-4xl"
        >
          <h4 className="text-[#D4AF37] font-mono text-sm tracking-[0.3em] mb-6">THE EDITORIAL</h4>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-wide mb-8 leading-tight">
            Journeys &<br /> Inspirations
          </h1>
          <p className="text-gray-400 font-sans font-light text-lg md:text-xl max-w-2xl">
            Immersive stories, insider guides, and reflections on the art of bespoke travel from our global network of experts.
          </p>
        </motion.div>
      </section>

      {/* Featured Article */}
      <section className="px-6 md:px-12 lg:px-24 mb-24">
        <FeaturedJournal article={journals[0]} />
      </section>

      {/* Grid Articles */}
      <section className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {journals.slice(1).map((article, index) => (
            <JournalCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}

function FeaturedJournal({ article }: { article: typeof journals[0] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <motion.div 
      ref={containerRef}
      className="relative group cursor-pointer w-full h-[60vh] md:h-[80vh] rounded-2xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 1 }}
    >
      <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-colors duration-700" />
      <motion.img 
        style={{ y, scale: 1.1 }}
        src={article.image}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transform origin-center transition-transform duration-[10s] group-hover:scale-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-20" />
      
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[#D4AF37] font-mono tracking-widest text-xs">{article.category}</span>
          <span className="w-1 h-1 bg-white/50 rounded-full"></span>
          <span className="text-white/70 font-mono tracking-widest text-xs">{article.date}</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-serif text-white tracking-wide mb-4">
          {article.title}
        </h2>
        <p className="text-gray-300 font-sans font-light text-lg md:text-xl max-w-2xl hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
          {article.excerpt}
        </p>
      </div>
    </motion.div>
  );
}

function JournalCard({ article, index }: { article: typeof journals[0], index: number }) {
  return (
    <motion.div 
      className="group cursor-pointer flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="w-full h-80 md:h-[400px] overflow-hidden rounded-xl mb-6 relative">
        <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-700" />
        <img 
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out"
        />
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[#D4AF37] font-mono tracking-widest text-[10px] uppercase">{article.category}</span>
        <span className="w-1 h-1 bg-white/30 rounded-full"></span>
        <span className="text-white/50 font-mono tracking-widest text-[10px] uppercase">{article.date}</span>
      </div>
      
      <h3 className="text-2xl md:text-3xl font-serif text-white tracking-wide mb-3 group-hover:text-[#D4AF37] transition-colors duration-500">
        {article.title}
      </h3>
      
      <p className="text-gray-400 font-sans font-light leading-relaxed line-clamp-3">
        {article.excerpt}
      </p>
    </motion.div>
  );
}
