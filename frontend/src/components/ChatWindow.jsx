import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { BotGlyph, SparkleIcon } from "./icons";

const SUGGESTIONS = [
  "What is this document about?"
];

/**
 * Scrollable message list.
 * Auto-scrolls to the newest message whenever messages change.
 */
const ChatWindow = ({ messages, isLoading, onSuggestion }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="chat-scroll relative z-10 flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 min-h-full flex flex-col">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <BotGlyph className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-display font-semibold text-xl text-base-content">
                Ask me anything about your document
              </h2>
              <p className="text-sm text-base-content/50 max-w-sm">
                I'll retrieve the most relevant passages and answer using only
                what's grounded in your source material.
              </p>
            </div>

            {onSuggestion && (
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSuggestion(s)}
                    className="btn btn-sm rounded-full bg-base-100 border-base-300 text-base-content/70 font-normal hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <SparkleIcon className="w-3.5 h-3.5 text-secondary" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="animate-message-in">
            <MessageBubble role={msg.role} content={msg.content} />
          </div>
        ))}

        {/* Loading indicator while waiting for a response */}
        {isLoading && (
          <div className="animate-message-in flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center shrink-0 text-secondary">
              <BotGlyph className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-base-300 bg-base-100 px-4 py-3.5 shadow-sm flex items-center gap-1.5">
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-base-content/40 inline-block" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-base-content/40 inline-block" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-base-content/40 inline-block" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
