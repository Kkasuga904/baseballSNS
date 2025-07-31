import React from 'react';

function ClearDataButton() {
  const handleClearAll = () => {
    if (confirm('すべてのデータをクリアしますか？この操作は取り消せません。')) {
      // LocalStorageから全てのデータを削除
      const keysToRemove = [
        'baseballSNSPosts',
        'baseballSNS_teams', 
        'baseballSNS_teamMembers',
        'baseballSNSMyPageData_demo@baseball-sns.com',
        'baseballSNSMyPageData_guest',
        'baseballSNSProfile_demo@baseball-sns.com',
        'baseballSNSProfile_guest'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // または全削除（注意：他のアプリのデータも消える）
      // localStorage.clear();
      
      alert('データをクリアしました。ページをリロードします。');
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleClearAll}
      style={{
        position: 'fixed',
        bottom: '20px',
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
      🗑️ 全データクリア
    </button>
  );
}

export default ClearDataButton;