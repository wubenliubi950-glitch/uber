import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";
import ServiceWorkerRegistrar from "./sw-register";

export const metadata: Metadata = {
  title: "配達判定 | Uber Eats 自転車配達 判定ツール",
  description:
    "Uber Eats 配達依頼を、報酬・時間・距離・配達先エリアから素早く「行く／微妙／行かない」で判定する補助ツール。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "配達判定",
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
        <main className="mx-auto max-w-xl px-4 py-4 pb-24">{children}</main>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
