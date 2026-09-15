export type ContestIconName =
  | "contest_trophy"
  | "contest_video"
  | "contest_upvote"
  | "contest_join"
  | "step_upload"
  | "step_enter"
  | "step_record"
  | "step_share"
  | "step_win"
  | "upload_panel"
  | "rules_basics"
  | "rules_how_to_win"
  | "faq_chevron";

const assets: Record<ContestIconName, string> = {
  contest_trophy: "/icons/contest_trophy.svg",
  contest_video: "/icons/contest_video.svg",
  contest_upvote: "/icons/contest_upvote.svg",
  contest_join: "/icons/contest_join.svg",
  step_upload: "/icons/step_upload.svg",
  step_enter: "/icons/step_enter.svg",
  step_record: "/icons/step_record.svg",
  step_share: "/icons/step_share.svg",
  step_win: "/icons/step_win.svg",
  upload_panel: "/icons/upload_panel.svg",
  rules_basics: "/icons/rules_basics.svg",
  rules_how_to_win: "/icons/rules_how_to_win.svg",
  faq_chevron: "/icons/faq_chevron.svg",
};

export function ContestIcon({
  name,
  size = 56,
  className = "",
}: {
  name: ContestIconName;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      aria-hidden="true"
      className={className}
      height={size}
      src={assets[name]}
      width={size}
    />
  );
}
