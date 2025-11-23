import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // TODO: 本番環境のURLに合わせて変更してください
  metadataBase: new URL('https://garden-planner-itxh78fn8-acorn181s-projects.vercel.app'),
  title: {
    template: '%s | Garden Planner',
    default: 'Garden Planner - 家庭菜園シミュレーター',
  },
  description: 'ブラウザで直感的に家庭菜園の計画が立てられるアプリ。コンパニオンプランツ判定や肥料計算も自動で行えます。',
  openGraph: {
    title: 'Garden Planner - 家庭菜園シミュレーター',
    description: 'スマホで使える家庭菜園デザインツール。相性判定や買い物リスト自動生成機能付き。',
    siteName: 'Garden Planner',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garden Planner',
    description: 'スマホで使える家庭菜園デザインツール。',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
