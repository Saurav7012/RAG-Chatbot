/**
 * A single chat message bubble.
 * Uses DaisyUI's chat component for styling.
 *
 * role: "user" | "assistant" | "error"
 */
const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";
  const isError = role === "error";

  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      {/* Avatar label */}
      <div className="chat-header mb-1 text-xs opacity-60">
        {isUser ? "You" : isError ? "Error" : "Assistant"}
      </div>

      {/* Bubble */}
      <div
        className={`chat-bubble text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? "chat-bubble-primary"
            : isError
            ? "chat-bubble-error"
            : "chat-bubble-neutral"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default MessageBubble;