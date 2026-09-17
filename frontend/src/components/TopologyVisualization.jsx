import React, { useState, useEffect } from 'react';
import { ShieldCheck, Radio, Activity, Cpu, Lock, AlertTriangle, Eye, X } from 'lucide-react';

export default function TopologyVisualization({ onOpenRiskEngine }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Nodes Data representing SwarRakshak Identity & Voice Compliance Pathways
  const nodes = [
    {
      id: 'central',
      label: 'IDENTITY ROOT NODE',
      category: 'Primary',
      x: 50,
      y: 50,
      status: 'Secured',
      riskScore: 4,
      details: 'Central biometric voice print vault & encrypted speaker profile vector.',
      telemetry: 'AES-256 HSM • 100% Integrity',
      type: 'root'
    },
    {
      id: 'node-1',
      label: 'Acoustic Harmonics Node A',
      category: 'Voice Biometrics',
      x: 25,
      y: 30,
      status: 'Active Scan',
      riskScore: 12,
      details: 'Evaluates fundamental voice frequencies (F0), formant bandwidth, and jitter.',
      telemetry: 'DSP FFT Stream • 60 FPS',
      type: 'biometric'
    },
    {
      id: 'node-2',
      label: 'Phase & Vocoder Detector',
      category: 'Deepfake Vector',
      x: 75,
      y: 30,
      status: 'Monitoring',
      riskScore: 84,
      details: 'Detects high-frequency phase discontinuities and neural vocoder synthesis artifacts.',
      telemetry: 'Model inference: 14ms',
      type: 'risk'
    },
    {
      id: 'node-3',
      label: 'Caller ID & Network Telemetry',
      category: 'Context Security',
      x: 20,
      y: 70,
      status: 'Verified',
      riskScore: 8,
      details: 'Cross-checks telephony origin, SIP header integrity, and caller number status.',
      telemetry: 'Known Vendor Identity',
      type: 'context'
    },
    {
      id: 'node-4',
      label: 'Protocol Compliance Gate',
      category: 'Policy Compliance',
      x: 80,
      y: 70,
      status: 'Bypass Requested',
      riskScore: 78,
      details: 'Monitors financial wire transfer authorization protocols & urgency levels.',
      telemetry: 'High Urgency Wire Signal',
      type: 'risk'
    },
    {
      id: 'node-5',
      label: 'Multi-Factor Voice Vault',
      category: 'Biometric Storage',
      x: 50,
      y: 85,
      status: 'Locked',
      riskScore: 2,
      details: 'Zero-knowledge biometric voice signature repository for consented identities.',
      telemetry: 'Cryptographic Hash Match',
      type: 'biometric'
    }
  ];

  // Connection edges
  const connections = [
    { from: 'central', to: 'node-1' },
    { from: 'central', to: 'node-2' },
    { from: 'central', to: 'node-3' },
    { from: 'central', to: 'node-4' },
    { from: 'central', to: 'node-5' },
    { from: 'node-1', to: 'node-3' },
    { from: 'node-2', to: 'node-4' }
  ];

  const getNodeColor = (type, riskScore) => {
    if (riskScore > 60) return '#790C12'; // Red wine accent
    if (type === 'root') return '#FFF7E1'; // Lemon cream
    return '#6B1E23'; // Deep red wine
  };

  return (
    <section className="relative my-12 z-20">
      {/* Topology Box Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#790C12] animate-ping" />
            <h3 className="text-xl sm:text-2xl font-black tracking-wider text-[#FFF7E1] font-['Space_Grotesk'] uppercase">
              BIOMETRIC IDENTITY TOPOLOGY MAP
            </h3>
          </div>
          <p className="text-xs font-mono text-[#FFF7E1]/70 tracking-widest mt-1">
            INTERACTIVE NEURAL COMPLIANCE PATHWAYS & REAL-TIME RISK INDICATORS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-[#6B1E23]/60 border border-[#790C12] text-[#FFF7E1] flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#FFF7E1] animate-pulse" />
            LIVE SPECTRUM NETWORK
          </span>
        </div>
      </div>

      {/* Main Interactive Canvas / SVG Topology Canvas Panel */}
      <div className="relative glass-panel-wine p-6 sm:p-10 rounded-3xl border border-[#FFF7E1]/15 overflow-hidden shadow-2xl bg-[#2C0F12]/80">
        <div className="absolute inset-0 bg-[radial-gradient(#790C12_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative w-full h-[450px] sm:h-[520px]">
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {connections.map((conn, idx) => {
              const fromNode = nodes.find((n) => n.id === conn.from);
              const toNode = nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const isHighlighted =
                hoveredNode === conn.from ||
                hoveredNode === conn.to ||
                selectedNode?.id === conn.from ||
                selectedNode?.id === conn.to;

              const isRiskPath = fromNode.riskScore > 60 || toNode.riskScore > 60;

              return (
                <line
                  key={idx}
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={
                    isHighlighted
                      ? '#FFF7E1'
                      : isRiskPath
                      ? 'rgba(121, 12, 18, 0.7)'
                      : 'rgba(255, 247, 225, 0.25)'
                  }
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={isRiskPath ? '6,6' : 'none'}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Interactive Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode === node.id;
            const isRisk = node.riskScore > 60;

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(node)}
              >
                {/* Outer Glow Circle */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRisk
                      ? 'bg-[#790C12]/40 border-2 border-[#790C12] shadow-[0_0_25px_rgba(121,12,18,0.8)] animate-wine-pulse'
                      : node.type === 'root'
                      ? 'bg-[#FFF7E1]/20 border-2 border-[#FFF7E1] shadow-[0_0_30px_rgba(255,247,225,0.5)]'
                      : 'bg-[#6B1E23]/60 border border-[#FFF7E1]/30 hover:border-[#FFF7E1]'
                  } ${isSelected || isHovered ? 'scale-125' : ''}`}
                >
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      node.type === 'root'
                        ? 'bg-[#FFF7E1] text-[#2C0F12]'
                        : 'bg-[#6B1E23] text-[#FFF7E1]'
                    }`}
                  >
                    {isRisk ? (
                      <AlertTriangle className="w-4 h-4 text-[#FFF7E1]" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Node Label Tooltip */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 text-center whitespace-nowrap pointer-events-none">
                  <span className="block text-xs font-mono font-bold text-[#FFF7E1] bg-[#2C0F12]/90 px-2.5 py-1 rounded-md border border-[#FFF7E1]/20 shadow-lg">
                    {node.label}
                  </span>
                  <span className="block text-[10px] font-mono text-[#FFF7E1]/70 uppercase">
                    Risk Score: {node.riskScore}/100
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal / Glassmorphic Detail Panel when Node is Clicked */}
        {selectedNode && (
          <div className="mt-8 p-6 sm:p-8 rounded-2xl glass-panel-wine-solid border border-[#790C12] animate-fadeIn relative">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#6B1E23] text-[#FFF7E1] hover:bg-[#790C12] transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#FFF7E1]/15">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#790C12] text-[#FFF7E1]">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#FFF7E1]/70 uppercase tracking-widest">
                    {selectedNode.category}
                  </span>
                  <h4 className="text-xl font-black text-[#FFF7E1] font-['Space_Grotesk']">
                    {selectedNode.label}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#6B1E23] text-[#FFF7E1] border border-[#FFF7E1]/30">
                  STATUS: {selectedNode.status}
                </span>
                <span className="text-xs font-mono font-bold px-3.5 py-1 rounded-full bg-[#790C12] text-[#FFF7E1]">
                  RISK: {selectedNode.riskScore}/100
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-xs font-mono font-bold text-[#FFF7E1]/80 uppercase tracking-widest mb-1">
                  PATHWAY DESCRIPTION
                </h5>
                <p className="text-sm text-[#FFF7E1] leading-relaxed">
                  {selectedNode.details}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-mono font-bold text-[#FFF7E1]/80 uppercase tracking-widest mb-1">
                  TELEMETRY METRICS
                </h5>
                <p className="text-sm font-mono text-[#FFF7E1] font-bold">
                  {selectedNode.telemetry}
                </p>
                {onOpenRiskEngine && (
                  <button
                    onClick={onOpenRiskEngine}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-[#790C12] hover:bg-[#6B1E23] text-[#FFF7E1] font-bold text-xs tracking-wider uppercase transition shadow-lg flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Inspect Node in Risk Radar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
