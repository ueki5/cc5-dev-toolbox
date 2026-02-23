# CLAUDE.md — エンジニア向け Web ツールボックス

このファイルは Claude Code がプロジェクトの方針を一貫して守るための規約書です。
実装時は必ずこのファイルを参照してください。

---

## プロジェクト概要

エンジニアが日常的に使う変換・整形ツールをまとめた **ビジュアル重視の Web アプリ**。

| ツール | パス | 概要 |
|--------|------|------|
| JSON整形 | `/json` | Pretty print / Minify + シンタックスハイライト + エラー行ハイライト |
| Base64変換 | `/base64` | エンコード・デコード + 自動判定 + 文字流れアニメーション |
| JWTデコード | `/jwt` | Header/Payload/Signatureカード表示 + 有効期限バー + ホバー説明 |

**制約**
- 外部 API は使わない（すべてクライアントサイドで処理）
- 認証機能は不要
- 3 つの機能は完全に独立したページ（並行開発を想定）

---

## 技術スタック

| 用途 | ライブラリ |
|------|-----------|
| フレームワーク | Next.js 14 (App Router) |
| 言語 | TypeScript（strict モード） |
| スタイリング | TailwindCSS + shadcn/ui |
| アニメーション | Framer Motion |
| シンタックスハイライト | react-syntax-highlighter |
| JWT デコード | jwt-decode |
| パッケージマネージャ | **pnpm**（npm / yarn は使わない） |

---

## ディレクトリ構造

```
cc5-dev-toolbox/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # ルートレイアウト（Sidebar 組み込み）
│   ├── page.tsx                # / → /json へリダイレクト
│   ├── json/
│   │   └── page.tsx
│   ├── base64/
│   │   └── page.tsx
│   └── jwt/
│       └── page.tsx
├── components/
│   ├── layout/                 # ページ共通レイアウト部品
│   │   └── Sidebar.tsx
│   ├── json/                   # JSON ツール専用コンポーネント
│   │   ├── JsonFormatter.tsx
│   │   ├── JsonInput.tsx
│   │   └── JsonOutput.tsx
│   ├── base64/                 # Base64 ツール専用コンポーネント
│   │   ├── Base64Converter.tsx
│   │   ├── DetectionBadge.tsx
│   │   └── FlowAnimation.tsx
│   └── jwt/                    # JWT ツール専用コンポーネント
│       ├── JwtDecoder.tsx
│       ├── JwtCard.tsx
│       └── ExpiryBar.tsx
├── lib/                        # 純粋関数・ビジネスロジック（UI 依存なし）
│   ├── json.ts
│   ├── base64.ts
│   └── jwt.ts
└── CLAUDE.md
```

### ディレクトリ配置ルール

- **`app/`** — ページファイル（`page.tsx`）のみ。ロジックやコンポーネントは書かない
- **`components/<tool>/`** — そのツール固有のコンポーネント。他ツールから import しない
- **`components/layout/`** — 全ページ共通の UI 部品
- **`lib/`** — UI に依存しない純粋関数のみ。React の import は禁止

---

## コーディング規約

### 命名規則

| 対象 | 規則 | 例 |
|------|------|----|
| コンポーネントファイル | PascalCase | `JsonFormatter.tsx` |
| ユーティリティファイル | camelCase | `json.ts` |
| コンポーネント関数 | PascalCase | `function JsonFormatter()` |
| 変数・関数 | camelCase | `const formatJson = ...` |
| 型・インターフェース | PascalCase | `type JsonError = ...` |
| Tailwind クラス | そのまま（テンプレートリテラル内で条件分岐） | `cn('base', isError && 'text-red-500')` |

### コンポーネントの書き方

```tsx
// ✅ 推奨パターン
'use client'  // クライアント処理が必要な場合のみ

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function MyComponent({ value, onChange }: Props) {
  return (
    <motion.div layout>
      {/* ... */}
    </motion.div>
  )
}
```

- `export default` は使わず **named export** を使う
- Props の型は関数の直上に `type Props = { ... }` で定義する
- shadcn/ui コンポーネントは `@/components/ui/` から import する
- `cn()` ユーティリティ（`@/lib/utils`）でクラス名を結合する

### TypeScript

- `any` は使わない。型が不明な場合は `unknown` + 型ガードを使う
- `as` キャストは最小限に抑える
- 関数の戻り値型は明示する

---

## 各機能の実装方針

### JSON整形ツール (`lib/json.ts`)

```ts
// エラー情報に行番号を含める
type JsonResult =
  | { result: string; error: null }
  | { result: null; error: { message: string; line: number } }

function formatJson(input: string): JsonResult
function minifyJson(input: string): string
```

- エラー行番号は `JSON.parse()` の例外メッセージから正規表現で抽出する
- アニメーション: `AnimatePresence` + `key` の切り替えでフェード遷移
- エラーハイライト: 入力行を `<div>` 単位に分割し、エラー行に赤ボーダーを付与

### Base64変換ツール (`lib/base64.ts`)

```ts
function encode(text: string): string    // TextEncoder + btoa（Unicode 対応）
function decode(base64: string): string  // atob + TextDecoder（Unicode 対応）
function detectMode(input: string): 'encoded' | 'plain'
// 判定: /^[A-Za-z0-9+/]+={0,2}$/.test(input)
```

- アニメーション: `FlowAnimation.tsx` で文字を `<motion.span>` に分割し `staggerChildren` で波状に流す
- 変換完了後に変換済みテキストへフェードイン

### JWTデコードツール (`lib/jwt.ts`)

```ts
type JwtParts = {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  raw: { header: string; payload: string; signature: string }
}

function decodeJwt(token: string): JwtParts
function getClaimDescription(key: string): string  // iss / sub / exp / iat / aud などの説明辞書
```

- `ExpiryBar`: `(now - iat) / (exp - iat) * 100` で進捗率を算出
  - 有効中 → `bg-green-500`、期限切れ → `bg-red-500` + 「Expired」バッジ
  - `exp` フィールドなし → バー非表示
- `JwtCard`: shadcn/ui `Card` + `Tooltip`。Tooltip の内容は `getClaimDescription()` から取得

---

## 共通コンポーネントの使い方

### Sidebar (`components/layout/Sidebar.tsx`)

```tsx
// アクティブ状態の判定
const pathname = usePathname()
const isActive = pathname.startsWith('/json')  // 各ツールに合わせて変更

// ナビゲーションアイテム定義
const tools = [
  { href: '/json',   label: 'JSON整形',   icon: Code2 },
  { href: '/base64', label: 'Base64',      icon: Binary },
  { href: '/jwt',    label: 'JWT',         icon: KeyRound },
]
```

- shadcn/ui `Button` (variant="ghost") を使用
- レスポンシブ: `md:` ブレークポイント以下でアイコンのみ表示（`hidden md:block` でラベル制御）

### shadcn/ui コンポーネント一覧（インストール済み前提）

| コンポーネント | 用途 |
|--------------|------|
| `Button` | ナビゲーション、アクションボタン |
| `Card` | JWT の Header/Payload/Signature 表示 |
| `Tooltip` | JWT フィールドのホバー説明 |
| `Badge` | Base64 自動判定ラベル、JWT Expired ラベル |
| `Progress` | JWT 有効期限バー（または Framer Motion で自作） |

### ルートレイアウト構造

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
```

---

## 開発コマンド

```bash
pnpm dev          # 開発サーバー起動（localhost:3000）
pnpm build        # プロダクションビルド
pnpm lint         # ESLint 実行
```

---

## 検証チェックリスト

実装完了後、以下をブラウザで手動確認する。

- [ ] JSON整形: 正常 JSON → 整形アニメーションが動く
- [ ] JSON整形: 不正 JSON → エラー行が赤くハイライトされる
- [ ] JSON圧縮: 整形済み JSON → 1行に圧縮される
- [ ] Base64: 日本語テキスト → 正しい Base64 文字列 + 流れるアニメーション
- [ ] Base64: Base64 文字列貼り付け → 「Encoded」バッジが表示される
- [ ] JWT: 有効なトークン入力 → 3カードが展開表示される
- [ ] JWT: `exp` が未来 → 緑バー表示
- [ ] JWT: `exp` が過去 → 赤バー + Expired バッジ
- [ ] レスポンシブ: モバイル幅でサイドバーがアイコンのみになる
