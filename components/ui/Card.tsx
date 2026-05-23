import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export const Card = ({ children, className }: { children: ReactNode, className?: string }) => {
  return (
    <div className={cn("relative rounded-xl md:rounded-2xl overflow-hidden bg-[#111111] border border-white/5", className)}>
      {children}
    </div>
  );
};
