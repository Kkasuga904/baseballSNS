import React from 'react';
import { useAuth } from '../App';
import { useTeam } from '../contexts/TeamContext';

function QuickDebug() {
  const { user } = useAuth();
  const { teams, teamMembers, getUserTeams } = useTeam();
  
  const handleLog = () => {
    console.log('=== デバッグ情報 ===');
    console.log('現在のユーザー:', {
      id: user?.id,
      email: user?.email,
      identifier: user?.id || user?.email
    });
    console.log('全チーム:', teams);
    console.log('全メンバーシップ:', teamMembers);
    console.log('ユーザーの所属チーム:', getUserTeams());
    
    // LocalStorageの生データを確認
    const lsTeams = localStorage.getItem('baseballSNS_teams');
    const lsMembers = localStorage.getItem('baseballSNS_teamMembers');
    console.log('LocalStorage teams (raw):', lsTeams);
    console.log('LocalStorage members (raw):', lsMembers);
    
    // パース後のデータ
    if (lsTeams) {
      console.log('LocalStorage teams (parsed):', JSON.parse(lsTeams));
    }
    if (lsMembers) {
      console.log('LocalStorage members (parsed):', JSON.parse(lsMembers));
    }
    
    // 現在のユーザーのメンバーシップを検索
    const userIdentifier = user?.id || user?.email;
    const userMemberships = teamMembers.filter(m => 
      m.userId === userIdentifier || 
      m.userId === user?.id || 
      m.userId === user?.email
    );
    console.log('ユーザーのメンバーシップ:', userMemberships);
  };

  return (
    <button
      onClick={handleLog}
      style={{
        position: 'fixed',
        bottom: '70px',
        left: '20px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 9999
      }}
    >
      🐛 デバッグログ
    </button>
  );
}

export default QuickDebug;