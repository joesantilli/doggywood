import { launchCopy } from "@/features/homepage/launchCopy";

/** Frozen with the approved desktop hero. Do not modify without explicit product owner instruction. */
export function LaunchHeader() {
  return (
    <header className="dw-header">
      <div className="dw-header-inner">
        <a aria-label="Doggywood home" className="dw-header-logo" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Doggywood"
            height={187}
            src="/brand/doggywood-logo.webp"
            width={557}
          />
        </a>

        <nav aria-label="Primary" className="dw-header-nav">
          <a href="/#how-it-works">How It Works</a>
          <a href="/#contest-rules">Contest Rules</a>
          <a href="/#faq">FAQ</a>
          <a href="/contact">Contact</a>
        </nav>

        <div className="dw-header-actions">
          <a className="dw-btn dw-btn-header dw-btn-outline" href={launchCopy.verifyDogHref}>
            {launchCopy.backToVerifyDog}
          </a>

          <a className="dw-btn dw-btn-header dw-btn-gold" href="/#enter">
            {launchCopy.enter}
          </a>
        </div>
      </div>
    </header>
  );
}
