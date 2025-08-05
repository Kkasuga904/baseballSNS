/**
 * sw.js - Service Worker
 * 
 * Service WorkerはPWA（Progressive Web App）の中核技術で、
 * オフライン機能、キャッシュ管理、バックグラウンド同期などを提供します。
 * 
 * このService Workerの機能:
 * - 静的アセットのキャッシュ
 * - オフライン時のフォールバック
 * - ネットワークファースト戦略の実装
 * - キャッシュバージョン管理
 */

/**
 * キャッシュ名とバージョン管理
 * バージョンを変更することで古いキャッシュをクリアできます
 * デプロイ時は自動的にタイムスタンプを付与することを推奨
 */
const CACHE_VERSION = '2025-08-05T12-55-51-528Z'; // バージョンを変更するとキャッシュが更新されます
const CACHE_NAME = `baselog-v${CACHE_VERSION}`;
const DATA_CACHE_NAME = `baselog-data-v${CACHE_VERSION}`;
const BUILD_TIME = new Date().toISOString(); // ビルド時刻を記録

/**
 * 初期インストール時にキャッシュするURL一覧
 * アプリの基本的な動作に必要なファイル
 */
const urlsToCache = [
  '/',              // ルートページ
  '/index.html',    // メインHTMLファイル
  '/manifest.json', // PWAマニフェスト
  '/icon.svg',      // アプリアイコン
  '/offline.html'   // オフラインページ
];

/**
 * installイベント - Service Workerのインストール時に実行
 * 
 * 役割:
 * 1. 必要なファイルをキャッシュに保存
 * 2. インストール完了後、即座にアクティブ化
 */
self.addEventListener('install', event => {
  // event.waitUntil()でインストール処理が完了するまで待機
  event.waitUntil(
    // キャッシュストレージを開く
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] キャッシュを開きました');
        // 指定されたURLをすべてキャッシュに追加
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] 必要なファイルをキャッシュしました');
        // skipWaiting()で待機中のService Workerをスキップして即座にアクティブ化
        return self.skipWaiting();
      })
  );
});

/**
 * activateイベント - Service Workerがアクティブになった時に実行
 * 
 * 役割:
 * 1. 古いバージョンのキャッシュを削除
 * 2. 新しいService Workerがすべてのクライアントを制御
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    // すべてのキャッシュ名を取得
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 現在のキャッシュ名と異なる場合は削除（古いバージョン）
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('[Service Worker] 古いキャッシュを削除:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // clients.claim()ですべてのクライアントを即座に制御
      console.log('[Service Worker] アクティブ化完了');
      return self.clients.claim();
    })
  );
});

/**
 * fetchイベント - ネットワークリクエストをインターセプト
 * 
 * 戦略:
 * - 静的アセット: Cache First (高速化優先)
 * - ナビゲーション: Network First (最新コンテンツ優先)
 * - データAPI: Network Only with localStorage backup
 */
self.addEventListener('fetch', event => {
  // GET以外のリクエスト（POST、PUT、DELETE等）はスキップ
  if (event.request.method !== 'GET') return;

  // 別オリジンへのリクエストはスキップ
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Service Worker自身へのリクエストはキャッシュしない
  if (event.request.url.includes('sw.js')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // 静的アセット（JS、CSS、画像）の場合はCache First戦略
  if (event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(response => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return response;
          });
        })
    );
    return;
  }

  // ナビゲーションリクエスト（ページ遷移）の場合
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // オフライン時はキャッシュから返す
          return caches.match(event.request)
            .then(response => {
              if (response) {
                return response;
              }
              // キャッシュにもない場合はオフラインページを表示
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }
  
  // その他のリクエストはNetwork First戦略
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

/**
 * Service Workerのライフサイクル:
 * 
 * 1. 登録（register）- index.htmlなどで実行
 * 2. インストール（install）- 初回アクセス時
 * 3. アクティベート（activate）- インストール完了後
 * 4. フェッチ（fetch）- リクエスト発生時
 * 5. 更新（update）- sw.jsが変更された時
 * 
 * デバッグのヒント:
 * - Chrome DevTools > Application > Service Workers で状態確認
 * - Update on reloadオプションで開発時は常に最新版を使用
 * - Clear storageで全キャッシュをクリア可能
 */