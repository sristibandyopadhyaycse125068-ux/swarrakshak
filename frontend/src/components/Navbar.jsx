import React from 'react';
import { ShieldCheck, Activity, FileText, Info } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, health }) {
  return (
    <nav className="glass-panel sticky top-4 z-50 mx-auto max-w-7xl px-6 py-4 mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            SwarRakshak
          </h1>
          <p className="text-xs text-cyan-400 font-medium tracking-wide">
            PRIVACY-AWARE VOICE RISK ASSISTANT
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('new')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'new'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4" />
          New Risk Analysis
        </button>

        <button
          onClick={() => setActiveTab('analyst')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'analyst'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Analyst History
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'info'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Info className="w-4 h-4" />
          Overview & Privacy
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
        <span className={`w-2.5 h-2.5 rounded-full ${health?.status === 'ok' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
        <span className="text-slate-300 font-medium">
          {health?.status === 'ok' ? 'API Online' : 'Connecting...'}
        </span>
      </div>
    </nav>
  );
}
