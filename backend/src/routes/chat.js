const express = require("express");
const router = express.Router();
const { runRAGChain } = require("../services/ragChain");

/**
 * POST /api/chat
 *
 * Body:
 *   {
 *     "message": "What is the return policy?",
 *     "history": [
 *       { "role": "user",      "content": "Hello" },
 *       { "role": "assistant", "content": "Hi! How can I help?" }
 *     ]
 *   }
 *
 * Response:
 *   {
 *     "answer":  "The return policy allows ...",
 *     "sources": ["documentation.pdf"],
 *     "history": [ ...previousHistory, newUserTurn, newAssistantTurn ]
 *   }
 */
router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "message is required and must be a non-empty string" });
    }

    if (history !== undefined && !Array.isArray(history)) {
      return res.status(400).json({ error: "history must be an array" });
    }

    // Validate each history entry has the expected shape
    const safeHistory = (history || []).filter(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        (entry.role === "user" || entry.role === "assistant") &&
        typeof entry.content === "string"
    );

    // ── RAG pipeline ────────────────────────────────────────────────────────
    const { answer, sources } = await runRAGChain(message.trim(), safeHistory);

    
    // ── Build updated history to return to the client ────────────────────────
    const updatedHistory = [
      ...safeHistory,
      { role: "user",      content: message.trim() },
      { role: "assistant", content: answer },
    ];

    res.json({
      answer,
      sources,
      history: updatedHistory,
    });

  } catch (error) {
    console.error("Chat route error:", error);

    // Surface a friendlier message for common ChromaDB / Gemini failures
    if (error.message?.includes("fetch")) {
      return res.status(503).json({
        error: "Could not reach ChromaDB. Make sure Docker is running.",
      });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;