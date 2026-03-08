# 検証レポート — cc5-dev-toolbox

実行日時: 2026-03-08T23:30:00+09:00

## 結果サマリー

| # | ツール | シナリオ | 結果 | エビデンス |
|---|--------|----------|------|-----------|
| 1 | JSON整形 | 正常 JSON → 整形表示 | ✅ PASS | [json-format-valid.png](evidence/json-format-valid.png) |
| 2 | JSON整形 | 不正 JSON → エラーハイライト | ✅ PASS | [json-format-invalid.png](evidence/json-format-invalid.png) |
| 3 | JSON圧縮 | 整形済み → 1行圧縮 | ✅ PASS | [json-minify.png](evidence/json-minify.png) |
| 4 | Base64 | 日本語エンコード + アニメーション | ✅ PASS | [base64-encode-japanese.png](evidence/base64-encode-japanese.png) |
| 5 | Base64 | Encoded バッジ自動表示 | ✅ PASS | [base64-detection-badge.png](evidence/base64-detection-badge.png) |
| 6 | JWT | 3カード展開表示 | ✅ PASS | [jwt-cards.png](evidence/jwt-cards.png) |
| 7 | JWT | 有効期限バー（緑） | ✅ PASS | [jwt-expiry-valid.png](evidence/jwt-expiry-valid.png) |
| 8 | JWT | 有効期限バー（赤 + Expired） | ✅ PASS | [jwt-expiry-expired.png](evidence/jwt-expiry-expired.png) |
| 9 | レスポンシブ | モバイル幅でアイコンのみ | ✅ PASS | [responsive-mobile.png](evidence/responsive-mobile.png) |

## 合計: 9/9

## 失敗項目の詳細

なし

## 備考

- シナリオ 3（JSON圧縮）: `fill` ツールが `\n` をリテラル文字列として扱うため、`evaluate_script` で `HTMLTextAreaElement.prototype.value` setter を直接呼び出す回避策が必要だった。
- シナリオ 9（レスポンシブ）: `resize_page` ツールでは `window.innerWidth` が変化しなかった。`emulate` ツールの `viewport` パラメータ（`375x812x2,mobile,touch`）を使用することで正しく適用された。
- Base64 エンコード結果: `こんにちは世界` → `44GT44KT44Gr44Gh44Gv5LiW55WM`（Unicode 対応済み）
- JWT デコード: Header / Payload / Signature の3カードが正常に展開。有効期限バーは有効時に緑、期限切れ時に赤 + Expired バッジを表示。
