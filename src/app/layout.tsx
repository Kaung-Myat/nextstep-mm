import type { Metadata, Viewport } from "next";
import { Noto_Sans, Noto_Sans_Myanmar } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { Navbar } from "@/components/navigation/navbar";
import { PreferencesProvider } from "@/components/preferences/preferences-provider";
import { AppLaunchProvider } from "@/components/pwa/app-launch-provider";
import { CrawlProvider } from "@/components/settings/crawl-provider";
import { ToastProvider } from "@/components/ui/toast";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoMyanmar = Noto_Sans_Myanmar({
  weight: ["400", "500", "600", "700"],
  subsets: ["myanmar"],
  variable: "--font-noto-myanmar",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a7a6f" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1418" },
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('nextstep-theme')||'system';var d=t==='system'?matchMedia('(prefers-color-scheme: dark)').matches:t==='dark';document.documentElement.dataset.theme=d?'dark':'light';var l=localStorage.getItem('nextstep-locale')||'en';document.documentElement.lang=l==='my'?'my':'en';document.documentElement.dataset.locale=l;var s=parseFloat(localStorage.getItem('nextstep-font-scale')||'1');if(isFinite(s)){s=Math.min(1.3,Math.max(0.85,Math.round(s/0.05)*0.05));document.documentElement.style.setProperty('--app-font-scale',String(s));document.documentElement.dataset.fontScale=String(s)}}catch(e){}})()`,
          }}
        />
        {process.env.NODE_ENV === "development" ? (
          <script
            dangerouslySetInnerHTML={{
              // Next.js DevTools can call releasePointerCapture after the browser already
              // dropped the pointer (drag/click race). Swallow only that benign NotFoundError.
              __html: `(function(){try{var o=Element.prototype.releasePointerCapture;if(typeof o!=="function")return;Element.prototype.releasePointerCapture=function(id){try{return o.call(this,id)}catch(e){if(!e||e.name!=="NotFoundError")throw e}}}catch(e){}})();`,
            }}
          />
        ) : null}
      </head>
      <body className={`${notoSans.variable} ${notoMyanmar.variable}`}>
        <PreferencesProvider>
          <ToastProvider>
            <CrawlProvider>
              <AppLaunchProvider>
                <div className="app-shell">
                  <SiteHeader />
                  <Navbar />
                  <main className="app-main">{children}</main>
                </div>
              </AppLaunchProvider>
            </CrawlProvider>
          </ToastProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
