type DogAvatarProps = {
  name: string;
  size?: "small" | "medium" | "large";
};

const sizeClassName = {
  small: "h-10 w-10 text-caption",
  medium: "h-14 w-14 text-label",
  large: "h-20 w-20 text-h3",
} as const;

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "D";
  const second = parts.length > 1 ? parts[1][0] : "";
  return `${first}${second}`.toUpperCase();
}

export function DogAvatar({ name, size = "medium" }: DogAvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-champagne text-midnight ${sizeClassName[size]}`}
    >
      {initialsFor(name)}
    </div>
  );
}
