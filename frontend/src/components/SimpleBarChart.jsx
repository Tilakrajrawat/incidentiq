export default function SimpleBarChart({ title, data }) {
  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="bar-chart">
        {data.map((item) => (
          <div key={item.label} className="bar-item">
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
            <div className="bar-meta">
              <span>{item.label}</span>
              <strong>{item.count}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
