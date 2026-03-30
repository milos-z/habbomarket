import type { Metadata } from "next";
import { Press_Start_2P, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareProvider } from "@/components/providers/CompareProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { FavoritesProvider } from "@/components/providers/FavoritesProvider";
import { PortfolioProvider } from "@/components/providers/PortfolioProvider";
import { AlertsProvider } from "@/components/providers/AlertsProvider";
import { ToastContainer } from "@/components/common/Toast";
import { BackToTop } from "@/components/common/BackToTop";
import { CommandPaletteWrapper } from "@/components/common/CommandPaletteWrapper";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "HabboMarket - Marktplatz Analyse Dashboard",
  description:
    "Analysiere Habbo Marktplatz-Preise, vergleiche Möbel zwischen Hotels und verfolge Trends mit Pixel-perfekten Charts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${pixelFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)]">
        <LanguageProvider>
          <FavoritesProvider>
            <PortfolioProvider>
              <CompareProvider>
                <AlertsProvider>
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <BackToTop />
                  <CommandPaletteWrapper />
                  <ToastContainer />
                </AlertsProvider>
              </CompareProvider>
            </PortfolioProvider>
          </FavoritesProvider>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
