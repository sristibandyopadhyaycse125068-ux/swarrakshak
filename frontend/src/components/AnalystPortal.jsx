import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAnalysesList } from '../services/api';
import { Filter, RefreshCw, FileText } from 'lucide-react';
import { getSeverityTheme } from '../utils/severity';

const MOCK_HISTORICAL_LOGS = [
  {
    incidentId: "SR-EVT-9982",
    timestamp: new Date(Date.now() - 1200000).toLocaleString(),
    voiceMatch: "Synthetic Voice C",
    acousticIntegrity: "88% Suspected",
    neuralThreat: "HIGH",
    score: 87,
    disposition: "BLOCKED & QUARANTINED",
    risk_level: "high"
  },
  {
    incidentId: "SR-EVT-9981",
    timestamp: new Date(Date.now() - 4800000).toLocaleString(),
    voiceMatch: "Deepfake Variant B",
    acousticIntegrity: "54% Anomalous",
    neuralThreat: "MODERATE",
    score: 54,
    disposition: "ESCALATED TO TIER-2",
    risk_level: "medium"
  },
  {
    incidentId: "SR-EVT-9980",
    timestamp: new Date(Date.now() - 14400000).toLocaleString(),
    voiceMatch: "Authentic Biomarker",
    acousticIntegrity: "99% Pristine",
    neuralThreat: "LOW",
    score: 12,
    disposition: "VERIFIED & CLEARED",
    risk_level: "low"
  }
];

export default function AnalystPortal() {
  const [analyses, setAnalyses] = useState([]);
  const [activeFilterIndex, setActiveFilterIndex] = useState(0); // 0: ALL, 1: HIGH, 2: MEDIUM, 3: LOW
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filterTabs = [
    { id: 'ALL', label: 'ALL EVENTS' },
    { id: 'HIGH', label: 'HIGH RISK' },
    { id: 'MEDIUM', label: 'MEDIUM RISK' },
    { id: 'LOW', label: 'LOW RISK' }
  ];

  const activeFilterId = filterTabs[activeFilterIndex].id;

  const loadList = async () => {
    setLoading(true);
    const localAudits = JSON.parse(localStorage.getItem('swarrakshak_local_audits') || '[]');
    try {
      const data = await fetchAnalysesList('');
      if (data && data.items && data.items.length > 0) {
        const mapped = data.items.map(item => ({
          incidentId: item.event_id || item.incidentId || "SR-EVT-9900",
          timestamp: item.created_at ? new Date(item.created_at).toLocaleString() : new Date().toLocaleString(),
          voiceMatch: item.voiceMatch || (item.risk_level === 'high' ? 'Synthetic Voice C' : (item.risk_level === 'medium' ? 'Deepfake Variant B' : 'Authentic Biomarker')),
          acousticIntegrity: item.acousticIntegrity || (item.risk_level === 'high' ? '88% Suspected' : (item.risk_level === 'medium' ? '54% Anomalous' : '99% Pristine')),
          neuralThreat: (item.risk_level || (item.risk_score >= 70 ? 'HIGH' : item.risk_score >= 40 ? 'MODERATE' : 'LOW')).toUpperCase(),
          score: item.risk_score !== undefined ? item.risk_score : (item.score || 35),
          disposition: item.disposition || (item.risk_level === 'high' ? 'BLOCKED & QUARANTINED' : (item.risk_level === 'medium' ? 'ESCALATED TO TIER-2' : 'VERIFIED & CLEARED')),
          risk_level: item.risk_level || 'low'
        }));
        setAnalyses([...localAudits, ...mapped]);
      } else {
        setAnalyses([...localAudits, ...MOCK_HISTORICAL_LOGS]);
      }
    } catch (err) {
      console.error('API connection fallback:', err);
      setAnalyses([...localAudits, ...MOCK_HISTORICAL_LOGS]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadList();
  }, []);

  const filteredLogs = analyses.filter(log => {
    if (activeFilterId === 'ALL') return true;
    const threat = String(log.neuralThreat || log.risk_level || '').toUpperCase();
    if (activeFilterId === 'HIGH') return threat.includes('HIGH') || threat.includes('CRITICAL');
    if (activeFilterId === 'MEDIUM') return threat.includes('MED') || threat.includes('MODERATE');
    if (activeFilterId === 'LOW') return threat.includes('LOW') || threat.includes('SAFE');
    return true;
  });

  return (
    <main style={{
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto',
      padding: 'clamp(12px, 3vw, 32px) clamp(12px, 3.5vw, 48px) 80px clamp(12px, 3.5vw, 48px)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <style>{`
        @keyframes redLightSweep {
          0% { transform: translateX(-150%) skewX(-25deg); opacity: 0; }
          50% { opacity: 0.65; }
          100% { transform: translateX(250%) skewX(-25deg); opacity: 0; }
        }
        .audit-card-sheen:hover .light-beam {
          animation: redLightSweep 0.9s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* MASTER GLASS CANVAS CONTAINER */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1540px',
        margin: '0 auto',
        padding: 'clamp(20px, 3vw, 40px) clamp(12px, 2.5vw, 36px)',
        backgroundColor: 'rgba(255, 255, 255, 0.025)',
        backdropFilter: 'blur(36px) saturate(190%)',
        WebkitBackdropFilter: 'blur(36px) saturate(190%)',
        borderRadius: 'clamp(20px, 3vw, 32px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderTop: '2px solid rgba(255, 255, 255, 0.45)',
        borderLeft: '1.5px solid rgba(255, 255, 255, 0.28)',
        boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.9), inset 0 2px 2px 0 rgba(255, 255, 255, 0.35)',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* AMBIENT SPOTLIGHT GLOW (Behind Header) */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '850px',
          height: '420px',
          background: 'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.35) 0%, rgba(225, 29, 72, 0.25) 45%, transparent 72%)',
          filter: 'blur(60px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* HEADER SECTION */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: 'clamp(20px, 3vw, 32px)'
        }}>
          <h1 style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: 'clamp(1.25rem, 2.2vw, 2.3rem)',
            fontWeight: '700',
            letterSpacing: 'clamp(0.08em, 0.14vw, 0.18em)',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            margin: '0 0 10px 0',
            lineHeight: '1.25',
            wordBreak: 'break-word'
          }}>
            FRAUD ANALYST AUDIT LOG
          </h1>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(0.8rem, 0.95vw, 1rem)',
            fontWeight: '500',
            color: '#a1a1aa',
            letterSpacing: '0.03em',
            margin: '0 0 clamp(16px, 2.5vw, 24px) 0',
            maxWidth: '700px',
            lineHeight: '1.5'
          }}>
            Real-time immutable forensic records, acoustic anomalies, and analyst disposition telemetry
          </p>

          {/* RESPONSIVE FILTER TRACK WRAPPER */}
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '4px 0 8px 0'
          }}>
            {/* FROSTED CAPSULE FILTER TRACK */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              position: 'relative',
              padding: '6px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(15, 12, 18, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 10px 28px -6px rgba(0, 0, 0, 0.7)',
              maxWidth: '100%',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              zIndex: 10
            }}>
              {/* Filter Funnel Icon */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 10px', color: '#71717a' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </div>

              {/* TAB BUTTONS CONTAINER */}
              <div style={{ display: 'flex', position: 'relative', alignItems: 'center' }}>
                
                {/* PHYSICAL SLIDING RED LIQUID CAPSULE */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 'clamp(80px, 9vw, 115px)',
                    transform: `translateX(calc(${activeFilterIndex} * clamp(80px, 9vw, 115px)))`,
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    borderRadius: '9999px',
                    background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.95) 0%, rgba(190, 18, 60, 0.98) 55%, rgba(136, 19, 55, 1) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    borderTop: '1.5px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: `
                      0 4px 18px 0 rgba(225, 29, 72, 0.6),
                      inset 0 1.5px 2px rgba(255, 255, 255, 0.65),
                      inset 0 -2px 4px rgba(0, 0, 0, 0.45)
                    `,
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                />

                {/* BUTTONS */}
                {filterTabs.map((tab, idx) => {
                  const isSelected = activeFilterIndex === idx;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFilterIndex(idx)}
                      style={{
                        minWidth: 'clamp(80px, 9vw, 115px)',
                        width: 'clamp(80px, 9vw, 115px)',
                        padding: 'clamp(6px, 1vw, 8px) clamp(8px, 1.2vw, 14px)',
                        textAlign: 'center',
                        borderRadius: '9999px',
                        border: 'none',
                        background: 'transparent',
                        color: isSelected ? '#FFFFFF' : '#a1a1aa',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 'clamp(9px, 0.75vw, 11px)',
                        fontWeight: isSelected ? '700' : '600',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'color 0.2s ease',
                        position: 'relative',
                        zIndex: 2,
                        userSelect: 'none'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Reset/Refresh Icon */}
              <button
                type="button"
                onClick={() => setActiveFilterIndex(0)}
                title="Reset Filters"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#71717a',
                  padding: '0 10px 0 6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'animate-spin' : ''}>
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ADAPTIVE AUDIT LOG CONTAINER */}
        <div style={{
          width: '100%',
          position: 'relative',
          zIndex: 2,
          boxSizing: 'border-box'
        }}>
          {loading ? (
            <div className="p-16 text-center text-zinc-400 font-mono text-sm animate-pulse flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
              QUERYING AUDIT INCIDENT DATABASE...
            </div>
          ) : analyses.length === 0 ? (
            <div className="p-16 text-center text-zinc-400 font-mono text-sm flex flex-col items-center gap-3">
              <FileText className="w-8 h-8 text-zinc-600" />
              NO INCIDENT ANALYSES MATCHING FILTER. EXECUTE DETECTION IN RADAR DASHBOARD.
            </div>
          ) : isMobile ? (
            /* MOBILE VIEW: VERTICAL STACKED GLASS CARDS */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              width: '100%'
            }}>
              {filteredLogs.map((log, index) => {
                const theme = getSeverityTheme(log.neuralThreat, log.score);
                return (
                  <motion.div
                    key={log.incidentId || index}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.035)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderTop: '1.5px solid rgba(255, 255, 255, 0.28)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    {/* Top Row: Incident ID & Threat Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>
                        {log.incidentId}
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: theme.bg,
                        border: `1px solid ${theme.border}`,
                        color: theme.text
                      }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: theme.text }} />
                        {log.neuralThreat}
                      </span>
                    </div>

                    {/* Middle Row: Voice Match, Acoustic Integrity, Risk Score */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.25)',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.04)'
                    }}>
                      <div>
                        <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: '8px', color: '#a1a1aa', letterSpacing: '0.08em' }}>VOICE MATCH</div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: '600', color: '#FFFFFF', marginTop: '2px' }}>{log.voiceMatch}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: '8px', color: '#a1a1aa', letterSpacing: '0.08em' }}>ACOUSTIC</div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: '600', color: '#FFFFFF', marginTop: '2px' }}>{log.acousticIntegrity}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Syncopate', sans-serif", fontSize: '8px', color: '#a1a1aa', letterSpacing: '0.08em' }}>SCORE</div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: '700', color: theme.text, marginTop: '2px' }}>{log.score}/100</div>
                      </div>
                    </div>

                    {/* Bottom Row: Timestamp & Disposition */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#a1a1aa' }}>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{log.timestamp}</span>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: '600', color: '#e4e4e7' }}>{log.disposition}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* DESKTOP VIEW: FULL GLASS TABLE TRAY */
            <div style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(16px) saturate(160%)',
              WebkitBackdropFilter: 'blur(16px) saturate(160%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderTop: '1.5px solid rgba(255, 255, 255, 0.38)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
              overflowX: 'auto',
              boxSizing: 'border-box'
            }}>
              <table style={{
                width: '100%',
                minWidth: '880px',
                borderCollapse: 'separate',
                borderSpacing: '0 10px',
                textAlign: 'left'
              }}>
                <thead>
                  <tr>
                    {['TIMESTAMP', 'INCIDENT ID', 'VOICE MATCH', 'ACOUSTIC INTEGRITY', 'RISK LEVEL', 'RISK SCORE', 'ANALYST DISPOSITION'].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          fontFamily: "'Syncopate', sans-serif",
                          fontSize: 'clamp(9px, 0.68vw, 11px)',
                          fontWeight: '700',
                          letterSpacing: '0.12em',
                          color: '#a1a1aa',
                          padding: 'clamp(10px, 1.2vw, 14px) clamp(12px, 1.5vw, 18px)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* TABLE BODY */}
                <tbody>
                  {filteredLogs.map((log, index) => {
                    const theme = getSeverityTheme(log.neuralThreat, log.score);

                    return (
                      <motion.tr
                        key={log.incidentId || index}
                        className="audit-card-sheen"
                        initial={{ opacity: 0, y: 16, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.35,
                          delay: Math.min(index * 0.05, 0.4),
                          ease: [0.25, 0.1, 0.25, 1]
                        }}
                        whileHover={{
                          y: -2,
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.7), 0 0 16px -2px rgba(244, 63, 94, 0.25)',
                          transition: { duration: 0.2 }
                        }}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.025)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderTop: '1.5px solid rgba(255, 255, 255, 0.22)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          boxSizing: 'border-box'
                        }}
                      >
                        {/* GLIDING RED LIGHT SWEEP BEAM */}
                        <td
                          style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            overflow: 'hidden',
                            padding: 0,
                            border: 'none',
                            borderRadius: '14px'
                          }}
                        >
                          <div
                            className="light-beam"
                            style={{
                              position: 'absolute',
                              top: 0,
                              bottom: 0,
                              left: 0,
                              width: '180px',
                              background: 'linear-gradient(90deg, transparent 0%, rgba(244, 63, 94, 0.28) 45%, rgba(255, 255, 255, 0.35) 50%, rgba(244, 63, 94, 0.28) 55%, transparent 100%)',
                              filter: 'blur(6px)',
                              pointerEvents: 'none'
                            }}
                          />
                        </td>

                        {/* TIMESTAMP */}
                        <td style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 'clamp(11px, 0.85vw, 13px)',
                          color: '#d4d4d8',
                          padding: 'clamp(12px, 1.4vw, 16px) clamp(12px, 1.5vw, 18px)',
                          whiteSpace: 'nowrap'
                        }}>
                          {log.timestamp}
                        </td>

                        {/* INCIDENT ID */}
                        <td style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 'clamp(12px, 0.9vw, 14px)',
                          fontWeight: '600',
                          color: '#FFFFFF',
                          letterSpacing: '0.04em',
                          padding: 'clamp(12px, 1.4vw, 16px) clamp(12px, 1.5vw, 18px)',
                          whiteSpace: 'nowrap'
                        }}>
                          {log.incidentId}
                        </td>

                        {/* VOICE MATCH */}
                        <td style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 'clamp(12px, 0.9vw, 14px)',
                          fontWeight: '600',
                          color: '#FFFFFF',
                          padding: 'clamp(12px, 1.4vw, 16px) clamp(12px, 1.5vw, 18px)',
                          whiteSpace: 'nowrap'
                        }}>
                          {log.voiceMatch}
                        </td>

                        {/* ACOUSTIC INTEGRITY */}
                        <td style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 'clamp(12px, 0.9vw, 14px)',
                          fontWeight: '600',
                          color: '#FFFFFF',
                          padding: 'clamp(12px, 1.4vw, 16px) clamp(12px, 1.5vw, 18px)',
                          whiteSpace: 'nowrap'
                        }}>
                          {log.acousticIntegrity}
                        </td>

                        {/* RISK LEVEL BADGE */}
                        <td style={{ padding: 'clamp(12px, 1.4vw, 16px) clamp(12px, 1.5vw, 18px)', whiteSpace: 'nowrap' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px clamp(8px, 1vw, 12px)',
                            borderRadius: '9999px',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: 'clamp(10px, 0.75vw, 11px)',
                            fontWeight: '700',
                            letterSpacing: '0.06em',
                            border: '1px solid',
                            borderColor: 
                              log.neuralThreat === 'HIGH' ? 'rgba(244, 63, 94, 0.4)' :
                              (log.neuralThreat === 'MEDIUM' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'),
                            backgroundColor: 
                              log.neuralThreat === 'HIGH' ? 'rgba(244, 63, 94, 0.12)' :
                              (log.neuralThreat === 'MEDIUM' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)'),
                            color: 
                              log.neuralThreat === 'HIGH' ? '#f43f5e' :
                              (log.neuralThreat === 'MEDIUM' ? '#f59e0b' : '#10b981')
                          }}>
                            <span style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: 'currentColor'
                            }} />
                            {log.neuralThreat}
                          </span>
                        </td>


                        {/* RISK SCORE */}
                        <td style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 'clamp(13px, 1vw, 15px)',
                          fontWeight: '700',
                          color: theme.text,
                          padding: 'clamp(12px, 1.4vw, 16px) clamp(12px, 1.5vw, 18px)',
                          whiteSpace: 'nowrap'
                        }}>
                          {log.score}/100
                        </td>

                        {/* ANALYST DISPOSITION */}
                        <td style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 'clamp(11px, 0.85vw, 13px)',
                          fontWeight: '600',
                          color: '#e4e4e7',
                          padding: 'clamp(12px, 1.4vw, 16px) clamp(12px, 1.5vw, 18px)',
                          whiteSpace: 'nowrap'
                        }}>
                          {log.disposition}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


