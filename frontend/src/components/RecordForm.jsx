import { useState } from "react";

export default function RecordForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [severity, setSeverity] = useState("LOW");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, description: content, severity });
    setTitle("");
    setContent("");
    setSeverity("LOW");
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Create Incident</h3>
      <input
        className="input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea"
        placeholder="Content (optional)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <select className="input" value={severity} onChange={(e) => setSeverity(e.target.value)}>
        <option value="CRITICAL">Critical</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
      <button className="btn primary">Add</button>
    </form>
  );
}
