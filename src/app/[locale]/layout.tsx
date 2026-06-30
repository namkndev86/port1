import type { Metadata } from "next";
import { Inter, Outfit, Space_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider, themeFoucScript } from "@/components/common/theme-provider";
import { LocaleProvider } from "@/components/common/locale-provider";
import { getDictionary } from "@/i18n/get-dictionary";
import { Locale, locales } from "@/i18n/config";

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

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alexrivera.dev";
  
  return {
    title: {
      template: "%s | Alex Rivera - Senior Software Architect",
      default: "Alex Rivera | Senior Fullstack Architect & AI Engineer",
    },
    description: "Senior Software Architect specializing in Next.js, Go, TypeScript, and cloud-native systems. Browse my portfolio, read technical blog posts, or start a consultation.",
    keywords: ["Software Architect", "Next.js", "React", "TypeScript", "Go", "PostgreSQL", "Animations"],
    authors: [{ name: "Alex Rivera" }],
    creator: "Alex Rivera",
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        vi: `${baseUrl}/vi`,
        ja: `${baseUrl}/ja`,
      },
    },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  const commonDict = await getDictionary(locale as Locale, 'common');
  const dictionary = { common: commonDict };

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${outfit.variable} ${spaceMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeFoucScript }} />
      </head>
      <body
        className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LocaleProvider locale={locale as Locale} dictionary={dictionary}>
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
