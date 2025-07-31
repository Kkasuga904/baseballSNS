// デモチーム「新神田ウイングス」のセットアップ

export const setupDemoTeam = () => {
  // チームデータ
  const demoTeam = {
    id: 'demo-team-001',
    name: '新神田ウイングス',
    description: '東京都千代田区を拠点に活動する社会人野球チーム',
    createdBy: 'demo-user-001',
    createdAt: new Date('2024-01-01').toISOString(),
    inviteCode: 'WINGS001',
    wikiText: `【チーム戦術メモ】

◆ 攻撃サイン
- タッチサイン：右耳 → 盗塁
- タッチサイン：左肩 → バント
- タッチサイン：帽子 → ヒットエンドラン

◆ 守備連携
- ランナー1塁：セカンドベースカバーは遊撃手
- ランナー2塁：センターが深めに守備位置
- ダブルプレー：4-6-3を基本とする

◆ 練習メニュー
月曜：バッティング中心
水曜：守備練習・連携確認
土曜：実戦形式練習試合`
  };

  // メンバーデータ
  const demoMembers = [
    {
      id: 'member-001',
      teamId: 'demo-team-001',
      userId: 'nakajima-keisuke',
      userName: '中嶋啓介',
      role: 'manager',
      joinedAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 'member-002',
      teamId: 'demo-team-001',
      userId: 'nishida-keisuke',
      userName: '西田啓介',
      role: 'coach',
      joinedAt: new Date('2024-01-02').toISOString()
    },
    {
      id: 'member-003',
      teamId: 'demo-team-001',
      userId: 'nakagawa-tsubasa',
      userName: '中川翼',
      role: 'player',
      joinedAt: new Date('2024-01-03').toISOString()
    },
    {
      id: 'member-004',
      teamId: 'demo-team-001',
      userId: 'muroki-kairi',
      userName: '室木海里',
      role: 'player',
      joinedAt: new Date('2024-01-03').toISOString()
    },
    {
      id: 'member-005',
      teamId: 'demo-team-001',
      userId: 'shimizu-masaki',
      userName: '清水正樹',
      role: 'player',
      joinedAt: new Date('2024-01-04').toISOString()
    },
    {
      id: 'member-006',
      teamId: 'demo-team-001',
      userId: 'kimura-yuki',
      userName: '木村祐樹',
      role: 'player',
      joinedAt: new Date('2024-01-05').toISOString()
    }
  ];

  // デモ用の練習記録
  const demoPracticePosts = [
    {
      id: `demo-post-001-${Date.now()}`,
      type: 'practice',
      userId: 'nakagawa-tsubasa',
      author: '中川翼',
      timestamp: new Date('2024-12-20T10:00:00').toISOString(),
      practiceData: {
        date: '2024-12-20',
        condition: '絶好調',
        menuItems: ['バッティング練習 100球', 'ランニング 3km', '守備練習 30分'],
        reflection: '今日はバッティングの調子が良く、センター返しが安定していた。'
      },
      likes: 5,
      comments: 2
    },
    {
      id: `demo-post-002-${Date.now() + 1}`,
      type: 'practice',
      userId: 'muroki-kairi',
      author: '室木海里',
      timestamp: new Date('2024-12-19T15:00:00').toISOString(),
      practiceData: {
        date: '2024-12-19',
        condition: '普通',
        menuItems: ['ピッチング練習 50球', 'キャッチボール', '筋トレ'],
        reflection: 'カーブの制球が課題。明日は低めを意識して練習する。'
      },
      likes: 3,
      comments: 1
    },
    {
      id: `demo-post-003-${Date.now() + 2}`,
      type: 'practice',
      userId: 'shimizu-masaki',
      author: '清水正樹',
      timestamp: new Date('2024-12-18T18:00:00').toISOString(),
      practiceData: {
        date: '2024-12-18',
        condition: '好調',
        menuItems: ['素振り 200回', 'ティーバッティング', '外野守備練習'],
        reflection: 'フライの追い方が改善できた。背走からの切り返しがスムーズになった。'
      },
      likes: 4,
      comments: 0
    }
  ];

  // 既存のデータを取得
  const existingTeams = JSON.parse(localStorage.getItem('baseballSNS_teams') || '[]');
  const existingMembers = JSON.parse(localStorage.getItem('baseballSNS_teamMembers') || '[]');
  const existingPosts = JSON.parse(localStorage.getItem('baseballSNSPosts') || '[]');

  // デモチームが既に存在するかチェック
  const teamExists = existingTeams.some(team => team.id === 'demo-team-001');
  
  if (!teamExists) {
    // チームを追加
    localStorage.setItem('baseballSNS_teams', JSON.stringify([...existingTeams, demoTeam]));
    
    // メンバーを追加
    localStorage.setItem('baseballSNS_teamMembers', JSON.stringify([...existingMembers, ...demoMembers]));
    
    // 練習記録を追加
    localStorage.setItem('baseballSNSPosts', JSON.stringify([...existingPosts, ...demoPracticePosts]));
    
    console.log('デモチーム「新神田ウイングス」をセットアップしました！');
    return true;
  } else {
    console.log('デモチームは既に存在します。');
    return false;
  }
};

// 現在のユーザーをデモチームに参加させる
export const joinDemoTeam = (userId, role = 'player') => {
  const existingMembers = JSON.parse(localStorage.getItem('baseballSNS_teamMembers') || '[]');
  
  // 既に参加しているかチェック
  const alreadyMember = existingMembers.some(
    member => member.teamId === 'demo-team-001' && member.userId === userId
  );
  
  if (!alreadyMember) {
    const newMember = {
      id: `member-${Date.now()}`,
      teamId: 'demo-team-001',
      userId: userId,
      role: role,
      joinedAt: new Date().toISOString()
    };
    
    localStorage.setItem(
      'baseballSNS_teamMembers', 
      JSON.stringify([...existingMembers, newMember])
    );
    
    console.log(`ユーザー ${userId} をデモチームに追加しました！`);
    return true;
  }
  
  return false;
};

// デモユーザーをチームに追加
 export const addDemoUserToTeam = () => {
  const existingMembers = JSON.parse(localStorage.getItem('baseballSNS_teamMembers') || '[]');
  
  // デモユーザーのIDパターン（複数の可能性を考慮）
  const demoUserIds = ['demo_user', 'demo@baseball-sns.com'];
  
  // いずれかのIDで既にメンバーかチェック
  const demoUserInTeam = existingMembers.some(
    member => member.teamId === 'demo-team-001' && 
    demoUserIds.includes(member.userId)
  );
  
  if (!demoUserInTeam) {
    // demo@baseball-sns.com を使用（実際のデモアカウントのメールアドレス）
    const demoMember = {
      id: 'member-demo',
      teamId: 'demo-team-001',
      userId: 'demo@baseball-sns.com',
      role: 'player',
      joinedAt: new Date().toISOString()
    };
    
    localStorage.setItem(
      'baseballSNS_teamMembers', 
      JSON.stringify([...existingMembers, demoMember])
    );
    
    console.log('デモユーザー(demo@baseball-sns.com)をチームに追加しました！');
    return true;
  }
  
  return false;
};

// チームメンバーシップをリセットして再セットアップ
export const resetAndSetupDemoTeam = () => {
  // 既存のチームとメンバーをクリア
  localStorage.removeItem('baseballSNS_teams');
  localStorage.removeItem('baseballSNS_teamMembers');
  
  // 既存の投稿から古いデモ投稿を削除
  const existingPosts = JSON.parse(localStorage.getItem('baseballSNSPosts') || '[]');
  const filteredPosts = existingPosts.filter(post => 
    !post.id.startsWith('post-') && !post.id.startsWith('demo-post-')
  );
  localStorage.setItem('baseballSNSPosts', JSON.stringify(filteredPosts));
  
  // チームを再セットアップ
  setupDemoTeam();
  
  // デモユーザーを追加
  addDemoUserToTeam();
  
  console.log('デモチームをリセットして再セットアップしました！');
};