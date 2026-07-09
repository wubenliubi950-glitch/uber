import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";
import ServiceWorkerRegistrar from "./sw-register";

export const metadata: Metadata = {
  title: "英会話チューター | AI English Tutor",
  description:
    "AI と英語で会話しながら、毎回そのばで添削（Good / Fix / Natural / Next）を受けられる英会話練習アプリ。読み上げと音声入力にも対応。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "英会話チューター",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-full">
        <AppHeader />
        <main>{children}</main>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
