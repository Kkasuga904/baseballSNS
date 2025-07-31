import React, { useState } from 'react';
import { useTeam } from '../contexts/TeamContext';
import { TeamRoles, TeamRoleLabels } from '../models/team';
import './TeamManagement.css';

function TeamManagement({ onClose, onTeamCreated }) {
  const { createTeam, joinTeam, searchTeams, loading } = useTeam();
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'join'
  const [isProcessing, setIsProcessing] = useState(false);
  
  // チーム作成フォーム
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamWikiText, setTeamWikiText] = useState('');
  
  // チーム参加フォーム
  const [inviteCode, setInviteCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRole, setSelectedRole] = useState(TeamRoles.PLAYER);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // チーム作成処理
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsProcessing(true);

    if (!teamName.trim()) {
      setError('チーム名を入力してください');
      setIsProcessing(false);
      return;
    }

    try {
      const newTeam = await createTeam({
        name: teamName,
        description: teamDescription,
        wikiText: teamWikiText
      });
      
      setSuccess('チームを作成しました！');
      setTeamName('');
      setTeamDescription('');
      setTeamWikiText('');
      
      // 成功メッセージを表示してから閉じる
      setTimeout(() => {
        if (onTeamCreated) {
          onTeamCreated(newTeam);
        }
      }, 1500);
      
      
    } catch (err) {
      setError(err.message || 'チーム作成に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  // チーム参加処理（招待コード）
  const handleJoinByCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!inviteCode.trim()) {
      setError('招待コードを入力してください');
      return;
    }

    setIsProcessing(true);
    try {
      const team = await joinTeam(inviteCode.toUpperCase(), selectedRole);
      setSuccess(`${team.name}に参加しました！`);
      setInviteCode('');
      
      // 成功時のアニメーション効果
      const successElement = document.querySelector('.bg-green-100');
      if (successElement) {
        successElement.classList.add('animate-pulse');
      }
      
      setTimeout(() => {
        if (onClose) {
          onClose();
          // ページをリロードして最新の状態を表示
          window.location.reload();
        }
      }, 1500);
    } catch (err) {
      setError(err.message || 'チーム参加に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  // チーム検索
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = searchTeams(searchQuery);
    setSearchResults(results);
  };

  // 検索結果からチーム参加
  const handleJoinFromSearch = async (team) => {
    setError('');
    setSuccess('');

    setIsProcessing(true);
    try {
      await joinTeam(team.inviteCode, selectedRole);
      setSuccess(`${team.name}に参加しました！`);
      
      // 成功時のアニメーション効果
      const successElement = document.querySelector('.bg-green-100');
      if (successElement) {
        successElement.classList.add('animate-pulse');
      }
      
      setTimeout(() => {
        if (onClose) {
          onClose();
          // ページをリロードして最新の状態を表示
          window.location.reload();
        }
      }, 1500);
    } catch (err) {
      setError(err.message || 'チーム参加に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  console.log('[TeamManagement] Rendering modal');
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      className="team-modal-overlay"
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '672px',
          maxHeight: '90vh',
          overflow: 'hidden'
        }}
        className="team-modal-content"
      >
        <div style={{ 
          borderBottom: '2px solid #e5e7eb', 
          padding: '24px',
          background: 'linear-gradient(to right, #f0fdf4, #dcfce7)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '32px' }}>⚾</span>
              チーム管理
            </h2>
            <button
              onClick={onClose}
              style={{ 
                color: '#374151', 
                fontSize: '28px',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* タブ切り替え */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <button
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              color: activeTab === 'create' ? '#059669' : '#6b7280',
              borderBottom: activeTab === 'create' ? '3px solid #059669' : '3px solid transparent',
              backgroundColor: activeTab === 'create' ? 'white' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onClick={() => setActiveTab('create')}
          >
            <span style={{ fontSize: '20px' }}>🏗️</span>
            チーム作成
          </button>
          <button
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              color: activeTab === 'join' ? '#059669' : '#6b7280',
              borderBottom: activeTab === 'join' ? '3px solid #059669' : '3px solid transparent',
              backgroundColor: activeTab === 'join' ? 'white' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onClick={() => setActiveTab('join')}
          >
            <span style={{ fontSize: '20px' }}>🤝</span>
            チーム参加
          </button>
        </div>

        <div style={{ 
          padding: '32px', 
          overflowY: 'auto', 
          maxHeight: 'calc(90vh - 200px)',
          backgroundColor: '#fafafa'
        }}>
          {/* エラー・成功メッセージ */}
          {error && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: '12px',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px'
            }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: '#f0fdf4',
              color: '#166534',
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: '500'
            }}
            className="success-message"
            >
              <span style={{ fontSize: '24px' }}>✅</span>
              {success}
            </div>
          )}

          {/* チーム作成フォーム */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  チーム名
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="例: 〇〇野球部"
                  maxLength={50}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  チーム説明
                </label>
                <textarea
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white',
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="チームの特徴や活動内容など"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📋</span>
                  戦術・指示メモ（Wiki）
                </label>
                <textarea
                  value={teamWikiText}
                  onChange={(e) => setTeamWikiText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#f9fafb',
                    fontFamily: 'monospace',
                    resize: 'vertical',
                    minHeight: '150px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="攻撃サイン、守備連携、練習メニューなど"
                  rows={6}
                />
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '4px',
                  fontStyle: 'italic'
                }}>
                  ※ 監督・コーチのみ編集可能です
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || isProcessing}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: loading || isProcessing ? '#9ca3af' : 'white',
                  backgroundColor: loading || isProcessing ? '#e5e7eb' : '#059669',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading || isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: loading || isProcessing ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!loading && !isProcessing) {
                    e.target.style.backgroundColor = '#047857';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && !isProcessing) {
                    e.target.style.backgroundColor = '#059669';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                {loading || isProcessing ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                    作成中...
                  </>
                ) : (
                  <>
                    <span>⚾</span>
                    チームを作成
                  </>
                )}
              </button>
            </form>
          )}

          {/* チーム参加フォーム */}
          {activeTab === 'join' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* 役割選択 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>👥</span>
                  参加する役割
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {Object.entries(TeamRoleLabels).map(([role, label]) => (
                    <label 
                      key={role} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: selectedRole === role ? '#dcfce7' : 'white',
                        border: `2px solid ${selectedRole === role ? '#059669' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flex: 1
                      }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={selectedRole === role}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ 
                        fontWeight: selectedRole === role ? '600' : '400',
                        color: selectedRole === role ? '#059669' : '#374151'
                      }}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 招待コードで参加 */}
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>🎫</span>
                  招待コードで参加
                </h3>
                <form onSubmit={handleJoinByCode} style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      fontSize: '18px',
                      fontWeight: '600',
                      letterSpacing: '2px',
                      textAlign: 'center',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: '#f9fafb',
                      textTransform: 'uppercase'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="XXXXXXXX"
                    maxLength={8}
                  />
                  <button
                    type="submit"
                    disabled={loading || isProcessing}
                    style={{
                      padding: '12px 32px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: loading || isProcessing ? '#9ca3af' : 'white',
                      backgroundColor: loading || isProcessing ? '#e5e7eb' : '#059669',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading || isProcessing ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                        参加中...
                      </>
                    ) : (
                      <>参加</>
                    )}
                  </button>
                </form>
              </div>

              {/* チーム検索 */}
              <div>
                <h3 className="font-semibold mb-3">チームを検索</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 p-2 border rounded focus:ring-green-500 focus:border-green-500"
                    placeholder="チーム名で検索"
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    検索
                  </button>
                </div>

                {/* 検索結果 */}
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map((team) => (
                      <div
                        key={team.id}
                        className="border rounded p-3 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{team.name}</h4>
                            {team.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {team.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleJoinFromSearch(team)}
                            disabled={loading || isProcessing}
                            className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                              loading || isProcessing
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                            }`}
                          >
                            {isProcessing ? '参加中...' : '参加'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    該当するチームが見つかりませんでした
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamManagement;