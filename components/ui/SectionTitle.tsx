import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export const SectionTitle = ({ children, className, ...props }: HTMLMotionProps<"h2">) => {
  return (
    <motion.h2 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={cn("text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-widest", className)}
      {...props}
    >
      {children}
    </motion.h2>
  );
};
