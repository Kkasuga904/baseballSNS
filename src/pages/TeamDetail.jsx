import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { TeamRoleLabels, canEditTeam, canEditWiki, canViewMembersPractice } from '../models/team';
// import PostCard from '../components/PostCard';

function TeamDetail() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getTeamById, 
    getTeamMembers, 
    getUserRoleInTeam,
    updateTeamWiki,
    updateMemberRole,
    leaveTeam 
  } = useTeam();
  const { posts } = usePosts();
  
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [editingWiki, setEditingWiki] = useState(false);
  const [wikiText, setWikiText] = useState('');
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'members' | 'practice'
  const [loading, setLoading] = useState(true);

  // チーム情報の読み込み
  useEffect(() => {
    loadTeamData();
  }, [teamId]);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      const teamData = getTeamById(teamId);
      if (!teamData) {
        navigate('/');
        return;
      }
      
      setTeam(teamData);
      setWikiText(teamData.wikiText || '');
      
      const membersList = getTeamMembers(teamId);
      setMembers(membersList);
      
      const role = getUserRoleInTeam(teamId);
      setUserRole(role);
    } finally {
      setLoading(false);
    }
  };

  // Wiki保存
  const handleSaveWiki = async () => {
    try {
      await updateTeamWiki(teamId, wikiText);
      setTeam(prev => ({ ...prev, wikiText }));
      setEditingWiki(false);
    } catch (error) {
      alert('Wiki更新に失敗しました');
    }
  };

  // メンバーのロール変更
  const handleRoleChange = async (userId, newRole) => {
    if (!canEditTeam(userRole)) return;
    
    try {
      await updateMemberRole(teamId, userId, newRole);
      loadTeamData(); // リロード
    } catch (error) {
      alert('ロール変更に失敗しました');
    }
  };

  // チーム脱退
  const handleLeaveTeam = async () => {
    if (!confirm('本当にこのチームから脱退しますか？')) return;
    
    try {
      await leaveTeam(teamId);
      navigate('/');
    } catch (error) {
      alert('チーム脱退に失敗しました');
    }
  };

  // メンバーの練習記録を取得
  const getMemberPracticePosts = (userId) => {
    return posts.filter(post => 
      post.userId === userId && 
      post.practiceData && 
      post.practiceData.date
    ).sort((a, b) => 
      new Date(b.practiceData.date) - new Date(a.practiceData.date)
    );
  };

  // 全メンバーの最新の練習記録を取得
  const getAllMembersPracticePosts = () => {
    const allPracticePosts = [];
    members.forEach(member => {
      const memberPosts = getMemberPracticePosts(member.userId);
      allPracticePosts.push(...memberPosts.map(post => ({
        ...post,
        memberInfo: member
      })));
    });
    
    return allPracticePosts.sort((a, b) => 
      new Date(b.practiceData.date) - new Date(a.practiceData.date)
    ).slice(0, 20); // 最新20件
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">チームが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← 戻る
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{team.name}</h1>
                {userRole && (
                  <span className="text-sm text-gray-600">
                    あなたの役割: {TeamRoleLabels[userRole]}
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={handleLeaveTeam}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              チームを脱退
            </button>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            <button
              className={`px-4 py-3 font-semibold ${
                activeTab === 'info'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('info')}
            >
              チーム情報
            </button>
            <button
              className={`px-4 py-3 font-semibold ${
                activeTab === 'members'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('members')}
            >
              メンバー ({members.length})
            </button>
            {canViewMembersPractice(userRole) && (
              <button
                className={`px-4 py-3 font-semibold ${
                  activeTab === 'practice'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('practice')}
              >
                練習記録
              </button>
            )}
          </div>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* チーム情報タブ */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* 基本情報 */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">基本情報</h2>
              
              <div className="space-y-3">
                {team.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">説明</h3>
                    <p className="mt-1">{team.description}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600">招待コード</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="bg-gray-100 px-3 py-1 rounded font-mono">
                      {team.inviteCode}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(team.inviteCode);
                        alert('招待コードをコピーしました');
                      }}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      コピー
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600">作成日</h3>
                  <p className="mt-1">
                    {new Date(team.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            </div>

            {/* Wiki */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">戦術・指示メモ（Wiki）</h2>
                {canEditWiki(userRole) && !editingWiki && (
                  <button
                    onClick={() => setEditingWiki(true)}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    編集
                  </button>
                )}
              </div>
              
              {editingWiki ? (
                <div className="space-y-3">
                  <textarea
                    value={wikiText}
                    onChange={(e) => setWikiText(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500 font-mono"
                    rows={10}
                    placeholder="攻撃サイン、守備連携、練習メニューなど"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveWiki}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setWikiText(team.wikiText || '');
                        setEditingWiki(false);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                  {team.wikiText || (
                    <span className="text-gray-500">
                      まだ何も記載されていません
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* メンバータブ */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">メンバー一覧</h2>
            
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">
                        {member.userId.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">ユーザー {member.userId}</p>
                      <p className="text-sm text-gray-600">
                        {TeamRoleLabels[member.role]}
                      </p>
                    </div>
                  </div>
                  
                  {canEditTeam(userRole) && member.userId !== user?.id && (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      {Object.entries(TeamRoleLabels).map(([role, label]) => (
                        <option key={role} value={role}>
                          {label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 練習記録タブ */}
        {activeTab === 'practice' && canViewMembersPractice(userRole) && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">メンバーの練習記録</h2>
            
            {getAllMembersPracticePosts().length > 0 ? (
              getAllMembersPracticePosts().map((post) => (
                <div key={post.id} className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-600">
                      ユーザー {post.memberInfo.userId}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({TeamRoleLabels[post.memberInfo.role]})
                    </span>
                  </div>
                  <div className="practice-post">
                    <div className="text-sm text-gray-600 mb-1">
                      {new Date(post.practiceData.date).toLocaleDateString('ja-JP')}
                    </div>
                    {post.practiceData.condition && (
                      <div className="text-sm mb-2">
                        <span className="font-semibold">コンディション:</span> {post.practiceData.condition}
                      </div>
                    )}
                    {post.practiceData.menuItems && post.practiceData.menuItems.length > 0 && (
                      <div className="text-sm">
                        <span className="font-semibold">練習メニュー:</span>
                        <ul className="list-disc list-inside mt-1">
                          {post.practiceData.menuItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {post.practiceData.reflection && (
                      <div className="text-sm mt-2">
                        <span className="font-semibold">振り返り:</span> {post.practiceData.reflection}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                まだ練習記録がありません
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamDetail;