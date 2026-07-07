// Lightweight inline icon set — keeps the bundle dependency-free.
export const LogoMark = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3.2" fill="currentColor" />
    <circle
      cx="12"
      cy="12"
      r="7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeDasharray="2.5 3.2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="10.4" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
  </svg>
);

export const SendIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M4 12L20 4L13 20L11 13L4 12Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

export const UserGlyph = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M4.5 20c1.4-4 4.2-6 7.5-6s6.1 2 7.5 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const BotGlyph = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="8" width="16" height="11" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 8V4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="3.2" r="1.2" fill="currentColor" />
    <circle cx="9" cy="13.5" r="1.3" fill="currentColor" />
    <circle cx="15" cy="13.5" r="1.3" fill="currentColor" />
  </svg>
);

export const AlertGlyph = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 3.5L21 19.5H3L12 3.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M12 9.5V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="16.8" r="0.9" fill="currentColor" />
  </svg>
);

export const SparkleIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
      fill="currentColor"
    />
  </svg>
);
