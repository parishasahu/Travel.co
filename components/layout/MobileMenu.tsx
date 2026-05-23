'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '-100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-40 bg-[#0C0C0C] flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay" />
          <ul className="flex flex-col items-center space-y-8">
            {['DESTINATIONS', 'JOURNALS', 'CONTACT'].map((item, i) => (
              <motion.li 
                key={item}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              >
                <a 
                  href={`#${item.toLowerCase()}`} 
                  onClick={onClose}
                  className="text-5xl md:text-7xl font-serif text-white hover:text-[#D4AF37] transition-colors tracking-widest"
                >
                  {item}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
