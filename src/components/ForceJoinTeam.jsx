import React from 'react';
import { useAuth } from '../App';
import { useTeam } from '../contexts/TeamContext';

function ForceJoinTeam() {
  const { user } = useAuth();
  const { teams, teamMembers } = useTeam();
  
  const handleForceJoin = () => {
    if (!user) {
      alert('ログインしてください');
      return;
    }
    
    // 現在のユーザー情報
    const userIdentifier = user.email || user.id;
    console.log('Current user:', { id: user.id, email: user.email, identifier: userIdentifier });
    console.log('Current teams from context:', teams);
    console.log('Current members from context:', teamMembers);
    
    // 既存のメンバーシップを取得
    const existingMembers = JSON.parse(localStorage.getItem('baseballSNS_teamMembers') || '[]');
    console.log('Existing members:', existingMembers);
    
    // demo_userとdemo@baseball-sns.comの両方をチェック
    const possibleUserIds = ['demo_user', 'demo@baseball-sns.com', user.id, user.email, userIdentifier];
    const alreadyMember = existingMembers.some(
      m => m.teamId === 'demo-team-001' && possibleUserIds.includes(m.userId)
    );
    
    if (alreadyMember) {
      // 既存のメンバーシップを削除して再作成
      console.log('Removing existing membership and recreating...');
      const filteredMembers = existingMembers.filter(
        m => !(m.teamId === 'demo-team-001' && possibleUserIds.includes(m.userId))
      );
      localStorage.setItem('baseballSNS_teamMembers', JSON.stringify(filteredMembers));
    }
    
    // 現在のメンバーシップを再取得（削除後）
    const currentMembers = JSON.parse(localStorage.getItem('baseballSNS_teamMembers') || '[]');
    
    // 新しいメンバーシップを追加（emailを使用）
    const newMember = {
      id: `force-${Date.now()}`,
      teamId: 'demo-team-001',
      userId: user.email || userIdentifier, // emailを優先
      role: 'player',
      joinedAt: new Date().toISOString()
    };
    
    const updatedMembers = [...currentMembers, newMember];
    localStorage.setItem('baseballSNS_teamMembers', JSON.stringify(updatedMembers));
    
    console.log('Added member:', newMember);
    console.log('Updated members:', updatedMembers);
    console.log('User email used:', user.email);
    
    alert(`チームに強制参加しました！\nユーザーID: ${newMember.userId}`);
    window.location.reload();
  };
  
  return (
    <button
      onClick={handleForceJoin}
      style={{
        position: 'fixed',
        bottom: '120px',
        left: '20px',
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 9999
      }}
    >
      💪 強制参加（デモチーム）
    </button>
  );
}

export default ForceJoinTeam;