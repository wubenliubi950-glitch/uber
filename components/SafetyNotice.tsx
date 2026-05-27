interface Props {
  compact?: boolean;
}

export default function SafetyNotice({ compact }: Props) {
  return (
    <div
      role="note"
      className={`rounded-xl border-2 border-amber-400 bg-amber-50 px-4 ${
        compact ? "py-2 text-sm" : "py-3 text-base"
      } text-amber-900 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100`}
    >
      <p className="font-bold">⚠ 安全のために</p>
      <p>
        走行中にスマホ操作をしないでください。必ず安全な場所で停止してから判定してください。
      </p>
    </div>
  );
}
