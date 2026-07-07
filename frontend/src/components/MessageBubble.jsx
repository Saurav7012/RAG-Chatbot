import { AlertGlyph, BotGlyph, UserGlyph } from "./icons";

/**
 * A single chat message bubble.
 *
 * role: "user" | "assistant" | "error"
 */
const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";
  const isError = role === "error";

  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className="max-w-[80%] sm:max-w-[70%]">
          <div className="text-[11px] font-medium text-base-content/40 mb-1 text-right pr-1">
            You
          </div>
          <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-content px-4 py-3 shadow-sm shadow-primary/20">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <UserGlyph className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
          isError
            ? "bg-error/10 border-error/20 text-error"
            : "bg-base-100 border-base-300 text-secondary"
        }`}
      >
        {isError ? <AlertGlyph className="w-4 h-4" /> : <BotGlyph className="w-4 h-4" />}
      </div>
      <div className="max-w-[80%] sm:max-w-[70%]">
        <div className="text-[11px] font-medium text-base-content/40 mb-1 pl-1">
          {isError ? "Error" : "Assistant"}
        </div>
        <div
          className={`rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border ${
            isError
              ? "bg-error/5 border-error/20 text-error"
              : "bg-base-100 border-base-300 border-l-4 border-l-secondary/60"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-base-content">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
