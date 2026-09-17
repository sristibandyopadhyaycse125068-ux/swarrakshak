import React from 'react';
import { PhoneCall, AlertTriangle, DollarSign, ShieldAlert, UserCheck } from 'lucide-react';

export default function ContextForm({ context, setContext }) {
  const handleChange = (field, val) => {
    setContext((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-10 my-8 border border-blue-500/30 bg-[#080812]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,114,255,0.08)] relative z-20">
      <div className="pb-6 border-b border-white/10">
        <h3 className="text-2xl font-black text-white flex items-center gap-3 font-['Space_Grotesk'] tracking-wide">
          <PhoneCall className="w-7 h-7 text-blue-400" />
          3. CALL CONTEXT & BEHAVIORAL INDICATORS
        </h3>
        <p className="text-sm text-slate-300 font-mono tracking-wider mt-2">
          CONFIGURE METADATA SIGNAL INDICATORS TO POWER MULTIMODAL CONTEXTUAL RISK WEIGHTING
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Caller Number Status */}
        <div className="space-y-4">
          <label className="block text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-cyan-400" />
            1. Caller Identification Status
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'known', label: 'Known Contact' },
              { id: 'unknown', label: 'Unknown Number' },
              { id: 'hidden', label: 'Hidden / Spoofed' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChange('caller_number_status', opt.id)}
                className={`py-4 px-4 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all duration-300 border cursor-pointer ${
                  context.caller_number_status === opt.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                    : 'bg-[#0d0e1c] border-white/10 text-slate-300 hover:border-cyan-500/50 hover:bg-[#121429]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Request Urgency */}
        <div className="space-y-4">
          <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            2. Request Time Urgency
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'normal', label: 'Standard Timeline' },
              { id: 'urgent', label: 'Urgent / High Pressure' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChange('request_urgency', opt.id)}
                className={`py-4 px-4 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all duration-300 border cursor-pointer ${
                  context.request_urgency === opt.id
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                    : 'bg-[#0d0e1c] border-white/10 text-slate-300 hover:border-amber-500/50 hover:bg-[#121429]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Value */}
        <div className="space-y-4">
          <label className="block text-xs font-mono font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            3. Financial Transaction Value
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'low', label: 'Low (< $10k)' },
              { id: 'medium', label: 'Medium ($10k-$100k)' },
              { id: 'high', label: 'High (> $100k)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChange('transaction_value', opt.id)}
                className={`py-4 px-4 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all duration-300 border cursor-pointer ${
                  context.transaction_value === opt.id
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                    : 'bg-[#0d0e1c] border-white/10 text-slate-300 hover:border-emerald-500/50 hover:bg-[#121429]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Procedure Status */}
        <div className="space-y-4">
          <label className="block text-xs font-mono font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            4. Authorization Protocol Override
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'normal', label: 'Standard Approval' },
              { id: 'bypass_requested', label: 'Bypass Requested' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChange('procedure_status', opt.id)}
                className={`py-4 px-4 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all duration-300 border cursor-pointer ${
                  context.procedure_status === opt.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-500 border-purple-400 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] scale-105'
                    : 'bg-[#0d0e1c] border-white/10 text-slate-300 hover:border-purple-500/50 hover:bg-[#121429]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Caller Relationship */}
        <div className="lg:col-span-2 space-y-4">
          <label className="block text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            5. Claimed Identity / Role Relationship
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: 'executive', label: 'CFO / Executive' },
              { id: 'vendor', label: 'Supplier / Vendor' },
              { id: 'customer', label: 'Bank Customer' },
              { id: 'unknown', label: 'Unknown Caller' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChange('caller_relationship', opt.id)}
                className={`py-4 px-4 rounded-2xl text-xs sm:text-sm font-mono font-bold transition-all duration-300 border cursor-pointer ${
                  context.caller_relationship === opt.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                    : 'bg-[#0d0e1c] border-white/10 text-slate-300 hover:border-cyan-500/50 hover:bg-[#121429]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

