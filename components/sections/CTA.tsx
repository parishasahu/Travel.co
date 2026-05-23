'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Container } from '@/components/ui/Container';

const schema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  inquiry: z.string().min(10, { message: 'Please tell us more about your inquiry' }),
});

export default function CTA() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
    // Submit logic
  };

  return (
    <section id="contact" className="py-16 bg-[#0C0C0C] relative border-t border-white/5">
      <Container className="flex flex-col md:flex-row gap-16">
        
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
          <GlassPanel className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-8">
              <div className="relative">
                <input 
                  {...register('name')} 
                  placeholder="YOUR NAME"
                  className="w-full bg-transparent border-b border-white/20 pb-4 text-white font-mono tracking-widest focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-gray-600"
                />
                {errors.name && <p className="absolute -bottom-6 text-red-500 text-xs font-mono">{errors.name.message?.toString()}</p>}
              </div>

              <div className="relative">
                <input 
                  {...register('email')} 
                  placeholder="YOUR EMAIL"
                  className="w-full bg-transparent border-b border-white/20 pb-4 text-white font-mono tracking-widest focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-gray-600"
                />
                {errors.email && <p className="absolute -bottom-6 text-red-500 text-xs font-mono">{errors.email.message?.toString()}</p>}
              </div>

              <div className="relative">
                <textarea 
                  {...register('inquiry')} 
                  placeholder="YOUR INQUIRY"
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 pb-4 text-white font-mono tracking-widest focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-gray-600 resize-none"
                />
                {errors.inquiry && <p className="absolute -bottom-6 text-red-500 text-xs font-mono">{errors.inquiry.message?.toString()}</p>}
              </div>

              <Button type="submit" variant="outline" className="mt-8 self-start">
                SUBMIT INQUIRY
              </Button>
            </form>
          </GlassPanel>
        </div>
        
      </Container>
    </section>
  );
}
