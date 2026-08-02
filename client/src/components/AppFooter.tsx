/**
 * AppFooter — Minimal footer
 * Editorial Theme: Light cream bg, dark muted text
 */
export function AppFooter() {
  return (
    <footer className="border-t border-[#e8e4df] mt-12 py-6 bg-[#faf8f5]">
      <div className="container max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#1a1a1a]/25">
          <span>MyHabits.io © {new Date().getFullYear()}</span>
          <span className="italic">"We are what we repeatedly do."</span>
          <span>
            SYNCED · {new Date().toLocaleTimeString("en-US", { hour12: false }).substring(0, 8)} LOCAL
          </span>
        </div>
      </div>
    </footer>
  );
}
