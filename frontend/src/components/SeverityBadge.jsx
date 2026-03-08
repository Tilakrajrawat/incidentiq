const styles = {
  critical: { backgroundColor: "#ef4444", color: "white" },
  high: { backgroundColor: "#f97316", color: "white" },
  medium: { backgroundColor: "#eab308", color: "black" },
  low: { backgroundColor: "#22c55e", color: "white" }
};

export default function SeverityBadge({ severity = "LOW" }) {
  const normalized = String(severity).toLowerCase();
  const style = styles[normalized] || styles.low;

  return (
    <span className="badge" style={{ ...style, borderRadius: 9999, padding: "0.15rem 0.5rem", fontSize: "0.75rem" }}>
      {String(severity).toUpperCase()}
    </span>
  );
}
