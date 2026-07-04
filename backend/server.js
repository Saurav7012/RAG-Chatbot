require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { getClient } = require("./src/config/chromadb");
const chatRoute = require("./src/routes/chat");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:5173", // Vite React dev server
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ─── Health Check ─────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    // Check ChromaDB connectivity
    const client = getClient();
    await client.heartbeat();

    res.json({
      status: "ok",
      message: "Server is running",
      chromadb: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server is running but ChromaDB is not reachable",
      chromadb: "disconnected",
      error: error.message,
    });
  }
});

// ─── Routes ───────────────────────────────────────────────
app.use("/api/chat", chatRoute);

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 ChromaDB expected at ${process.env.CHROMA_URL}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});