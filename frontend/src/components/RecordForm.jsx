import { useState } from "react";
import ErrorBanner from "./ErrorBanner.jsx";

export default function RecordForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [severity, setSeverity] = useState("LOW");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await onCreate({ title, description: content, severity });
      setTitle("");
      setContent("");
      setSeverity("LOW");
    } catch (createError) {
      setError(createError.message || "Failed to create incident.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Create Incident</h3>
      <ErrorBanner message={error} />
      <input
        className="input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea"
        placeholder="Description"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <select className="input" value={severity} onChange={(e) => setSeverity(e.target.value)}>
        <option value="CRITICAL">Critical</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
      <button className="btn primary" disabled={saving}>{saving ? "Adding..." : "Add"}</button>
    </form>
  );
}
