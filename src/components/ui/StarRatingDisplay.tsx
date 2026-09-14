type StarRatingDisplayProps = {
  average: number;
  ratingCount?: number;
  compact?: boolean;
};

function starLabel(filled: boolean, index: number, average: number) {
  if (filled) {
    return `Star ${index} of 5 filled for average ${average.toFixed(1)}`;
  }

  return `Star ${index} of 5 empty for average ${average.toFixed(1)}`;
}

export function StarRatingDisplay({
  average,
  ratingCount,
  compact = false,
}: StarRatingDisplayProps) {
  const rounded = Math.round(average);

  return (
    <div className="flex flex-wrap items-center gap-space-8">
      <p className="sr-only">
        Average fan rating {average.toFixed(1)} out of 5
        {typeof ratingCount === "number"
          ? ` from ${ratingCount.toLocaleString("en-US")} ratings`
          : ""}
        . This is not the official contest Fan Score.
      </p>
      <div aria-hidden="true" className="flex items-center gap-space-4">
        {Array.from({ length: 5 }, (_, index) => {
          const starNumber = index + 1;
          const filled = starNumber <= rounded;
          return (
            <span
              className={
                filled
                  ? "text-[18px] leading-none text-doggywood-gold"
                  : "text-[18px] leading-none text-text-gray"
              }
              key={starNumber}
              title={starLabel(filled, starNumber, average)}
            >
              {filled ? "★" : "☆"}
            </span>
          );
        })}
      </div>
      <p
        className={
          compact
            ? "text-caption text-warm-white"
            : "text-caption text-text-gray"
        }
      >
        <span className="font-semibold text-inherit">{average.toFixed(1)}</span>
        {typeof ratingCount === "number"
          ? ` · ${ratingCount.toLocaleString("en-US")} ratings`
          : ""}
      </p>
    </div>
  );
}
