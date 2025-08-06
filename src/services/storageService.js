// ローカルストレージを使用したデータ永続化サービス

const STORAGE_KEYS = {
  DIARIES: 'baseball_sns_diaries',
  PRACTICE_RECORDS: 'baseball_sns_practice_records',
  USER_DATA: 'baseball_sns_user_data',
  AUTH_USER: 'baseball_sns_auth_user'
}

class StorageService {
  // 日記データの保存
  saveDiaries(diaries) {
    try {
      const currentUser = this.getCurrentUser()
      const key = currentUser ? `${STORAGE_KEYS.DIARIES}_${currentUser.id}` : STORAGE_KEYS.DIARIES
      localStorage.setItem(key, JSON.stringify(diaries))
      return true
    } catch (error) {
      console.error('Error saving diaries:', error)
      return false
    }
  }

  // 日記データの読み込み
  loadDiaries() {
    try {
      const currentUser = this.getCurrentUser()
      const key = currentUser ? `${STORAGE_KEYS.DIARIES}_${currentUser.id}` : STORAGE_KEYS.DIARIES
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading diaries:', error)
      return []
    }
  }

  // 単一の日記を保存
  saveDiary(diary) {
    const diaries = this.loadDiaries()
    const existingIndex = diaries.findIndex(d => d.id === diary.id)
    
    if (existingIndex >= 0) {
      diaries[existingIndex] = diary
    } else {
      diaries.push(diary)
    }
    
    return this.saveDiaries(diaries)
  }

  // 日記の削除
  deleteDiary(diaryId) {
    const diaries = this.loadDiaries()
    const filteredDiaries = diaries.filter(d => d.id !== diaryId)
    return this.saveDiaries(filteredDiaries)
  }

  // 練習記録の保存
  savePracticeRecords(records) {
    try {
      const currentUser = this.getCurrentUser()
      const key = currentUser ? `${STORAGE_KEYS.PRACTICE_RECORDS}_${currentUser.id}` : STORAGE_KEYS.PRACTICE_RECORDS
      localStorage.setItem(key, JSON.stringify(records))
      return true
    } catch (error) {
      console.error('Error saving practice records:', error)
      return false
    }
  }

  // 練習記録の読み込み
  loadPracticeRecords() {
    try {
      const currentUser = this.getCurrentUser()
      const key = currentUser ? `${STORAGE_KEYS.PRACTICE_RECORDS}_${currentUser.id}` : STORAGE_KEYS.PRACTICE_RECORDS
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Error loading practice records:', error)
      return {}
    }
  }

  // 特定の日付の練習記録を保存
  savePracticeRecord(date, record) {
    const records = this.loadPracticeRecords()
    records[date] = record
    return this.savePracticeRecords(records)
  }

  // 特定の日付の練習記録を取得
  getPracticeRecord(date) {
    const records = this.loadPracticeRecords()
    return records[date] || null
  }

  // 現在のユーザー情報を取得
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.AUTH_USER)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  // ユーザー情報を保存
  saveCurrentUser(user) {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
      return true
    } catch (error) {
      console.error('Error saving current user:', error)
      return false
    }
  }

  // ユーザーデータの保存
  saveUserData(data) {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) return false
      
      const key = `${STORAGE_KEYS.USER_DATA}_${currentUser.id}`
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error saving user data:', error)
      return false
    }
  }

  // ユーザーデータの読み込み
  loadUserData() {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) return {}
      
      const key = `${STORAGE_KEYS.USER_DATA}_${currentUser.id}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Error loading user data:', error)
      return {}
    }
  }

  // すべてのデータをクリア
  clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach(baseKey => {
        // ベースキーと、ユーザー固有のキーを削除
        const keysToDelete = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith(baseKey)) {
            keysToDelete.push(key)
          }
        }
        keysToDelete.forEach(key => localStorage.removeItem(key))
      })
      return true
    } catch (error) {
      console.error('Error clearing all data:', error)
      return false
    }
  }

  // ユーザー固有のデータをクリア
  clearUserData() {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) return false
      
      const userKeys = [
        `${STORAGE_KEYS.DIARIES}_${currentUser.id}`,
        `${STORAGE_KEYS.PRACTICE_RECORDS}_${currentUser.id}`,
        `${STORAGE_KEYS.USER_DATA}_${currentUser.id}`
      ]
      
      userKeys.forEach(key => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error('Error clearing user data:', error)
      return false
    }
  }

  // データのエクスポート（バックアップ用）
  exportData() {
    try {
      const currentUser = this.getCurrentUser()
      const data = {
        diaries: this.loadDiaries(),
        practiceRecords: this.loadPracticeRecords(),
        userData: this.loadUserData(),
        exportDate: new Date().toISOString(),
        user: currentUser
      }
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Error exporting data:', error)
      return null
    }
  }

  // データのインポート（復元用）
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.diaries) {
        this.saveDiaries(data.diaries)
      }
      
      if (data.practiceRecords) {
        this.savePracticeRecords(data.practiceRecords)
      }
      
      if (data.userData) {
        this.saveUserData(data.userData)
      }
      
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }
}

// シングルトンインスタンスをエクスポート
const storageService = new StorageService()
export default storageService