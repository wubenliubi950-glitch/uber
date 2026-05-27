interface Props {
  pickupName?: string;
  dropoffArea?: string;
}

function buildQuery(parts: (string | undefined)[]): string {
  return parts
    .filter((p): p is string => !!p && p.trim().length > 0)
    .concat("岡山市")
    .join(" ");
}

export default function MapLinks({ pickupName, dropoffArea }: Props) {
  const pickupQuery = encodeURIComponent(buildQuery([pickupName]));
  const dropoffQuery = encodeURIComponent(buildQuery([dropoffArea]));

  return (
    <section className="rounded-2xl border-2 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
      <h2 className="text-lg font-black">地図で開く</h2>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
        詳細な住所は保存していません。検索リンクのみです。
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${pickupQuery}`}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-xl border-2 border-slate-300 px-3 py-3 text-center text-sm font-bold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-700"
        >
          Google Maps（受取店舗）
        </a>
        <a
          href={`https://maps.apple.com/?q=${pickupQuery}`}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-xl border-2 border-slate-300 px-3 py-3 text-center text-sm font-bold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-700"
        >
          Apple Maps（受取店舗）
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${dropoffQuery}`}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-xl border-2 border-slate-300 px-3 py-3 text-center text-sm font-bold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-700"
        >
          Google Maps（配達先エリア）
        </a>
        <a
          href={`https://maps.apple.com/?q=${dropoffQuery}`}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-xl border-2 border-slate-300 px-3 py-3 text-center text-sm font-bold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-700"
        >
          Apple Maps（配達先エリア）
        </a>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
        <li>出発前にルートを確認してください</li>
        <li>走行中にスマホ操作をしないでください</li>
        <li>自転車では坂道・大通り・階段・細道に注意してください</li>
      </ul>
    </section>
  );
}
