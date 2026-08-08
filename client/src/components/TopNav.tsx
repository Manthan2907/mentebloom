import { Link, useLocation } from "wouter";
import { Calendar } from "lucide-react";
import PillNav from "./PillNav";

export function TopNav() {
  const [location] = useLocation();
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const navItems = [
    { label: "Dashboard", href: "/app" },
    { label: "Journal", href: "/app/journal" },
    { label: "Analytics", href: "/app/analytics" },
    { label: "Wellness", href: "/app/wellness" },
    { label: "Academic", href: "/app/academic-stress" },
    { label: "Meditation", href: "/app/meditation" },
    { label: "Consult", href: "/app/consultation" }
  ];

  return (
    <header className="bg-[#faf8f5] border-b border-[#e8e4df] sticky top-0 z-50 shrink-0 w-full">
      <div className="container max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 min-h-[56px]">
          {/* Left — Logo & Header Nav Headings */}
          <div className="flex items-center gap-5 shrink-0">
            <Link href="/" className="flex items-center gap-1.5 cursor-pointer">
              <div className="w-5 h-5 bg-[#c8f54e] rounded-sm flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6l2 2 4-4" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-base text-[#1a1a1a]">
                Mentebloom
              </span>
            </Link>

            {/* Feature Headings on Header using React Bits PillNav */}
            <PillNav
              items={navItems}
              activeHref={location}
              baseColor="#1a1a1a"
              pillColor="#f5f3ef"
              pillTextColor="#1a1a1a"
              hoveredPillTextColor="#c8f54e"
              initialLoadAnimation={false}
            />
          </div>

          {/* Center — Date */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#1a1a1a]/40 font-mono tracking-wide">
            <Calendar className="w-3 h-3" />
            {dateStr.toUpperCase()}
          </div>

          {/* Right — Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-[#1a1a1a]/40 hover:text-[#1a1a1a]/70 transition-colors font-mono"
            >
              ← Home
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
