import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection({ onOpenDashboard, onOpenTopology }) {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 pt-10 pb-6 z-20">
      {/* Top Security Status Pill */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#6B1E23]/60 border border-[#790C12] text-[#FFF7E1] text-xs font-mono font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(121,12,18,0.3)] backdrop-blur-md"
      >
        <Sparkles className="w-4 h-4 text-[#FFF7E1] animate-pulse" />
        SECURE NEURAL TOPOLOGY PLATFORM
      </motion.div>

      {/* Main Heading: SWARRAKSHAK */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-[0.1em] leading-none uppercase max-w-7xl mb-4 font-['Space_Grotesk'] text-[#FFF7E1]"
        style={{
          color: '#FFF7E1',
          textShadow: '0 0 24px rgba(121, 12, 18, 0.45)'
        }}
      >
        SWARRAKSHAK
      </motion.h1>

      {/* Subtitle: YOUR VOICE. YOUR IDENTITY. */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="text-2xl sm:text-4xl font-black tracking-widest uppercase text-[#FFF7E1] font-['Space_Grotesk'] mb-6 drop-shadow-[0_0_15px_rgba(121,12,18,0.4)]"
      >
        YOUR VOICE. YOUR IDENTITY.
      </motion.h2>

      {/* Exact Quote (Lowercase) */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-[#FFF7E1]/85 text-base sm:text-xl font-normal max-w-3xl mx-auto leading-relaxed mb-10 tracking-wide font-sans italic"
      >
        authenticate seamlessly through biometric voice telemetry and neural compliance
      </motion.p>

      {/* Hero CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        className="flex flex-wrap items-center justify-center gap-5 cursor-pointer"
      >
        <button
          type="button"
          onClick={onOpenDashboard}
          className="group relative flex items-center gap-3 px-9 py-4 rounded-full bg-[#790C12] hover:bg-[#6B1E23] text-[#FFF7E1] font-mono font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_30px_rgba(121,12,18,0.6)] hover:shadow-[0_0_45px_rgba(121,12,18,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 border border-[#FFF7E1]/20 cursor-pointer"
        >
          <Activity className="w-5 h-5 text-[#FFF7E1]" />
          <span>Launch Risk Dashboard</span>
          <ArrowRight className="w-5 h-5 text-[#FFF7E1] group-hover:translate-x-1 transition" />
        </button>

        <button
          type="button"
          onClick={onOpenTopology}
          className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#2C0F12]/90 border border-[#790C12] text-[#FFF7E1] font-mono font-bold text-sm sm:text-base uppercase tracking-wider hover:bg-[#6B1E23]/50 hover:border-[#FFF7E1] backdrop-blur-xl transition-all duration-300 cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5 text-[#FFF7E1]" />
          <span>Inspect Topology Map</span>
        </button>
      </motion.div>
    </section>
  );
}


