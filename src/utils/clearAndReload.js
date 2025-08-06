// ローカルストレージをクリアして再ログイン
export const clearAndReloadAsAdmin = () => {
  // 現在のユーザー情報をクリア
  localStorage.removeItem('baseballSNSUser');
  
  // デバイスIDは保持（同じデバイスとして扱う）
  // ページをリロードして新しい設定を適用
  window.location.reload();
};

// デバイスタイプを確認
export const checkDeviceType = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const deviceType = isMobile ? 'mobile' : 'pc';
  const isAdmin = !isMobile;
  
  console.log('=== デバイス情報 ===');
  console.log('デバイスタイプ:', deviceType);
  console.log('管理者権限:', isAdmin ? 'あり' : 'なし');
  console.log('UserAgent:', navigator.userAgent);
  
  return {
    deviceType,
    isAdmin,
    userAgent: navigator.userAgent
  };
};

// グローバルに公開（開発者コンソールから実行可能）
if (typeof window !== 'undefined') {
  window.clearAndReloadAsAdmin = clearAndReloadAsAdmin;
  window.checkDeviceType = checkDeviceType;
}