import Link from "next/link";
import { DoggywoodLogo, VerifyDogLogo } from "@/components/brand/Logos";
import { launchCopy } from "@/features/homepage/launchCopy";

const footerLinks = [
  { href: "/rules", label: "Official Rules" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/#about", label: "About" },
] as const;

export function LaunchFooter() {
  return (
    <footer className="mt-auto border-t border-launch-line bg-white" id="about">
      <div className="dw-below">
        <div className="flex flex-col items-center gap-6 py-8 text-center lg:flex-row lg:items-center lg:justify-between lg:py-10 lg:text-left">
          <Link aria-label="Doggywood home" href="/">
            <DoggywoodLogo className="h-auto w-[200px] lg:w-[220px]" />
          </Link>
          <nav aria-label="Footer" className="w-full lg:w-auto">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    className="inline-flex min-h-10 items-center text-[14px] text-launch-navy hover:underline"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col items-center gap-2 lg:items-end">
            <a aria-label="Verify.Dog" href="https://verify.dog" rel="noreferrer">
              <VerifyDogLogo className="h-auto w-[160px] lg:w-[176px]" />
            </a>
            <p className="text-[13px] text-launch-muted lg:text-right">
              {launchCopy.footerNote}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
