// チーム関連のデータモデル

/**
 * チームモデル
 */
export const Team = {
  id: '',
  name: '',
  description: '',
  createdBy: '',
  createdAt: null,
  wikiText: '',
  inviteCode: ''
};

/**
 * チームメンバーシップモデル
 */
export const TeamMember = {
  id: '',
  teamId: '',
  userId: '',
  role: 'player', // 'player' | 'coach' | 'manager'
  joinedAt: null
};

/**
 * ロール定義
 */
export const TeamRoles = {
  PLAYER: 'player',
  COACH: 'coach',
  MANAGER: 'manager'
};

/**
 * ロール表示名
 */
export const TeamRoleLabels = {
  [TeamRoles.PLAYER]: '選手',
  [TeamRoles.COACH]: 'コーチ',
  [TeamRoles.MANAGER]: '監督'
};

/**
 * 権限チェック
 */
export const canEditTeam = (role) => {
  return role === TeamRoles.MANAGER || role === TeamRoles.COACH;
};

export const canViewMembersPractice = (role) => {
  return role === TeamRoles.MANAGER || role === TeamRoles.COACH;
};

export const canEditWiki = (role) => {
  return role === TeamRoles.MANAGER || role === TeamRoles.COACH;
};