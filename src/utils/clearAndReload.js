// ローカルストレージをクリアして再ログイン
export const clearAndReloadAsAdmin = () => {
  // 現在のユーザー情報をクリア
  localStorage.removeItem('baseballSNSUser');
  
  // デバイスIDは保持（同じデバイスとして扱う）
  // ページをリロードして新しい設定を適用
  window.location.reload();
};

// グローバルに公開（開発者コンソールから実行可能）
if (typeof window !== 'undefined') {
  window.clearAndReloadAsAdmin = clearAndReloadAsAdmin;
}