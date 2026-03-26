import type { Metadata } from "next";
import { Press_Start_2P, Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { CompareProvider } from "@/components/providers/CompareProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
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
          <CompareProvider>
            <Header />
            <main className="flex-1">{children}</main>
          </CompareProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
