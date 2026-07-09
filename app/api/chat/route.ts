import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, LEVELS, TOPICS } from "@/lib/tutorPrompt";
import type { ChatMessage, Level, Topic } from "@/types/chat";

export const runtime = "nodejs";
// The tutor should always respond fresh; never cache.
export const dynamic = "force-dynamic";

const DEFAULT_MODEL = "claude-sonnet-5";

interface ChatRequest {
  messages: ChatMessage[];
  level: Level;
  topic: Topic;
}

function friendlyApiError(err: unknown): string {
  if (err instanceof Anthropic.APIError) {
    switch (err.status) {
      case 401:
        return "APIキーが無効です。.env.local の ANTHROPIC_API_KEY を確認してください。";
      case 429:
        return "リクエストが多すぎます。少し待ってからもう一度お試しください。";
      case 400:
        return "モデル名が正しくない可能性があります。ANTHROPIC_MODEL の設定を確認してください。";
      default:
        if (err.status && err.status >= 500) {
          return "Anthropic 側で一時的なエラーが発生しました。少し待ってからお試しください。";
        }
        return `Anthropic API エラー (${err.status ?? "?"}) が発生しました。`;
    }
  }
  return "応答の生成中にエラーが発生しました。";
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function sanitize(body: unknown): ChatRequest | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.messages)) return null;

  const messages: ChatMessage[] = [];
  for (const m of b.messages) {
    if (!m || typeof m !== "object") return null;
    const role = (m as ChatMessage).role;
    const content = (m as ChatMessage).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return null;
    }
    messages.push({ role, content });
  }

  const level: Level = LEVELS.some((l) => l.value === b.level)
    ? (b.level as Level)
    : "beginner";
  const topic: Topic = TOPICS.some((t) => t.value === b.topic)
    ? (b.topic as Topic)
    : "daily";

  return { messages, level, topic };
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError(
      "APIキーが設定されていません。プロジェクト直下に .env.local を作り、ANTHROPIC_API_KEY を設定してください。",
      500,
    );
  }

  let parsed: ChatRequest | null;
  try {
    parsed = sanitize(await req.json());
  } catch {
    return jsonError("リクエストの形式が正しくありません。", 400);
  }
  if (!parsed) return jsonError("リクエストの形式が正しくありません。", 400);

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const system = buildSystemPrompt(parsed.level, parsed.topic);

  // If there are no messages yet, seed the conversation so the tutor opens.
  const messages =
    parsed.messages.length > 0
      ? parsed.messages
      : [{ role: "user" as const, content: "Let's start. Please greet me and ask your first question." }];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model,
          max_tokens: 700,
          system,
          messages,
        });
        anthropicStream.on("text", (delta: string) => {
          controller.enqueue(encoder.encode(delta));
        });
        await anthropicStream.finalMessage();
        controller.close();
      } catch (err) {
        const message = friendlyApiError(err);
        // Surface the error inside the stream so the client can show it.
        controller.enqueue(encoder.encode(`\n[ERROR] ${message}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
