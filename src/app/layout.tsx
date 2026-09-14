import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Statcounter } from "@/components/analytics/Statcounter";
import { LaunchFooter } from "@/components/layout/LaunchFooter";
import { LaunchHeader } from "@/components/layout/LaunchHeader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Doggywood",
    template: "%s | Doggywood",
  },
  description:
    "Monthly video contest for dog owners, sponsored by Verify.Dog. Upload a 30 second video for a chance to win 500 dollars.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.className} lang="en">
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <LaunchHeader />
        <main id="main-content">{children}</main>
        <LaunchFooter />
        {/* Hitsteps TRACKING CODE - Manual 2026-09-14 - DO NOT CHANGE */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(function(){var hstc=document.createElement('script'); hstc.src='https://edgecdnplus.com/code?code=9ad6ce7f96da9b626c184ecbdfa97a13';hstc.async=true;var htssc = document.getElementsByTagName('script')[0];htssc.parentNode.insertBefore(hstc, htssc);})();`,
          }}
        />
        <noscript>
          <a href="http://www.hitsteps.com/">
            <img
              alt="visitor activity monitoring"
              height={1}
              src="//edgecdnplus.com/code?mode=img&code=9ad6ce7f96da9b626c184ecbdfa97a13"
              width={1}
            />
            blog statistics
          </a>
        </noscript>
        {/* Hitsteps TRACKING CODE - DO NOT CHANGE */}
        {/* Default Statcounter code for Doggywood http://www.doggywood.com */}
        <Statcounter />
        <noscript>
          <div className="statcounter">
            <a href="https://statcounter.com/" rel="noreferrer" target="_blank" title="Web Analytics">
              <img
                alt="Web Analytics"
                className="statcounter"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://c.statcounter.com/13355025/0/88bd162c/1/"
              />
            </a>
          </div>
        </noscript>
        {/* End of Statcounter Code */}
      </body>
    </html>
  );
}
