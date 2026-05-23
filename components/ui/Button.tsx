import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) => {
  const baseStyles = "font-mono tracking-widest transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[#D4AF37] text-[#0C0C0C] hover:bg-white hover:text-[#0C0C0C]",
    outline: "bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0C0C0C]",
    ghost: "bg-transparent text-white hover:text-[#D4AF37]"
  };

  const sizes = {
    sm: "py-2 px-6 text-xs",
    md: "py-4 px-12 text-sm",
    lg: "py-6 px-16 text-base"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      {...props} 
    />
  );
};
