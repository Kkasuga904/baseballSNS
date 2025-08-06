// PWAキャッシュをクリアするユーティリティ

export const clearPWACache = async () => {
  try {
    console.log('PWAキャッシュをクリア中...');
    
    // Service Workerのキャッシュをクリア
    if ('serviceWorker' in navigator) {
      const caches = await window.caches.keys();
      await Promise.all(
        caches.map(cache => window.caches.delete(cache))
      );
      console.log('Service Workerキャッシュをクリア完了');
    }
    
    // ページをリロードしてマニフェストを再読み込み
    window.location.reload();
    
  } catch (error) {
    console.error('PWAキャッシュクリアエラー:', error);
  }
};

export const updatePWAIcon = async () => {
  try {
    // マニフェストを再読み込みするために、リンク要素を更新
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      const href = manifestLink.href.split('?')[0];
      manifestLink.href = `${href}?v=${Date.now()}`;
      console.log('マニフェストリンクを更新しました');
    }
    
    // ファビコンも更新
    const faviconLink = document.querySelector('link[rel="icon"]');
    if (faviconLink) {
      const href = faviconLink.href.split('?')[0];
      faviconLink.href = `${href}?v=${Date.now()}`;
      console.log('ファビコンリンクを更新しました');
    }
    
  } catch (error) {
    console.error('PWAアイコン更新エラー:', error);
  }
};

// グローバルに公開
if (typeof window !== 'undefined') {
  window.clearPWACache = clearPWACache;
  window.updatePWAIcon = updatePWAIcon;
}