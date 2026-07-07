import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { sendMessage } from "./services/api";

const App = () => {
  // What the user sees in the chat window
  const [messages, setMessages] = useState([]);

  // Clean history array sent to the backend on every request
  const [history, setHistory] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (userText) => {
    // 1. Show the user's message immediately
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);

    try {
      // 2. Call the backend RAG pipeline
      const data = await sendMessage(userText, history);

      // 3. Show the assistant's answer
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);

      // 4. Save updated history for the next turn
      setHistory(data.history);
    } catch (err) {
      // 5. Show a friendly error bubble — never a blank screen
      setMessages((prev) => [
        ...prev,
        { role: "error", content: `Something went wrong: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      {/* Chat card */}
      <div className="card bg-base-100 shadow-xl w-full max-w-2xl h-[88vh] flex flex-col">

        {/* Header */}
        <div className="card-body p-0 flex flex-col h-full">
          <div className="bg-primary text-primary-content px-6 py-4 rounded-t-2xl">
            <h1 className="text-lg font-bold">PDF Chatbot</h1>
            <p className="text-sm opacity-80">Answers sourced from your document</p>
          </div>

          {/* Message list */}
          <ChatWindow messages={messages} isLoading={isLoading} />

          {/* Input bar */}
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;