import React from 'react';

export default function DemoPresetLoader({ onSelectPreset }) {
  const presetData = {
    A: {
      id: 'genuine',
      title: 'Executive Voiceprint A',
      subtitle: 'Authentic human voice',
      desc: 'High-confidence executive voice profile with minimal acoustic deviation and standard protocol compliance.',
      badge: 'LOW DEVIATION',
      context: {
        caller_number_status: 'known',
        request_urgency: 'normal',
        transaction_value: 'low',
        procedure_status: 'normal',
        caller_relationship: 'vendor',
        notes: 'Verified natural acoustic harmonics and matched biometric signature.'
      }
    },
    B: {
      id: 'cloned_high_risk',
      title: 'Deepfake Spoof Vector B',
      subtitle: 'Synthetic clone attack',
      desc: 'Simulated neural voice replica containing identity and waveform inconsistencies attempting urgent bypass.',
      badge: 'HIGH THREAT',
      context: {
        caller_number_status: 'unknown',
        request_urgency: 'urgent',
        transaction_value: 'high',
        procedure_status: 'bypass_requested',
        caller_relationship: 'executive',
        notes: 'Urgent wire transfer request with synthetic spectral anomalies.'
      }
    },
    C: {
      id: 'suspicious_context',
      title: 'Synthetic Voice Attack C',
      subtitle: 'Elevated anomaly vector',
      desc: 'Synthetic audio profile with acoustic artifacts and neural generation signatures requesting overrides.',
      badge: 'MODERATE THREAT',
      context: {
        caller_number_status: 'hidden',
        request_urgency: 'urgent',
        transaction_value: 'medium',
        procedure_status: 'bypass_requested',
        caller_relationship: 'customer',
        notes: 'Hidden caller ID with requested authorization bypass.'
      }
    }
  };

  const handleExecuteProfile = (cardId) => {
    if (onSelectPreset && presetData[cardId]) {
      onSelectPreset(presetData[cardId]);
    }
  };

  return (
    <div style={{
      marginTop: '28px',
      marginBottom: '28px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* AUDIO SPECTRUM SCENARIO MATRIX */}
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#E11D48', fontSize: '18px' }}>⚡</span>
          <h3 style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '0.14em',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            margin: 0
          }}>
            AUDIO SPECTRUM SCENARIO MATRIX
          </h3>
        </div>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          color: '#E11D48',
          backgroundColor: 'rgba(225, 29, 72, 0.1)',
          padding: '4px 10px',
          borderRadius: '6px',
          textTransform: 'uppercase'
        }}>
          ATTACK PROFILES
        </span>
      </div>

      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '13px',
        color: '#a1a1aa',
        margin: '0 0 16px 4px'
      }}>
        Select a simulated profile to test the risk detection engine against known attack vectors.
      </p>

      {/* 3 Scenario Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '18px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {[
          {
            id: 'A',
            badge: 'LOW DEVIATION',
            badgeColor: '#10b981',
            badgeBg: 'rgba(16, 185, 129, 0.12)',
            title: 'Executive Voiceprint A',
            desc: 'High-confidence executive voice profile with minimal acoustic deviation and standard protocol compliance.',
            glow: '0 12px 28px -6px rgba(16, 185, 129, 0.35)',
            borderBottom: '2px solid #10b981'
          },
          {
            id: 'B',
            badge: 'HIGH THREAT',
            badgeColor: '#f43f5e',
            badgeBg: 'rgba(244, 63, 94, 0.12)',
            title: 'Deepfake Spoof Vector B',
            desc: 'Simulated neural voice replica containing identity and waveform inconsistencies attempting urgent bypass.',
            glow: '0 12px 28px -6px rgba(244, 63, 94, 0.35)',
            borderBottom: '2px solid #f43f5e'
          },
          {
            id: 'C',
            badge: 'MODERATE THREAT',
            badgeColor: '#f59e0b',
            badgeBg: 'rgba(245, 158, 11, 0.12)',
            title: 'Synthetic Voice Attack C',
            desc: 'Synthetic audio profile with acoustic artifacts and neural generation signatures requesting overrides.',
            glow: '0 12px 28px -6px rgba(245, 158, 11, 0.35)',
            borderBottom: '2px solid #f59e0b'
          }
        ].map((card) => (
          <div
            key={card.id}
            className="glass-panel"
            onClick={() => handleExecuteProfile && handleExecuteProfile(card.id)}
            style={{
              borderBottom: card.borderBottom,
              boxShadow: card.glow,
              borderRadius: '16px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '230px',
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            {/* Top Badge & Arrow */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '14px' }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.06em',
                color: card.badgeColor,
                backgroundColor: card.badgeBg,
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                {card.badge}
              </span>
              <span style={{ color: '#71717a', fontSize: '14px' }}>▶</span>
            </div>

            {/* Title & Centered Body Description */}
            <div style={{ margin: 'auto 0', width: '100%' }}>
              <h4 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '18px',
                fontWeight: '700',
                color: '#FFFFFF',
                margin: '0 0 8px 0',
                letterSpacing: '0.02em'
              }}>
                {card.title}
              </h4>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '13px',
                color: '#a1a1aa',
                lineHeight: '1.55',
                margin: 0
              }}>
                {card.desc}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExecuteProfile && handleExecuteProfile(card.id);
              }}
              style={{
                marginTop: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '13px',
                fontWeight: '700',
                color: card.badgeColor,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              Execute Profile →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


