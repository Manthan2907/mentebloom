import React from 'react';
import { cn } from '@/lib/utils';

export interface Button6Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
}

export const Button6 = React.forwardRef<HTMLButtonElement, Button6Props>(
  (
    {
      children,
      className,
      onClick,
      disabled,
      type = 'button',
      hoverBgColor = '#c8f54e',
      hoverTextColor = '#1a1a1a',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-xl border-2 border-[#1a1a1a] font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
          className
        )}
        {...props}
      >
        {/* Normal State Text & Icon */}
        <div className="inline-flex h-full w-full translate-y-0 items-center justify-center px-5 bg-[#1a1a1a] text-white transition-all duration-500 ease-out group-hover:-translate-y-[150%] gap-2">
          {children}
        </div>

        {/* Hover Reveal State Text & Icon with Skew Fill */}
        <div className="absolute inline-flex h-full w-full translate-y-[100%] items-center justify-center transition-all duration-500 ease-out group-hover:translate-y-0 gap-2">
          <span
            className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:scale-150"
            style={{ backgroundColor: hoverBgColor }}
          />
          <span
            className="z-10 inline-flex items-center justify-center gap-2 font-bold"
            style={{ color: hoverTextColor }}
          >
            {children}
          </span>
        </div>
      </button>
    );
  }
);

Button6.displayName = 'Button6';
export default Button6;
