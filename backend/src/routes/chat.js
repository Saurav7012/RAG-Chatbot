const express = require("express");
const router = express.Router();

// Placeholder — full RAG logic added in Block 3
router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Temporary echo response until Block 3
    res.json({
      answer: `Echo (Block 3 will replace this): "${message}"`,
      history: history || [],
    });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;