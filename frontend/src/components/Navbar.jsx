import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabMapping = [
    { id: 'topology', label: 'Topology' },
    { id: 'dashboard', label: 'Risk Dashboard' },
    { id: 'analyst', label: 'Analyst History' },
    { id: 'overview', label: 'Overview Preview' },
  ];

  return (
    <header 
      className="header-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 28px',
        zIndex: 100,
        boxSizing: 'border-box'
      }}
    >
      {/* LEFT: BRAND */}
      <div 
        onClick={() => setActiveTab('topology')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '8px',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '13px' }}>🛡️</span>
        </div>
        <span 
          className="brand-logo-text"
          style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: '13px',
            fontWeight: '800',
            letterSpacing: '0.12em',
            color: '#FFFFFF'
          }}
        >
          SWARRAKSHAK
        </span>
      </div>

      {/* CENTER: RESPONSIVE PILL NAVIGATION */}
      <div className="nav-pill-wrapper">
        <nav className="nav-pill-container">
          {tabMapping.map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => setActiveTab(tabItem.id)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '13px',
                fontWeight: activeTab === tabItem.id ? '600' : '400',
                color: activeTab === tabItem.id ? '#FFFFFF' : '#a1a1aa',
                cursor: 'pointer',
                position: 'relative',
                padding: '4px 0',
                transition: 'color 0.2s ease'
              }}
            >
              {tabItem.label}
              {activeTab === tabItem.id && (
                <span style={{
                  position: 'absolute',
                  bottom: '-3px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#FFFFFF',
                  borderRadius: '9999px'
                }} />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* RIGHT: SYSTEM LIVE BADGE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '9999px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '12px',
        fontFamily: "'Space Grotesk', sans-serif",
        color: '#e4e4e7',
        flexShrink: 0
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#f43f5e',
          boxShadow: '0 0 8px #f43f5e'
        }} />
        System Live
      </div>
    </header>
  );
}





