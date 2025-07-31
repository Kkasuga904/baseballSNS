import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import './Settings.css';

function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState(null);
  
  // プロフィール情報を読み込む
  useEffect(() => {
    if (user) {
      const profileKey = user.email === 'over9131120@gmail.com' 
        ? 'baseballSNSAdminProfile'
        : `baseballSNSProfile_${user.email || 'guest'}`;
      const savedProfile = localStorage.getItem(profileKey);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
  }, [user]);
  
  // 通知設定
  const [notificationSettings, setNotificationSettings] = useState({
    practiceReminder: profile?.settings?.practiceReminder || false,
    gameReminder: profile?.settings?.gameReminder || false,
    dailyRecordReminder: profile?.settings?.dailyRecordReminder || false,
    reminderTime: profile?.settings?.reminderTime || '18:00'
  });
  
  // プライバシー設定
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: profile?.settings?.profileVisibility || 'public',
    postVisibility: profile?.settings?.postVisibility || 'public',
    showEmail: profile?.settings?.showEmail || false
  });
  
  // 表示設定
  const [displaySettings, setDisplaySettings] = useState({
    theme: profile?.settings?.theme || 'light',
    language: profile?.settings?.language || 'ja',
    timeFormat: profile?.settings?.timeFormat || '24h'
  });

  // プロフィールが読み込まれたら設定を更新
  useEffect(() => {
    if (profile?.settings) {
      setNotificationSettings({
        practiceReminder: profile.settings.practiceReminder || false,
        gameReminder: profile.settings.gameReminder || false,
        dailyRecordReminder: profile.settings.dailyRecordReminder || false,
        reminderTime: profile.settings.reminderTime || '18:00'
      });
      
      setPrivacySettings({
        profileVisibility: profile.settings.profileVisibility || 'public',
        postVisibility: profile.settings.postVisibility || 'public',
        showEmail: profile.settings.showEmail || false
      });
      
      setDisplaySettings({
        theme: profile.settings.theme || 'light',
        language: profile.settings.language || 'ja',
        timeFormat: profile.settings.timeFormat || '24h'
      });
    }
  }, [profile]);

  const handleSaveSettings = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const settings = {
        ...notificationSettings,
        ...privacySettings,
        ...displaySettings
      };
      
      // プロフィールを更新して保存
      const updatedProfile = { ...profile, settings };
      setProfile(updatedProfile);
      
      // LocalStorageに保存
      const profileKey = user.email === 'over9131120@gmail.com' 
        ? 'baseballSNSAdminProfile'
        : `baseballSNSProfile_${user.email || 'guest'}`;
      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
      setMessage('設定を保存しました');
    } catch (error) {
      console.error('設定の保存エラー:', error);
      setMessage('設定の保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!window.confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
      return;
    }
    
    try {
      // LocalStorageからプロフィールを削除
      const profileKey = user.email === 'over9131120@gmail.com' 
        ? 'baseballSNSAdminProfile'
        : `baseballSNSProfile_${user.email || 'guest'}`;
      localStorage.removeItem(profileKey);
      
      // 認証をクリア
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('アカウント削除エラー:', error);
      setMessage('アカウントの削除に失敗しました');
    }
  };

  return (
    <div className="settings-container">
      <h1>設定</h1>
      
      {message && (
        <div className={`message ${message.includes('失敗') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      <div className="settings-section">
        <h2>通知設定</h2>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.practiceReminder}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                practiceReminder: e.target.checked
              })}
            />
            練習リマインダー
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.gameReminder}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                gameReminder: e.target.checked
              })}
            />
            試合リマインダー
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.dailyRecordReminder}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                dailyRecordReminder: e.target.checked
              })}
            />
            日記リマインダー
          </label>
        </div>
        <div className="setting-item">
          <label>
            リマインダー時刻
            <input
              type="time"
              value={notificationSettings.reminderTime}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                reminderTime: e.target.value
              })}
            />
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>プライバシー設定</h2>
        <div className="setting-item">
          <label>
            プロフィール公開範囲
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) => setPrivacySettings({
                ...privacySettings,
                profileVisibility: e.target.value
              })}
            >
              <option value="public">公開</option>
              <option value="followers">フォロワーのみ</option>
              <option value="private">非公開</option>
            </select>
          </label>
        </div>
        <div className="setting-item">
          <label>
            投稿公開範囲
            <select
              value={privacySettings.postVisibility}
              onChange={(e) => setPrivacySettings({
                ...privacySettings,
                postVisibility: e.target.value
              })}
            >
              <option value="public">公開</option>
              <option value="followers">フォロワーのみ</option>
              <option value="private">非公開</option>
            </select>
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={privacySettings.showEmail}
              onChange={(e) => setPrivacySettings({
                ...privacySettings,
                showEmail: e.target.checked
              })}
            />
            メールアドレスを公開
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>表示設定</h2>
        <div className="setting-item">
          <label>
            テーマ
            <select
              value={displaySettings.theme}
              onChange={(e) => setDisplaySettings({
                ...displaySettings,
                theme: e.target.value
              })}
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
              <option value="auto">自動</option>
            </select>
          </label>
        </div>
        <div className="setting-item">
          <label>
            言語
            <select
              value={displaySettings.language}
              onChange={(e) => setDisplaySettings({
                ...displaySettings,
                language: e.target.value
              })}
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>
        <div className="setting-item">
          <label>
            時刻表示
            <select
              value={displaySettings.timeFormat}
              onChange={(e) => setDisplaySettings({
                ...displaySettings,
                timeFormat: e.target.value
              })}
            >
              <option value="24h">24時間表示</option>
              <option value="12h">12時間表示</option>
            </select>
          </label>
        </div>
      </div>
      
      <div className="settings-actions">
        <button 
          className="save-button"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? '保存中...' : '設定を保存'}
        </button>
      </div>
      
      <div className="settings-section danger-zone">
        <h2>アカウント</h2>
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          ログアウト
        </button>
        <button 
          className="delete-account-button"
          onClick={handleDeleteAccount}
        >
          アカウントを削除
        </button>
      </div>
    </div>
  );
}

export default Settings;