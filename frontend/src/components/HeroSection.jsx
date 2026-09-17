import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection({ onStartTelemetry, onExploreDashboard }) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 z-10">
      {/* Luminous Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-widest uppercase mb-8 shadow-lg shadow-cyan-500/10 backdrop-blur-md"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        SwarRakshak Voice Biometric Telemetry
      </motion.div>

      {/* Hero Headline */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none uppercase max-w-5xl mb-6"
      >
        <span className="bg-gradient-to-r from-white via-cyan-100 to-slate-300 bg-clip-text text-transparent">
          YOUR VOICE
        </span>
        <br />
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent glow-text-cyan">
          YOUR IDENTITY
        </span>
      </motion.h1>

      {/* Sub-quote */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="text-slate-300 text-base sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-10 tracking-wide"
      >
        Authenticate seamlessly through biometric voice telemetry and neural compliance. Protect critical wire transfers and sensitive corporate communications.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-5"
      >
        <button
          onClick={onStartTelemetry}
          className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition" />
          <Activity className="w-5 h-5 text-cyan-200" />
          <span>Initialize Telemetry</span>
          <ArrowRight className="w-5 h-5 text-cyan-200 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={onExploreDashboard}
          className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-900/60 border border-slate-700/80 text-slate-200 font-bold text-sm sm:text-base hover:bg-slate-800/80 hover:border-slate-500 hover:text-white backdrop-blur-md transition-all duration-300"
        >
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Operational Dashboard</span>
        </button>
      </motion.div>
    </section>
  );
}
