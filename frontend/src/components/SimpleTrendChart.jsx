import { useMemo } from "react";

export default function SimpleTrendChart({ data }) {
  const points = useMemo(() => {
    const max = Math.max(...data.map((item) => item.count), 1);
    return data
      .map((item, index) => {
        const x = (index / Math.max(data.length - 1, 1)) * 100;
        const y = 100 - (item.count / max) * 100;
        return `${x},${y}`;
      })
      .join(" ");
  }, [data]);

  return (
    <div className="card">
      <h3>Last 7 Days Trend</h3>
      <svg viewBox="0 0 100 100" className="line-chart" preserveAspectRatio="none">
        <polyline fill="none" stroke="#38bdf8" strokeWidth="2" points={points} />
      </svg>
      <div className="trend-labels">
        {data.map((item) => (
          <span key={item.date}>{item.date.slice(5)}</span>
        ))}
      </div>
    </div>
  );
}
