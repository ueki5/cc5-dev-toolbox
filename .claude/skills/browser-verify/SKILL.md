---
name: browser-verify
description: chrome-devtools-mcp を使って cc5-dev-toolbox の全機能を自動検証し、スクリーンショットと検証レポートを生成する
disable-model-invocation: true
allowed-tools: mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_screenshot, mcp__chrome-devtools__fill, mcp__chrome-devtools__click, mcp__chrome-devtools__type_text, mcp__chrome-devtools__evaluate_script, mcp__chrome-devtools__resize_page, mcp__chrome-devtools__wait_for, mcp__chrome-devtools__new_page, mcp__chrome-devtools__list_pages, Write, Bash
---

# browser-verify — 自動検証スキル

`pnpm dev` で開発サーバーが起動していることを確認してから、以下の手順で全 9 シナリオを検証する。
スクリーンショットは `docs/evidence/<tool>-<scenario>.png` に保存し、最後に `docs/REPORT.md` を生成する。

## 前提確認

まず開発サーバーの起動ポートを確認する。

```bash
curl -s http://localhost:3000 > /dev/null && echo "3000" || curl -s http://localhost:3001 > /dev/null && echo "3001"
```

以降の `BASE_URL` は確認したポートに合わせる（例: `http://localhost:3001`）。

Chrome が起動していない場合は以下で起動する:

```bash
google-chrome --remote-debugging-port=9222 --no-first-run &
sleep 2
```

---

## シナリオ 1: JSON整形 — 正常 JSON

1. `BASE_URL/json` へ遷移
2. 入力エリアに以下を入力:
   ```json
   {"name":"Alice","age":30,"active":true}
   ```
3. 「整形」ボタンをクリック
4. **期待**: シンタックスハイライト付きで整形されたJSONが表示される
5. スクリーンショット → `docs/evidence/json-format-valid.png`

---

## シナリオ 2: JSON整形 — 不正 JSON

1. 入力エリアをクリアして以下を入力:
   ```
   {"name":"Alice" "age":30}
   ```
2. 「整形」ボタンをクリック
3. **期待**: エラー行が赤くハイライトされ、行番号付きエラーメッセージが表示される
4. スクリーンショット → `docs/evidence/json-format-invalid.png`

---

## シナリオ 3: JSON圧縮

1. 入力エリアに整形済み JSON を入力:
   ```json
   {
     "name": "Alice",
     "age": 30
   }
   ```
2. 「圧縮」ボタンをクリック
3. **期待**: 1行に圧縮される
4. スクリーンショット → `docs/evidence/json-minify.png`

---

## シナリオ 4: Base64 — 日本語テキストのエンコード

1. `BASE_URL/base64` へ遷移
2. 入力エリアに「こんにちは世界」と入力
3. 「エンコード」ボタンをクリック
4. **期待**: Base64文字列が出力され、文字が流れるアニメーションが再生される
5. アニメーション完了後にスクリーンショット → `docs/evidence/base64-encode-japanese.png`

---

## シナリオ 5: Base64 — 自動判定バッジ

1. 入力エリアをクリアして以下の Base64 文字列を入力:
   ```
   44GT44KT44Gr44Gh44Gv5LiW55WM
   ```
2. **期待**: 入力直後に「Encoded」バッジが自動表示される（ボタン押下不要）
3. スクリーンショット → `docs/evidence/base64-detection-badge.png`

---

## シナリオ 6: JWT デコード — カード表示

1. `BASE_URL/jwt` へ遷移
2. 入力エリアに以下の JWT トークンを入力:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
   ```
3. **期待**: Header / Payload / Signature の 3 カードが展開表示される
4. スクリーンショット → `docs/evidence/jwt-cards.png`

---

## シナリオ 7: JWT — 有効期限バー（有効）

1. 以下の `exp` が未来（現在時刻 + 1時間）の JWT を JavaScript で生成して入力:
   ```javascript
   const now = Math.floor(Date.now() / 1000);
   const header = btoa(JSON.stringify({alg:"HS256",typ:"JWT"})).replace(/=/g,'');
   const payload = btoa(JSON.stringify({sub:"1",iat:now,exp:now+3600})).replace(/=/g,'');
   `${header}.${payload}.signature`;
   ```
   上記の出力値を入力エリアに貼り付ける
2. **期待**: 緑色のプログレスバーが表示される
3. スクリーンショット → `docs/evidence/jwt-expiry-valid.png`

---

## シナリオ 8: JWT — 有効期限バー（期限切れ）

1. 以下の `exp` が過去の JWT を JavaScript で生成して入力:
   ```javascript
   const now = Math.floor(Date.now() / 1000);
   const header = btoa(JSON.stringify({alg:"HS256",typ:"JWT"})).replace(/=/g,'');
   const payload = btoa(JSON.stringify({sub:"1",iat:now-7200,exp:now-3600})).replace(/=/g,'');
   `${header}.${payload}.signature`;
   ```
2. **期待**: 赤色のバー + 「Expired」バッジが表示される
3. スクリーンショット → `docs/evidence/jwt-expiry-expired.png`

---

## シナリオ 9: レスポンシブ — モバイル幅

1. ページをモバイル幅（375 × 812）にリサイズ
2. いずれかのページを表示
3. **期待**: サイドバーがアイコンのみになり、ラベルが非表示になる
4. スクリーンショット → `docs/evidence/responsive-mobile.png`
5. ページを元のサイズ（1280 × 800）に戻す

---

## レポート生成

全シナリオ完了後、以下の形式で `docs/REPORT.md` を Write ツールで生成する:

```markdown
# 検証レポート — cc5-dev-toolbox

実行日時: <ISO 8601 形式>

## 結果サマリー

| # | ツール | シナリオ | 結果 | エビデンス |
|---|--------|----------|------|-----------|
| 1 | JSON整形 | 正常 JSON → 整形表示 | ✅ PASS / ❌ FAIL | [json-format-valid.png](evidence/json-format-valid.png) |
| 2 | JSON整形 | 不正 JSON → エラーハイライト | ✅ PASS / ❌ FAIL | [json-format-invalid.png](evidence/json-format-invalid.png) |
| 3 | JSON圧縮 | 整形済み → 1行圧縮 | ✅ PASS / ❌ FAIL | [json-minify.png](evidence/json-minify.png) |
| 4 | Base64 | 日本語エンコード + アニメーション | ✅ PASS / ❌ FAIL | [base64-encode-japanese.png](evidence/base64-encode-japanese.png) |
| 5 | Base64 | Encoded バッジ自動表示 | ✅ PASS / ❌ FAIL | [base64-detection-badge.png](evidence/base64-detection-badge.png) |
| 6 | JWT | 3カード展開表示 | ✅ PASS / ❌ FAIL | [jwt-cards.png](evidence/jwt-cards.png) |
| 7 | JWT | 有効期限バー（緑） | ✅ PASS / ❌ FAIL | [jwt-expiry-valid.png](evidence/jwt-expiry-valid.png) |
| 8 | JWT | 有効期限バー（赤 + Expired） | ✅ PASS / ❌ FAIL | [jwt-expiry-expired.png](evidence/jwt-expiry-expired.png) |
| 9 | レスポンシブ | モバイル幅でアイコンのみ | ✅ PASS / ❌ FAIL | [responsive-mobile.png](evidence/responsive-mobile.png) |

## 合計: <PASS数>/9

## 失敗項目の詳細

<FAIL があった場合のみ記述>

## 備考

<気になった点・改善提案など>
```
