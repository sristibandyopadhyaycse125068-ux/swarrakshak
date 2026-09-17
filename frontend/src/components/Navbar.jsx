import React from 'react';
import { ShieldCheck, Activity, FileText, Info, Sparkles, Radio } from 'lucide-react';

export default function Navbar({ activePhase, setActivePhase, health }) {
  return (
    <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6">
      <nav className="glass-panel px-5 py-3 rounded-full flex items-center justify-between gap-4 border border-white/10 shadow-[0_8px_32px_0_rgba(0,240,255,0.1)] backdrop-blur-xl bg-[#050508]/70">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActivePhase(1)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative p-2.5 rounded-full bg-gradient-to-tr from-[#0072ff] via-[#00f0ff] to-[#7b2cbf] text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all duration-300">
            <ShieldCheck className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent font-['Space_Grotesk']">
                SWARRAKSHAK
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-bold tracking-widest">
                v2.0 WebGL
              </span>
            </div>
            <p className="text-[10px] text-cyan-400/80 font-mono tracking-widest uppercase">
              Biometric Neural Telemetry
            </p>
          </div>
        </div>

        {/* Floating Navigation Pill */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-[#050508]/80 border border-white/10 shadow-inner">
          <button
            onClick={() => setActivePhase(1)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
              activePhase === 1
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Orb Hero
          </button>

          <button
            onClick={() => setActivePhase(2)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
              activePhase === 2
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Neural Morph
          </button>

          <button
            onClick={() => setActivePhase(3)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
              activePhase === 3
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Risk Dashboard
          </button>

          <button
            onClick={() => setActivePhase(4)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
              activePhase === 4
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Audit Feed
          </button>
        </div>

        {/* System Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono shadow-[0_0_10px_rgba(0,240,255,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${health?.status === 'ok' ? 'bg-cyan-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${health?.status === 'ok' ? 'bg-cyan-400' : 'bg-amber-400'}`}></span>
            </span>
            <span className="text-cyan-300 font-bold tracking-wider uppercase">
              {health?.status === 'ok' ? 'System Live' : 'Connecting...'}
            </span>
          </div>

          <button
            onClick={() => setActivePhase(3)}
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Deploy Radar
          </button>
        </div>
      </nav>
    </header>
  );
}
