import React from 'react';

export default function InfoOverview() {
  return (
    <main style={{
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto',
      padding: '24px clamp(20px, 4vw, 56px) 80px clamp(20px, 4vw, 56px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* MASTER GLASS CANVAS */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1540px',
        margin: '28px auto 60px auto',
        padding: '40px clamp(24px, 3.5vw, 48px) 52px clamp(24px, 3.5vw, 48px)',
        backgroundColor: 'rgba(255, 255, 255, 0.025)',
        backdropFilter: 'blur(36px) saturate(190%)',
        WebkitBackdropFilter: 'blur(36px) saturate(190%)',
        borderRadius: '32px',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderTop: '2px solid rgba(255, 255, 255, 0.45)', // Sharp specular top bevel
        borderLeft: '1.5px solid rgba(255, 255, 255, 0.28)',
        boxShadow: `
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          inset 0 2px 2px 0 rgba(255, 255, 255, 0.35),
          inset 0 -2px 6px 0 rgba(0, 0, 0, 0.7)
        `,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>

        {/* AMBIENT SPOTLIGHT GLOW BEHIND HEADER */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '850px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.32) 0%, rgba(225, 29, 72, 0.22) 45%, transparent 72%)',
          filter: 'blur(65px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* 2. CENTERED SECTION HEADER */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '36px'
        }}>
          <h1 style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: 'clamp(1.5rem, 2.3vw, 2.4rem)',
            fontWeight: '700',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            margin: '0 0 14px 0',
            lineHeight: '1.25',
            textAlign: 'center'
          }}>
            SWARRAKSHAK: PRIVACY-AWARE VOICE-RISK ASSISTANT
          </h1>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
            fontWeight: '400',
            color: '#a1a1aa',
            letterSpacing: '0.03em',
            margin: 0,
            maxWidth: '850px',
            lineHeight: '1.7',
            textAlign: 'center'
          }}>
            AI generative speech models can now clone a human voice using just a few seconds of reference audio. SwarRakshak protects financial operations and corporate personnel by evaluating voice authenticity, speaker similarity, and call context before sensitive wire transfers or account changes are approved.
          </p>
        </div>

        {/* 3. 3-COLUMN FEATURE BENTO GRID */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>
          {[
            {
              num: '1',
              title: 'Acoustic Authenticity',
              desc: 'Extracts spectral flatness, zero crossing rates, and pitch stability to identify synthetic or manipulated voice artifacts.',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              ),
              accentColor: '#38bdf8'
            },
            {
              num: '2',
              title: 'Speaker Comparison',
              desc: 'Optionally compares current call embeddings against a trusted reference voice sample (e.g. CFO or executive reference).',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ),
              accentColor: '#818cf8'
            },
            {
              num: '3',
              title: 'Zero-Retention Privacy',
              desc: 'Raw audio is automatically deleted immediately following feature extraction. Only non-confidential metadata is stored.',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              ),
              accentColor: '#34d399'
            }
          ].map((card, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(16px) saturate(160%)',
                WebkitBackdropFilter: 'blur(16px) saturate(160%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderTop: '1.5px solid rgba(255, 255, 255, 0.38)',
                borderLeft: '1.5px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '20px',
                padding: '24px 26px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {card.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  margin: 0,
                  letterSpacing: '0.02em'
                }}>
                  {card.num}. {card.title}
                </h3>
              </div>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '13.5px',
                color: '#a1a1aa',
                lineHeight: '1.6',
                margin: 0
              }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 4. CORE PRINCIPLES PANEL (Full Width Bento Card) */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(16px) saturate(160%)',
          WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderTop: '1.5px solid rgba(255, 255, 255, 0.38)',
          borderLeft: '1.5px solid rgba(255, 255, 255, 0.22)',
          borderRadius: '20px',
          padding: '28px 32px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
          boxSizing: 'border-box'
        }}>
          <h2 style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            margin: '0 0 18px 0'
          }}>
            Core Principles & Operating Scope
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                title: 'Transparent Weighted Risk Scoring',
                text: 'Combines acoustic features (up to 40pts), speaker consistency (up to 30pts), and structural context signals (up to 30pts) into a 0-100 risk score.'
              },
              {
                title: 'Actionable Verification Protocols',
                text: 'Recommends independent callback channels when High risk (60-100) or Medium risk (30-59) is flagged.'
              },
              {
                title: 'Human Decision Support',
                text: 'Serves as an early risk warning assistant; does not automatically block telecom calls or execute financial transactions.'
              }
            ].map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#10b981',
                  fontSize: '11px',
                  marginTop: '2px',
                  flexShrink: 0
                }}>
                  ✓
                </span>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', lineHeight: '1.6', color: '#a1a1aa' }}>
                  <strong style={{ color: '#FFFFFF', fontWeight: '700' }}>{item.title}: </strong>
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

