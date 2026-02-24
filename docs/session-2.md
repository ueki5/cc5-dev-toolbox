# Session 2 — Base64エンコード／デコードツール

作業ブランチ: `feature/base64-converter`
作業ディレクトリ: `/home/ueki5/Workspaces/ClaudeCode/cc5-dev-toolbox-base64`

## 前提

Session 0 が main ブランチでプロジェクト初期化・共通レイアウトを完了済み。
この worktree は main から派生している。
`CLAUDE.md` のコーディング規約に従って実装すること。

## このセッションのゴール

Base64 エンコード／デコードツールを実装し、`feature/base64-converter` ブランチにプッシュする。

---

## 担当ファイル（このセッションのみ触るファイル）

```
lib/base64.ts
components/base64/Base64Converter.tsx
components/base64/DetectionBadge.tsx
components/base64/FlowAnimation.tsx
app/base64/page.tsx   ← stub を置き換える
```

他のファイルは変更しない。

---

## 実装仕様

### lib/base64.ts

```ts
export function encode(text: string): string
// TextEncoder + btoa でUnicode対応
// const bytes = new TextEncoder().encode(text)
// const binary = String.fromCharCode(...bytes)
// return btoa(binary)

export function decode(base64: string): string
// atob + TextDecoder でUnicode対応

export function detectMode(input: string): 'encoded' | 'plain'
// 判定: /^[A-Za-z0-9+/]+=*$/.test(input.trim()) && input.trim().length % 4 === 0
```

- React の import は禁止（純粋関数のみ）

### components/base64/Base64Converter.tsx

```tsx
'use client'
```

- 入力エリア（textarea）と出力エリアを配置
- 「エンコード」「デコード」ボタン
- 入力変化のたびに `detectMode()` を呼び出して `DetectionBadge` に渡す
- 変換ボタン押下時に `FlowAnimation` を再生し、完了後に出力を表示する

### components/base64/DetectionBadge.tsx

```tsx
type Props = {
  mode: 'encoded' | 'plain'
}
```

- shadcn/ui `Badge` を使用
- `'encoded'` → `"Encoded"` バッジ（`variant="default"` / 青系）
- `'plain'`   → `"Plain Text"` バッジ（`variant="secondary"` / グレー）

### components/base64/FlowAnimation.tsx

```tsx
type Props = {
  text: string         // アニメーションで流す文字列
  isPlaying: boolean   // true のときアニメーション再生
  onComplete: () => void
}
```

- `isPlaying` が `true` になったとき、`text` を1文字ずつ `<motion.span>` に分割
- Framer Motion の `staggerChildren: 0.02` で左から右へ波状に流す
- アニメーション完了時に `onComplete()` を呼び出す
- アニメーション完了後に結果テキストをフェードイン表示

### app/base64/page.tsx

```tsx
import { Base64Converter } from '@/components/base64/Base64Converter'

export default function Base64Page() {
  return <Base64Converter />
}
```

---

## 完了確認

```bash
pnpm dev    # localhost:3000/base64 で動作確認
pnpm build  # ビルドエラーがないこと
pnpm lint   # lint エラーがないこと
```

## 手動確認項目

- [ ] 日本語テキスト入力 → 正しい Base64 文字列に変換され、流れるアニメーションが再生される
- [ ] Base64 文字列を貼り付け → 「Encoded」バッジが自動表示される
- [ ] 通常テキストを貼り付け → 「Plain Text」バッジが表示される
- [ ] デコード → 元のテキストに戻る

---

## コミット & プッシュ

```bash
git add lib/base64.ts components/base64/ app/base64/page.tsx
git commit -m "feat: implement Base64 converter with auto-detection and flow animation"
git push origin feature/base64-converter
```
