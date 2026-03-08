const severityTargetsMs = {
  critical: 15 * 60 * 1000,
  high: 60 * 60 * 1000,
  medium: 4 * 60 * 60 * 1000,
  low: 24 * 60 * 60 * 1000
};

export function getSlaStatus(incident) {
  const severity = String(incident?.severity || "low").toLowerCase();
  const target = severityTargetsMs[severity] || severityTargetsMs.low;
  const createdAt = incident?.createdAt ? new Date(incident.createdAt).getTime() : Date.now();
  const acknowledgedAt = incident?.acknowledgedAt ? new Date(incident.acknowledgedAt).getTime() : null;
  const compareAt = acknowledgedAt || Date.now();
  const elapsed = Math.max(compareAt - createdAt, 0);

  if (elapsed >= target) {
    return { label: "Breached", tone: "danger", remainingMs: 0 };
  }

  if (elapsed >= target * 0.8) {
    return { label: "Approaching breach", tone: "warning", remainingMs: target - elapsed };
  }

  return { label: "On track", tone: "success", remainingMs: target - elapsed };
}

export function formatDuration(ms) {
  const totalMinutes = Math.max(Math.round(ms / 60000), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
