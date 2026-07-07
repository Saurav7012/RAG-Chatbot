import { useRef, useState } from "react";
import { SendIcon } from "./icons";

/**
 * Text input bar with Send button.
 * Enter sends the message. Shift+Enter adds a newline.
 * Disabled while the assistant is loading.
 */
const ChatInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const resize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleChange = (e) => {
    setText(e.target.value);
    resize(e.target);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText("");
    requestAnimationFrame(() => resize(textareaRef.current));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = text.trim().length > 0 && !isLoading;

  return (
    <div className="relative z-10 shrink-0 bg-gradient-to-t from-base-200 via-base-200 to-transparent pt-3">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-5">
        <div
          className={`flex items-end gap-2 rounded-3xl border bg-base-100 shadow-lg shadow-black/[0.03] px-3 py-2.5 transition-shadow ${
            isLoading
              ? "border-base-300 opacity-80"
              : "border-base-300 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10"
          }`}
        >
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none bg-transparent outline-none border-none text-sm leading-relaxed text-base-content placeholder:text-base-content/40 py-2 px-2 max-h-40"
            rows={1}
            placeholder="Ask a question about your document..."
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-all ${
              canSend
                ? "bg-primary text-primary-content hover:brightness-110 active:scale-95 shadow-sm shadow-primary/30"
                : "bg-base-300 text-base-content/30 cursor-not-allowed"
            }`}
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <SendIcon className="w-4.5 h-4.5" />
            )}
          </button>
        </div>
        <p className="text-[11px] text-base-content/35 text-center mt-2">
          Press Enter to send &middot; Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
