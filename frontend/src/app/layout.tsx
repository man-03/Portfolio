import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { AppProviders } from "@/components/providers";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const themeBoot = `(function(){try{var theme=localStorage.getItem("dossier.theme");var accent=localStorage.getItem("dossier.accent");var allowed=["terracotta","lagoon","iris","amber","rosewood"];var dark=theme==="dark"||(theme!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=dark?"dark":"light";document.documentElement.dataset.accent=allowed.indexOf(accent)>=0?accent:"terracotta";}catch(e){}})();`;

export const metadata: Metadata = {
  title: {
    default: "manoj.dossier",
    template: "%s · manoj.dossier",
  },
  description: "A professional portfolio and private studio for managing its content.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-accent="terracotta" className={`${fraunces.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <AppProviders>
          <a className="skip-link" href="#content">
            Skip to content
          </a>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
