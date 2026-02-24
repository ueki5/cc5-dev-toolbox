# Session 0 — プロジェクト初期化 + 共通レイアウト

作業ブランチ: `main`
作業ディレクトリ: `/home/ueki5/Workspaces/ClaudeCode/cc5-dev-toolbox`

## このセッションのゴール

Next.js プロジェクトを初期化し、サイドバー付きの共通レイアウトを実装する。
セッション 1〜3 が並列実装できる状態（`pnpm build` が通る stub ページあり）にして main にプッシュする。

---

## 実装ステップ

### 1. プロジェクト初期化

既存の `CLAUDE.md` と `docs/` を残したまま Next.js を初期化する。

```bash
# 既存ファイルを退避
mv CLAUDE.md /tmp/CLAUDE.md.bak
mv docs /tmp/docs.bak

# Next.js プロジェクト初期化（カレントディレクトリに展開）
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir --eslint --import-alias "@/*" --no-git

# ファイルを戻す
mv /tmp/CLAUDE.md.bak CLAUDE.md
mv /tmp/docs.bak docs
```

### 2. 追加パッケージインストール

```bash
pnpm add framer-motion react-syntax-highlighter jwt-decode
pnpm add -D @types/react-syntax-highlighter

pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card tooltip badge progress
```

### 3. 実装するファイル

| ファイル | 内容 |
|---------|------|
| `app/layout.tsx` | Sidebar を埋め込んだルートレイアウト |
| `app/page.tsx` | `/json` へのリダイレクト |
| `components/layout/Sidebar.tsx` | 左サイドバー（JSON/Base64/JWT ナビゲーション） |
| `app/json/page.tsx` | stub（セッション 1 が置き換える） |
| `app/base64/page.tsx` | stub（セッション 2 が置き換える） |
| `app/jwt/page.tsx` | stub（セッション 3 が置き換える） |

### 4. Sidebar の実装要件

- shadcn/ui `Button` (variant="ghost") でナビゲーション
- `usePathname()` でアクティブ状態を判定・スタイル適用
- レスポンシブ: `md` ブレークポイント以下でアイコンのみ（`hidden md:block` でラベル非表示）
- ナビゲーション項目:

```ts
const tools = [
  { href: '/json',   label: 'JSON整形', icon: Code2   },
  { href: '/base64', label: 'Base64',   icon: Binary   },
  { href: '/jwt',    label: 'JWT',      icon: KeyRound },
]
```

### 5. app/layout.tsx の構造

```tsx
// app/layout.tsx
import { Sidebar } from '@/components/layout/Sidebar'

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

### 6. stub ページの形式

各ツールページは以下のシンプルな形式で作成する（セッション 1〜3 が置き換える）:

```tsx
// app/json/page.tsx
export default function JsonPage() {
  return <div className="text-muted-foreground">JSON 整形ツール（実装予定）</div>
}
```

### 7. 完了確認

```bash
pnpm build   # ビルドエラーがないこと
pnpm lint    # lint エラーがないこと
```

### 8. コミット & プッシュ

```bash
git add -A
git commit -m "feat: initialize Next.js project with common layout and sidebar"
git push origin main
```

---

## 注意事項

- `CLAUDE.md` のコーディング規約に従うこと
- `app/` の `page.tsx` は Next.js の要件で `export default` にすること（例外）
- それ以外のファイルはすべて named export を使う
- pnpm を使う（npm / yarn は使わない）
- このセッションでは `components/json/`, `components/base64/`, `components/jwt/`, `lib/` は **触らない**
  （セッション 1〜3 の担当）

---

## 完了後: worktree のセットアップ

このセッションの push 完了後、以下のコマンドで並列開発用 worktree を作成する:

```bash
cd /home/ueki5/Workspaces/ClaudeCode/cc5-dev-toolbox

git worktree add ../cc5-dev-toolbox-json   -b feature/json-formatter
git worktree add ../cc5-dev-toolbox-base64 -b feature/base64-converter
git worktree add ../cc5-dev-toolbox-jwt    -b feature/jwt-decoder
```

各 worktree で Claude Code を起動:

```bash
# VSCode の場合
code ../cc5-dev-toolbox-json
code ../cc5-dev-toolbox-base64
code ../cc5-dev-toolbox-jwt
```

各 worktree ディレクトリ内の `docs/session-N.md` を Claude Code に渡してセッション 1〜3 を実行する。
