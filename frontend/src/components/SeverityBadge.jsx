const labels = {
  critical: "CRITICAL",
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW"
};

export default function SeverityBadge({ severity = "LOW" }) {
  const normalized = String(severity).toLowerCase();

  return (
    <span className={`severity-badge severity-${normalized}`}>
      {labels[normalized] || String(severity).toUpperCase()}
    </span>
  );
}
