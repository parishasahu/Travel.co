'use client';


type HeroTextProps = {
  text1Ref: React.RefObject<HTMLHeadingElement | null>;
  text2Ref: React.RefObject<HTMLHeadingElement | null>;
  text3Ref: React.RefObject<HTMLHeadingElement | null>;
};

export const HeroText = ({ text1Ref, text2Ref, text3Ref }: HeroTextProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <h2 ref={text1Ref} className="absolute text-5xl md:text-7xl lg:text-9xl font-serif text-white text-center tracking-tight opacity-0">
        WHAT ARE YOU<br/>WAITING FOR?
      </h2>
      <h2 ref={text2Ref} className="absolute text-5xl md:text-7xl lg:text-9xl font-serif text-white text-center tracking-tight opacity-0">
        YOU DESERVE IT
      </h2>
      <h2 ref={text3Ref} className="absolute text-5xl md:text-7xl lg:text-9xl font-serif text-[#D4AF37] text-center tracking-tight opacity-0">
        BOOK YOUR ESCAPE
      </h2>
    </div>
  );
};
