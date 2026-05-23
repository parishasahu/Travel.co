'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  return (
    <main className="bg-[#0C0C0C] min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none z-0 transform translate-x-1/3 -translate-y-1/3" />
      
      <div className="px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* Header Section */}
        <section className="mb-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <h4 className="text-[#D4AF37] font-mono text-sm tracking-[0.3em] mb-6">CONNECT</h4>
            <h1 className="text-5xl md:text-7xl font-serif text-white tracking-widest mb-6">
              Global Concierge
            </h1>
            <p className="text-gray-400 font-sans font-light max-w-xl mx-auto text-lg leading-relaxed">
              Our travel artisans are available around the clock to design your next extraordinary escape. 
            </p>
          </motion.div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column - Offices & Info */}
          <motion.div 
            className="lg:col-span-5 space-y-16"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-white font-serif text-2xl mb-2">Direct Line</h3>
                <p className="text-[#D4AF37] font-mono tracking-widest">+1 (800) 555-0199</p>
              </div>
              <div>
                <h3 className="text-white font-serif text-2xl mb-2">Email</h3>
                <p className="text-[#D4AF37] font-mono tracking-widest">concierge@thetravel.co</p>
              </div>
              <div>
                <h3 className="text-white font-serif text-2xl mb-2">Social</h3>
                <div className="flex gap-6 mt-4">
                  {['INSTAGRAM', 'TWITTER', 'LINKEDIN'].map((social) => (
                    <a key={social} href="#" className="text-gray-400 font-mono text-xs tracking-widest hover:text-[#D4AF37] transition-colors">
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Offices */}
            <div>
              <h4 className="text-gray-500 font-mono text-sm tracking-[0.2em] mb-8 uppercase border-b border-white/10 pb-4">Our Offices</h4>
              <div className="space-y-8">
                <div>
                  <h3 className="text-white font-serif text-xl mb-2">New York</h3>
                  <p className="text-gray-400 font-sans font-light text-sm">One World Trade Center<br />Suite 4500<br />New York, NY 10007</p>
                </div>
                <div>
                  <h3 className="text-white font-serif text-xl mb-2">London</h3>
                  <p className="text-gray-400 font-sans font-light text-sm">The Shard<br />32 London Bridge St<br />London SE1 9SG</p>
                </div>
                <div>
                  <h3 className="text-white font-serif text-xl mb-2">Dubai</h3>
                  <p className="text-gray-400 font-sans font-light text-sm">Burj Khalifa<br />Corporate Suites<br />Downtown Dubai</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Map & FAQ */}
          <motion.div 
            className="lg:col-span-7 flex flex-col gap-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Map Visual */}
            <div className="w-full h-[400px] rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-[#D4AF37]/10 z-10 group-hover:bg-transparent transition-colors duration-1000 mix-blend-overlay" />
              <div className="absolute inset-0 border border-white/10 rounded-2xl z-20 pointer-events-none" />
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80" 
                alt="Global map abstract" 
                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 transform scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out"
              />
              <div className="absolute bottom-8 left-8 z-30">
                <Button variant="outline" className="bg-black/50 backdrop-blur-md">
                  SCHEDULE CONSULTATION
                </Button>
              </div>
            </div>

            {/* FAQs */}
            <div className="mt-8">
              <h4 className="text-white font-serif text-3xl mb-8">Frequently Asked</h4>
              <div className="border-t border-white/10">
                <FAQItem 
                  question="How far in advance should I book my journey?" 
                  answer="For optimal availability of exclusive villas and private experiences, we recommend initiating the planning process 6-8 months prior to your intended travel dates. For peak holiday seasons, 10-12 months is advisable."
                />
                <FAQItem 
                  question="Do you handle private aviation and yacht charters?" 
                  answer="Yes. Our dedicated transport logistics team orchestrates seamless private jet charters, helicopter transfers, and luxury yacht rentals globally, ensuring your journey is as extraordinary as the destination."
                />
                <FAQItem 
                  question="Is there a minimum budget for your bespoke itineraries?" 
                  answer="While we don't strictly enforce a minimum, our highly customized, full-service itineraries typically start at $15,000 per couple, reflecting the exclusive nature and premium tier of the experiences we curate."
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <span className="text-white font-serif text-xl group-hover:text-[#D4AF37] transition-colors pr-8">
          {question}
        </span>
        <span className="text-[#D4AF37] font-mono text-2xl relative w-4 h-4 flex items-center justify-center">
          <span className="absolute w-full h-[1px] bg-current" />
          <motion.span 
            className="absolute w-[1px] h-full bg-current"
            animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 font-sans font-light pt-6 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
