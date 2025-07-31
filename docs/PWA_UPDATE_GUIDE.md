# PWA自動更新ガイド

## 概要
このアプリケーションは、デプロイ後に自動的に更新を検知し、ユーザーの操作なしでページをリロードする機能を実装しています。

## 仕組み

### 1. Service Worker のバージョン管理
- `public/sw.js` 内の `CACHE_VERSION` が更新されると、新しいService Workerがインストールされます
- ビルド時に自動的にタイムスタンプベースのバージョンが生成されます

### 2. 自動更新の流れ
1. ユーザーがアプリを開く/再訪問する
2. Service Workerが更新をチェック（初回アクセス時 + 5分ごと）
3. 新しいバージョンが検出されると：
   - 新しいService Workerが自動的にインストール・アクティブ化
   - ページが自動的にリロード
   - 最新のコンテンツが表示される

### 3. 実装の詳細

#### main.jsx
```javascript
// 更新検知とリロード機能
registration.addEventListener('updatefound', () => {
  const newWorker = registration.installing
  newWorker.addEventListener('statechange', () => {
    if (newWorker.state === 'activated') {
      window.location.reload()
    }
  })
})
```

#### sw.js
- `skipWaiting()`: 新しいService Workerを即座にアクティブ化
- `clients.claim()`: すべてのクライアントを即座に制御
- ネットワークファースト戦略: 常に最新のコンテンツを優先

## 開発時の注意点

### ローカル開発
1. `npm run dev` でローカルサーバーを起動
2. Chrome DevTools > Application > Service Workers で状態を確認
3. "Update on reload" オプションを有効にすると、リロード時に常に最新版を使用

### デプロイ前
1. `npm run build` を実行（自動的にService Workerのバージョンが更新される）
2. `git add .` && `git commit -m "Update"`
3. デプロイ（Vercel/Firebase Hosting）

### 手動でService Workerを更新
```bash
npm run update-sw
```

## トラブルシューティング

### 更新が反映されない場合
1. Chrome DevTools > Application > Clear storage でキャッシュをクリア
2. Service Worker を手動で Unregister
3. ハード再読み込み（Ctrl+Shift+R）

### 開発時に頻繁にリロードされる場合
開発時は Service Worker を無効化することを推奨：
```javascript
// main.jsx の先頭に追加
if (import.meta.env.DEV) {
  // 開発環境ではService Workerを登録しない
  console.log('開発環境: Service Worker を無効化')
} else {
  // Service Worker 登録コード
}
```

## ベストプラクティス

1. **重要な更新時**: `CACHE_VERSION` を手動で変更して強制更新
2. **キャッシュ戦略**: 静的アセットは積極的にキャッシュ、APIレスポンスはキャッシュしない
3. **テスト**: デプロイ前に必ずローカルでPWA動作を確認（`npm run build` && `npm run preview`）

## 参考リンク
- [Service Worker API - MDN](https://developer.mozilla.org/ja/docs/Web/API/Service_Worker_API)
- [The Service Worker Lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle)