export type IconName =
  | "trophy"
  | "video"
  | "phone"
  | "paw"
  | "heart"
  | "bag"
  | "play"
  | "thumbs"
  | "people"
  | "upload"
  | "cloud"
  | "share"
  | "film"
  | "doc"
  | "vote"
  | "form"
  | "list";

const iconClassName = "h-8 w-8 text-launch-gold";

export function FlatIcon({
  name,
  className = iconClassName,
}: {
  name: IconName;
  className?: string;
}) {
  switch (name) {
    case "trophy":
      return (
        <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 32 32">
          <path
            d="M8 6h16v4a8 8 0 0 1-6 7.75V20h4v2H10v-2h4v-2.25A8 8 0 0 1 8 10V6Zm2 2v2a6 6 0 0 0 12 0V8H10Z"
            fill="currentColor"
          />
        </svg>
      );
    case "video":
      return (
        <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 32 32">
          <path d="M6 10h14v12H6V10Zm16 3 4-2v10l-4-2V13Z" fill="currentColor" />
        </svg>
      );
    case "phone":
      return (
        <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32">
          <path d="M11 4h10a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1 3v14h8V7h-8Zm4 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        </svg>
      );
    case "paw":
      return (
        <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32">
          <circle cx="11" cy="11" r="3" />
          <circle cx="21" cy="11" r="3" />
          <circle cx="8" cy="18" r="3" />
          <circle cx="24" cy="18" r="3" />
          <ellipse cx="16" cy="23" rx="5" ry="4" />
        </svg>
      );
    case "heart":
      return (
        <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32">
          <path d="M16 26s-9-5.7-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.3-9 12-9 12Z" />
        </svg>
      );
    case "bag":
      return (
        <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 32 32">
          <path d="M10 12h12l-1 12H11L10 12Zm4-4h4l2 4h-8l2-4Z" fill="currentColor" />
        </svg>
      );
    case "play":
      return (
        <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32">
          <path d="M12 9v14l12-7-12-7Z" />
        </svg>
      );
    case "thumbs":
      return (
        <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32">
          <path d="M14 6h3l3 8h6v12H10V16h4V6Zm-8 10h4v12H6V16Z" />
        </svg>
      );
    case "people":
      return (
        <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32">
          <circle cx="11" cy="11" r="3" />
          <circle cx="21" cy="11" r="3" />
          <path d="M6 24c0-3 2.5-5 5-5s5 2 5 5v1H6v-1Zm10 0c0-3 2.5-5 5-5s5 2 5 5v1H16v-1Z" />
        </svg>
      );
    case "upload":
      return (
        <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32">
          <path d="M16 6l8 8h-5v8h-6v-8H8l8-8ZM6 24h20v2H6v-2Z" />
        </svg>
      );
    case "cloud":
      return (
        <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32">
          <path d="M10 24a6 6 0 0 1 0-12 8 8 0 0 1 15.5 2.5A5.5 5.5 0 0 1 24 24H10Z" />
        </svg>
      );
    case "share":
      return (
        <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32">
          <circle cx="8" cy="16" r="3" />
          <circle cx="24" cy="8" r="3" />
          <circle cx="24" cy="24" r="3" />
          <path d="M10.5 14.5 21.5 9.5M10.5 17.5 21.5 22.5" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "film":
      return (
        <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32">
          <path d="M6 8h14v16H6V8Zm16 3 6-3v16l-6-3V11Z" />
        </svg>
      );
    case "doc":
      return (
        <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32">
          <path d="M10 6h9l7 7v13H10V6Zm9 2v5h5" />
        </svg>
      );
    case "vote":
      return (
        <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 32 32">
          <path
            d="M14 13V7.5A2.5 2.5 0 0 1 16.5 5h.3c1 .2 1.7 1.2 1.5 2.2L17.5 13H24a2 2 0 0 1 2 2.3l-1.2 8A3 3 0 0 1 21.9 26H13a2 2 0 0 1-2-2v-8.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
          <path
            d="M11 15.5H8A2 2 0 0 0 6 17.5V24a2 2 0 0 0 2 2h3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
        </svg>
      );
    case "form":
      return (
        <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 32 32">
          <path
            d="M10 5.5h9.5L24.5 10v16.5H10A1.5 1.5 0 0 1 8.5 25V7A1.5 1.5 0 0 1 10 5.5Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
          <path d="M19 5.5V11h5.5" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.75" />
          <path
            d="M12.5 16h7M12.5 20h7M12.5 24h4.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.75"
          />
        </svg>
      );
    case "list":
      return (
        <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 32 32">
          <path
            d="M8 8h16M8 16h16M8 24h16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.75"
          />
          <circle cx="5" cy="8" fill="currentColor" r="1.25" />
          <circle cx="5" cy="16" fill="currentColor" r="1.25" />
          <circle cx="5" cy="24" fill="currentColor" r="1.25" />
        </svg>
      );
  }
}
