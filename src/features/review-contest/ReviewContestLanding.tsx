import type { ReactNode } from "react";
import { ContestIcon } from "@/components/ui/ContestIcon";
import { ReviewContestEntryForm } from "@/features/review-contest/ReviewContestEntryForm";
import { reviewContestCopy } from "@/features/review-contest/reviewContestCopy";
import styles from "@/features/review-contest/ReviewContestLanding.module.css";

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
  const midpoint = Math.ceil(reviewContestCopy.faqs.length / 2);
  const columns = [reviewContestCopy.faqs.slice(0, midpoint), reviewContestCopy.faqs.slice(midpoint)];

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

function HeroHeadline() {
  return (
    <h1 className="dw-hero-headline">
      <span className={styles.headlineLine}>{reviewContestCopy.headlineLine1}</span>
      <span>{reviewContestCopy.headlineLine2}</span>
      <span className="dw-hero-headline-accent">{reviewContestCopy.headlineAccent}</span>
    </h1>
  );
}

export function ReviewContestLanding() {
  return (
    <div id="review-contest-page">
      <div className={styles.hero}>
      <section className="dw-hero">
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
              <p className="dw-hero-eyebrow">{reviewContestCopy.heroEyebrow}</p>
              <HeroHeadline />
              <p className="dw-hero-lede">{reviewContestCopy.lede}</p>
              <div className="dw-hero-actions">
                <a className="dw-btn dw-btn-hero dw-btn-gold" href="#enter">
                  {reviewContestCopy.heroCta}
                </a>
              </div>
              <p className="mt-3 text-[14px] leading-5 text-launch-muted">
                {reviewContestCopy.heroEligibility}
              </p>
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

          <p className="dw-hero-eyebrow">{reviewContestCopy.heroEyebrow}</p>
          <HeroHeadline />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Golden Retriever wearing a Verify.Dog tag in front of the Doggywood hillside sign"
            className="dw-hero-mobile-image"
            height={1086}
            src="/brand/doggywood-mobile-hero.webp"
            width={1448}
          />

          <p className="dw-hero-lede text-center">{reviewContestCopy.lede}</p>

          <div className="dw-hero-actions">
            <a className="dw-btn dw-btn-hero dw-btn-gold" href="#enter">
              {reviewContestCopy.heroCta}
            </a>
          </div>
          <p className="mt-3 text-center text-[14px] leading-5 text-launch-muted">
            {reviewContestCopy.heroEligibility}
          </p>
        </div>
      </section>
      </div>

      <section className="border-y border-[#e6e2d8] bg-[#F4F0E6]">
        <BelowHero>
          <ul className="grid lg:grid-cols-3">
            {reviewContestCopy.snapshot.map((item, index) => (
              <li
                className={`relative flex items-center justify-center gap-[18px] py-[22px] ${index < reviewContestCopy.snapshot.length - 1 ? "border-b border-[#e6e2d8] lg:border-b-0" : ""} lg:px-6`}
                key={item.title}
              >
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-[22px] bottom-[22px] left-0 hidden w-px bg-[#d8d4c8] lg:block"
                  />
                ) : null}
                <ContestIcon name={item.icon} size={58} />
                <div className="min-w-0 text-center">
                  <p className="text-[18px] leading-[1.12] font-extrabold tracking-[0.01em] text-launch-navy">
                    {item.title}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </BelowHero>
      </section>

      <section className="dw-about" id="about">
        <BelowHero>
          <div className="dw-about-intro">
            <p className="dw-eyebrow">{reviewContestCopy.aboutEyebrow}</p>
            <h2 className="dw-section-title dw-about-title">{reviewContestCopy.aboutHeading}</h2>
            {reviewContestCopy.aboutParagraphs.map((paragraph) => (
              <p className="dw-about-lede" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </BelowHero>
      </section>

      <section className="dw-how" id="how-it-works">
        <BelowHero>
          <div className="dw-how-intro">
            <p className="dw-eyebrow dw-how-eyebrow">{reviewContestCopy.howEyebrow}</p>
            <h2 className="dw-section-title dw-section-title-how">{reviewContestCopy.howHeading}</h2>
          </div>
          <ol className="dw-how-cards">
            {reviewContestCopy.stages.map((stage) => (
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

      <section className="dw-vote" id="judging">
        <BelowHero>
          <div className="dw-about-intro mb-7">
            <p className="dw-eyebrow">{reviewContestCopy.judgingEyebrow}</p>
            <h2 className="dw-section-title dw-vote-title">{reviewContestCopy.judgingHeading}</h2>
            <p className="dw-about-lede">{reviewContestCopy.judgingLede}</p>
          </div>
          <ol className="dw-about-cards">
            {reviewContestCopy.criteria.map((item) => (
              <li className="dw-about-card" key={item.title}>
                <p className="dw-how-card-step">{item.weight}</p>
                <ContestIcon name={item.icon} size={56} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center text-[16px] font-extrabold text-launch-navy lg:text-left">
            {reviewContestCopy.judgingTotal}
          </p>
          <p className="dw-vote-note">{reviewContestCopy.judgingNote}</p>
        </BelowHero>
      </section>

      <section className="dw-enter" id="enter">
        <BelowHero>
          <div className="dw-enter-shell">
            <div className="dw-enter-intro">
              <h2 className="dw-section-title dw-enter-title">{reviewContestCopy.formHeading}</h2>
              <p className="dw-enter-lede">{reviewContestCopy.formLede}</p>
            </div>
            <div className="dw-enter-form">
              <ReviewContestEntryForm />
            </div>
          </div>
        </BelowHero>
      </section>

      <section className="dw-rules" id="contest-rules">
        <BelowHero>
          <h2 className="dw-section-title dw-rules-title">{reviewContestCopy.rulesHeading}</h2>
          <ul className="dw-about-cards">
            {reviewContestCopy.rules.map((card) => (
              <li className="dw-about-card" key={card.title}>
                <ContestIcon name={card.icon} size={56} />
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </li>
            ))}
          </ul>
        </BelowHero>
      </section>

      <section className="dw-faq" id="faq">
        <BelowHero>
          <div className="dw-faq-inner">
            <div className="dw-faq-intro">
              <p className="dw-eyebrow">{reviewContestCopy.faqEyebrow}</p>
              <h2 className="dw-section-title dw-section-title-faq">{reviewContestCopy.faqHeading}</h2>
            </div>
            <FaqList />
          </div>
        </BelowHero>
      </section>

      <section className="dw-final-cta">
        <BelowHero>
          <h2 className="dw-section-title dw-final-title">
            {reviewContestCopy.finalHeadingLine1}
            <span className="block">{reviewContestCopy.finalHeadingLine2}</span>
          </h2>
          <p className="dw-final-lede">{reviewContestCopy.finalLede}</p>
          <a className="dw-btn dw-btn-gold dw-final-button" href="#enter">
            {reviewContestCopy.finalCta}
          </a>
        </BelowHero>
      </section>
    </div>
  );
}
