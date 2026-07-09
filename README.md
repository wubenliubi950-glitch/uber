# 英会話チューター（AI English Tutor）

AI と英語で会話しながら、毎回その場で短い添削を受けられる英会話練習アプリです。
「読める・分かる」だけでなく、**日常会話で自然に話せるようになる**ことを目的にしています。

Claude（Anthropic API）が会話相手兼チューターになり、あなたの答えに自然に英語で返しつつ、
毎ターン `Good / Fix / Natural / Next` の形式で短くフィードバックします。

> 📱 **ChatGPT の音声会話で練習したい場合** は、貼り付けるだけで使えるプロンプトを
> [`chatgpt-voice-tutor-prompt.md`](./chatgpt-voice-tutor-prompt.md) に用意しています
> （アプリのセットアップは不要）。

## 特徴

- **英語で会話が進む** — チューターが1〜3文で自然に返し、会話のテンポを止めません
- **毎回その場で添削** — 各ターンに添削カードを表示
  - 🟢 Good … 良かった点
  - 🔧 Fix … 直した文（間違いが無ければ「Perfect!」）
  - 💬 Natural … もっと自然な言い方
  - ❓ Next … 次の質問
- **レベル切替** — 初級 / 中級で語彙と難易度が変わります
- **話題切替** — 日常会話・旅行・大学生活・建築・研究室・プレゼン・留学・面接
- **音声対応**（ブラウザ標準機能）
  - 🔊 チューターの英文を読み上げ（自動読み上げの ON/OFF 可）
  - 🎤 マイクで英語を話して入力
  - 非対応ブラウザでは自動的にテキストのみにフォールバック
- 会話と設定は端末内（localStorage）に保存。「新しい会話」でリセットできます

## 技術スタック

- Next.js 14 App Router（TypeScript）
- Tailwind CSS（OS のダークモード追従）
- `@anthropic-ai/sdk`（サーバー側の API ルートからストリーミング呼び出し）
- Web Speech API（読み上げ・音声入力、ブラウザ標準）

## セットアップ

依存パッケージのインストール：

```bash
npm install
```

API キーの設定：

```bash
cp .env.example .env.local
# .env.local を開き、ANTHROPIC_API_KEY にキーを設定
```

- `ANTHROPIC_API_KEY`（必須）… https://console.anthropic.com/ で取得
- `ANTHROPIC_MODEL`（任意）… 既定は `claude-sonnet-5`

## 起動

開発サーバー：

```bash
npm run dev
# http://localhost:3000
```

本番ビルド：

```bash
npm run build
npm run start
```

型チェック：

```bash
npm run typecheck
```

## 使い方

1. アプリを開くと、チューターが英語で最初の質問をします（自動で読み上げ）
2. テキスト入力かマイク（🎤）で英語で答えます（Enter で送信 / Shift+Enter で改行）
3. チューターが自然に返し、下に添削カード（Good / Fix / Natural / Next）が出ます
4. 詰まったら日本語で書いても OK。ヒントと英語での言い方を教えてくれます
5. 上部のツールバーでレベル・話題・自動読み上げを切り替え、「新しい会話」でリセット

## 構成

```
app/
  page.tsx            チャット画面（会話の状態管理・ストリーミング受信）
  api/chat/route.ts   Anthropic API へのストリーミング中継
  layout.tsx          レイアウト・メタデータ
components/
  Toolbar.tsx         レベル/話題/自動読み上げ/リセット
  MessageList.tsx     メッセージ一覧・自動スクロール
  ChatMessage.tsx     1メッセージ（会話文＋添削カード＋読み上げ）
  FeedbackCard.tsx    Good/Fix/Natural/Next の添削カード
  Composer.tsx        入力欄＋送信＋マイク
lib/
  tutorPrompt.ts      チューターのシステムプロンプト・レベル/話題の定義
  parseFeedback.ts    応答を「会話文」と「添削」に分解
  useSpeech.ts        読み上げ(TTS)・音声入力(STT)フック
  storage.ts          会話・設定の localStorage 保存
types/
  chat.ts             型定義
```

## 仕組み（プロンプト設計）

チューターへの指示は `lib/tutorPrompt.ts` で組み立てます。会話の返答と添削を
`===FEEDBACK===` という区切り行で分けて出力させ、アプリ側で会話バブルと添削カードに
分割表示します。区切りより前（会話文）だけを読み上げるので、日本語の添削は音声に
混ざりません。

## 注意

- API 呼び出しはサーバー側の `app/api/chat/route.ts` で行い、API キーはブラウザに
  露出しません
- キーが未設定・無効な場合は、画面に日本語でエラーを表示します（クラッシュしません）
