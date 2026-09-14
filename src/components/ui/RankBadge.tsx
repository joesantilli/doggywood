type RankBadgeProps = {
  rank: number;
};

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <span
      aria-label={`Rank ${rank}`}
      className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-medium bg-midnight text-h3 text-doggywood-gold"
    >
      {rank}
    </span>
  );
}
