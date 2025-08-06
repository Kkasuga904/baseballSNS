import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getDeviceId, 
  createDeviceUser, 
  signInWithDevice,
  getDeviceUserData,
  saveDeviceUserData 
} from '../utils/deviceAuth';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初回起動時の自動ログイン
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 既存のユーザー情報を確認
        const savedUser = localStorage.getItem('baseballSNSUser');
        
        if (savedUser) {
          // 既存のデバイスユーザーがいる場合
          const userData = JSON.parse(savedUser);
          if (userData.isAnonymous) {
            // デバイスタイプに基づいて権限を更新
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isPC = !isMobile;
            
            userData.isAdmin = isPC;
            userData.displayName = isPC ? '管理者' : 'ゲストユーザー';
            userData.deviceType = isMobile ? 'mobile' : 'pc';
            localStorage.setItem('baseballSNSUser', JSON.stringify(userData));
            setUser(userData);
            console.log(`既存のデバイスユーザーでログイン（${userData.deviceType}）`);
          } else {
            // 匿名でないユーザーの場合は、デバイス認証に切り替え
            const result = await signInWithDevice();
            if (result.data) {
              setUser(result.data);
              console.log('デバイス認証に切り替え');
            }
          }
        } else {
          // 新規デバイスの場合、自動的にデバイス認証でログイン
          const result = await signInWithDevice();
          if (result.data) {
            setUser(result.data);
            console.log('新規デバイスとして自動ログイン');
          }
        }
      } catch (error) {
        console.error('認証初期化エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // デバイス認証でサインイン（手動実行用）
  const signIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithDevice();
      if (result.data) {
        setUser(result.data);
        return { data: result.data, error: null };
      }
      return { data: null, error: result.error };
    } catch (error) {
      console.error('サインインエラー:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // サインアウト（デバイス認証では基本的に使用しない）
  const signOut = async () => {
    // デバイス認証では実際にはログアウトしない（データは保持）
    // UIのテスト用にユーザー情報だけクリア
    setUser(null);
    sessionStorage.clear();
    return { error: null };
  };

  // プロフィール更新
  const updateProfile = async (updates) => {
    if (!user) {
      return { data: null, error: new Error('ログインしていません') };
    }
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('baseballSNSUser', JSON.stringify(updatedUser));
    
    return { data: updatedUser, error: null };
  };

  // デバイスユーザーのデータを取得
  const getUserData = () => {
    return getDeviceUserData();
  };

  // デバイスユーザーのデータを保存
  const saveUserData = (data) => {
    return saveDeviceUserData(data);
  };

  // メール認証システム（保留）
  // 以下の機能は現在使用していませんが、将来的に復活させる可能性があります
  /*
  const signUp = async (email, password) => {
    // メールアドレスでの新規登録（現在は無効）
    return { data: null, error: new Error('メール認証は現在利用できません') };
  };

  const signInWithEmail = async (email, password) => {
    // メールアドレスでのログイン（現在は無効）
    return { data: null, error: new Error('メール認証は現在利用できません') };
  };

  const signInWithGoogle = async () => {
    // Google認証（現在は無効）
    return { data: null, error: new Error('Google認証は現在利用できません') };
  };

  const resetPassword = async (email) => {
    // パスワードリセット（現在は無効）
    return { data: null, error: new Error('パスワードリセットは現在利用できません') };
  };

  const updatePassword = async (newPassword) => {
    // パスワード更新（現在は無効）
    return { data: null, error: new Error('パスワード更新は現在利用できません') };
  };
  */

  const value = {
    user,
    loading,
    signIn,
    signOut,
    updateProfile,
    getUserData,
    saveUserData,
    // メール認証システム（保留）
    // signUp,
    // signInWithEmail,
    // signInWithGoogle,
    // resetPassword,
    // updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};