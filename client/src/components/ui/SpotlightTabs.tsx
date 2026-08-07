import React from "react";
import { motion } from "framer-motion";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface SpotlightTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: "dark" | "light";
}

export const SpotlightTabs: React.FC<SpotlightTabsProps> = ({
  tabs,
  activeId,
  onChange,
  className = "",
  variant = "dark"
}) => {
  const isDark = variant === "dark";

  return (
    <div
      className={`relative flex items-center p-1.5 rounded-xl border overflow-hidden ${
        isDark
          ? "bg-[#1a1a1a] border-white/10 shadow-inner"
          : "bg-[#f5f3ef] border-[#e8e4df] shadow-xs"
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex-1 py-2 px-3 text-xs font-mono font-medium tracking-wide transition-colors cursor-pointer z-10 ${
              isActive
                ? isDark
                  ? "text-[#c8f54e] font-bold"
                  : "text-[#1a1a1a] font-bold"
                : isDark
                ? "text-white/40 hover:text-white/80"
                : "text-[#1a1a1a]/50 hover:text-[#1a1a1a]"
            }`}
          >
            {/* Active Spotlight Highlight Container */}
            {isActive && (
              <motion.div
                layoutId="spotlightTabActive"
                className="absolute inset-0 z-0 pointer-events-none"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 32,
                }}
              >
                {/* Top Glowing Beam Light */}
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full ${
                    isDark
                      ? "bg-[#c8f54e] shadow-[0_0_10px_#c8f54e]"
                      : "bg-[#1a1a1a] shadow-[0_0_8px_rgba(26,26,26,0.5)]"
                  }`}
                />

                {/* Downward Trapezoid Spotlight Cone */}
                <div
                  className={`absolute inset-0 pointer-events-none [clip-path:polygon(20%_0%,80%_0%,100%_100%,0%_100%)] ${
                    isDark
                      ? "bg-gradient-to-b from-[#c8f54e]/35 via-[#c8f54e]/10 to-transparent"
                      : "bg-gradient-to-b from-[#1a1a1a]/20 via-[#1a1a1a]/5 to-transparent"
                  }`}
                />

                {/* Ambient Soft Glow Background */}
                <div
                  className={`absolute inset-0 rounded-lg ${
                    isDark ? "bg-white/[0.04]" : "bg-white/80 shadow-xs"
                  }`}
                />
              </motion.div>
            )}

            <span className="relative z-10 flex items-center justify-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                    isActive
                      ? isDark
                        ? "bg-[#c8f54e]/20 text-[#c8f54e]"
                        : "bg-[#1a1a1a] text-white"
                      : isDark
                      ? "bg-white/10 text-white/50"
                      : "bg-[#1a1a1a]/10 text-[#1a1a1a]/60"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
