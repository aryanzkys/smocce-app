"use client";
import React from 'react';

export default function LoadingOverlay({ show, message = 'Processing...', tip }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Animated concentric rings */}
        <div className="absolute inset-0 animate-[spin_6s_linear_infinite]">
          <div className="absolute inset-8 rounded-full border-2 border-cyan-400/20"></div>
          <div className="absolute inset-12 rounded-full border-2 border-fuchsia-400/20"></div>
          <div className="absolute inset-16 rounded-full border-2 border-emerald-400/20"></div>
        </div>
        {/* Robotic core */}
        <div className="relative z-10 w-40 h-40 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-[0_0_50px_rgba(56,189,248,0.3)] border border-cyan-400/30 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="w-3 h-3 rounded-full bg-fuchsia-400 animate-[pulse_1.4s_ease_infinite_0.2s]"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-[pulse_1.4s_ease_infinite_0.4s]"></span>
          </div>
          <div className="w-24 h-24 relative">
            {/* Gear */}
            <svg className="absolute inset-0 w-full h-full text-cyan-400/70 animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100" fill="none">
              <path d="M50 32a18 18 0 100 36 18 18 0 000-36zm0-12l4 6 7-2 2 7 7 2-2 7 6 4-6 4 2 7-7 2-2 7-7-2-4 6-4-6-7 2-2-7-7-2 2-7-6-4 6-4-2-7 7-2 2-7 7 2 4-6z" fill="currentColor"/>
            </svg>
            {/* Scanner */}
            <div className="absolute inset-6 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-[scan_2.2s_ease_in_out_infinite]"></div>
              <div className="absolute inset-0 border border-cyan-400/30 rounded-full"></div>
            </div>
          </div>
          <div className="mt-3 text-center px-3">
            <p className="text-cyan-100 text-sm font-medium">{message}</p>
            {tip && <p className="text-[11px] text-cyan-200/70 mt-1">{tip}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
