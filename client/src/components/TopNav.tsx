/**
 * TopNav — Editorial Theme navigation
 * Light cream background, green logo, theme tabs, dark CTA button
 */
import { Calendar, Star } from "lucide-react";

export function TopNav() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-[#faf8f5] border-b border-[#e8e4df] sticky top-0 z-50">
      <div className="container max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left — Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-[#c8f54e] rounded-sm flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6l2 2 4-4" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-base text-[#1a1a1a]">
                MyHabits.io
              </span>
            </div>

            {/* Theme tabs */}
            <div className="hidden md:flex items-center gap-1 ml-4">
              <button className="text-[10px] font-mono tracking-wider text-[#1a1a1a]/40 px-2 py-1 hover:text-[#1a1a1a]/60 transition-colors">
                PASTEL
              </button>
              <button className="text-[10px] font-mono tracking-wider text-[#1a1a1a] bg-[#c8f54e] px-2.5 py-1 rounded-sm font-semibold">
                EDITORIAL
              </button>
              <button className="text-[10px] font-mono tracking-wider text-[#1a1a1a]/40 px-2 py-1 hover:text-[#1a1a1a]/60 transition-colors">
                ALMANAC
              </button>
            </div>
          </div>

          {/* Center — Date */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#1a1a1a]/40 font-mono tracking-wide">
            <Calendar className="w-3 h-3" />
            {dateStr.toUpperCase()}
          </div>

          {/* Right — Navigation */}
          <nav className="flex items-center gap-4">
            <a
              href="#"
              className="text-xs text-[#1a1a1a]/40 hover:text-[#1a1a1a]/70 transition-colors font-mono"
            >
              ← Home
            </a>
            <a
              href="#"
              className="text-xs text-[#1a1a1a]/40 hover:text-[#1a1a1a]/70 transition-colors font-mono"
            >
              Sign in
            </a>
            <a
              href="#"
              className="text-xs font-mono bg-[#1a1a1a] text-white px-4 py-1.5 rounded-sm hover:bg-[#2a2a2a] transition-colors"
            >
              Get it · from $3.99
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
