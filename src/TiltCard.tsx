import React, { useState, useRef } from 'react';
import synth from './audio';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  useGlowPanel?: boolean;
}

export default function TiltCard({ children, maxTilt = 10, className = '', useGlowPanel = true, ...props }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set mouse variables for spotlight border
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Calculate rotation angles
    const width = rect.width;
    const height = rect.height;
    const rotX = -((y / height) - 0.5) * maxTilt;
    const rotY = ((x / width) - 0.5) * maxTilt;

    setTransformStyle(`perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.015, 1.015, 1.015)`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.setProperty('--mouse-x', `-999px`);
      card.style.setProperty('--mouse-y', `-999px`);
    }
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const handleMouseEnter = () => {
    synth.playHover();
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ 
        transform: transformStyle, 
        transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out'
      }}
      className={`${useGlowPanel ? 'glowing-panel border' : ''} relative group ${className}`}
      {...props}
    >
      {/* Spotlight overlay backplate */}
      {useGlowPanel && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-[inherit] z-0"
          style={{
            background: 'radial-gradient(400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(16, 185, 129, 0.05), transparent 80%)'
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
