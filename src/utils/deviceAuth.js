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
  // 特定のデバイスIDまたは環境で管理者権限を付与
  const isAdminDevice = true; // このPCは管理者として設定
  
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