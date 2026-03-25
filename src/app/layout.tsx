import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
export const metadata: Metadata = {
  title: "Portfolio of Jitwisut",
  description:
    "Jitwisut is a fullstack developer and designer. Known for his work in web development, he specializes in creating intuitive and aesthetically pleasing user interfaces.",
  keywords: [
    "Jitwisut",
    "Fullstack Developer",
    "Designer",
    "Web Developer",
    "Portfolio",
    "Next.js",
    "React",
    "ElysiaJS",
    "Bun"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
