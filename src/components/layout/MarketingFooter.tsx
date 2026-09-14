import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

const footerLinks = [
  { href: "/watch", label: "Watch" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/hall_of_fame", label: "Hall of Fame" },
  { href: "/rules", label: "Rules" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function MarketingFooter() {
  return (
    <footer className="mt-auto border-t border-border-subtle bg-midnight text-warm-white">
      <PageContainer>
        <div className="flex flex-col gap-space-24 py-space-40 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-extrabold tracking-[0.18em]">★ DOGGYWOOD</p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-space-24 gap-y-space-12">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    className="inline-flex min-h-11 items-center text-caption text-champagne hover:text-warm-white"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </PageContainer>
    </footer>
  );
}
