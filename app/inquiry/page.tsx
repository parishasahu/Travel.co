'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  destination: z.string().min(2, 'Destination is required'),
  travelers: z.string().min(1, 'Number of travelers is required'),
  dates: z.string().min(2, 'Travel dates are required'),
  budget: z.string().min(1, 'Budget is required'),
  experience: z.string().min(1, 'Experience type is required'),
  requests: z.string().optional(),
});

type InquiryForm = z.infer<typeof schema>;

export default function InquiryPage() {
  return (
    <main className="min-h-screen bg-[#0C0C0C] flex flex-col md:flex-row pt-[100px] md:pt-0">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-8 md:p-16 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <h4 className="text-[#D4AF37] font-mono text-sm tracking-widest mb-4">INQUIRY</h4>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 leading-tight">
              Begin Your <br /> Journey
            </h1>
            <p className="text-gray-400 font-sans font-light mb-12">
              Share your vision with our concierge team and let us craft your bespoke escape.
            </p>
          </motion.div>

          <Suspense fallback={<div className="text-[#D4AF37] font-mono tracking-widest">LOADING EXPERIENCE...</div>}>
            <InquiryFormContent />
          </Suspense>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay z-20 pointer-events-none"></div>
        <img 
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Luxury coastal retreat" 
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-[10s] ease-out"
        />
        <div className="absolute bottom-12 left-12 z-30 pointer-events-none">
          <p className="text-white/70 font-mono text-sm tracking-widest uppercase">The Mediterranean</p>
          <p className="text-white font-serif text-2xl mt-2">Where time stands still</p>
        </div>
      </div>
    </main>
  );
}

function InquiryFormContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = useSearchParams();
  const prefilledDestination = searchParams.get('destination');
  
  // Format destination nicely if it exists (e.g., "maldives" -> "Maldives")
  const formattedDestination = prefilledDestination 
    ? prefilledDestination.charAt(0).toUpperCase() + prefilledDestination.slice(1).replace('-', ' ') 
    : '';

  const { register, handleSubmit, formState: { errors } } = useForm<InquiryForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      destination: formattedDestination
    }
  });

  const onSubmit = async (data: InquiryForm) => {
    setIsSubmitting(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const inputClasses = "w-full bg-transparent border-b border-white/20 pb-4 pt-4 text-white font-mono tracking-widest focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-transparent peer";
  const labelClasses = "absolute left-0 top-4 text-gray-500 font-mono tracking-widest text-sm transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#D4AF37] peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-400";

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-[#D4AF37]/30 p-8 text-center rounded-2xl"
      >
        <h3 className="text-2xl font-serif text-[#D4AF37] mb-4">Request Received</h3>
        <p className="text-gray-400 font-sans font-light">
          Our luxury travel concierge will review your inquiry and contact you within 24 hours to begin designing your experience.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <input {...register('fullName')} id="fullName" placeholder="Full Name" className={inputClasses} />
          <label htmlFor="fullName" className={labelClasses}>FULL NAME</label>
          {errors.fullName && <span className="absolute -bottom-5 text-red-500 text-xs font-mono">{errors.fullName.message}</span>}
        </div>
        <div className="relative">
          <input {...register('email')} id="email" type="email" placeholder="Email" className={inputClasses} />
          <label htmlFor="email" className={labelClasses}>EMAIL ADDRESS</label>
          {errors.email && <span className="absolute -bottom-5 text-red-500 text-xs font-mono">{errors.email.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <input {...register('phone')} id="phone" placeholder="Phone" className={inputClasses} />
          <label htmlFor="phone" className={labelClasses}>PHONE NUMBER</label>
          {errors.phone && <span className="absolute -bottom-5 text-red-500 text-xs font-mono">{errors.phone.message}</span>}
        </div>
        <div className="relative">
          <input {...register('destination')} id="destination" placeholder="Destination" className={inputClasses} />
          <label htmlFor="destination" className={labelClasses}>DESTINATION OF INTEREST</label>
          {errors.destination && <span className="absolute -bottom-5 text-red-500 text-xs font-mono">{errors.destination.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <input {...register('travelers')} id="travelers" placeholder="Travelers" className={inputClasses} />
          <label htmlFor="travelers" className={labelClasses}>NUMBER OF TRAVELERS</label>
          {errors.travelers && <span className="absolute -bottom-5 text-red-500 text-xs font-mono">{errors.travelers.message}</span>}
        </div>
        <div className="relative">
          <input {...register('dates')} id="dates" placeholder="Dates" className={inputClasses} />
          <label htmlFor="dates" className={labelClasses}>TRAVEL DATES</label>
          {errors.dates && <span className="absolute -bottom-5 text-red-500 text-xs font-mono">{errors.dates.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <select {...register('budget')} id="budget" className={inputClasses + " appearance-none cursor-pointer"}>
            <option value="" className="bg-[#0C0C0C] text-gray-500">Select a range...</option>
            <option value="10k-25k" className="bg-[#0C0C0C] text-white">$10,000 - $25,000</option>
            <option value="25k-50k" className="bg-[#0C0C0C] text-white">$25,000 - $50,000</option>
            <option value="50k-100k" className="bg-[#0C0C0C] text-white">$50,000 - $100,000</option>
            <option value="100k+" className="bg-[#0C0C0C] text-white">$100,000+</option>
          </select>
          <label htmlFor="budget" className={labelClasses}>BUDGET RANGE</label>
          {errors.budget && <span className="absolute -bottom-5 text-red-500 text-xs font-mono">{errors.budget.message}</span>}
        </div>
        <div className="relative">
          <select {...register('experience')} id="experience" className={inputClasses + " appearance-none cursor-pointer"}>
            <option value="" className="bg-[#0C0C0C] text-gray-500">Select type...</option>
            <option value="luxury-retreat" className="bg-[#0C0C0C] text-white">Luxury Retreat</option>
            <option value="honeymoon" className="bg-[#0C0C0C] text-white">Honeymoon</option>
            <option value="adventure" className="bg-[#0C0C0C] text-white">Adventure</option>
            <option value="wellness" className="bg-[#0C0C0C] text-white">Wellness</option>
            <option value="private-island" className="bg-[#0C0C0C] text-white">Private Island</option>
          </select>
          <label htmlFor="experience" className={labelClasses}>TYPE OF EXPERIENCE</label>
          {errors.experience && <span className="absolute -bottom-5 text-red-500 text-xs font-mono">{errors.experience.message}</span>}
        </div>
      </div>

      <div className="relative mt-12">
        <textarea {...register('requests')} id="requests" rows={3} placeholder="Requests" className={inputClasses + " resize-none"} />
        <label htmlFor="requests" className={labelClasses}>SPECIAL REQUESTS</label>
      </div>

      <Button type="submit" variant="outline" className="w-full mt-12 py-6 relative overflow-hidden group">
        <span className="relative z-10">{isSubmitting ? 'SUBMITTING...' : 'SUBMIT INQUIRY'}</span>
      </Button>
    </motion.form>
  );
}
