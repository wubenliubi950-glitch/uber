"use client";

import { useEffect, useState } from "react";
import HistoryList from "@/components/HistoryList";
import SafetyNotice from "@/components/SafetyNotice";
import {
  clearHistory,
  deleteDeliveryRecord,
  getHistory,
} from "@/lib/storage";
import type { DeliveryRecord } from "@/types/delivery";

export default function HistoryPage() {
  const [records, setRecords] = useState<DeliveryRecord[]>([]);

  useEffect(() => {
    setRecords(getHistory());
  }, []);

  function handleDelete(id: string) {
    deleteDeliveryRecord(id);
    setRecords(getHistory());
  }

  function handleClear() {
    if (typeof window !== "undefined" && window.confirm("すべての履歴を削除します。よろしいですか？")) {
      clearHistory();
      setRecords([]);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">判定履歴</h1>
        {records.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-bold text-rose-700 underline dark:text-rose-400"
          >
            すべて削除
          </button>
        )}
      </div>
      <SafetyNotice compact />
      <HistoryList records={records} onDelete={handleDelete} />
    </div>
  );
}
