export default function Footer() {
  return (
    <footer className="bg-[#0C0C0C] py-16 px-4 md:px-8 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <h2 className="text-6xl md:text-[10rem] font-serif text-white tracking-tighter opacity-10 mb-16 select-none pointer-events-none whitespace-nowrap overflow-hidden">
          THE TRAVEL CO.
        </h2>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-white/10 pt-16">
          <div className="col-span-1 md:col-span-2">
             <h3 className="text-2xl font-serif text-white tracking-widest mb-6">THE TRAVEL CO.</h3>
             <p className="text-gray-500 font-sans font-light max-w-sm">
               Curating the world&apos;s most extraordinary luxury travel experiences for those who demand the absolute best.
             </p>
          </div>
          
          <div>
            <h4 className="text-[#D4AF37] font-mono text-xs tracking-widest mb-6">EXPLORE</h4>
            <ul className="space-y-4 font-mono text-sm tracking-widest text-gray-400">
              <li><a href="#destinations" className="hover:text-white transition-colors">DESTINATIONS</a></li>

              <li><a href="#contact" className="hover:text-white transition-colors">CONTACT</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-mono text-xs tracking-widest mb-6">LEGAL</h4>
            <ul className="space-y-4 font-mono text-sm tracking-widest text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a></li>
            </ul>
          </div>
        </div>
        
        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-32 text-gray-600 font-mono text-xs tracking-widest gap-4">
          <p>&copy; {new Date().getFullYear()} THE TRAVEL CO. ALL RIGHTS RESERVED.</p>
          <p>DESIGNED FOR EXTRAORDINARY</p>
        </div>
      </div>
    </footer>
  );
}
