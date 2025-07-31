/**
 * 開発環境用のダミーService Worker
 * 
 * 開発時にService Worker関連のエラーを防ぐための最小限の実装
 * 本番環境では使用されません
 */

// インストールイベント - 即座にアクティブ化
self.addEventListener('install', () => {
  console.log('[Dev SW] Installing...');
  self.skipWaiting();
});

// アクティベートイベント - すべてのクライアントを制御
self.addEventListener('activate', () => {
  console.log('[Dev SW] Activated');
  self.clients.claim();
});

// フェッチイベント - すべてのリクエストをそのまま通す
self.addEventListener('fetch', (event) => {
  // ネットワークリクエストをそのまま実行
  event.respondWith(fetch(event.request));
});