import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/contexts/i18n";

// Japanese fonts optimized for classical literature
const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inishie no Ne (古の音) - Japanese Classical Literature Audio Platform",
  description: "Experience authentic readings of Japanese classical literature. Native speaker narrations of timeless works including Genji Monogatari, Heike Monogatari, and more.",
  keywords: ["Japanese literature", "classical Japanese", "audio books", "古典文学", "朗読", "日本文学"],
  authors: [{ name: "Inishie no Ne" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ja_JP",
    siteName: "Inishie no Ne",
    title: "Inishie no Ne - Japanese Classical Literature Audio",
    description: "Native speaker narrations of Japanese classical literature",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inishie no Ne - Japanese Classical Literature Audio",
    description: "Native speaker narrations of Japanese classical literature",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${notoSansJP.variable} ${notoSerifJP.variable} font-sans antialiased`}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
