'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useFramePreload as useImageSequence } from '@/hooks/useFramePreload';
import { HeroCanvas } from './HeroCanvas';
import { HeroText } from './HeroText';
import { HeroOverlay } from './HeroOverlay';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLHeadingElement>(null);

  // We have 240 frames in sequence-1
  const { images, loaded, progress } = useImageSequence('/sequence-1', 'ezgif-frame', 240, 3);

  useEffect(() => {
    if (!loaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    // Draw first frame cover
    const drawImage = (img: HTMLImageElement) => {
      const hRatio = window.innerWidth / img.width;
      const vRatio = window.innerHeight / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (window.innerWidth - img.width * ratio) / 2;
      const centerShift_y = (window.innerHeight - img.height * ratio) / 2;
      
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
      );
    };

    if (images[0]) {
      drawImage(images[0]);
    }

    const frameTracker = { frame: 0 };

    // Scroll trigger for canvas
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1.5, // Buttery smoothing
      }
    });

    tl.to(frameTracker, {
      frame: images.length - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: () => {
        if (images[frameTracker.frame]) {
          drawImage(images[frameTracker.frame]);
        }
      }
    });

    // Typography animations
    const texts = [text1Ref.current, text2Ref.current, text3Ref.current];
    texts.forEach((text, i) => {
      if (text) {
        if (i === 0) {
          // First text appears immediately on load
          gsap.fromTo(text, 
            { opacity: 0, y: 30, filter: 'blur(10px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out', delay: 0.2 }
          );
          // Fades out as we scroll
          gsap.to(text, {
            opacity: 0,
            y: -50,
            filter: 'blur(10px)',
            scrollTrigger: {
              trigger: containerRef.current,
              start: '0% top',
              end: '25% top',
              scrub: 1,
            }
          });
        } else {
          // Subsequent texts fade in and out based on scroll
          gsap.fromTo(text, 
            { opacity: 0, y: 50, filter: 'blur(10px)' },
            { 
              opacity: 1, 
              y: 0, 
              filter: 'blur(0px)',
              scrollTrigger: {
                trigger: containerRef.current,
                start: `${(i) * 40}% top`,
                end: `${(i) * 40 + 15}% top`,
                scrub: 1,
              }
            }
          );
          gsap.to(text, {
            opacity: 0,
            y: -50,
            filter: 'blur(10px)',
            scrollTrigger: {
              trigger: containerRef.current,
              start: `${(i) * 40 + 20}% top`,
              end: `${(i) * 40 + 35}% top`,
              scrub: 1,
            }
          });
        }
      }
    });

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      if (images[frameTracker.frame]) {
        drawImage(images[frameTracker.frame]);
      }
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loaded, images]);

  return (
    <section ref={containerRef} className="relative h-screen bg-[#0C0C0C]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <HeroCanvas ref={canvasRef} loaded={loaded} progress={progress} />
        <HeroOverlay />
        <HeroText text1Ref={text1Ref} text2Ref={text2Ref} text3Ref={text3Ref} />
      </div>
    </section>
  );
}
