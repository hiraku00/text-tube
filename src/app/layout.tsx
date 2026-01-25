import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TextTube - YouTube動画をテキストで読む",
    template: "%s | TextTube",
  },
  description: "YouTube動画の内容を構造化されたテキストで効率的に読める。LLMに読み込ませやすい形式で、動画視聴の時間を節約。",
  keywords: ["YouTube", "要約", "テキスト化", "動画", "スクリプト", "LLM", "効率化"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "TextTube",
    title: "TextTube - YouTube動画をテキストで読む",
    description: "YouTube動画の内容を構造化されたテキストで効率的に読める。",
  },
  twitter: {
    card: "summary_large_image",
    title: "TextTube - YouTube動画をテキストで読む",
    description: "YouTube動画の内容を構造化されたテキストで効率的に読める。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Header />
        <Sidebar />
        <main className="pt-14 sm:pl-[72px] md:pl-60 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
