# SNS ENTRANCE

ビジネスの初対面チャットで全メッセージにAIフィルターをかけるWebアプリ。

## Tech Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth, PostgreSQL, Realtime, Storage)
- Anthropic Claude API (Haiku) for message filtering
- Deploy: Vercel

## Key Architecture Decisions
- AIフィルターは Next.js Route Handler (`/api/filter`) 経由で Claude API を呼ぶ
- メッセージは original_text と filtered_text の2カラムで保存
- 送信者のみ original_text を閲覧可能（RLS + アプリ側制御）
- リアルタイム配信は Supabase Realtime (Postgres Changes)
- 外部SNSハンドオフは URL/連絡先の相互共有で実現（API連携なし）

## Commands
- `npm run dev` — 開発サーバー起動
- `npx supabase start` — ローカル Supabase 起動
- `npx supabase db push` — マイグレーション適用
- `npm run build` — ビルド確認

## Style Guide
- コンポーネントは関数コンポーネント + hooks
- Server Components をデフォルトにし、インタラクティブな部分のみ 'use client'
- Tailwind のみでスタイリング（CSS modules 使わない）
- 色はダークテーマベース: bg-[#0c0f14], accent teal-400
- 日本語UI、コード内コメントは英語

## Environment Variables (.env.local)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ANTHROPIC_API_KEY
