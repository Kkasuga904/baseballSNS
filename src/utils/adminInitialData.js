/**
 * 管理人アカウント用の初期データ設定
 */

// チームデータ
export const adminTeams = [
  {
    id: 'team-shinkanda-wings',
    name: '新神田ウイングス',
    description: '東京都千代田区を拠点とする社会人野球チーム',
    inviteCode: 'WINGS123',
    createdBy: 'over9131120@gmail.com',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'team-takaoka-jhs',
    name: '高岡中学校',
    description: '石川県金沢市の中学校野球部',
    inviteCode: 'TAKAOKA1',
    createdBy: 'over9131120@gmail.com',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'team-kincho-baseball',
    name: '錦丘野球部',
    description: '石川県立錦丘高等学校野球部',
    inviteCode: 'KINCHO01',
    createdBy: 'over9131120@gmail.com',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'team-seiryo-univ',
    name: '星稜大野球部',
    description: '金沢星稜大学硬式野球部',
    inviteCode: 'SEIRYO01',
    createdBy: 'over9131120@gmail.com',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// チームメンバーシップデータ
export const adminTeamMembers = [
  {
    id: 'member-1',
    teamId: 'team-shinkanda-wings',
    userId: 'over9131120@gmail.com',
    role: 'manager',
    joinedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'member-2',
    teamId: 'team-takaoka-jhs',
    userId: 'over9131120@gmail.com',
    role: 'coach',
    joinedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'member-3',
    teamId: 'team-kincho-baseball',
    userId: 'over9131120@gmail.com',
    role: 'coach',
    joinedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'member-4',
    teamId: 'team-seiryo-univ',
    userId: 'over9131120@gmail.com',
    role: 'coach',
    joinedAt: '2024-01-01T00:00:00.000Z'
  }
];

/**
 * 管理人アカウントの初期データをLocalStorageに設定
 */
export function initializeAdminData() {
  const TEAMS_KEY = 'baseballSNS_teams';
  const TEAM_MEMBERS_KEY = 'baseballSNS_teamMembers';
  
  // 既存のチームデータを取得
  const existingTeams = JSON.parse(localStorage.getItem(TEAMS_KEY) || '[]');
  const existingMembers = JSON.parse(localStorage.getItem(TEAM_MEMBERS_KEY) || '[]');
  
  // 管理人のチームが既に存在するかチェック
  const adminTeamIds = adminTeams.map(t => t.id);
  const hasAdminTeams = existingTeams.some(team => adminTeamIds.includes(team.id));
  
  if (!hasAdminTeams) {
    // 管理人のチームを追加
    const updatedTeams = [...existingTeams, ...adminTeams];
    const updatedMembers = [...existingMembers, ...adminTeamMembers];
    
    localStorage.setItem(TEAMS_KEY, JSON.stringify(updatedTeams));
    localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(updatedMembers));
    
    console.log('管理人アカウントの初期チームデータを設定しました');
  }
}