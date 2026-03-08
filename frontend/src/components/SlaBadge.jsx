import { formatDuration, getSlaStatus } from "../lib/sla";

export default function SlaBadge({ incident, showRemaining = false }) {
  const status = getSlaStatus(incident);

  return (
    <span className={`sla-badge sla-${status.tone}`}>
      SLA: {status.label}
      {showRemaining && status.label !== "Breached" ? ` (${formatDuration(status.remainingMs)} left)` : ""}
    </span>
  );
}
