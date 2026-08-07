import React from 'react';

interface CardCanvasProps {
  children: React.ReactNode;
  className?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ children, className = "" }) => {
  return (
    <div className={`card-canvas relative w-full ${className}`}>
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <filter width="3000%" x="-1000%" height="3000%" y="-1000%" id="unopaq">
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0"></feColorMatrix>
        </filter>
      </svg>
      <div className="card-backdrop"></div>
      {children}
    </div>
  );
};

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`glow-card relative rounded-2xl overflow-hidden p-[2px] transition-all group ${className}`}>
      {/* Animated Traveling Glow Borders */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
        {/* Top Border Beam */}
        <div className="border-element border-top absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent via-[#c8f54e] via-[#38bdf8] to-transparent animate-glow-top" />
        {/* Right Border Beam */}
        <div className="border-element border-right absolute top-[-100%] right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-[#c8f54e] via-[#38bdf8] to-transparent animate-glow-right" />
        {/* Bottom Border Beam */}
        <div className="border-element border-bottom absolute bottom-0 right-[-100%] w-full h-[2px] bg-gradient-to-l from-transparent via-[#c8f54e] via-[#38bdf8] to-transparent animate-glow-bottom" />
        {/* Left Border Beam */}
        <div className="border-element border-left absolute bottom-[-100%] left-0 w-[2px] h-full bg-gradient-to-t from-transparent via-[#c8f54e] via-[#38bdf8] to-transparent animate-glow-left" />
      </div>

      {/* Subtle Glowing Aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#c8f54e]/20 via-[#38bdf8]/20 to-[#c8f54e]/20 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none -z-10" />

      {/* Card Content Container */}
      <div className="card-content relative z-10 w-full h-full rounded-2xl bg-white">
        {children}
      </div>
    </div>
  );
};

export { CardCanvas, Card };
