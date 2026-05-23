'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Destination {
  span: string;
  image: string;
  title: string;
  description: string;
}

export default function DestinationCard({ dest }: { dest: Destination }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Parallax subtle rotation
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3]);

  // Mouse glare/glow effect
  const glareX = useTransform(springX, [-0.5, 0.5], [100, -100]);
  const glareY = useTransform(springY, [-0.5, 0.5], [100, -100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative rounded-xl md:rounded-2xl overflow-hidden bg-[#111111] cursor-pointer group ${dest.span} min-h-[400px] md:min-h-0 border border-white/5`}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={dest.image}
          alt={dest.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:brightness-110"
        />
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />
      <div className="absolute inset-0 z-10 transition-opacity duration-700 bg-[#0C0C0C]/20 opacity-100 group-hover:opacity-0" />

      {/* Golden border glow on hover */}
      <div className="absolute inset-0 z-20 border-[1px] border-[#D4AF37]/0 group-hover:border-[#D4AF37]/50 rounded-xl md:rounded-2xl transition-all duration-700 ease-out" />
      <div className="absolute inset-0 z-20 shadow-[inset_0_0_80px_rgba(212,175,55,0)] group-hover:shadow-[inset_0_0_80px_rgba(212,175,55,0.15)] transition-all duration-700 ease-out" />

      {/* Dynamic Glare/Shimmer */}
      <motion.div
        className="absolute inset-0 z-20 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 50%)',
          x: glareX,
          y: glareY,
          scale: 1.5,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-30 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="backdrop-blur-sm bg-black/10 absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <h3 className="text-3xl md:text-5xl font-serif text-white tracking-[0.2em] mb-3 md:mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          {dest.title}
        </h3>

        <div className="overflow-hidden">
          <motion.p
            className="text-xs md:text-sm font-mono text-[#D4AF37] tracking-[0.15em] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >
            {dest.description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
