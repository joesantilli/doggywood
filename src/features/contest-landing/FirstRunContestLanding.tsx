/**
 * First-run contest landing experience.
 *
 * Currently rendered at `/`. This composition can later move to `/contest`
 * without a visual rewrite. The permanent Doggywood homepage is not built yet.
 */
import type { ReactNode } from "react";
import { ContestIcon, type ContestIconName } from "@/components/ui/ContestIcon";
import { LaunchButton } from "@/components/ui/LaunchButton";
import { EntryForm } from "@/features/homepage/EntryForm";
import { launchCopy } from "@/features/homepage/launchCopy";
import type { VerifyDogPrefill } from "@/lib/validation/entry";

function BelowHero({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`dw-below ${className}`.trim()}>{children}</div>;
}

function FaqList() {
  const midpoint = Math.ceil(launchCopy.faqs.length / 2);
  const columns = [launchCopy.faqs.slice(0, midpoint), launchCopy.faqs.slice(midpoint)];

  return (
    <div className="dw-faq-grid">
      {columns.map((column) => (
        <div className="dw-faq-col" key={column[0]?.q}>
          {column.map((item) => (
            <details className="dw-faq-item" key={item.q}>
              <summary>
                {item.q}
                <span aria-hidden="true" className="dw-faq-chevron">
                  <ContestIcon name="faq_chevron" size={16} />
                </span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}

export function FirstRunContestLanding({ prefill }: { prefill: VerifyDogPrefill }) {
  return (
    <>
      <section className="dw-hero">
        {/* DOGGYWOOD APPROVED HERO. DO NOT MODIFY WITHOUT EXPLICIT PRODUCT OWNER INSTRUCTION. */}
        <div className="dw-hero-desktop">
          <div className="dw-hero-photo-viewport">
            <div className="dw-hero-photo-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                aria-hidden="true"
                className="dw-hero-photo"
                src="/brand/doggywood-mobile-hero.webp"
              />
            </div>
          </div>

          <div className="dw-hero-inner">
            <div className="dw-hero-copy">
              <p className="dw-hero-eyebrow">{launchCopy.heroEyebrow}</p>

              <h1 className="dw-hero-headline">
                <span>{launchCopy.headlineLine1}</span>
                <span>
                  {launchCopy.headlineLine2}{" "}
                  <span className="dw-hero-headline-accent">{launchCopy.headlineStarts}</span>
                </span>
                <span className="dw-hero-headline-accent">{launchCopy.headlineAccent}</span>
              </h1>

              <p className="dw-hero-lede">{launchCopy.lede}</p>

              <div className="dw-hero-actions">
                <a className="dw-btn dw-btn-hero dw-btn-gold" href="#enter">
                  {launchCopy.heroCta}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="dw-hero-mobile">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Doggywood"
            className="dw-hero-mobile-logo"
            height={187}
            src="/brand/doggywood-logo.webp"
            width={557}
          />

          <p className="dw-hero-eyebrow">{launchCopy.heroEyebrow}</p>

          <h1 className="dw-hero-headline">
            <span>{launchCopy.headlineLine1}</span>
            <span>
              {launchCopy.headlineLine2}{" "}
              <span className="dw-hero-headline-accent">{launchCopy.headlineStarts}</span>
            </span>
            <span className="dw-hero-headline-accent">{launchCopy.headlineAccent}</span>
          </h1>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Golden Retriever wearing a Verify.Dog tag in front of the Doggywood hillside sign"
            className="dw-hero-mobile-image"
            height={1086}
            src="/brand/doggywood-mobile-hero.webp"
            width={1448}
          />

          <p className="dw-hero-prize">{launchCopy.heroPrize}</p>

          <p className="dw-hero-lede">{launchCopy.lede}</p>

          <div className="dw-hero-actions">
            <a className="dw-btn dw-btn-hero dw-btn-gold" href="#enter">
              {launchCopy.heroCta}
            </a>
          </div>
        </div>
      </section>

      {/* Frozen with the approved hero. Do not modify without explicit product owner instruction. */}
      <section className="border-y border-[#e6e2d8] bg-[#F4F0E6]">
        <BelowHero>
          <ul className="grid lg:grid-cols-3">
            {launchCopy.snapshot.map((item, index) => (
              <li
                className={`relative flex items-center justify-center gap-[18px] py-[22px] ${index < launchCopy.snapshot.length - 1 ? "border-b border-[#e6e2d8] lg:border-b-0" : ""} lg:px-6`}
                key={item.title}
              >
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-[22px] bottom-[22px] left-0 hidden w-px bg-[#d8d4c8] lg:block"
                  />
                ) : null}
                <ContestIcon name={item.icon as ContestIconName} size={58} />
                <div className="min-w-0 text-center">
                  <p className="text-[18px] leading-[1.12] font-extrabold tracking-[0.01em] text-launch-navy">
                    {item.title}
                  </p>
                  <p className="mt-[5px] text-[14px] leading-[1.35] text-[#6b6b6b]">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </BelowHero>
      </section>

      <section className="dw-how" id="how-it-works">
        <BelowHero>
          <h2 className="dw-section-title dw-section-title-how">{launchCopy.howHeading}</h2>
          <p className="dw-how-lede">{launchCopy.howLede}</p>
          <ol className="dw-how-cards">
            {launchCopy.stages.map((stage) => (
              <li className="dw-how-card" key={stage.title}>
                <p className="dw-how-card-step">{stage.step}</p>
                <ContestIcon name={stage.icon} size={62} />
                <h3 className="dw-how-card-title">{stage.title}</h3>
                <p className="dw-how-card-body">{stage.body}</p>
              </li>
            ))}
          </ol>
        </BelowHero>
      </section>

      <section className="bg-[#F7F4EC] py-4 lg:py-5" id="enter">
        <BelowHero>
          <h2 className="dw-section-title text-center lg:text-left">{launchCopy.formHeading}</h2>
          <p className="mt-1 text-center text-[15px] leading-6 text-launch-muted lg:text-left lg:text-[16px]">
            {launchCopy.formLede}
          </p>
          <div className="mt-4">
            <EntryForm prefill={prefill} />
          </div>
        </BelowHero>
      </section>

      <section className="dw-rules" id="contest-rules">
        <BelowHero>
          <div className="dw-rules-panel">
            <h2 className="dw-section-title dw-rules-title">{launchCopy.rulesHeading}</h2>
            <div className="dw-rules-grid">
              <div className="dw-rules-col">
                <div className="dw-rules-col-heading">
                  <ContestIcon name="rules_basics" size={50} />
                  <h3>{launchCopy.rulesBasicsHeading}</h3>
                </div>
                <ul>
                  {launchCopy.rulesBasics.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="dw-rules-col">
                <div className="dw-rules-col-heading">
                  <ContestIcon name="rules_how_to_win" size={50} />
                  <h3>{launchCopy.rulesWinHeading}</h3>
                </div>
                <ul>
                  {launchCopy.rulesWin.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="dw-rules-cta">
                <LaunchButton className="h-[50px] min-h-[50px]" href="/rules" size="compact" variant="outline">
                  {launchCopy.viewRules}
                </LaunchButton>
              </div>
            </div>
          </div>
        </BelowHero>
      </section>

      <section className="dw-faq" id="faq">
        <BelowHero>
          <div className="dw-faq-inner">
            <div className="dw-faq-intro">
              <p className="dw-eyebrow">{launchCopy.faqEyebrow}</p>
              <h2 className="dw-section-title dw-section-title-faq">{launchCopy.faqHeading}</h2>
              <p className="dw-faq-lede">{launchCopy.faqLede}</p>
            </div>
            <FaqList />
          </div>
        </BelowHero>
      </section>
    </>
  );
}
