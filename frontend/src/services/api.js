const API_BASE = '/api/v1';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

export async function submitAnalysis(formData) {
  const res = await fetch(`${API_BASE}/analyses`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.detail?.message || errorData.detail || 'Failed to process analysis.';
    throw new Error(message);
  }

  return await res.json();
}

export async function fetchAnalysesList(riskLevel = '', page = 1) {
  const params = new URLSearchParams({ page, page_size: 10 });
  if (riskLevel) params.append('risk_level', riskLevel);

  const res = await fetch(`${API_BASE}/analyses?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch incident log.');
  }
  return await res.json();
}
