# PWAアイコン設定手順

## 1. アイコンの生成

1. ブラウザで `generate-icons.html` を開く
2. 「すべてのアイコンをダウンロード」ボタンをクリック
3. ダウンロードされたPNGファイルをすべて `public` フォルダに配置

## 2. 必要なアイコンファイル

以下のファイルが生成されます：

### 通常アイコン（any）
- icon-16x16.png - ファビコン用
- icon-32x32.png - ファビコン用
- icon-48x48.png
- icon-72x72.png
- icon-96x96.png
- icon-120x120.png
- icon-144x144.png
- icon-152x152.png - iPad用
- icon-167x167.png - iPad Pro用
- icon-180x180.png - iPhone用
- icon-192x192.png - Android用
- icon-512x512.png - Android用
- apple-touch-icon.png - iOS Safari用

### マスカブルアイコン（maskable）
- icon-maskable-192x192.png - Android 12以降用
- icon-maskable-512x512.png - Android 12以降用

## 3. 確認方法

### iOSでの確認
1. Safariでサイトを開く
2. 共有ボタン → 「ホーム画面に追加」
3. ホーム画面に追加されたアイコンを確認

### Androidでの確認
1. Chromeでサイトを開く
2. メニュー → 「ホーム画面に追加」
3. ホーム画面に追加されたアイコンを確認

### PWAインストール後の確認
- アプリアイコンが正しく表示されることを確認
- タスクバーやアプリ一覧でもアイコンが表示されることを確認

## 4. トラブルシューティング

### アイコンが表示されない場合
1. キャッシュをクリア
2. PWAを一度アンインストールして再インストール
3. `manifest.json` のキャッシュバスティングを更新
   ```html
   <link rel="manifest" href="/manifest.json?v=2024.2">
   ```

### iOSでアイコンが正しく表示されない場合
- `apple-touch-icon.png` が180×180pxであることを確認
- 透過PNGではなく、背景色付きのPNGを使用

### Androidでマスカブルアイコンが正しく表示されない場合
- アイコンの周囲に十分な余白（セーフエリア）があることを確認
- 最低でも全体の10%以上の余白を確保