"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const navItems = [
  { href: "/watch", label: "Watch" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/hall_of_fame", label: "Hall of Fame" },
] as const;

export function MarketingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileNavId = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="border-b border-border-subtle bg-warm-white">
      <PageContainer>
        <div className="flex h-[68px] items-center justify-between gap-space-16 lg:h-20">
          <Link
            className="flex min-h-11 items-center gap-space-8 font-extrabold tracking-[0.18em] text-midnight"
            href="/"
          >
            <span aria-hidden="true" className="text-doggywood-gold">
              ★
            </span>
            DOGGYWOOD
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-space-32 lg:flex">
            {navItems.map((item) => (
              <Link
                className="inline-flex min-h-11 items-center text-label text-text-gray hover:text-midnight"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="inline-flex min-h-11 items-center text-label text-text-gray hover:text-midnight"
              href="/account"
            >
              Profile
            </Link>
            <PrimaryButton href="/enter">Enter Doggywood</PrimaryButton>
          </nav>
          <div className="flex items-center gap-space-8 lg:hidden">
            <PrimaryButton href="/enter">Enter</PrimaryButton>
            <button
              aria-controls={mobileNavId}
              aria-expanded={menuOpen}
              className="inline-flex min-h-11 min-w-11 items-center justify-end text-label text-midnight"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              Menu
            </button>
          </div>
        </div>
        {menuOpen ? (
          <nav
            aria-label="Primary"
            className="border-t border-border-subtle py-space-16 lg:hidden"
            id={mobileNavId}
          >
            <ul className="flex flex-col gap-space-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className="flex min-h-11 items-center text-label text-midnight"
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="flex min-h-11 items-center text-label text-midnight"
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </PageContainer>
    </header>
  );
}
