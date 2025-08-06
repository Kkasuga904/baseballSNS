// 自動保存フック
// 指定した間隔でデータを自動的に保存する

import { useEffect, useRef } from 'react'

/**
 * useAutoSave - データの自動保存を行うカスタムフック
 * 
 * @param {any} data - 保存するデータ
 * @param {Function} saveFunction - データを保存する関数
 * @param {number} delay - 保存間隔（ミリ秒）デフォルト: 3000ms（3秒）
 * @param {Array} dependencies - 追加の依存配列
 */
export function useAutoSave(data, saveFunction, delay = 3000, dependencies = []) {
  const timeoutRef = useRef(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // 初回レンダリング時はスキップ
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // 既存のタイマーをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 新しいタイマーを設定
    timeoutRef.current = setTimeout(() => {
      if (data !== null && data !== undefined) {
        saveFunction(data)
        console.log('Auto-saved at:', new Date().toLocaleTimeString())
      }
    }, delay)

    // クリーンアップ
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, saveFunction, delay, ...dependencies])

  // コンポーネントのアンマウント時に保存
  useEffect(() => {
    return () => {
      if (data !== null && data !== undefined) {
        saveFunction(data)
        console.log('Saved on unmount at:', new Date().toLocaleTimeString())
      }
    }
  }, [])

  // 手動保存関数を返す
  const save = () => {
    if (data !== null && data !== undefined) {
      saveFunction(data)
      console.log('Manually saved at:', new Date().toLocaleTimeString())
    }
  }

  return { save }
}

/**
 * useAutoSaveForm - フォームデータの自動保存フック
 * 
 * @param {string} formId - フォームの識別子（LocalStorageのキー）
 * @param {Object} formData - フォームデータ
 * @param {number} delay - 保存間隔（ミリ秒）
 */
export function useAutoSaveForm(formId, formData, delay = 2000) {
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem(`form_draft_${formId}`, JSON.stringify({
        data,
        savedAt: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Failed to auto-save form:', error)
    }
  }

  const { save } = useAutoSave(formData, saveToLocalStorage, delay)

  // 下書きデータの読み込み
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem(`form_draft_${formId}`)
      if (draft) {
        const parsed = JSON.parse(draft)
        return parsed.data
      }
    } catch (error) {
      console.error('Failed to load draft:', error)
    }
    return null
  }

  // 下書きデータの削除
  const clearDraft = () => {
    try {
      localStorage.removeItem(`form_draft_${formId}`)
    } catch (error) {
      console.error('Failed to clear draft:', error)
    }
  }

  return { save, loadDraft, clearDraft }
}

export default useAutoSave