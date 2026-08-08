import { cn } from "@/lib/utils";
import React from "react";

export interface GlassShineCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const GlassShineCard: React.FC<GlassShineCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/30 hover:bg-white/15 group",
        className
      )}
      {...props}
    >
      {/* Shine effect light beam sweep */}
      <div className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:animate-[shine_2s_infinite] group-hover:opacity-100" />
      {/* Inner glass highlights */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 via-transparent to-black/10" />
      {/* Card content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const SampleCard: React.FC = () => {
  return (
    <div className="container">
      <div className="card">
        <p className="innerText">SAMPLE TEXT</p>
        <p className="desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id
          dictum augue, id viverra.
        </p>
      </div>
    </div>
  );
};

export default GlassShineCard;
