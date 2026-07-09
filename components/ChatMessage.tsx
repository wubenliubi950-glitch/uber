import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { parseTurn } from "@/lib/parseFeedback";
import FeedbackCard from "./FeedbackCard";

interface Props {
  message: ChatMessageType;
  ttsSupported: boolean;
  onSpeak: (text: string) => void;
}

export default function ChatMessage({ message, ttsSupported, onSpeak }: Props) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-2 text-white dark:bg-emerald-500">
          {message.content}
        </div>
      </div>
    );
  }

  const { reply, feedback } = parseTurn(message.content);

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%]">
        <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
          <div className="flex items-start gap-2">
            <p className="whitespace-pre-wrap">{reply || "…"}</p>
            {ttsSupported && reply && (
              <button
                type="button"
                aria-label="読み上げる"
                title="読み上げる"
                onClick={() => onSpeak(reply)}
                className="mt-0.5 shrink-0 rounded-full p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-100"
              >
                🔊
              </button>
            )}
          </div>
        </div>
        {feedback && <FeedbackCard feedback={feedback} />}
      </div>
    </div>
  );
}
