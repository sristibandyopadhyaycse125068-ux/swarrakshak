import React from 'react';
import { PhoneCall, AlertTriangle, DollarSign, ShieldAlert, UserCheck } from 'lucide-react';

export default function ContextForm({ context, setContext }) {
  const handleChange = (field, val) => {
    setContext((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="glass-panel p-8 space-y-8 my-6">
      <div className="pb-4 border-b border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <PhoneCall className="w-6 h-6 text-blue-400" />
          3. Call Context & Threat Indicators
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Select caller details and behavioral indicators to evaluate structural risk factors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Caller Number Status */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-blue-400" />
            Caller Identification Status
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'known', label: 'Known ID' },
              { id: 'unknown', label: 'Unknown Number' },
              { id: 'hidden', label: 'Hidden / Spoofed' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChange('caller_number_status', opt.id)}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                  context.caller_number_status === opt.id
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-md shadow-blue-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Request Urgency */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Request Time Urgency
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'normal', label: 'Normal Timeline' },
              { id: 'urgent', label: 'Urgent / High Pressure' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChange('request_urgency', opt.id)}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                  context.request_urgency === opt.id
                    ? 'bg-amber-500/30 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Value */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Transaction Financial Value
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'low', label: 'Low (< $10k)' },
              { id: 'medium', label: 'Medium ($10k-$100k)' },
              { id: 'high', label: 'High (> $100k)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChange('transaction_value', opt.id)}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                  context.transaction_value === opt.id
                    ? 'bg-emerald-500/30 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Procedure Status */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            Authorization Protocol
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'normal', label: 'Standard Approval' },
              { id: 'bypass_requested', label: 'Bypass Requested' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChange('procedure_status', opt.id)}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                  context.procedure_status === opt.id
                    ? 'bg-purple-500/30 border-purple-500 text-purple-200 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Caller Relationship */}
        <div className="md:col-span-2 space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            Claimed Identity Relationship
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                className={`py-3.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                  context.caller_relationship === opt.id
                    ? 'bg-cyan-500/30 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
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
