require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { traceable } = require("langsmith/traceable");
const { retrieveContext } = require("./retriever");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Prompt Templates ────────────────────────────────────────────────────────

const buildCondensePrompt = (chatHistory, followUpQuestion) => `
Given the conversation history below and a follow-up question, rewrite the
follow-up question to be a fully self-contained, standalone question that
captures all relevant context from the history.

Conversation history:
${chatHistory}

Follow-up question: ${followUpQuestion}

Standalone question:`.trim();

const buildQAPrompt = (context, chatHistory, question) => `
You are a helpful assistant that answers questions strictly based on the
provided document context. If the answer is not contained in the context,
say "I don't have enough information in the document to answer that."

Document context:
${context}

${chatHistory ? `Conversation history:\n${chatHistory}\n` : ""}
User question: ${question}

Answer:`.trim();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatHistory = (history = []) =>
  history
    .map((msg) => {
      const speaker = msg.role === "user" ? "User" : "Assistant";
      return `${speaker}: ${msg.content}`;
    })
    .join("\n");

// Wrapped with traceable so each Gemini call appears as its own span
const callGemini = traceable(
  async (prompt, stepName) => {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL,
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  },
  { name: "Gemini LLM Call", project_name: process.env.LANGCHAIN_PROJECT }
);

// ─── Main RAG Function ───────────────────────────────────────────────────────

const runRAGChain = traceable(
  async (userMessage, history = []) => {
    // 1. Condense the question when there is prior context
    let searchQuery = userMessage;

    if (history.length > 0) {
      const historyText = formatHistory(history);
      const condensePrompt = buildCondensePrompt(historyText, userMessage);

      try {
        searchQuery = await callGemini(condensePrompt, "condense");
        searchQuery = searchQuery.trim().replace(/\n+/g, " ");
      } catch (err) {
        console.warn("Condense step failed, using raw message:", err.message);
        searchQuery = userMessage;
      }
    }

    // 2. Retrieve relevant chunks from ChromaDB
    const docs = await retrieveContext(searchQuery, 4);

    if (!docs || docs.length === 0) {
      return {
        answer:
          "I couldn't find any relevant information in the document to answer your question.",
        sources: [],
      };
    }

    // 3. Build context string from retrieved chunks
    const context = docs
      .map((doc, i) => `[Chunk ${i + 1}]\n${doc.pageContent}`)
      .join("\n\n");

    const sources = [
      ...new Set(docs.map((doc) => doc.metadata?.source).filter(Boolean)),
    ];

    // 4. Build the QA prompt and call Gemini
    const historyText = formatHistory(history);
    const qaPrompt = buildQAPrompt(context, historyText, userMessage);

    const answer = await callGemini(qaPrompt, "qa");

    return {
      answer: answer.trim(),
      sources,
    };
  },
  { name: "RAG Pipeline", project_name: process.env.LANGCHAIN_PROJECT }
);

module.exports = { runRAGChain };