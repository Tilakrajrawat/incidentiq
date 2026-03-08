import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  title: { type: String, required: true },
  content: { type: String, default: "" },
  severity: { type: String, enum: ["critical", "high", "medium", "low"], default: "low", index: true },
  status: {
    type: String,
    enum: ["open", "acknowledged", "in_progress", "resolved", "closed"],
    default: "open",
    index: true
  },
  escalated: { type: Boolean, default: false },
  acknowledgedAt: { type: Date, default: null },
  resolvedAt: { type: Date, default: null },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

export default mongoose.model("Record", recordSchema);
