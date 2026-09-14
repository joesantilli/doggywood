import type { ReactNode } from "react";
import { DogAvatar } from "@/components/ui/DogAvatar";
import { StarRatingDisplay } from "@/components/ui/StarRatingDisplay";

type VideoPlaceholderCardProps = {
  dogName: string;
  averageRating: number;
  ratingCount: number;
  label?: string;
  overlay?: ReactNode;
  compactRating?: boolean;
};

export function VideoPlaceholderCard({
  dogName,
  averageRating,
  ratingCount,
  label = "Vertical dog video",
  overlay,
  compactRating = true,
}: VideoPlaceholderCardProps) {
  return (
    <article className="min-w-0 overflow-hidden rounded-large bg-video-canvas text-warm-white">
      <div className="relative aspect-[9/16] w-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,162,39,0.18),_transparent_42%),linear-gradient(180deg,_rgba(165,28,48,0.18),_transparent_40%,_rgba(17,17,17,0.92))]" />
        <div className="absolute inset-x-0 top-space-16 flex justify-center">
          <p className="text-eyebrow text-champagne">{label}</p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-space-16 px-space-16 text-center">
          <DogAvatar name={dogName} size="large" />
          <p className="text-h3">{dogName}</p>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-space-16">
          {overlay ?? (
            <StarRatingDisplay
              average={averageRating}
              compact={compactRating}
              ratingCount={ratingCount}
            />
          )}
        </div>
      </div>
    </article>
  );
}
