# 作業リスト — cc5-dev-toolbox

> **更新ルール**: 各タスク完了時に `[ ]` を `[x]` に変更してください。

---

## 1. プロジェクト初期化

- [ ] Next.js 14 プロジェクトのセットアップ（`pnpm create next-app`）
- [ ] 依存パッケージのインストール（`framer-motion`, `react-syntax-highlighter`, `jwt-decode`）
- [ ] shadcn/ui の初期化（`pnpm dlx shadcn-ui@latest init`）
- [ ] shadcn/ui コンポーネントの追加（Button, Card, Tooltip, Badge, Progress）
- [ ] TailwindCSS 設定確認（`tailwind.config.ts` の content パス）

---

## 2. レイアウト / 共通コンポーネント

- [ ] `app/layout.tsx` — RootLayout（Sidebar 組み込み、flex h-screen 構成）
- [ ] `app/page.tsx` — `/` → `/json` リダイレクト
- [ ] `components/layout/Sidebar.tsx` — ナビゲーション + レスポンシブ対応（モバイルでアイコンのみ）

---

## 3. ライブラリ（lib/）

- [ ] `lib/json.ts` — `formatJson` / `minifyJson`（エラー行番号付き、`JsonResult` 型定義）
- [ ] `lib/base64.ts` — `encode` / `decode` / `detectMode`（Unicode 対応、TextEncoder/TextDecoder 使用）
- [ ] `lib/jwt.ts` — `decodeJwt` / `getClaimDescription`（`JwtParts` 型定義）

---

## 4. JSON 整形ツール

- [ ] `app/json/page.tsx`
- [ ] `components/json/JsonInput.tsx` — テキストエリア入力
- [ ] `components/json/JsonOutput.tsx` — シンタックスハイライト + エラー行赤ハイライト
- [ ] `components/json/JsonFormatter.tsx` — Pretty/Minify 切り替え + `AnimatePresence` フェード遷移

---

## 5. Base64 変換ツール

- [ ] `app/base64/page.tsx`
- [ ] `components/base64/DetectionBadge.tsx` — 「Encoded」/「Plain」バッジ自動表示
- [ ] `components/base64/FlowAnimation.tsx` — 文字を `<motion.span>` 分割 + `staggerChildren` 波状アニメーション
- [ ] `components/base64/Base64Converter.tsx` — エンコード・デコード + 自動判定

---

## 6. JWT デコードツール

- [ ] `app/jwt/page.tsx`
- [ ] `components/jwt/JwtCard.tsx` — shadcn/ui Card + Tooltip（`getClaimDescription` 連携）
- [ ] `components/jwt/ExpiryBar.tsx` — 進捗バー（有効中: 緑 / 期限切れ: 赤 + Expired バッジ）
- [ ] `components/jwt/JwtDecoder.tsx` — 3 カード（Header / Payload / Signature）展開表示

---

## 7. chrome-devtools-mcp の設定

- [ ] `.mcp.json` を作成し `chrome-devtools-mcp` サーバーを登録
- [ ] Chrome を `--remote-debugging-port=9222` で起動できることを確認
- [ ] Claude Code から MCP ツールが認識されることを確認（`/mcp` コマンドで一覧確認）

---

## 8. browser-verify スキル の作成

- [ ] `docs/evidence/` ディレクトリの作成（スクリーンショット保存先）
- [ ] `.claude/skills/browser-verify/SKILL.md` の作成
  - chrome-devtools-mcp でブラウザを自動操作する手順
  - 各機能の正常系・異常系テストシナリオ（下記「検証チェックリスト」準拠）
  - スクリーンショットを `docs/evidence/<tool>-<scenario>.png` として保存
  - 検証レポート `docs/REPORT.md` を自動生成するフォーマット定義

---

## 9. 自動検証（/browser-verify）

- [ ] 全機能（セクション 1〜6）の実装完了
- [ ] `/browser-verify` コマンドで自動検証を実行
- [ ] `docs/REPORT.md` で結果を確認・レビュー

---

## 検証チェックリスト（/browser-verify の対象シナリオ）

| # | ツール | シナリオ | 期待結果 |
|---|--------|----------|----------|
| 1 | JSON整形 | 正常 JSON を入力 | 整形アニメーションが動く |
| 2 | JSON整形 | 不正 JSON を入力 | エラー行が赤くハイライトされる |
| 3 | JSON圧縮 | 整形済み JSON を入力 | 1 行に圧縮される |
| 4 | Base64 | 日本語テキストをエンコード | 正しい Base64 文字列 + 流れるアニメーション |
| 5 | Base64 | Base64 文字列を貼り付け | 「Encoded」バッジが表示される |
| 6 | JWT | 有効なトークンを入力 | 3 カードが展開表示される |
| 7 | JWT | `exp` が未来のトークン | 緑バー表示 |
| 8 | JWT | `exp` が過去のトークン | 赤バー + Expired バッジ |
| 9 | レスポンシブ | モバイル幅（375px）で確認 | サイドバーがアイコンのみになる |
