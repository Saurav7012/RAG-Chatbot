require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { retrieveContext } = require("./retriever");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Prompt Templates ────────────────────────────────────────────────────────

/**
 * When the conversation has prior turns, ask Gemini to rewrite the latest
 * user question as a standalone question so the retriever gets clean input.
 */
const buildCondensePrompt = (chatHistory, followUpQuestion) => `
Given the conversation history below and a follow-up question, rewrite the
follow-up question to be a fully self-contained, standalone question that
captures all relevant context from the history.

Conversation history:
${chatHistory}

Follow-up question: ${followUpQuestion}

Standalone question:`.trim();

/**
 * Main QA prompt — instructs Gemini to answer using only the provided context.
 */
const buildQAPrompt = (context, chatHistory, question) => `
You are a helpful assistant that answers questions strictly based on the
provided document context. If the answer is not contained in the context,
say "I don't have enough information in the document to answer that."

if user asks "what is this document about" - summarize shortly and provide answer.

Document context:
${context}

${chatHistory ? `Conversation history:\n${chatHistory}\n` : ""}
User question: ${question}

Answer:`.trim();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Formats the history array into a plain-text block for the prompt.
 * Each entry is expected to be { role: "user"|"assistant", content: string }.
 */
const formatHistory = (history = []) =>
  history
    .map((msg) => {
      const speaker = msg.role === "user" ? "User" : "Assistant";
      return `${speaker}: ${msg.content}`;
    })
    .join("\n");

/**
 * Calls Gemini's generateContent and returns the plain-text response.
 */
const callGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// ─── Main RAG Function ───────────────────────────────────────────────────────

/**
 * Runs the full RAG pipeline for one conversational turn.
 *
 * @param {string} userMessage        - The latest message from the user.
 * @param {Array}  history            - Prior turns [{ role, content }, ...].
 * @returns {Promise<{ answer: string, sources: string[] }>}
 */
const runRAGChain = async (userMessage, history = []) => {
  // 1. Condense the question when there is prior context so the retriever
  //    gets a clean, self-contained query.
  let searchQuery = userMessage;

  if (history.length > 0) {
    const historyText = formatHistory(history);
    const condensePrompt = buildCondensePrompt(historyText, userMessage);

    try {
      searchQuery = await callGemini(condensePrompt);
      // Strip any accidental newlines from the condensed question
      searchQuery = searchQuery.trim().replace(/\n+/g, " ");
    } catch (err) {
      // Fall back to the raw user message if condensation fails
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

  const answer = await callGemini(qaPrompt);

  return {
    answer: answer.trim(),
    sources,
  };
};

module.exports = { runRAGChain };