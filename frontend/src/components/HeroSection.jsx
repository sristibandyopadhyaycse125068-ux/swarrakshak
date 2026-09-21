import React from 'react';

export default function HeroSection({ onOpenDashboard }) {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 'clamp(90px, 14vh, 130px)', /* Smooth dynamic spacing from navbar */
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* TITLE + CTA GROUP */}
      <div className="hero-action-group">
        <h1 style={{
          fontFamily: "'Syncopate', sans-serif",
          fontSize: 'clamp(28px, 5.5vw, 54px)',
          fontWeight: '900',
          letterSpacing: '0.22em',
          color: '#FFFFFF',
          margin: '0 0 10px 0',
          textShadow: '0 0 32px rgba(255, 255, 255, 0.18)'
        }}>
          SWARRAKSHAK
        </h1>

        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(9px, 2vw, 11px)',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#a1a1aa',
          margin: '0 0 22px 0',
          fontWeight: '500'
        }}>
          YOUR VOICE. YOUR IDENTITY.
        </p>

        <button
          onClick={onOpenDashboard}
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '9999px',
            padding: '10px 24px',
            color: '#FFFFFF',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '13px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
            transition: 'transform 0.2s ease, border-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Run Telemetry <span style={{ fontSize: '15px' }}>→</span>
        </button>
      </div>

      {/* GLOBE CANVAS WRAPPER */}
      <div className="globe-canvas-wrapper">
        {/* Three.js Canvas / Globe container sits cleanly below */}
      </div>
    </section>
  );
}








