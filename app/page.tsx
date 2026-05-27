import Link from "next/link";
import SafetyNotice from "@/components/SafetyNotice";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-black tracking-tight">
          配達判定（自転車・岡山市内向け MVP）
        </h1>
        <p className="text-base text-slate-700 dark:text-slate-300">
          Uber Eats
          の配達依頼を、報酬・時間・距離・配達先エリア・天候から
          「行く／微妙／行かない」で素早く判定する補助ツールです。
          配達中の操作ではなく、安全な場所で停止して使ってください。
        </p>
      </section>

      <SafetyNotice />

      <nav className="grid gap-3">
        <Link
          href="/analyze"
          className="flex min-h-[64px] items-center justify-center rounded-2xl bg-emerald-600 px-6 text-lg font-bold text-white shadow active:scale-[0.98] dark:bg-emerald-500"
        >
          手入力で判定する
        </Link>
        <Link
          href="/analyze?mode=ocr"
          className="flex min-h-[64px] items-center justify-center rounded-2xl bg-sky-600 px-6 text-lg font-bold text-white shadow active:scale-[0.98] dark:bg-sky-500"
        >
          スクショをアップロードして判定
        </Link>
        <Link
          href="/history"
          className="flex min-h-[64px] items-center justify-center rounded-2xl border-2 border-slate-300 bg-white px-6 text-lg font-bold text-slate-800 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          過去の判定履歴
        </Link>
        <Link
          href="/settings"
          className="flex min-h-[64px] items-center justify-center rounded-2xl border-2 border-slate-300 bg-white px-6 text-lg font-bold text-slate-800 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          設定
        </Link>
      </nav>

      <SafetyNotice compact />
    </div>
  );
}
