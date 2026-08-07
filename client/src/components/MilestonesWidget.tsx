/**
 * MilestonesWidget — Upcoming milestones
 * Editorial Theme: Light white card
 */
import { Download } from "lucide-react";

export function MilestonesWidget() {
  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-mono tracking-widest text-[#1a1a1a]/30 uppercase">
          Upcoming Milestones
        </h3>
        <span className="text-[10px] font-mono text-[#1a1a1a]/20">2</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8f54e]" />
            <span className="text-sm text-[#1a1a1a]/70">50 Day Streak</span>
          </div>
          <span className="text-[10px] font-mono text-[#1a1a1a]/30">23 DAYS LEFT</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#e0dcd7]" />
            <span className="text-sm text-[#1a1a1a]/30">Quiet Quarter</span>
          </div>
          <span className="text-[10px] font-mono text-[#1a1a1a]/20">LOCKED</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#f0ece7]">
        <button className="flex items-center gap-2 w-full text-xs text-[#1a1a1a]/30 hover:text-[#1a1a1a]/50 transition-colors font-mono py-1.5">
          <Download className="w-3.5 h-3.5" />
          Full Data Export
        </button>
      </div>
    </div>
  );
}
