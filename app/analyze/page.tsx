"use client";

import { useRouter } from "next/navigation";
import InputForm from "@/components/InputForm";
import SafetyNotice from "@/components/SafetyNotice";
import { calculateDeliveryScore } from "@/lib/scoring";
import { getSettings } from "@/lib/storage";
import type { DeliveryInput } from "@/types/delivery";

const PENDING_KEY = "uber-eats-judge:pending-result";

export default function AnalyzePage() {
  const router = useRouter();

  function handleSubmit(input: DeliveryInput) {
    const settings = getSettings();
    const result = calculateDeliveryScore(input, settings);
    try {
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ input, result }),
      );
    } catch {
      // ignore — result page will show an error if missing
    }
    router.push("/result");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black">案件を入力</h1>
      <SafetyNotice compact />
      <InputForm onSubmit={handleSubmit} />
    </div>
  );
}
