/**
 * Sends a user message + conversation history to the backend RAG pipeline.
 *
 * @param {string} message   - The user's latest question.
 * @param {Array}  history   - Full conversation history: [{ role, content }]
 * @returns {Promise<{ answer: string, sources: string[], history: Array }>}
 */
export const sendMessage = async (message, history = []) => {
  const response = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${response.status}`);
  }

  return response.json();
};