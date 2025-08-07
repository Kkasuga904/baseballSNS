import React, { useRef, useEffect, useState } from 'react'
import './MobileTextEditor.css'

function MobileTextEditor({ content, onChange, placeholder }) {
  const editorRef = useRef(null)
  const [currentStyle, setCurrentStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    fontSize: 'normal'
  })
  const [cursorPosition, setCursorPosition] = useState(0)

  // コンテンツの初期化
  useEffect(() => {
    if (editorRef.current && content !== undefined) {
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content || ''
        // カーソル位置を最後に設定
        if (content) {
          const range = document.createRange()
          const sel = window.getSelection()
          range.selectNodeContents(editorRef.current)
          range.collapse(false)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    }
  }, [content])

  // カーソル位置の取得と保存
  const saveCursorPosition = () => {
    const sel = window.getSelection()
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      setCursorPosition(range.startOffset)
    }
  }

  // スタイルの適用（カーソル位置から入力される文字に適用）
  const toggleStyle = (styleType, value = null) => {
    const newStyle = { ...currentStyle }
    
    switch (styleType) {
      case 'bold':
        newStyle.bold = !newStyle.bold
        break
      case 'italic':
        newStyle.italic = !newStyle.italic
        break
      case 'underline':
        newStyle.underline = !newStyle.underline
        break
      case 'fontSize':
        newStyle.fontSize = value
        break
    }
    
    setCurrentStyle(newStyle)
    
    // フォーカスを戻す
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  // テキスト入力時の処理
  const handleInput = (e) => {
    if (editorRef.current) {
      // 入力された文字に現在のスタイルを適用
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        
        // 最後に入力された文字を取得
        if (e.inputType === 'insertText' || e.inputType === 'insertCompositionText') {
          // スタイルを適用する処理
          applyCurrentStyle()
        }
      }
      
      onChange(editorRef.current.innerHTML)
      saveCursorPosition()
    }
  }

  // 現在のスタイルを適用
  const applyCurrentStyle = () => {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return

    // スタイルコマンドを適用
    if (currentStyle.bold) {
      document.execCommand('bold', false, null)
    }
    if (currentStyle.italic) {
      document.execCommand('italic', false, null)
    }
    if (currentStyle.underline) {
      document.execCommand('underline', false, null)
    }
    
    // フォントサイズの適用
    if (currentStyle.fontSize !== 'normal') {
      const sizeMap = {
        'large': '7',
        'medium': '5',
        'small': '3'
      }
      document.execCommand('fontSize', false, sizeMap[currentStyle.fontSize])
    }
  }

  // リスト追加
  const insertList = (type) => {
    document.execCommand(type === 'bullet' ? 'insertUnorderedList' : 'insertOrderedList')
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
      editorRef.current.focus()
    }
  }

  // 画像追加
  const insertImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = `<img src="${e.target.result}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`
          document.execCommand('insertHTML', false, img)
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  // ペースト処理
  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div className="mobile-text-editor">
      {/* モバイル用ツールバー（キーボードの上に表示） */}
      <div className="mobile-toolbar">
        <div className="toolbar-scroll">
          <button
            className={`toolbar-btn ${currentStyle.fontSize === 'large' ? 'active' : ''}`}
            onClick={() => toggleStyle('fontSize', 'large')}
            type="button"
          >
            <span className="text-large">A</span>
          </button>
          <button
            className={`toolbar-btn ${currentStyle.fontSize === 'medium' ? 'active' : ''}`}
            onClick={() => toggleStyle('fontSize', 'medium')}
            type="button"
          >
            <span className="text-medium">A</span>
          </button>
          <button
            className={`toolbar-btn ${currentStyle.fontSize === 'normal' ? 'active' : ''}`}
            onClick={() => toggleStyle('fontSize', 'normal')}
            type="button"
          >
            <span className="text-normal">A</span>
          </button>
          
          <div className="toolbar-divider" />
          
          <button
            className={`toolbar-btn ${currentStyle.bold ? 'active' : ''}`}
            onClick={() => toggleStyle('bold')}
            type="button"
          >
            <strong>B</strong>
          </button>
          <button
            className={`toolbar-btn ${currentStyle.italic ? 'active' : ''}`}
            onClick={() => toggleStyle('italic')}
            type="button"
          >
            <em>I</em>
          </button>
          <button
            className={`toolbar-btn ${currentStyle.underline ? 'active' : ''}`}
            onClick={() => toggleStyle('underline')}
            type="button"
          >
            <u>U</u>
          </button>
          
          <div className="toolbar-divider" />
          
          <button
            className="toolbar-btn"
            onClick={() => insertList('bullet')}
            type="button"
          >
            •
          </button>
          <button
            className="toolbar-btn"
            onClick={() => insertList('number')}
            type="button"
          >
            1.
          </button>
          
          <div className="toolbar-divider" />
          
          <button
            className="toolbar-btn"
            onClick={insertImage}
            type="button"
          >
            📷
          </button>
        </div>
      </div>

      {/* エディタ本体 */}
      <div
        ref={editorRef}
        contentEditable
        className="mobile-editor-content"
        onInput={handleInput}
        onFocus={saveCursorPosition}
        onClick={saveCursorPosition}
        onKeyUp={saveCursorPosition}
        onPaste={handlePaste}
        placeholder={placeholder}
        suppressContentEditableWarning={true}
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  )
}

export default MobileTextEditor