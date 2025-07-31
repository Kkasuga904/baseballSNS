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
const CACHE_VERSION = '2025-07-31T03-10-40-028Z'; // バージョンを変更するとキャッシュが更新されます
const CACHE_NAME = `baselog-v${CACHE_VERSION}`;
const BUILD_TIME = new Date().toISOString(); // ビルド時刻を記録

/**
 * 初期インストール時にキャッシュするURL一覧
 * アプリの基本的な動作に必要なファイル
 */
const urlsToCache = [
  '/',              // ルートページ
  '/index.html',    // メインHTMLファイル
  '/manifest.json', // PWAマニフェスト
  '/icon.svg'       // アプリアイコン
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
          if (cacheName !== CACHE_NAME) {
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
 * 戦略: Network First, Cache Fallback
 * 1. まずネットワークからの取得を試みる（最新データ優先）
 * 2. ネットワークが利用できない場合はキャッシュから返す
 * 3. 成功したレスポンスはキャッシュに保存
 */
self.addEventListener('fetch', event => {
  // GET以外のリクエスト（POST、PUT、DELETE等）はスキップ
  // これらはデータ変更を伴うため、キャッシュすべきでない
  if (event.request.method !== 'GET') return;

  // 別オリジンへのリクエストはスキップ
  // 外部APIやCDNへのリクエストはキャッシュしない
  if (!event.request.url.startsWith(self.location.origin)) return;

  // APIコールはスキップ
  // 動的データはキャッシュせず、常に最新を取得
  if (event.request.url.includes('/api/')) return;

  // Service Worker自身へのリクエストはキャッシュしない
  if (event.request.url.includes('sw.js')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // リクエストに対するレスポンスをカスタマイズ
  event.respondWith(
    // まずネットワークから取得を試みる
    fetch(event.request, { cache: 'no-cache' }) // 常に最新を取得
      .then(response => {
        // レスポンスが正常でない場合はそのまま返す
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        /**
         * レスポンスのクローンを作成
         * レスポンスはストリームなので、一度しか読めない
         * ブラウザ用とキャッシュ用に2つ必要
         */
        const responseToCache = response.clone();

        // 非同期でキャッシュに保存（レスポンス返却をブロックしない）
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        // オリジナルのレスポンスをブラウザに返す
        return response;
      })
      .catch(() => {
        // ネットワークエラー時（オフライン等）はキャッシュから返す
        console.log('[Service Worker] ネットワークエラー、キャッシュから取得:', event.request.url);
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