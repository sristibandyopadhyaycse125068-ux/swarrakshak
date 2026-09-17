import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection({ onInitialize, onExploreDashboard }) {
  const handlePrimary = onInitialize || onExploreDashboard;
  const handleSecondary = onExploreDashboard || onInitialize;

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 z-20">
      {/* Luminous Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md"
      >
        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        SwarRakshak Biometric Voice Telemetry v2.0
      </motion.div>

      {/* Hero Headline */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none uppercase max-w-6xl mb-6 font-['Space_Grotesk']"
      >
        <span className="bg-gradient-to-r from-white via-cyan-100 to-slate-200 bg-clip-text text-transparent">
          YOUR VOICE
        </span>
        <br />
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.6)]">
          YOUR IDENTITY
        </span>
      </motion.h1>

      {/* Sub-quote */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="text-slate-200 text-lg sm:text-2xl font-medium max-w-3xl mx-auto leading-relaxed mb-12 tracking-wide font-sans"
      >
        Authenticate seamlessly through biometric voice telemetry and neural compliance.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-6 cursor-pointer relative z-30"
      >
        <button
          type="button"
          onClick={handlePrimary}
          className="group relative flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-black text-base sm:text-lg shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <Activity className="w-6 h-6 text-white" />
          <span>Initialize Telemetry</span>
          <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition" />
        </button>

        <button
          type="button"
          onClick={handleSecondary}
          className="flex items-center gap-3 px-9 py-5 rounded-full bg-[#080812]/90 border border-cyan-500/40 text-cyan-300 font-bold text-base sm:text-lg hover:bg-cyan-950/60 hover:border-cyan-400 hover:text-white backdrop-blur-xl shadow-lg transition-all duration-300 cursor-pointer"
        >
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <span>Explore Docs</span>
        </button>
      </motion.div>
    </section>
  );
}

