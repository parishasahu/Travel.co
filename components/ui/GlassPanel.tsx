import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export const GlassPanel = ({ children, className }: { children: ReactNode, className?: string }) => {
  return (
    <div className={cn("bg-[#1A1A1A]/30 border border-white/5 rounded-sm backdrop-blur-md", className)}>
      {children}
    </div>
  );
};
