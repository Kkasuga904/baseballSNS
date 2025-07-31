import React, { useState } from 'react';
import './ProfileTabs.css';

function ProfileTabs({ profile, user, isOwnProfile, getCategoryLabel, getPositionLabels, getHandLabel }) {
  const [activeTab, setActiveTab] = useState('basic');
  
  return (
    <div className="profile-tabs-container">
      {/* タブヘッダー */}
      <div className="profile-tabs-header">
        <button
          className={`profile-tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          <span className="tab-icon">👤</span>
          基本情報
        </button>
        <button
          className={`profile-tab ${activeTab === 'baseball' ? 'active' : ''}`}
          onClick={() => setActiveTab('baseball')}
        >
          <span className="tab-icon">⚾</span>
          野球情報
        </button>
        <button
          className={`profile-tab ${activeTab === 'physical' ? 'active' : ''}`}
          onClick={() => setActiveTab('physical')}
        >
          <span className="tab-icon">💪</span>
          身体情報
        </button>
        <button
          className={`profile-tab ${activeTab === 'school' ? 'active' : ''}`}
          onClick={() => setActiveTab('school')}
        >
          <span className="tab-icon">🏫</span>
          出身校
        </button>
      </div>
      
      {/* タブコンテンツ */}
      <div className="profile-tab-content">
        {/* 基本情報タブ */}
        {activeTab === 'basic' && (
          <div className="profile-section">
            <div className="profile-field">
              <label>ニックネーム</label>
              <div className="field-value">{profile.nickname}</div>
            </div>
            <div className="profile-field">
              <label>メールアドレス</label>
              <div className="field-value">{user && user.email}</div>
            </div>
            <div className="profile-field">
              <label>スポーツ</label>
              <div className="field-value">
                {profile.sport === 'baseball' ? '⚾ 野球' : '🥎 ソフトボール'}
              </div>
            </div>
            <div className="profile-field">
              <label>カテゴリー</label>
              <div className="field-value">
                {getCategoryLabel(profile.category)}
                {profile.grade && ` ${profile.grade}年`}
              </div>
            </div>
            {profile.birthDate && (
              <div className="profile-field">
                <label>🎂 年齢</label>
                <div className="field-value age-display">
                  {(() => {
                    const today = new Date()
                    const birthDate = new Date(profile.birthDate)
                    let age = today.getFullYear() - birthDate.getFullYear()
                    const monthDiff = today.getMonth() - birthDate.getMonth()
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                      age--
                    }
                    return `${age}歳`
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 野球情報タブ */}
        {activeTab === 'baseball' && (
          <div className="profile-section">
            <div className="profile-field">
              <label>ポジション</label>
              <div className="field-value">
                {getPositionLabels(
                  profile.positions || [profile.position], 
                  profile.sport, 
                  profile.pitcherTypes || (profile.pitcherType ? [profile.pitcherType] : [])
                )}
              </div>
            </div>
            <div className="profile-field">
              <label>投打</label>
              <div className="field-value">
                {getHandLabel(profile.throwingHand, profile.battingHand)}
              </div>
            </div>
            <div className="profile-field">
              <label>背番号</label>
              <div className="field-value">{profile.uniformNumber || '---'}</div>
            </div>
            <div className="profile-field">
              <label>打席</label>
              <div className="field-value">{profile.battingOrder || '---'}</div>
            </div>
          </div>
        )}
        
        {/* 身体情報タブ */}
        {activeTab === 'physical' && (
          <div className="profile-section">
            <div className="profile-field">
              <label>身長</label>
              <div className="field-value">{profile.height || '---'} cm</div>
            </div>
            <div className="profile-field">
              <label>体重</label>
              <div className="field-value">{profile.weight || '---'} kg</div>
            </div>
            <div className="profile-field">
              <label>体脂肪率</label>
              <div className="field-value">{profile.bodyFat ? `${profile.bodyFat}%` : '---'}</div>
            </div>
            <div className="profile-field">
              <label>最高球速</label>
              <div className="field-value">{profile.maxSpeed ? `${profile.maxSpeed} km/h` : '---'}</div>
            </div>
          </div>
        )}
        
        {/* 出身校タブ */}
        {activeTab === 'school' && (
          <div className="profile-section">
            <div className="profile-field">
              <label>出身中学校</label>
              <div className={`field-value ${
                profile.middleSchool && profile.middleSchoolPublic !== false 
                  ? '' 
                  : (profile.middleSchool && profile.middleSchoolPublic === false 
                      ? 'private-info' 
                      : 'unset-info')
              }`}>
                {profile.middleSchool && profile.middleSchoolPublic !== false 
                  ? profile.middleSchool 
                  : profile.middleSchool && profile.middleSchoolPublic === false 
                    ? '🔒 非公開' 
                    : '--- 未設定 ---'}
              </div>
            </div>
            <div className="profile-field">
              <label>出身高校</label>
              <div className={`field-value ${
                profile.highSchool && profile.highSchoolPublic !== false 
                  ? '' 
                  : (profile.highSchool && profile.highSchoolPublic === false 
                      ? 'private-info' 
                      : 'unset-info')
              }`}>
                {profile.highSchool && profile.highSchoolPublic !== false 
                  ? profile.highSchool 
                  : profile.highSchool && profile.highSchoolPublic === false 
                    ? '🔒 非公開' 
                    : '--- 未設定 ---'}
              </div>
            </div>
            <div className="profile-field">
              <label>出身大学</label>
              <div className={`field-value ${
                profile.university && profile.universityPublic !== false 
                  ? '' 
                  : (profile.university && profile.universityPublic === false 
                      ? 'private-info' 
                      : 'unset-info')
              }`}>
                {profile.university && profile.universityPublic !== false 
                  ? profile.university 
                  : profile.university && profile.universityPublic === false 
                    ? '🔒 非公開' 
                    : '--- 未設定 ---'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileTabs;