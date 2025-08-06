import React, { useRef, useEffect, useState } from 'react'
import './SimpleTextEditor.css'

function SimpleTextEditor({ content, onChange, placeholder }) {
  const editorRef = useRef(null)
  const [showToolbar, setShowToolbar] = useState(false)
  const [selection, setSelection] = useState(null)

  // コンテンツの初期化
  useEffect(() => {
    if (editorRef.current && content !== undefined) {
      // 現在の選択範囲を保存
      const currentSelection = window.getSelection()
      const range = currentSelection.rangeCount > 0 ? currentSelection.getRangeAt(0) : null
      
      // コンテンツを設定
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content || ''
      }
      
      // 選択範囲を復元
      if (range && editorRef.current.contains(range.startContainer)) {
        currentSelection.removeAllRanges()
        currentSelection.addRange(range)
      }
    }
  }, [content])

  // テキスト選択時の処理
  const handleSelection = () => {
    const selection = window.getSelection()
    if (selection.toString().length > 0) {
      setSelection(selection)
      setShowToolbar(true)
    } else {
      setShowToolbar(false)
    }
  }

  // フォーマット適用
  const applyFormat = (command, value = null) => {
    // 選択範囲を復元
    if (selection) {
      const currentSelection = window.getSelection()
      currentSelection.removeAllRanges()
      currentSelection.addRange(selection.getRangeAt(0))
    }
    
    document.execCommand(command, false, value)
    editorRef.current.focus()
    handleInput()
  }

  // インラインスタイル適用
  const applyInlineStyle = (style) => {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    
    if (selectedText) {
      // 選択されたテキストをspanで囲む
      const span = document.createElement('span')
      Object.assign(span.style, style)
      
      try {
        range.surroundContents(span)
      } catch (e) {
        // 複数の要素にまたがる場合
        const fragment = range.extractContents()
        span.appendChild(fragment)
        range.insertNode(span)
      }
      
      handleInput()
    }
  }

  // 見出し設定（選択部分のみ）
  const setHeading = (level) => {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    
    if (selectedText) {
      const heading = document.createElement(level === 0 ? 'span' : `h${level}`)
      heading.textContent = selectedText
      
      if (level === 0) {
        // 通常テキストに戻す
        heading.style.fontSize = '16px'
        heading.style.fontWeight = 'normal'
      }
      
      range.deleteContents()
      range.insertNode(heading)
      
      // 選択を解除
      selection.removeAllRanges()
      handleInput()
    }
  }

  // 入力処理
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // ペースト処理（書式を保持）
  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain')
    document.execCommand('insertHTML', false, text)
    handleInput()
  }

  return (
    <div className="simple-text-editor">
      {/* ツールバー */}
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            onClick={() => setHeading(1)}
            title="大見出し"
            className="toolbar-button"
          >
            <span className="text-size-large">A</span>
          </button>
          <button
            onClick={() => setHeading(2)}
            title="中見出し"
            className="toolbar-button"
          >
            <span className="text-size-medium">A</span>
          </button>
          <button
            onClick={() => setHeading(0)}
            title="標準"
            className="toolbar-button"
          >
            <span className="text-size-small">A</span>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => applyFormat('bold')}
            title="太字"
            className="toolbar-button"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => applyFormat('italic')}
            title="斜体"
            className="toolbar-button"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => applyFormat('underline')}
            title="下線"
            className="toolbar-button"
          >
            <u>U</u>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => applyFormat('insertUnorderedList')}
            title="箇条書き"
            className="toolbar-button"
          >
            •
          </button>
          <button
            onClick={() => applyFormat('insertOrderedList')}
            title="番号付きリスト"
            className="toolbar-button"
          >
            1.
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'
              input.onchange = (e) => {
                const file = e.target.files[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    const img = `<img src="${e.target.result}" style="max-width: 100%; height: auto;" />`
                    document.execCommand('insertHTML', false, img)
                    handleInput()
                  }
                  reader.readAsDataURL(file)
                }
              }
              input.click()
            }}
            title="画像を追加"
            className="toolbar-button"
          >
            🖼️
          </button>
        </div>
      </div>

      {/* エディタ本体 */}
      <div
        ref={editorRef}
        contentEditable
        className="editor-content"
        onInput={handleInput}
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
        onPaste={handlePaste}
        placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  )
}

export default SimpleTextEditor