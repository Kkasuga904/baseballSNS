import React from 'react';
import { useAuth } from '../App';
import { useTeam } from '../contexts/TeamContext';

function SimpleTeamTest() {
  const { user } = useAuth();
  const { teams, teamMembers, getUserTeams } = useTeam();
  
  const testTeams = () => {
    console.log('=== シンプルテスト ===');
    console.log('1. User:', user);
    console.log('2. Teams:', teams);
    console.log('3. Members:', teamMembers);
    
    if (user) {
      const userTeams = getUserTeams(user);
      console.log('4. User teams:', userTeams);
    } else {
      console.log('4. No user logged in');
    }
  };
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>チーム状態テスト</h4>
      <p>ユーザー: {user?.email || '未ログイン'}</p>
      <p>チーム数: {teams.length}</p>
      <p>メンバー数: {teamMembers.length}</p>
      <p>所属チーム: {user ? getUserTeams(user).length : 0}</p>
      <button
        onClick={testTeams}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        コンソールに出力
      </button>
    </div>
  );
}

export default SimpleTeamTest;