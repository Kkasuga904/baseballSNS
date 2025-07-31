# Vercel設定ガイド（vercel.json）

## 概要
`vercel.json` はVercelデプロイメントの設定ファイルです。ビルド、ルーティング、HTTPヘッダーなどを設定します。

## 設定項目の説明

### buildCommand
```json
"buildCommand": "npm run build"
```
- Vercelがビルド時に実行するコマンド
- Viteのビルドコマンドを実行

### outputDirectory
```json
"outputDirectory": "dist"
```
- ビルド結果が出力されるディレクトリ
- Viteのデフォルト出力先

### framework
```json
"framework": "vite"
```
- 使用しているフレームワークを指定
- Vercelが最適化を適用

### rewrites（SPAルーティング）
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```
- すべてのルートを`index.html`にリダイレクト
- React RouterのようなクライアントサイドルーティングのSPAに必須
- これがないと直接URLアクセス時に404エラーになる

### headers（HTTPヘッダー設定）

#### アイコンファイル
```json
{
  "source": "/icon.svg",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=31536000, immutable"
    }
  ]
}
```
- アイコンは変更が少ないため1年間キャッシュ
- `immutable`で変更されないことを明示

#### PWAマニフェスト
```json
{
  "source": "/manifest.json",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=3600"
    }
  ]
}
```
- 1時間キャッシュ（アプリ情報の更新を考慮）

#### Service Worker
```json
{
  "source": "/sw.js",
  "headers": [
    {
      "key": "Content-Type",
      "value": "application/javascript"
    },
    {
      "key": "Cache-Control",
      "value": "public, max-age=0, must-revalidate"
    }
  ]
}
```
- **Content-Type**: MIMEタイプを明示的に指定（エラー防止）
- **Cache-Control**: キャッシュ無効化で常に最新版を取得

## 重要なポイント

1. **JSONはコメントをサポートしない**
   - このファイルで設定の説明を確認

2. **Service Workerの更新**
   - `max-age=0`により常に最新のService Workerを取得
   - PWA自動更新機能に必須

3. **SPAのルーティング**
   - rewritesがないと、ページ更新時に404エラーが発生

## トラブルシューティング

### Service WorkerのMIMEタイプエラー
- `Content-Type: application/javascript`が正しく設定されているか確認
- Vercelのログで配信されているヘッダーを確認

### キャッシュの問題
- 開発時はブラウザのキャッシュをクリア
- Chrome DevTools > Network > Disable cache を有効化