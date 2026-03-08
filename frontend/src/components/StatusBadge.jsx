const labels = {
  open: "Open",
  acknowledged: "Acknowledged",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed"
};

export default function StatusBadge({ status = "open" }) {
  const normalized = String(status).toLowerCase();
  return <span className={`status-badge status-${normalized}`}>{labels[normalized] || normalized}</span>;
}
