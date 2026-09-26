import React from 'react';

export default function ContextForm({ context, setContext, handleRunDetection }) {
  const valueToDisplayMap = {
    callerId: {
      known: 'Verified contact',
      executive: 'Known executive',
      unknown: 'Unknown caller',
      hidden: 'Impersonation suspected',
    },
    urgency: {
      normal: 'Routine',
      time_sensitive: 'Time-sensitive',
      urgent: 'Urgent',
      critical: 'Critical',
    },
    transactionValue: {
      none: 'No transaction',
      low: 'Low value',
      medium: 'High value',
      high: 'Critical value',
    },
    protocolOverride: {
      normal: 'No override',
      bypass_requested: 'Requested override',
      partial: 'Partial override',
      full: 'Full override',
    },
    roleRelationship: {
      employee: 'Employee',
      executive: 'Executive',
      vendor: 'Vendor',
      customer: 'Customer',
      unknown: 'Unknown entity',
    }
  };

  const displayToValueMap = {
    callerId: {
      'Verified contact': 'known',
      'Known executive': 'executive',
      'Unknown caller': 'unknown',
      'Impersonation suspected': 'hidden',
    },
    urgency: {
      'Routine': 'normal',
      'Time-sensitive': 'time_sensitive',
      'Urgent': 'urgent',
      'Critical': 'critical',
    },
    transactionValue: {
      'No transaction': 'none',
      'Low value': 'low',
      'High value': 'medium',
      'Critical value': 'high',
    },
    protocolOverride: {
      'No override': 'normal',
      'Requested override': 'bypass_requested',
      'Partial override': 'partial',
      'Full override': 'full',
    },
    roleRelationship: {
      'Employee': 'employee',
      'Executive': 'executive',
      'Vendor': 'vendor',
      'Customer': 'customer',
      'Unknown entity': 'unknown',
    }
  };

  const fieldKeyMap = {
    callerId: 'caller_number_status',
    urgency: 'request_urgency',
    transactionValue: 'transaction_value',
    protocolOverride: 'procedure_status',
    roleRelationship: 'caller_relationship',
  };

  const handleContextChange = (key, opt) => {
    const backendField = fieldKeyMap[key];
    const backendVal = displayToValueMap[key]?.[opt] || opt;
    if (setContext && backendField) {
      setContext((prev) => ({ ...prev, [backendField]: backendVal }));
    }
  };

  const contextSignals = {
    callerId: valueToDisplayMap.callerId[context?.caller_number_status] || 'Verified contact',
    urgency: valueToDisplayMap.urgency[context?.request_urgency] || 'Routine',
    transactionValue: valueToDisplayMap.transactionValue[context?.transaction_value] || 'No transaction',
    protocolOverride: valueToDisplayMap.protocolOverride[context?.procedure_status] || 'No override',
    roleRelationship: valueToDisplayMap.roleRelationship[context?.caller_relationship] || 'Customer',
  };

  return (
    <div className="glass-panel" style={{
      marginTop: '36px',
      marginBottom: '40px',
      borderRadius: '20px',
      padding: '36px 32px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Section Header: Centered & Spaced */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ color: '#E11D48', fontSize: '22px' }}>📞</span>
          <h3 style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '0.14em',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            margin: 0
          }}>
            CALL CONTEXT & BEHAVIORAL INDICATORS
          </h3>
        </div>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '14px',
          fontWeight: '500',
          color: '#a1a1aa',
          marginTop: '8px',
          marginBottom: 0
        }}>
          Add contextual signals to improve the accuracy of the risk assessment.
        </p>
      </div>

      {/* Sub-Cards Grid: 2-3 Columns with Generous Gaps */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(260px, 28vw, 340px), 1fr))',
        gap: '18px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {[
          {
            key: 'callerId',
            icon: '👤',
            title: 'Caller Identification Status',
            desc: 'Select appropriate telemetry tag',
            options: ['Verified contact', 'Known executive', 'Unknown caller', 'Impersonation suspected'],
            current: contextSignals?.callerId || 'Verified contact'
          },
          {
            key: 'urgency',
            icon: '⚠️',
            title: 'Request Time Urgency',
            desc: 'Select the level of time pressure',
            options: ['Routine', 'Time-sensitive', 'Urgent', 'Critical'],
            current: contextSignals?.urgency || 'Routine'
          },
          {
            key: 'transactionValue',
            icon: '💲',
            title: 'Financial Transaction Value',
            desc: 'Select transaction exposure level',
            options: ['No transaction', 'Low value', 'High value', 'Critical value'],
            current: contextSignals?.transactionValue || 'No transaction'
          },
          {
            key: 'protocolOverride',
            icon: '🛡️',
            title: 'Authorization Protocol Override',
            desc: 'Identify whether standard controls were bypassed',
            options: ['No override', 'Requested override', 'Partial override', 'Full override'],
            current: contextSignals?.protocolOverride || 'No override'
          },
          {
            key: 'roleRelationship',
            icon: '👥',
            title: 'Claimed Identity / Role Relationship',
            desc: "Select the caller's claimed relationship",
            options: ['Employee', 'Executive', 'Vendor', 'Customer', 'Unknown entity'],
            current: contextSignals?.roleRelationship || 'Customer'
          }
        ].map((card) => (
          <div
            key={card.key}
            className="glass-panel"
            style={{
              borderRadius: '16px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxSizing: 'border-box',
              minHeight: '190px',
              justifyContent: 'space-between'
            }}
          >
            {/* Header with Icon, Title, and Description */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '15px' }}>{card.icon}</span>
                <h4 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  margin: 0,
                  letterSpacing: '0.02em'
                }}>
                  {card.title}
                </h4>
              </div>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: '#71717a',
                margin: '0 0 16px 0'
              }}>
                {card.desc}
              </p>
            </div>

            {/* Centered Pill Buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              width: '100%'
            }}>
              {card.options.map((opt) => {
                const isSelected = card.current === opt;

                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleContextChange && handleContextChange(card.key, opt)}
                    className={isSelected ? "glass-btn-primary" : "glass-btn-secondary"}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '8px 14px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease-in-out'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Centered Primary Run Engine Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '36px' }}>
        <button
          type={handleRunDetection ? 'submit' : 'button'}
          onClick={handleRunDetection || (() => {})}
          className="glass-btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px 40px',
            fontFamily: "'Syncopate', sans-serif",
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.12em',
            cursor: 'pointer',
            textTransform: 'uppercase'
          }}
        >
          <span>⚡</span> RUN RISK DETECTION ENGINE <span>⚡</span>
        </button>
      </div>
    </div>
  );
}
