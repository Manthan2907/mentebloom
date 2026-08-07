import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export interface FlowingMenuItemData {
  id?: string;
  link?: string;
  text: string;
  subtext?: string;
  image?: string;
  color?: string;
  onClick?: () => void;
}

export interface FlowingMenuProps {
  items?: FlowingMenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

interface MenuItemProps extends FlowingMenuItemData {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  isFirst: boolean;
  isActive?: boolean;
  onSelect?: (id: string) => void;
}

export const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = '#1a1a1a',
  bgColor = 'transparent',
  marqueeBgColor = '#1a1a1a',
  marqueeTextColor = '#c8f54e',
  borderColor = '#e8e4df',
  activeId,
  onSelect,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-[#e8e4df] shadow-xs ${className}`} style={{ backgroundColor: bgColor }}>
      <nav className="flex flex-col m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem
            key={item.id || idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isFirst={idx === 0}
            isActive={activeId === item.id}
            onSelect={onSelect}
          />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  id,
  link = '#',
  text,
  subtext,
  image,
  color = '#c8f54e',
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isFirst,
  isActive = false,
  onClick,
  onSelect
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.5, ease: 'power2.out' };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / (contentWidth || 1)) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [text, subtext, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      });
    };

    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [text, subtext, image, repetitions, speed]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  const handleClick = (ev: React.MouseEvent) => {
    ev.preventDefault();
    if (onClick) onClick();
    if (id && onSelect) onSelect(id);
  };

  return (
    <div
      className={`relative overflow-hidden text-center py-3.5 px-4 transition-colors ${
        isActive ? 'bg-[#1a1a1a] text-white' : 'bg-white hover:bg-[#faf8f5]'
      }`}
      ref={itemRef}
      style={{ borderTop: isFirst ? 'none' : `1px solid ${borderColor}` }}
    >
      <a
        className="flex items-center justify-between h-full relative cursor-pointer no-underline font-display font-bold text-base md:text-lg tracking-tight"
        href={link}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: isActive ? '#ffffff' : textColor }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono text-sm tracking-wider uppercase">{text}</span>
          {subtext && (
            <span className={`text-xs font-sans font-normal opacity-60 hidden sm:inline`}>
              — {subtext}
            </span>
          )}
        </div>
        <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-sm ${
          isActive ? 'bg-[#c8f54e] text-[#1a1a1a]' : 'bg-[#f0ece7] text-[#1a1a1a]/60'
        }`}>
          {isActive ? '● SELECTED' : 'SELECT'}
        </span>
      </a>

      {/* Marquee Hover Overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%] z-20"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="h-full w-fit flex items-center" ref={marqueeInnerRef}>
          {[...Array(repetitions)].map((_, idx) => (
            <div className="marquee-part flex items-center flex-shrink-0" key={idx} style={{ color: marqueeTextColor }}>
              <span className="whitespace-nowrap font-mono font-bold text-sm tracking-wider uppercase px-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
                {text} {subtext ? `• ${subtext}` : ''}
              </span>
              {image ? (
                <div
                  className="w-10 h-6 mx-2 rounded-md bg-cover bg-center shrink-0 border border-white/20"
                  style={{ backgroundImage: `url(${image})` }}
                />
              ) : (
                <span className="text-[#c8f54e] font-mono text-xs px-2">★</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;
