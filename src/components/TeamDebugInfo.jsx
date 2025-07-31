import React from 'react';
import { useTeam } from '../contexts/TeamContext';
import { useAuth } from '../App';
import { resetAndSetupDemoTeam } from '../utils/demoTeamSetup';

function TeamDebugInfo() {
  const { user } = useAuth();
  const { teams, teamMembers, getUserTeams } = useTeam();
  
  const userTeams = getUserTeams();
  
  // デバッグ情報を整形
  const userIdentifier = user?.id || user?.email || 'Not logged in';
  
  const debugInfo = {
    currentUser: user ? {
      id: user.id,
      email: user.email,
      identifier: userIdentifier
    } : 'Not logged in',
    allTeams: teams.map(t => ({
      id: t.id,
      name: t.name
    })),
    allMembers: teamMembers.map(m => ({
      teamId: m.teamId,
      userId: m.userId,
      role: m.role
    })),
    userMemberships: teamMembers.filter(m => 
      m.userId === userIdentifier
    ),
    matchingLogic: {
      userIdentifier: userIdentifier,
      membersChecked: teamMembers.map(m => ({
        userId: m.userId,
        matches: m.userId === userIdentifier
      }))
    },
    userTeams: userTeams
  };
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      zIndex: 9999
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>🐛 Debug Info</h4>
      <pre style={{ margin: 0 }}>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <button
        onClick={() => {
          console.log('Full debug info:', debugInfo);
          console.log('LocalStorage teams:', localStorage.getItem('baseballSNS_teams'));
          console.log('LocalStorage members:', localStorage.getItem('baseballSNS_teamMembers'));
        }}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          backgroundColor: '#2e7d46',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Log to Console
      </button>
      <button
        onClick={() => {
          if (confirm('デモチームをリセットして再セットアップしますか？')) {
            resetAndSetupDemoTeam();
            window.location.reload();
          }
        }}
        style={{
          marginTop: '5px',
          marginLeft: '5px',
          padding: '5px 10px',
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reset Demo Team
      </button>
    </div>
  );
}

export default TeamDebugInfo;