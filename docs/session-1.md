# Session 1 — JSON整形ツール

作業ブランチ: `feature/json-formatter`
作業ディレクトリ: `/home/ueki5/Workspaces/ClaudeCode/cc5-dev-toolbox-json`

## 前提

Session 0 が main ブランチでプロジェクト初期化・共通レイアウトを完了済み。
この worktree は main から派生している。
`CLAUDE.md` のコーディング規約に従って実装すること。

## このセッションのゴール

JSON の整形・圧縮ツールを実装し、`feature/json-formatter` ブランチにプッシュする。

---

## 担当ファイル（このセッションのみ触るファイル）

```
lib/json.ts
components/json/JsonFormatter.tsx
components/json/JsonInput.tsx
components/json/JsonOutput.tsx
app/json/page.tsx   ← stub を置き換える
```

他のファイルは変更しない。

---

## 実装仕様

### lib/json.ts

```ts
type JsonResult =
  | { result: string; error: null }
  | { result: null; error: { message: string; line: number } }

export function formatJson(input: string): JsonResult
export function minifyJson(input: string): string
```

- `JSON.parse()` の例外メッセージから正規表現で行番号を抽出する
- メッセージ例: `"Unexpected token } in JSON at position 42"`
  → 入力文字列の先頭から position 文字目が何行目かを計算して `line` に設定する
- React の import は禁止（純粋関数のみ）

### components/json/JsonFormatter.tsx

```tsx
'use client'
```

- 状態: 入力値・出力値・エラー・モード（'format' | 'minify'）
- 「整形」ボタン → `formatJson()` を呼び出して出力を更新
- 「圧縮」ボタン → `minifyJson()` を呼び出して出力を更新
- `JsonInput` と `JsonOutput` を並べて表示（左右または上下レイアウト）

### components/json/JsonInput.tsx

```tsx
type Props = {
  value: string
  onChange: (value: string) => void
  errorLine: number | null
}
```

- textarea で JSON を入力受付
- `errorLine` が null 以外のとき、入力行を `<div>` 単位に分割し
  エラー行に `bg-red-50 border-l-4 border-red-500` を付与
- エラーメッセージを行番号付きで表示（例: `Line 3: Unexpected token`）

### components/json/JsonOutput.tsx

```tsx
type Props = {
  value: string
}
```

- `react-syntax-highlighter` で JSON をシンタックスハイライト表示
  - `import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'`
  - language="json"
- Framer Motion `AnimatePresence` + `key={value}` でフェードアニメーション
- コピーボタン（shadcn/ui `Button` + `navigator.clipboard.writeText`）

### app/json/page.tsx

```tsx
import { JsonFormatter } from '@/components/json/JsonFormatter'

export default function JsonPage() {
  return <JsonFormatter />
}
```

---

## 完了確認

```bash
pnpm dev    # localhost:3000/json で動作確認
pnpm build  # ビルドエラーがないこと
pnpm lint   # lint エラーがないこと
```

## 手動確認項目

- [ ] 正常な JSON 入力 → 整形されてアニメーション付きで表示される
- [ ] 不正な JSON 入力 → エラー行が赤くハイライトされ、行番号付きメッセージが表示される
- [ ] 整形済み JSON → 「圧縮」ボタンで1行に圧縮される
- [ ] コピーボタン → クリップボードにコピーされる

---

## コミット & プッシュ

```bash
git add lib/json.ts components/json/ app/json/page.tsx
git commit -m "feat: implement JSON formatter with syntax highlighting and error highlight"
git push origin feature/json-formatter
```
