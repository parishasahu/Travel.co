'use client';

import { forwardRef } from 'react';

export const HeroCanvas = forwardRef<HTMLCanvasElement, { loaded: boolean, progress: number }>(
  ({ loaded, progress }, ref) => {
    return (
      <>
        {!loaded && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0C0C0C]">
            <p className="text-[#D4AF37] font-mono tracking-widest text-sm">
              LOADING SEQUENCE {Math.round(progress * 100)}%
            </p>
          </div>
        )}
        <canvas 
          ref={ref} 
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%' }}
        />
      </>
    );
  }
);

HeroCanvas.displayName = 'HeroCanvas';
