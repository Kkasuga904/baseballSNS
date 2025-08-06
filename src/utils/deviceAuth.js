// デバイス認証ユーティリティ
import { v4 as uuidv4 } from 'uuid';

// デバイスIDを取得または生成
export const getDeviceId = () => {
  const DEVICE_ID_KEY = 'baseballSNS_deviceId';
  
  // 既存のデバイスIDを確認
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  // なければ新規生成
  if (!deviceId) {
    deviceId = `device_${uuidv4()}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
    console.log('新しいデバイスIDを生成:', deviceId);
  } else {
    console.log('既存のデバイスIDを使用:', deviceId);
  }
  
  return deviceId;
};

// デバイスユーザー情報を作成
export const createDeviceUser = (deviceId) => {
  // 管理者デバイスIDリスト（あなたのPCのデバイスIDをここに設定）
  // 初回アクセス時にコンソールに表示されるデバイスIDを確認して設定
  const ADMIN_DEVICE_IDS = [
    // ここにあなたのPCのデバイスIDを追加
    // 例: 'device_12345678-90ab-cdef-1234-567890abcdef'
  ];
  
  // 環境変数でも管理者を判定（ローカル開発環境用）
  const isLocalAdmin = window.location.hostname === 'localhost' && 
                      window.location.port === '3000';
  
  // 特定のデバイスIDまたはローカル開発環境の場合のみ管理者
  const isAdminDevice = ADMIN_DEVICE_IDS.includes(deviceId) || isLocalAdmin;
  
  // 初回作成時にデバイスIDをコンソールに表示（管理者設定用）
  if (!localStorage.getItem('deviceIdLogged')) {
    console.log('=== あなたのデバイスID ===');
    console.log(deviceId);
    console.log('管理者にする場合は、このIDをdeviceAuth.jsのADMIN_DEVICE_IDSに追加してください');
    localStorage.setItem('deviceIdLogged', 'true');
  }
  
  return {
    id: deviceId,
    email: `${deviceId}@device.local`,
    displayName: isAdminDevice ? '管理者' : 'ゲストユーザー',
    isAnonymous: true,
    isAdmin: isAdminDevice,
    deviceId: deviceId,
    createdAt: new Date().toISOString()
  };
};

// デバイス認証でログイン
export const signInWithDevice = async () => {
  try {
    const deviceId = getDeviceId();
    const deviceUser = createDeviceUser(deviceId);
    
    // ユーザー情報をローカルストレージに保存
    localStorage.setItem('baseballSNSUser', JSON.stringify(deviceUser));
    
    // デバイスユーザーのデータストレージキー
    const userDataKey = `baseballSNSData_${deviceId}`;
    
    // 初回ログインの場合、初期データを作成
    if (!localStorage.getItem(userDataKey)) {
      const initialData = {
        practices: [],
        diaries: [],
        settings: {
          theme: 'light',
          notifications: true
        }
      };
      localStorage.setItem(userDataKey, JSON.stringify(initialData));
      console.log('デバイスユーザーの初期データを作成');
    }
    
    return {
      data: deviceUser,
      error: null,
      isNewDevice: !localStorage.getItem(userDataKey)
    };
  } catch (error) {
    console.error('デバイス認証エラー:', error);
    return {
      data: null,
      error: error,
      isNewDevice: false
    };
  }
};

// デバイスユーザーのデータを取得
export const getDeviceUserData = () => {
  const deviceId = getDeviceId();
  const userDataKey = `baseballSNSData_${deviceId}`;
  const data = localStorage.getItem(userDataKey);
  return data ? JSON.parse(data) : null;
};

// デバイスユーザーのデータを保存
export const saveDeviceUserData = (data) => {
  const deviceId = getDeviceId();
  const userDataKey = `baseballSNSData_${deviceId}`;
  localStorage.setItem(userDataKey, JSON.stringify(data));
  return true;
};

// デバイス認証をクリア（デバッグ用）
export const clearDeviceAuth = () => {
  const DEVICE_ID_KEY = 'baseballSNS_deviceId';
  const deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (deviceId) {
    // デバイスIDとユーザーデータを削除
    localStorage.removeItem(DEVICE_ID_KEY);
    localStorage.removeItem(`baseballSNSData_${deviceId}`);
    localStorage.removeItem('baseballSNSUser');
    console.log('デバイス認証をクリアしました');
  }
};