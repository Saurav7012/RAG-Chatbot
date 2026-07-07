import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

/**
 * Scrollable message list.
 * Auto-scrolls to the newest message whenever messages change.
 */
const ChatWindow = ({ messages, isLoading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-base-content/40 text-sm">
            Ask me anything about the document.
          </p>
        </div>
      )}

      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} content={msg.content} />
      ))}

      {/* Loading indicator while waiting for a response */}
      {isLoading && (
        <div className="chat chat-start">
          <div className="chat-header mb-1 text-xs opacity-60">Assistant</div>
          <div className="chat-bubble chat-bubble-neutral">
            <span className="loading loading-dots loading-sm" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;