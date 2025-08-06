// ローカルストレージをクリアして再ログイン
export const clearAndReloadAsAdmin = () => {
  // 現在のユーザー情報をクリア
  localStorage.removeItem('baseballSNSUser');
  
  // デバイスIDは保持（同じデバイスとして扱う）
  // ページをリロードして新しい設定を適用
  window.location.reload();
};

// デバイス情報を確認
export const checkDeviceInfo = () => {
  const deviceId = localStorage.getItem('baseballSNS_deviceId');
  const user = JSON.parse(localStorage.getItem('baseballSNSUser') || '{}');
  const isLocalhost = window.location.hostname === 'localhost';
  
  console.log('=== デバイス情報 ===');
  console.log('デバイスID:', deviceId);
  console.log('ユーザー名:', user.displayName || '未設定');
  console.log('管理者権限:', user.isAdmin ? 'あり' : 'なし');
  console.log('ローカル環境:', isLocalhost ? 'はい' : 'いいえ');
  console.log('');
  console.log('管理者にするには:');
  console.log('1. 上記のデバイスIDをコピー');
  console.log('2. src/utils/deviceAuth.js のADMIN_DEVICE_IDSに追加');
  console.log('3. ページをリロード');
  
  return {
    deviceId,
    displayName: user.displayName,
    isAdmin: user.isAdmin,
    isLocalhost
  };
};

// グローバルに公開（開発者コンソールから実行可能）
if (typeof window !== 'undefined') {
  window.clearAndReloadAsAdmin = clearAndReloadAsAdmin;
  window.checkDeviceInfo = checkDeviceInfo;
}