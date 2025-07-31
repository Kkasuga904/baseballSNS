import React from 'react';
import { useAuth } from '../App';
import { useTeam } from '../contexts/TeamContext';

function SyncTeamData() {
  const { user } = useAuth();
  const { forceReload } = useTeam();
  
  const syncTeamData = () => {
    if (!user) {
      alert('ログインしてください');
      return;
    }
    
    console.log('=== チームデータ同期開始 ===');
    console.log('現在のユーザー:', user);
    
    // 1. 現在のlocalStorageの状態を確認
    const teams = JSON.parse(localStorage.getItem('baseballSNS_teams') || '[]');
    const members = JSON.parse(localStorage.getItem('baseballSNS_teamMembers') || '[]');
    
    console.log('LocalStorage teams:', teams);
    console.log('LocalStorage members:', members);
    
    // 2. デモチームの存在確認
    const demoTeam = teams.find(t => t.id === 'demo-team-001');
    if (!demoTeam) {
      console.log('デモチームが見つかりません');
      alert('デモチームが見つかりません。先にデモチームを作成してください。');
      return;
    }
    
    // 3. 現在のユーザーのメンバーシップ確認
    const userMemberships = members.filter(m => 
      m.userId === user.email || 
      m.userId === user.id ||
      m.userId === 'demo@baseball-sns.com'
    );
    
    console.log('ユーザーのメンバーシップ:', userMemberships);
    
    if (userMemberships.length === 0) {
      console.log('メンバーシップが見つかりません。追加します。');
      
      // メンバーシップを追加
      const newMember = {
        id: `sync-${Date.now()}`,
        teamId: 'demo-team-001',
        userId: user.email || user.id,
        role: 'player',
        joinedAt: new Date().toISOString()
      };
      
      const updatedMembers = [...members, newMember];
      localStorage.setItem('baseballSNS_teamMembers', JSON.stringify(updatedMembers));
      console.log('メンバーシップを追加しました:', newMember);
    }
    
    // 4. TeamContextを強制リロード
    console.log('TeamContextを再読み込みします...');
    forceReload();
    
    // 5. 少し待ってから画面を更新
    setTimeout(() => {
      console.log('画面を更新します...');
      window.location.reload();
    }, 500);
  };
  
  return (
    <button
      onClick={syncTeamData}
      style={{
        position: 'fixed',
        bottom: '320px',
        left: '20px',
        padding: '10px 20px',
        backgroundColor: '#ffc107',
        color: '#000',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 9999
      }}
    >
      🔄 チームデータ同期
    </button>
  );
}

export default SyncTeamData;