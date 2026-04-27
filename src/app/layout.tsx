import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import { Providers } from "@/components/providers/Providers";
import { siteConfig } from "@/lib/config";
import { getSiteSettings } from "@/lib/actions/settings";
import NavigationProgress from "@/components/ui/NavigationProgress";
import { isLightColor, buildCssVars } from "@/lib/utils/color";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: `${siteConfig.ownerName} — Full Stack Engineer`,
  description: siteConfig.metaDescription,
  metadataBase: new URL(siteConfig.siteUrl),
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const darkVars = buildCssVars(settings.backgroundDark, isLightColor(settings.backgroundDark));
  const lightVars = buildCssVars(settings.backgroundLight, isLightColor(settings.backgroundLight));
  return (
    <html
      lang="en"
      className={`${syne.variable} ${ibmPlexMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.dataset.theme='light';}catch(e){}`,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { ${darkVars}; } [data-theme="light"] { ${lightVars}; }`,
          }}
        />
      </head>
      <body>
        <Providers>
          <NavigationProgress />
          <LenisProvider>{children}</LenisProvider>
        </Providers>
      </body>
    </html>
  );
}
