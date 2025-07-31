import React from 'react';

function CheckDemoTeam() {
  const checkDemoTeam = () => {
    console.log('=== デモチーム確認 ===');
    
    // LocalStorageからチーム情報を取得
    const teams = JSON.parse(localStorage.getItem('baseballSNS_teams') || '[]');
    const members = JSON.parse(localStorage.getItem('baseballSNS_teamMembers') || '[]');
    
    console.log('全チーム:', teams);
    console.log('全メンバー:', members);
    
    // デモチームを検索
    const demoTeam = teams.find(t => t.id === 'demo-team-001');
    if (demoTeam) {
      console.log('デモチーム発見:', demoTeam);
      
      // デモチームのメンバーを検索
      const demoTeamMembers = members.filter(m => m.teamId === 'demo-team-001');
      console.log('デモチームのメンバー:', demoTeamMembers);
    } else {
      console.log('デモチームが見つかりません！');
    }
    
    // 現在のユーザー
    const currentUser = JSON.parse(localStorage.getItem('baseballSNSUser') || 'null');
    console.log('現在のユーザー:', currentUser);
    
    if (currentUser) {
      const userMemberships = members.filter(m => 
        m.userId === currentUser.email || 
        m.userId === currentUser.id ||
        m.userId === 'demo_user' ||
        m.userId === 'demo@baseball-sns.com'
      );
      console.log('現在のユーザーのメンバーシップ:', userMemberships);
    }
  };
  
  return (
    <button
      onClick={checkDemoTeam}
      style={{
        position: 'fixed',
        bottom: '220px',
        left: '20px',
        padding: '10px 20px',
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 9999
      }}
    >
      🔍 デモチーム確認
    </button>
  );
}

export default CheckDemoTeam;