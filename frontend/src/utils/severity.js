export const getSeverityTheme = (threatLevel = '', score = 0) => {
  const level = String(threatLevel).toUpperCase();
  
  // HIGH / CRITICAL THREAT: Crimson / Rose
  if (level.includes('HIGH') || level.includes('CRITICAL') || score >= 70) {
    return {
      text: '#f43f5e',
      border: 'rgba(244, 63, 94, 0.4)',
      bg: 'rgba(244, 63, 94, 0.12)',
      glow: 'rgba(244, 63, 94, 0.35)'
    };
  }

  // MEDIUM / MODERATE / ELEVATED THREAT: Vibrant Amber / Orange
  if (level.includes('MED') || level.includes('MODERATE') || level.includes('ELEVATED') || (score >= 40 && score < 70)) {
    return {
      text: '#f59e0b',
      border: 'rgba(245, 158, 11, 0.4)',
      bg: 'rgba(245, 158, 11, 0.12)',
      glow: 'rgba(245, 158, 11, 0.35)'
    };
  }

  // LOW / SAFE: Emerald Green
  return {
    text: '#10b981',
    border: 'rgba(16, 185, 129, 0.4)',
    bg: 'rgba(16, 185, 129, 0.12)',
    glow: 'rgba(16, 185, 129, 0.35)'
  };
};
