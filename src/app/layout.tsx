import type { Metadata } from "next";
import { Inter, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Alex Rivera - Senior Software Architect",
    default: "Alex Rivera | Senior Fullstack Architect & AI Engineer",
  },
  description: "Senior Software Architect specializing in Next.js, Go, TypeScript, and cloud-native systems. Browse my portfolio, read technical blog posts, or start a consultation.",
  keywords: ["Software Architect", "Next.js", "React", "TypeScript", "Go", "PostgreSQL", "Animations"],
  authors: [{ name: "Alex Rivera" }],
  creator: "Alex Rivera",
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${spaceMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background text-foreground flex flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
