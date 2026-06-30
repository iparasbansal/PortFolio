import React, { useEffect, useRef } from 'react';

interface ScrollMarqueeProps {
  items: string[];
}

export default function ScrollMarquee({ items }: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  
  // Physics states
  const positionRef = useRef(0);
  const speedBoostRef = useRef(0);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      // Adjust speed boost based on scroll velocity
      // Positive scroll (down) speeds up, negative scroll (up) slows/reverses
      const scaleFactor = 0.12;
      speedBoostRef.current += delta * scaleFactor;

      // Clamp speed boost to prevent excessive speeds
      const maxBoost = 15;
      speedBoostRef.current = Math.max(-maxBoost, Math.min(maxBoost, speedBoostRef.current));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const loop = () => {
      const track = trackRef.current;
      if (!track) {
        animationRef.current = requestAnimationFrame(loop);
        return;
      }

      // Base translation speed
      const baseSpeed = 0.5;
      
      // Update position with physics
      positionRef.current -= baseSpeed + speedBoostRef.current;

      // Dampen speed boost back to 0
      speedBoostRef.current *= 0.94;

      // Loop position infinitely once half width is crossed
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(positionRef.current) >= halfWidth) {
        positionRef.current = 0;
      }

      track.style.transform = `translateX(${positionRef.current}px)`;

      animationRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Double the items array to create seamless loop
  const doubleItems = [...items, ...items, ...items];

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden py-4 select-none pointer-events-none"
    >
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#020617] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#020617] to-transparent z-10" />

      <div 
        ref={trackRef} 
        className="flex whitespace-nowrap gap-8 w-max transition-transform duration-75 ease-out"
      >
        {doubleItems.map((item, idx) => (
          <span 
            key={idx} 
            className="text-[20px] font-mono tracking-wider font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500/40 via-cyan-500/40 to-blue-500/40 hover:from-emerald-400 hover:to-cyan-400 cursor-default transition-all"
          >
            {item.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
