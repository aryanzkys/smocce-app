"use client";
import React from 'react';

export default function RoboHeader({ title = 'SMOCCE Admin Dashboard', subtitle = 'Monitoring & Management System', onLogout, onImportClick, onExportClick }) {
  return (
    <header className="relative bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(6,182,212,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(217,70,239,0.25),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.25),transparent_40%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-4">
            {/* 3D Logo */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 shadow-[0_0_30px_rgba(6,182,212,0.5)] rotate-6 hover:-rotate-3 transition-transform duration-300 flex items-center justify-center border border-white/10">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 8h10v8H7z" opacity=".3"/>
                <path d="M5 6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6zm2 0h10v12H7V6z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 drop-shadow">{title}</h1>
              <p className="text-sm text-cyan-100/80">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onImportClick} className="px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 border border-cyan-400/30 transition">Import Excel</button>
            <button onClick={onExportClick} className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border border-emerald-400/30 transition">Export Data</button>
            <button onClick={onLogout} className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 border border-rose-400/30 transition">Logout</button>
          </div>
        </div>
      </div>
      {/* bottom shine */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </header>
  );
}
