import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useTeam } from '../contexts/TeamContext';
import TeamManagement from '../components/TeamManagement';
import { TeamRoleLabels } from '../models/team';
import './Teams.css';

function Teams() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getUserTeams, teams, searchTeams } = useTeam();
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // ユーザーの所属チーム
  const userTeams = user ? getUserTeams(user) : [];
  
  // 検索結果
  const searchResults = searchQuery ? searchTeams(searchQuery) : [];
  
  // 表示するチーム（検索中は検索結果、それ以外は全チーム）
  const displayTeams = searchQuery ? searchResults : teams;
  
  return (
    <div className="teams-page">
      <div className="teams-header">
        <h2>🏟️ チーム</h2>
        <button
          onClick={() => {
            console.log('チーム作成・参加ボタンがクリックされました');
            setShowTeamManagement(true);
          }}
          className="btn-primary"
        >
          チーム作成・参加
        </button>
      </div>
      
      {/* 検索バー */}
      <div className="teams-search">
        <input
          type="text"
          placeholder="チーム名で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      
      {/* 所属チーム */}
      {userTeams.length > 0 && (
        <div className="teams-section">
          <h3>所属チーム</h3>
          <div className="teams-grid">
            {userTeams.map((teamData) => (
              <div
                key={teamData.id}
                className="team-card my-team"
                onClick={() => navigate(`/team/${teamData.id}`)}
              >
                <div className="team-card-header">
                  <h4>{teamData.name}</h4>
                  <span className="team-role">
                    {TeamRoleLabels[teamData.membership.role]}
                  </span>
                </div>
                {teamData.description && (
                  <p className="team-description">{teamData.description}</p>
                )}
                <div className="team-meta">
                  <span>招待コード: {teamData.inviteCode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 全チーム一覧 */}
      <div className="teams-section">
        <h3>{searchQuery ? '検索結果' : 'すべてのチーム'}</h3>
        {displayTeams.length > 0 ? (
          <div className="teams-grid">
            {displayTeams.map((team) => {
              const isMember = userTeams.some(t => t.id === team.id);
              return (
                <div
                  key={team.id}
                  className={`team-card ${isMember ? 'is-member' : ''}`}
                  onClick={() => navigate(`/team/${team.id}`)}
                >
                  <div className="team-card-header">
                    <h4>{team.name}</h4>
                    {isMember && <span className="member-badge">所属中</span>}
                  </div>
                  {team.description && (
                    <p className="team-description">{team.description}</p>
                  )}
                  <div className="team-meta">
                    <span>招待コード: {team.inviteCode}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-teams">
            <p>{searchQuery ? '検索結果がありません' : 'チームがまだありません'}</p>
            {!searchQuery && (
              <button
                onClick={() => setShowTeamManagement(true)}
                className="btn-secondary"
              >
                最初のチームを作成
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* チーム管理モーダル */}
      {showTeamManagement && (
        <TeamManagement
          onClose={() => setShowTeamManagement(false)}
          onTeamCreated={(newTeam) => {
            setShowTeamManagement(false);
            // 成功メッセージを表示
            alert(`チーム「${newTeam.name}」を作成しました！\n招待コード: ${newTeam.inviteCode}`);
            // チーム一覧を更新
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }}
        />
      )}
    </div>
  );
}

export default Teams;