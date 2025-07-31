/**
 * Service Worker登録用スクリプト
 * 
 * このファイルは通常のJavaScriptファイルとして読み込まれ、
 * Service Workerの登録を行います。
 * 
 * index.htmlから直接読み込むことで、ViteのモジュールシステムをバイパスL、
 * MIMEタイプの問題を回避します。
 */

// Service Workerのサポートチェック
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Service Workerファイルのパス
    const swPath = '/sw.js';
    
    // Service Workerを登録（通常のスクリプトとして）
    navigator.serviceWorker.register(swPath, { 
      type: 'classic',
      scope: '/'
    })
    .then(function(registration) {
      console.log('ServiceWorker registration successful:', registration);
    })
    .catch(function(err) {
      console.error('ServiceWorker registration failed:', err);
    });
  });
}