import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jitwisut Thobut — One Day at the Pavilion",
  description:
    "Portfolio of Jitwisut Thobut, full-stack developer and interface designer. Spend a day at a small concrete pavilion — from sunrise to the last light on.",
  keywords: ["Jitwisut", "Fullstack Developer", "Designer", "Web Developer", "Portfolio", "Next.js", "React", "Three.js", "ElysiaJS", "Bun"],
};

export const viewport: Viewport = {
  themeColor: "#e9d3bf",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
