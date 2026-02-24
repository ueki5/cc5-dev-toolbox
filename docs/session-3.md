# Session 3 — JWTデコードツール

作業ブランチ: `feature/jwt-decoder`
作業ディレクトリ: `/home/ueki5/Workspaces/ClaudeCode/cc5-dev-toolbox-jwt`

## 前提

Session 0 が main ブランチでプロジェクト初期化・共通レイアウトを完了済み。
この worktree は main から派生している。
`CLAUDE.md` のコーディング規約に従って実装すること。

## このセッションのゴール

JWT デコードツールを実装し、`feature/jwt-decoder` ブランチにプッシュする。

---

## 担当ファイル（このセッションのみ触るファイル）

```
lib/jwt.ts
components/jwt/JwtDecoder.tsx
components/jwt/JwtCard.tsx
components/jwt/ExpiryBar.tsx
app/jwt/page.tsx   ← stub を置き換える
```

他のファイルは変更しない。

---

## 実装仕様

### lib/jwt.ts

```ts
type JwtParts = {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  raw: { header: string; payload: string; signature: string }
}

export function decodeJwt(token: string): JwtParts
// import { jwtDecode } from 'jwt-decode' を使用
// トークンを "." で分割して raw を取得し、header と payload を jwtDecode でデコード

export function getClaimDescription(key: string): string
// 以下のキーに対して日本語説明を返す辞書関数
// iss: "トークンの発行者 (Issuer)"
// sub: "トークンの主体 (Subject)"
// aud: "トークンの受信者 (Audience)"
// exp: "有効期限 (Expiration Time) - Unix タイムスタンプ"
// iat: "発行日時 (Issued At) - Unix タイムスタンプ"
// nbf: "有効開始日時 (Not Before) - Unix タイムスタンプ"
// jti: "JWT の一意識別子 (JWT ID)"
// 未知のキーは "" (空文字列) を返す
```

- React の import は禁止（純粋関数のみ）

### components/jwt/JwtDecoder.tsx

```tsx
'use client'
```

- JWT トークンの入力欄（textarea）
- 入力変化時に `decodeJwt()` を呼び出してデコード結果を取得
- 不正なトークンのときはエラーメッセージを表示
- Header / Payload / Signature の3枚の `JwtCard` を横並び or グリッドで表示
- `ExpiryBar` を Payload カードの下に配置

### components/jwt/JwtCard.tsx

```tsx
type Props = {
  title: 'Header' | 'Payload' | 'Signature'
  data: Record<string, unknown> | string  // Signature は文字列
}
```

- shadcn/ui `Card`, `CardHeader`, `CardContent` を使用
- `data` がオブジェクトの場合: key-value を一覧表示
  - 各 key に shadcn/ui `Tooltip` を付与
  - Tooltip の内容は `getClaimDescription(key)` から取得
  - 空文字のときは `Tooltip` を表示しない
- `data` が文字列の場合（Signature）: モノスペースフォントで表示（折り返しあり）

### components/jwt/ExpiryBar.tsx

```tsx
type Props = {
  payload: Record<string, unknown>
}
```

- `exp`, `iat` フィールドが存在しない場合はバー全体を非表示にする
- 進捗率の計算: `(Date.now() / 1000 - iat) / (exp - iat) * 100`
- 進捗率は 0〜100 にクランプする
- Framer Motion `motion.div` で幅をアニメーション（`animate={{ width: '${percent}%' }}`）
- 有効中 (`exp > Date.now() / 1000`) → `bg-green-500`
- 期限切れ → `bg-red-500` + shadcn/ui `Badge` で `"Expired"` を表示
- exp の日時を人間が読める形式で表示（`new Date(exp * 1000).toLocaleString('ja-JP')`）

### app/jwt/page.tsx

```tsx
import { JwtDecoder } from '@/components/jwt/JwtDecoder'

export default function JwtPage() {
  return <JwtDecoder />
}
```

---

## 完了確認

```bash
pnpm dev    # localhost:3000/jwt で動作確認
pnpm build  # ビルドエラーがないこと
pnpm lint   # lint エラーがないこと
```

## 手動確認項目

テスト用 JWT トークン（[jwt.io](https://jwt.io) で生成可）:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

- [ ] 有効な JWT を入力 → Header / Payload / Signature の3カードが展開表示される
- [ ] `exp` が未来のトークン → 緑のプログレスバーが表示される
- [ ] `exp` が過去のトークン → 赤バー + Expired バッジが表示される
- [ ] フィールドにホバー → Tooltip に説明が表示される（`iss`, `sub`, `exp` など）
- [ ] 不正なトークン → エラーメッセージが表示される

---

## コミット & プッシュ

```bash
git add lib/jwt.ts components/jwt/ app/jwt/page.tsx
git commit -m "feat: implement JWT decoder with card layout and expiry bar"
git push origin feature/jwt-decoder
```
