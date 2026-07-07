import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { LogoMark } from "./components/icons";
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
      console.log(data);

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
    <div className="h-screen bg-base-200 flex flex-col overflow-hidden">
      {/* Ambient background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-secondary/[0.12] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 shrink-0 border-b border-base-300 bg-base-100/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-primary text-primary-content shrink-0">
            <LogoMark className="w-5 h-5" />
            <span className="retrieval-pulse absolute inset-0 rounded-2xl" />
          </div>

          <div className="min-w-0">
            <h1 className="font-display font-semibold text-base sm:text-lg leading-tight text-base-content truncate">
              RAG Chatbot
            </h1>
            <p className="text-[11px] sm:text-xs text-base-content/50 leading-tight truncate">
              Powered by Retrieval-Augmented Generation
            </p>
          </div>

          <div className="ml-auto flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-full border border-base-300 bg-base-100/60">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success/60 animate-ping" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-success" />
            </span>
            <span className="text-xs font-medium text-base-content/60 hidden sm:inline">
              Online
            </span>
          </div>
        </div>
      </header>

      {/* Message list */}
      <ChatWindow messages={messages} isLoading={isLoading} onSuggestion={handleSend} />

      {/* Input bar */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default App;
