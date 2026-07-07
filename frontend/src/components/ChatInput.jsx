import { useState } from "react";

/**
 * Text input bar with Send button.
 * Enter sends the message. Shift+Enter adds a newline.
 * Disabled while the assistant is loading.
 */
const ChatInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end p-4 border-t border-base-300 bg-base-100">
      <textarea
        className="textarea textarea-bordered flex-1 resize-none text-sm leading-relaxed"
        rows={1}
        placeholder="Type your question and press Enter..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <button
        className="btn btn-primary btn-sm h-10"
        onClick={handleSend}
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          "Send"
        )}
      </button>
    </div>
  );
};

export default ChatInput;