import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Team, TeamMember, TeamRoles } from '../models/team';

const TeamContext = createContext();

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within TeamProvider');
  }
  return context;
};

// ローカルストレージのキー
const TEAMS_KEY = 'baseballSNS_teams';
const TEAM_MEMBERS_KEY = 'baseballSNS_teamMembers';

export function TeamProvider({ children }) {
  const { user } = useAuth();
  
  // 初期状態でlocalStorageからデータを読み込む
  const [teams, setTeams] = useState(() => {
    const stored = localStorage.getItem(TEAMS_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  
  const [teamMembers, setTeamMembers] = useState(() => {
    const stored = localStorage.getItem(TEAM_MEMBERS_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);

  // ローカルストレージから読み込み
  const loadTeamsFromStorage = useCallback(() => {
    const storedTeams = localStorage.getItem(TEAMS_KEY);
    console.log('[TeamContext] Loading teams from storage:', storedTeams);
    if (storedTeams) {
      const parsed = JSON.parse(storedTeams);
      console.log('[TeamContext] Parsed teams:', parsed);
      setTeams(parsed);
    }
  }, []);

  const loadTeamMembersFromStorage = useCallback(() => {
    const storedMembers = localStorage.getItem(TEAM_MEMBERS_KEY);
    console.log('[TeamContext] Loading members from storage:', storedMembers);
    if (storedMembers) {
      const parsed = JSON.parse(storedMembers);
      console.log('[TeamContext] Parsed members:', parsed);
      setTeamMembers(parsed);
    }
  }, []);
  
  // 強制的にlocalStorageから再読み込み
  const forceReload = useCallback(() => {
    console.log('[TeamContext] Force reloading from localStorage...');
    loadTeamsFromStorage();
    loadTeamMembersFromStorage();
  }, [loadTeamsFromStorage, loadTeamMembersFromStorage]);
  
  // デバッグ用ログ（初回のみ）
  useEffect(() => {
    console.log('[TeamContext] Initial user:', user);
  }, []);
  
  // localStorageの変更を監視
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('[TeamContext] Storage changed, reloading...');
      loadTeamsFromStorage();
      loadTeamMembersFromStorage();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadTeamsFromStorage, loadTeamMembersFromStorage]);

  // ローカルストレージに保存
  const saveTeamsToStorage = (teamsData) => {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teamsData));
  };

  const saveTeamMembersToStorage = (membersData) => {
    localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(membersData));
  };

  // 招待コード生成
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // チーム作成
  const createTeam = useCallback(async (teamData) => {
    if (!user) {
      throw new Error('ログインが必要です');
    }

    setLoading(true);
    try {
      // user.email を優先的に使用（統一性のため）
      const userIdentifier = user.email || user.id;
      const newTeam = {
        ...Team,
        ...teamData,
        id: Date.now().toString(),
        createdBy: userIdentifier,
        createdAt: new Date().toISOString(),
        inviteCode: generateInviteCode()
      };

      const newTeams = [...teams, newTeam];
      setTeams(newTeams);
      saveTeamsToStorage(newTeams);

      // 作成者を監督として追加
      const newMember = {
        id: Date.now().toString(),
        teamId: newTeam.id,
        userId: userIdentifier,
        role: TeamRoles.MANAGER,
        joinedAt: new Date().toISOString()
      };

      const newMembers = [...teamMembers, newMember];
      setTeamMembers(newMembers);
      saveTeamMembersToStorage(newMembers);

      return newTeam;
    } finally {
      setLoading(false);
    }
  }, [user, teams, teamMembers]);

  // チーム参加
  const joinTeam = useCallback(async (inviteCode, role = TeamRoles.PLAYER) => {
    if (!user) {
      throw new Error('ログインが必要です');
    }

    setLoading(true);
    try {
      const team = teams.find(t => t.inviteCode === inviteCode);
      if (!team) {
        throw new Error('無効な招待コードです');
      }

      // すでに参加しているかチェック
      const userIdentifier = user.email || user.id;
      const existingMember = teamMembers.find(
        m => m.teamId === team.id && 
        (m.userId === userIdentifier || m.userId === user.id || m.userId === user.email)
      );
      if (existingMember) {
        throw new Error('すでにこのチームに参加しています');
      }

      const newMember = {
        id: Date.now().toString(),
        teamId: team.id,
        userId: userIdentifier,
        role: role,
        joinedAt: new Date().toISOString()
      };

      const newMembers = [...teamMembers, newMember];
      setTeamMembers(newMembers);
      saveTeamMembersToStorage(newMembers);

      return team;
    } finally {
      setLoading(false);
    }
  }, [user, teams, teamMembers]);

  // チーム更新
  const updateTeam = useCallback(async (teamId, updates) => {
    setLoading(true);
    try {
      const newTeams = teams.map(team =>
        team.id === teamId
          ? { ...team, ...updates }
          : team
      );
      setTeams(newTeams);
      saveTeamsToStorage(newTeams);
      return newTeams.find(t => t.id === teamId);
    } finally {
      setLoading(false);
    }
  }, [teams]);

  // Wiki更新
  const updateTeamWiki = useCallback(async (teamId, wikiText) => {
    return updateTeam(teamId, { wikiText });
  }, [updateTeam]);

  // ユーザーの所属チーム取得
  const getUserTeams = useCallback((overrideUser = null) => {
    const currentUser = overrideUser || user;
    
    if (!currentUser) {
      return [];
    }
    
    if (!currentUser.email && !currentUser.id) {
      return [];
    }
    
    // user.email を優先的に使用（実際の保存で使われているため）
    const userIdentifier = currentUser.email || currentUser.id;
    
    // すべての可能性のあるIDでフィルター（nullやundefinedを除外）
    const possibleIds = [currentUser.email, currentUser.id, 'demo_user', 'demo@baseball-sns.com'].filter(id => id);
    const userMemberships = teamMembers.filter(m => 
      m && m.userId && possibleIds.includes(m.userId)
    );
    
    const result = userMemberships.map(membership => {
      const team = teams.find(t => t.id === membership.teamId);
      return team ? {
        ...team,
        membership
      } : null;
    }).filter(t => t); // null を除外
    
    return result;
  }, [user, teams, teamMembers]);

  // チーム取得
  const getTeamById = useCallback((teamId) => {
    return teams.find(t => t.id === teamId);
  }, [teams]);

  // チームメンバー取得
  const getTeamMembers = useCallback((teamId) => {
    return teamMembers.filter(m => m.teamId === teamId);
  }, [teamMembers]);

  // ユーザーのチームでの役割を取得
  const getUserRoleInTeam = useCallback((teamId) => {
    if (!user) return null;
    const userIdentifier = user.email || user.id;
    const membership = teamMembers.find(
      m => m.teamId === teamId && 
      (m.userId === userIdentifier || m.userId === user.id || m.userId === user.email)
    );
    return membership?.role || null;
  }, [user, teamMembers]);

  // チーム検索
  const searchTeams = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return teams.filter(team => 
      team.name.toLowerCase().includes(lowerQuery) ||
      team.description.toLowerCase().includes(lowerQuery)
    );
  }, [teams]);

  // メンバーロール更新
  const updateMemberRole = useCallback(async (teamId, userId, newRole) => {
    setLoading(true);
    try {
      const newMembers = teamMembers.map(member =>
        member.teamId === teamId && member.userId === userId
          ? { ...member, role: newRole }
          : member
      );
      setTeamMembers(newMembers);
      saveTeamMembersToStorage(newMembers);
    } finally {
      setLoading(false);
    }
  }, [teamMembers]);

  // チーム脱退
  const leaveTeam = useCallback(async (teamId) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userIdentifier = user.email || user.id;
      const newMembers = teamMembers.filter(
        m => !(m.teamId === teamId && 
          (m.userId === userIdentifier || m.userId === user.id || m.userId === user.email))
      );
      setTeamMembers(newMembers);
      saveTeamMembersToStorage(newMembers);
    } finally {
      setLoading(false);
    }
  }, [user, teamMembers]);

  const value = {
    teams,
    teamMembers,
    loading,
    isInitialized,
    createTeam,
    joinTeam,
    updateTeam,
    updateTeamWiki,
    getUserTeams,
    getTeamById,
    getTeamMembers,
    getUserRoleInTeam,
    searchTeams,
    updateMemberRole,
    leaveTeam,
    forceReload
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}