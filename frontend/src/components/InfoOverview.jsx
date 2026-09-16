import React from 'react';
import { ShieldCheck, Lock, Activity, Eye, Zap, CheckCircle2 } from 'lucide-react';

export default function InfoOverview() {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold text-white mb-3">
          SwarRakshak: Privacy-Aware Voice-Risk Assistant
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          AI generative speech models can now clone a human voice using just a few seconds of reference audio. 
          SwarRakshak protects financial operations and corporate personnel by evaluating voice authenticity, 
          speaker similarity, and call context before sensitive wire transfers or account changes are approved.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <Activity className="w-6 h-6 text-cyan-400 mb-2" />
            <h3 className="text-sm font-semibold text-white">1. Acoustic Authenticity</h3>
            <p className="text-xs text-slate-400 mt-1">
              Extracts spectral flatness, zero crossing rates, and pitch stability to identify synthetic or manipulated voice artifacts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <Eye className="w-6 h-6 text-indigo-400 mb-2" />
            <h3 className="text-sm font-semibold text-white">2. Speaker Comparison</h3>
            <p className="text-xs text-slate-400 mt-1">
              Optionally compares current call embeddings against a trusted reference voice sample (e.g. CFO or executive reference).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <Lock className="w-6 h-6 text-emerald-400 mb-2" />
            <h3 className="text-sm font-semibold text-white">3. Zero-Retention Privacy</h3>
            <p className="text-xs text-slate-400 mt-1">
              Raw audio is automatically deleted immediately following feature extraction. Only non-confidential metadata is stored.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-md font-bold text-white mb-4">Core Principles & Operating Scope</h3>
        <ul className="space-y-3 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Transparent Weighted Risk Scoring:</strong> Combines acoustic features (up to 40pts), speaker consistency (up to 30pts), and structural context signals (up to 30pts) into a 0-100 risk score.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Actionable Verification Protocols:</strong> Recommends independent callback channels when High risk (60-100) or Medium risk (30-59) is flagged.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Human Decision Support:</strong> Serves as an early risk warning assistant; does not automatically block telecom calls or execute financial transactions.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
