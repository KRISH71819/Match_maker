/**
 * ════════════════════════════════════════════════════════════════════
 * TDC Matchmaker — Express API Server
 * ════════════════════════════════════════════════════════════════════
 * Serves profile data, matching algorithms, and Gemini AI endpoints.
 * Designed for Render deployment with CORS for Vercel frontend.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profiles");
const matchRoutes = require("./routes/matches");
const aiRoutes = require("./routes/ai");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// ─── Health check ───
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "TDC Matchmaker API",
    ai: process.env.GEMINI_API_KEY ? "Gemini connected" : "Gemini not configured (using fallback)",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/ai", aiRoutes);

// ─── Error handling ───
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start server ───
app.listen(PORT, () => {
  console.log(`\n  🚀 TDC Matchmaker API running on port ${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log(`  AI: ${process.env.GEMINI_API_KEY ? "✅ Gemini API connected" : "⚠️  No GEMINI_API_KEY — using fallback scoring"}\n`);
});
