import React, { useState, useEffect } from 'react';
import { fetchAnalysesList } from '../services/api';
import { Search, Filter, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

export default function AnalystPortal() {
  const [analyses, setAnalyses] = useState([]);
  const [filterLevel, setFilterLevel] = useState('');
  const [loading, setLoading] = useState(true);

  const loadList = async () => {
    setLoading(true);
    try {
      const data = await fetchAnalysesList(filterLevel);
      setAnalyses(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, [filterLevel]);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            Fraud Analyst Incident Log
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Privacy-aware metadata summaries of analyzed voice calls. Raw audio is strictly excluded by default.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {['', 'high', 'medium', 'low'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filterLevel === lvl
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {lvl === '' ? 'All Events' : `${lvl} Risk`}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
            Loading incident records from SQLite database...
          </div>
        ) : analyses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No incident analyses recorded yet. Submit a new analysis to populate the audit log.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Event ID</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Caller Status</th>
                  <th className="px-6 py-4">Transaction Value</th>
                  <th className="px-6 py-4">Procedure</th>
                  <th className="px-6 py-4">Reasons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {analyses.map((item) => (
                  <tr key={item.event_id} className="hover:bg-slate-900/40 transition">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">{item.event_id}</td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.risk_level === 'high' ? 'badge-high' : item.risk_level === 'medium' ? 'badge-medium' : 'badge-low'
                      }`}>
                        {item.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{item.risk_score} / 100</td>
                    <td className="px-6 py-4 capitalize">{item.caller_number_status}</td>
                    <td className="px-6 py-4 capitalize">{item.transaction_value}</td>
                    <td className="px-6 py-4 capitalize">{item.procedure_status.replace('_', ' ')}</td>
                    <td className="px-6 py-4">{item.reasons_count} Flagged</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
