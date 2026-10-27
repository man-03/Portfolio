import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { AppProviders } from "@/components/providers";
import { getDefaultAccent } from "@/lib/config";
import "./globals.css";

const DEFAULT_PALETTE = getDefaultAccent();

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

const themeBoot = `(function(){try{var path=location.pathname||"";var brand=null;try{brand=JSON.parse(sessionStorage.getItem("dossier.site-brand")||"null");}catch(e){}var accent=${JSON.stringify(DEFAULT_PALETTE)};var adminTheme="light";if(brand&&(brand.theme==="light"||brand.theme==="dark")&&typeof brand.accent==="string"){adminTheme=brand.theme;accent=brand.accent;}var isAdmin=path.indexOf("/admin")===0;var isAuth=path==="/login"||path.indexOf("/login/")===0||path==="/forgot-password"||path.indexOf("/forgot-password/")===0||path==="/reset-password"||path.indexOf("/reset-password/")===0;if(isAdmin||isAuth){document.documentElement.dataset.theme=adminTheme;document.documentElement.dataset.accent=accent;return;}var visitor=localStorage.getItem("dossier.visitor-theme");document.documentElement.dataset.theme=visitor==="dark"?"dark":"light";document.documentElement.dataset.accent=accent;}catch(e){document.documentElement.dataset.theme="light";}})();`;

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s",
  },
  description: "A professional portfolio and private studio for managing its content.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-accent={DEFAULT_PALETTE} className={`${fraunces.variable} ${outfit.variable}`} suppressHydrationWarning>
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
