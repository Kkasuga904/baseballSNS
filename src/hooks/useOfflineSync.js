import { useState, useEffect, useCallback } from 'react'

/**
 * オフライン同期フック
 * オフライン時のデータ保存と、オンライン復帰時の同期を管理
 */
export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingSync, setPendingSync] = useState([])
  
  useEffect(() => {
    // オンライン/オフライン状態の監視
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingData()
    }
    
    const handleOffline = () => {
      setIsOnline(false)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // 初期化時に保留中のデータをロード
    const saved = localStorage.getItem('baseballSNS_pendingSync')
    if (saved) {
      setPendingSync(JSON.parse(saved))
    }
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  /**
   * オフライン時のデータ保存
   */
  const saveOfflineData = useCallback((type, data) => {
    const syncItem = {
      id: Date.now(),
      type,
      data,
      timestamp: new Date().toISOString()
    }
    
    const newPending = [...pendingSync, syncItem]
    setPendingSync(newPending)
    localStorage.setItem('baseballSNS_pendingSync', JSON.stringify(newPending))
    
    // オフライン時でもローカルストレージには即座に保存
    switch (type) {
      case 'practice':
        const practices = JSON.parse(localStorage.getItem('baseballSNS_practices') || '[]')
        practices.push(data)
        localStorage.setItem('baseballSNS_practices', JSON.stringify(practices))
        break
      case 'game':
        const games = JSON.parse(localStorage.getItem('baseballSNS_games') || '[]')
        games.push(data)
        localStorage.setItem('baseballSNS_games', JSON.stringify(games))
        break
      case 'diary':
        const diaries = JSON.parse(localStorage.getItem('baseballSNS_diaries') || '[]')
        diaries.push(data)
        localStorage.setItem('baseballSNS_diaries', JSON.stringify(diaries))
        break
    }
    
    return syncItem
  }, [pendingSync])
  
  /**
   * オンライン復帰時のデータ同期
   */
  const syncPendingData = useCallback(async () => {
    if (pendingSync.length === 0) return
    
    console.log('[同期] 保留中のデータを同期中...', pendingSync.length, '件')
    
    const successfulIds = []
    
    for (const item of pendingSync) {
      try {
        // 実際のAPIコールはここで実装
        // 現在はローカルストレージのみの実装
        console.log('[同期] 成功:', item.type, item.id)
        successfulIds.push(item.id)
      } catch (error) {
        console.error('[同期] エラー:', item.type, error)
      }
    }
    
    // 成功したアイテムを削除
    const remaining = pendingSync.filter(item => !successfulIds.includes(item.id))
    setPendingSync(remaining)
    
    if (remaining.length === 0) {
      localStorage.removeItem('baseballSNS_pendingSync')
    } else {
      localStorage.setItem('baseballSNS_pendingSync', JSON.stringify(remaining))
    }
  }, [pendingSync])
  
  /**
   * オフライン対応のデータ保存
   */
  const saveData = useCallback((type, data) => {
    if (!isOnline) {
      // オフライン時は保留リストに追加
      return saveOfflineData(type, data)
    }
    
    // オンライン時は通常保存
    switch (type) {
      case 'practice':
        const practices = JSON.parse(localStorage.getItem('baseballSNS_practices') || '[]')
        practices.push(data)
        localStorage.setItem('baseballSNS_practices', JSON.stringify(practices))
        break
      case 'game':
        const games = JSON.parse(localStorage.getItem('baseballSNS_games') || '[]')
        games.push(data)
        localStorage.setItem('baseballSNS_games', JSON.stringify(games))
        break
      case 'diary':
        const diaries = JSON.parse(localStorage.getItem('baseballSNS_diaries') || '[]')
        diaries.push(data)
        localStorage.setItem('baseballSNS_diaries', JSON.stringify(diaries))
        break
    }
    
    return { id: Date.now(), type, data, synced: true }
  }, [isOnline, saveOfflineData])
  
  return {
    isOnline,
    pendingSync,
    saveData,
    syncPendingData
  }
}