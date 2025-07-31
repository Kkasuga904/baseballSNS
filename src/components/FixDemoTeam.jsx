import React from 'react';
import { useAuth } from '../App';

function FixDemoTeam() {
  const { user } = useAuth();
  
  const fixDemoTeam = () => {
    if (!user) {
      alert('ログインしてください');
      return;
    }
    
    console.log('=== デモチーム修正開始 ===');
    
    // 1. 既存のチームとメンバーを取得
    const teams = JSON.parse(localStorage.getItem('baseballSNS_teams') || '[]');
    const members = JSON.parse(localStorage.getItem('baseballSNS_teamMembers') || '[]');
    
    console.log('修正前のチーム:', teams);
    console.log('修正前のメンバー:', members);
    
    // 2. デモチームが存在しない場合は作成
    let demoTeam = teams.find(t => t.id === 'demo-team-001');
    if (!demoTeam) {
      demoTeam = {
        id: 'demo-team-001',
        name: '新神田ウイングス',
        description: '東京都千代田区を拠点に活動する社会人野球チーム',
        createdBy: 'demo-user-001',
        createdAt: new Date('2024-01-01').toISOString(),
        inviteCode: 'WINGS001',
        wikiText: 'チーム戦術メモ'
      };
      teams.push(demoTeam);
      localStorage.setItem('baseballSNS_teams', JSON.stringify(teams));
      console.log('デモチームを作成しました');
    }
    
    // 3. 現在のユーザーのメンバーシップを確実に追加
    // 全ての可能性のあるユーザーIDを削除
    const userIds = [
      user.email,
      user.id,
      'demo_user',
      'demo@baseball-sns.com'
    ].filter(id => id);
    
    const filteredMembers = members.filter(m => 
      !(m.teamId === 'demo-team-001' && userIds.includes(m.userId))
    );
    
    // 新しいメンバーシップを追加（必ずuser.emailを使用）
    const newMember = {
      id: `fixed-${Date.now()}`,
      teamId: 'demo-team-001',
      userId: user.email, // 確実にemailを使用
      role: 'player',
      joinedAt: new Date().toISOString()
    };
    
    const updatedMembers = [...filteredMembers, newMember];
    localStorage.setItem('baseballSNS_teamMembers', JSON.stringify(updatedMembers));
    
    console.log('追加したメンバー:', newMember);
    console.log('修正後のメンバー:', updatedMembers);
    
    // 4. TeamContextを強制的に再読み込み
    alert(`修正完了！\nユーザーID: ${user.email}\nページを再読み込みします。`);
    window.location.reload();
  };
  
  return (
    <button
      onClick={fixDemoTeam}
      style={{
        position: 'fixed',
        bottom: '270px',
        left: '20px',
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 9999
      }}
    >
      🔧 デモチーム修正
    </button>
  );
}

export default FixDemoTeam;