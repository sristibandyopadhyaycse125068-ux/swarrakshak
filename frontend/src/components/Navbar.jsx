import React from 'react';
import { ShieldCheck, Network, Activity, FileText, Info } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, health }) {
  const navItems = [
    { id: 'topology', label: 'Topology', icon: Network },
    { id: 'dashboard', label: 'Risk Dashboard', icon: Activity },
    { id: 'analyst', label: 'Analyst History', icon: FileText },
    { id: 'overview', label: 'Overview Preview', icon: Info },
  ];

  return (
    <header className="sticky top-4 z-40 mx-auto max-w-7xl px-4 sm:px-6">
      <nav 
        className="glass-nav-wine px-5 py-3.5 rounded-full flex items-center justify-between gap-4 border border-[#FFF7E1]/14 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl bg-[#2C0F12]/72"
        style={{
          background: 'rgba(44, 15, 18, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 247, 225, 0.14)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('topology')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative p-2.5 rounded-full bg-[#6B1E23] text-[#FFF7E1] border border-[#790C12] shadow-[0_0_20px_rgba(121,12,18,0.5)] group-hover:shadow-[0_0_30px_rgba(121,12,18,0.8)] transition-all duration-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider text-[#FFF7E1] font-['Space_Grotesk'] uppercase">
                SWARRAKSHAK
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6B1E23] text-[#FFF7E1] border border-[#790C12] font-bold tracking-widest uppercase">
                CYBER INTEL
              </span>
            </div>
            <p className="text-[10px] text-[#FFF7E1]/70 font-mono tracking-widest uppercase">
              Biometric Neural Compliance
            </p>
          </div>
        </div>

        {/* Desktop Navigation Items */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[#2C0F12]/80 border border-[#FFF7E1]/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'text-[#FFF7E1] bg-[#6B1E23]/80 border border-[#790C12] shadow-[0_0_15px_rgba(121,12,18,0.4)]'
                    : 'text-[#FFF7E1]/70 hover:text-[#FFF7E1] hover:bg-[#6B1E23]/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFF7E1]' : 'text-[#FFF7E1]/70'}`} />
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#790C12] rounded-full shadow-[0_0_8px_#790C12]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Horizontal Scrollable Nav */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto py-1 max-w-[200px] scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap font-bold transition-all ${
                  isActive
                    ? 'bg-[#6B1E23] text-[#FFF7E1] border border-[#790C12]'
                    : 'text-[#FFF7E1]/70 bg-[#2C0F12]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* System Status Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6B1E23]/40 border border-[#790C12] text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#790C12] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#790C12]"></span>
            </span>
            <span className="text-[#FFF7E1] font-bold tracking-wider uppercase text-[11px]">
              {health?.status === 'ok' ? 'SYSTEM LIVE' : 'CONNECTING'}
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}

