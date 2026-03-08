import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["reporter", "responder", "admin"],
    default: "reporter"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
