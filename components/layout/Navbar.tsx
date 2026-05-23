'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-700 py-6 px-8 flex justify-between items-center",
          isScrolled ? "bg-[#0C0C0C]/50 backdrop-blur-md py-4" : "bg-transparent"
        )}
      >
        <div className="text-white font-serif text-2xl tracking-widest z-50 relative mix-blend-difference cursor-pointer">
          THE TRAVEL CO.
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white z-50 relative p-2 mix-blend-difference hover:text-[#D4AF37] transition-colors"
        >
          {isMenuOpen ? <X size={28} strokeWidth={1} /> : <Menu size={28} strokeWidth={1} />}
        </button>
      </nav>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
