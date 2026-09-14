export function DoggywoodLogo({
  className = "h-auto w-[220px]",
}: {
  className?: string;
}) {
  return (
    // Exact supplied Doggywood logo. Do not redraw, recolor, or replace.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt="Doggywood"
      className={className}
      height={187}
      src="/brand/doggywood-logo.webp"
      width={557}
    />
  );
}

export function VerifyDogLogo({
  className = "h-auto w-[168px]",
}: {
  className?: string;
}) {
  return (
    // Exact supplied Verify.Dog logo. Do not redraw, recolor, or replace.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt="Verify.Dog"
      className={className}
      height={100}
      src="/brand/verify-dog-logo.webp"
      width={300}
    />
  );
}

export function VerifyDogQrTag({
  className = "h-auto w-[72px]",
}: {
  className?: string;
}) {
  return (
    // Exact supplied Verify.Dog QR tag. Do not redraw, recolor, or replace.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt="Verify.Dog identity tag"
      className={className}
      height={190}
      src="/brand/QR-tag.webp"
      width={100}
    />
  );
}
