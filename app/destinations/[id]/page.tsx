'use client';

import { use, useRef, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { getDestinationDetails } from '@/lib/destination-details';
import { Button } from '@/components/ui/Button';

export default function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const dest = getDestinationDetails(resolvedParams.id);

  if (!dest) {
    notFound();
  }

  const { scrollYProgress } = useScroll();

  return (
    <main className="bg-[#0C0C0C] min-h-screen selection:bg-[#D4AF37] selection:text-black">
      
      {/* Sticky Back Button */}
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={() => router.push('/destinations')}
        className="fixed top-8 left-8 md:top-12 md:left-12 z-50 mix-blend-difference text-white font-mono text-xs tracking-widest hover:text-[#D4AF37] transition-colors"
      >
        ← BACK TO DESTINATIONS
      </motion.button>

      {/* 1. CINEMATIC HERO SECTION */}
      <HeroSection dest={dest} scrollYProgress={scrollYProgress} />

      {/* 2. COMPLETE PACKAGE DETAILS SECTION */}
      <PackageDetailsSection dest={dest} />

      {/* 3. ITINERARY TIMELINE */}
      <ItinerarySection dest={dest} />

      {/* 4. IMAGE GALLERY EXPERIENCE */}
      <GallerySection dest={dest} />

      {/* 5. INTERACTIVE GUIDE SECTION */}
      <GuideSection dest={dest} />

      {/* 6. LUXURY STAY SECTION */}
      <StaysSection dest={dest} />

      {/* 6.5 REVIEWS & TESTIMONIALS SECTION */}
      <ReviewsSection dest={dest} />

      {/* 7. PACKAGE BOOKING SECTION */}
      <BookingFooter dest={dest} router={router} />
      
    </main>
  );
}

// -------------------------------------------------------------
// SECTIONS
// -------------------------------------------------------------

function HeroSection({ dest, scrollYProgress }: { dest: any, scrollYProgress: any }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <img 
          src={dest.heroImage} 
          alt={dest.title} 
          className="w-full h-full object-cover animate-slowZoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#0C0C0C] z-10" />
      </motion.div>
      
      <motion.div 
        style={{ opacity }}
        className="relative z-20 text-center px-6 flex flex-col items-center mt-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <span className="text-[#D4AF37] font-mono tracking-[0.3em] text-sm md:text-base mb-6 block uppercase">{dest.id}</span>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white tracking-widest mb-6 drop-shadow-2xl">
          {dest.title}
        </h1>
        <p className="text-gray-200 font-sans font-light text-xl md:text-2xl max-w-2xl italic">
          "{dest.tagline}"
        </p>
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-white/50 to-transparent mx-auto animate-pulse" />
      </motion.div>
    </section>
  );
}

function PackageDetailsSection({ dest }: { dest: any }) {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 relative bg-[#0C0C0C] z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">The Experience</h2>
            <p className="text-gray-400 font-sans font-light text-lg leading-relaxed mb-12">
              {dest.introduction}
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <span className="text-[#D4AF37] font-mono text-xs tracking-widest block mb-2">DURATION</span>
                <span className="text-white font-serif text-xl">{dest.packageOverview.duration}</span>
              </div>
              <div>
                <span className="text-[#D4AF37] font-mono text-xs tracking-widest block mb-2">STARTING FROM</span>
                <span className="text-white font-serif text-xl">{dest.packageOverview.startingPrice}</span>
              </div>
              <div>
                <span className="text-[#D4AF37] font-mono text-xs tracking-widest block mb-2">BEST SEASON</span>
                <span className="text-white font-serif text-xl">{dest.packageOverview.bestSeason}</span>
              </div>
              <div>
                <span className="text-[#D4AF37] font-mono text-xs tracking-widest block mb-2">IDEAL FOR</span>
                <span className="text-white font-serif text-xl">{dest.packageOverview.idealFor}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#111] p-10 md:p-16 border border-[#D4AF37]/20 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#D4AF37]/5 z-0 transition-colors group-hover:bg-[#D4AF37]/10" />
            <h3 className="text-2xl font-serif text-white mb-8 relative z-10">Package Includes</h3>
            <ul className="space-y-6 relative z-10">
              {dest.experienceIncludes.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-[#D4AF37] mt-1">✧</span>
                  <span className="text-gray-300 font-sans font-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ItinerarySection({ dest }: { dest: any }) {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-24 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-20 text-center tracking-widest">
          ITINERARY
        </h2>
        <div className="relative border-l border-white/10 ml-4 md:ml-8 pl-8 md:pl-16 space-y-24">
          {dest.itinerary.map((day: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -left-[41px] md:-left-[73px] top-1 w-4 h-4 rounded-full bg-[#0C0C0C] border-2 border-[#D4AF37] group-hover:bg-[#D4AF37] transition-colors duration-500" />
              <span className="text-[#D4AF37] font-mono tracking-widest text-sm block mb-2">DAY {day.day}</span>
              <h3 className="text-3xl font-serif text-white mb-4 group-hover:text-[#D4AF37] transition-colors">{day.title}</h3>
              <p className="text-gray-400 font-sans font-light leading-relaxed">{day.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ dest }: { dest: any }) {
  if (!dest.gallery || dest.gallery.length === 0) return null;
  
  return (
    <section className="py-24 bg-[#0C0C0C]">
      <div className="px-6 md:px-12 lg:px-24 mb-12">
        <h2 className="text-4xl md:text-5xl font-serif text-white tracking-widest">IMPRESSIONS</h2>
      </div>
      <div className="flex overflow-x-auto gap-8 px-6 md:px-12 lg:px-24 pb-12 snap-x hide-scrollbar">
        {dest.gallery.map((img: string, i: number) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[40vw] h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden snap-center relative group"
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
            <img src={img} alt={`${dest.title} gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function GuideSection({ dest }: { dest: any }) {
  const guide = dest.guide;
  if (!guide) return null;

  return (
    <section className="px-6 md:px-12 lg:px-24 py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-16 tracking-widest text-center">CURATED GUIDE</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GuideCard title="Best Places" items={guide.bestPlaces} />
          <GuideCard title="Gastronomy" items={guide.restaurants} />
          <GuideCard title="Hidden Gems" items={guide.hiddenGems} />
          <GuideCard title="Activities" items={guide.activities} />
          <GuideCard title="Culture" text={guide.culture} />
          <GuideCard title="Tips & Weather" text={`${guide.weather} ${guide.tips.join('. ')}`} />
        </div>
      </div>
    </section>
  );
}

function GuideCard({ title, items, text }: { title: string, items?: string[], text?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#111] p-8 border border-white/5 hover:border-[#D4AF37]/30 transition-colors duration-500 rounded-xl"
    >
      <h3 className="text-[#D4AF37] font-serif text-2xl mb-6">{title}</h3>
      {items ? (
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="text-gray-300 font-sans font-light border-b border-white/5 pb-2 last:border-0">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-300 font-sans font-light leading-relaxed">{text}</p>
      )}
    </motion.div>
  );
}

function StaysSection({ dest }: { dest: any }) {
  if (!dest.stays || dest.stays.length === 0) return null;

  return (
    <section className="px-6 md:px-12 lg:px-24 py-24 bg-[#0C0C0C]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-16 tracking-widest text-center">LUXURY STAYS</h2>
        <div className="flex flex-col gap-16">
          {dest.stays.map((stay: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col lg:flex-row gap-12 items-center group"
            >
              <div className="w-full lg:w-3/5 h-[40vh] md:h-[60vh] rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                <img src={stay.image} alt={stay.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
              </div>
              <div className="w-full lg:w-2/5">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(stay.rating)].map((_, idx) => (
                    <span key={idx} className="text-[#D4AF37] text-xl">★</span>
                  ))}
                </div>
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 group-hover:text-[#D4AF37] transition-colors">{stay.name}</h3>
                <p className="text-gray-400 font-mono text-sm tracking-widest mb-8">{stay.price}</p>
                <h4 className="text-white font-serif text-xl mb-4">Resort Amenities</h4>
                <ul className="space-y-2 mb-8">
                  {stay.amenities.map((amenity: string, idx: number) => (
                    <li key={idx} className="text-gray-400 font-sans font-light flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#D4AF37] rounded-full" /> {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ dest }: { dest: any }) {
  if (!dest.reviews || !dest.reviews.items || dest.reviews.items.length === 0) return null;

  return (
    <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      
      <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-serif text-white tracking-widest mb-6">
            GUEST STORIES
          </h2>
          <div className="inline-flex items-center gap-4 bg-[#111] border border-[#D4AF37]/30 px-8 py-4 rounded-full">
            <span className="text-[#D4AF37] font-serif text-2xl">{dest.reviews.averageRating}/5</span>
            <span className="w-[1px] h-6 bg-white/20" />
            <span className="text-gray-300 font-mono text-sm tracking-widest">{dest.reviews.totalReviews} LUXURY TRAVELERS</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dest.reviews.items.map((review: any, i: number) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-[#111]/50 backdrop-blur-md p-10 border border-white/5 rounded-2xl relative group hover:border-[#D4AF37]/40 transition-all duration-700"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="flex items-center gap-2 mb-8">
                {[...Array(review.rating)].map((_, idx) => (
                  <span key={idx} className="text-[#D4AF37] text-lg">★</span>
                ))}
              </div>
              
              <p className="text-gray-300 font-serif text-lg md:text-xl leading-relaxed italic mb-10">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                  <img src={review.profileImage} alt={review.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div>
                  <h4 className="text-white font-mono text-sm tracking-widest">{review.name}</h4>
                  <p className="text-gray-500 font-sans text-xs uppercase tracking-wider">{review.country} • {review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingFooter({ dest, router }: { dest: any, router: any }) {
  return (
    <section className="relative py-32 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={dest.heroImage} className="w-full h-full object-cover filter brightness-50" />
        <div className="absolute inset-0 bg-[#0C0C0C]/80" />
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl px-6"
      >
        <h2 className="text-5xl md:text-7xl font-serif text-white mb-6">Reserve Your Escape</h2>
        <p className="text-gray-300 font-sans font-light text-lg mb-12">
          Contact our dedicated concierge to begin designing your bespoke {dest.title} journey.
        </p>
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => router.push(`/inquiry?destination=${dest.id}`)}
        >
          BEGIN INQUIRY
        </Button>
      </motion.div>
    </section>
  );
}
