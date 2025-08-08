import React, { useRef, useEffect, useState } from 'react'
import './MobileTextEditor.css'

function MobileTextEditor({ content, onChange, placeholder }) {
  const editorRef = useRef(null)
  const toolbarRef = useRef(null)
<<<<<<< HEAD
  const [inputStyles, setInputStyles] = useState({
=======
  const [currentStyle, setCurrentStyle] = useState({
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
    bold: false,
    italic: false,
    underline: false,
    fontSize: 'normal'
  })
<<<<<<< HEAD
  const [lastActiveStyle, setLastActiveStyle] = useState(null)
=======
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
  const [cursorPosition, setCursorPosition] = useState(0)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

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

  // キーボードの高さを検出してツールバー位置を調整
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height
        const windowHeight = window.innerHeight
        const keyboardHeight = windowHeight - viewportHeight
        
        if (toolbarRef.current) {
          if (keyboardHeight > 100) {
            // キーボードが表示されている
            toolbarRef.current.style.bottom = `${keyboardHeight}px`
          } else {
            // キーボードが非表示
            toolbarRef.current.style.bottom = '0'
          }
        }
      }
    }

    // Visual Viewport API を使用
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
      window.visualViewport.addEventListener('scroll', handleResize)
    }

    // フォーカス時にキーボードの高さを調整
    const handleFocus = () => {
      setTimeout(handleResize, 300)
    }

    const handleBlur = () => {
      if (toolbarRef.current) {
        toolbarRef.current.style.bottom = '0'
      }
    }

    if (editorRef.current) {
      editorRef.current.addEventListener('focus', handleFocus)
      editorRef.current.addEventListener('blur', handleBlur)
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
        window.visualViewport.removeEventListener('scroll', handleResize)
      }
      if (editorRef.current) {
        editorRef.current.removeEventListener('focus', handleFocus)
        editorRef.current.removeEventListener('blur', handleBlur)
      }
    }
  }, [])

  // カーソル位置の取得と保存
  const saveCursorPosition = () => {
    const sel = window.getSelection()
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      setCursorPosition(range.startOffset)
<<<<<<< HEAD
      // カーソル位置の推測で状態を上書きしない
    }
  }

  // スタイルの適用（選択テキストまたは新規入力に適用）
  const toggleStyle = (styleType, value = null) => {
    // 即座に状態を更新
    if (styleType === 'fontSize') {
      setInputStyles(prev => ({ ...prev, fontSize: value }))
    } else {
      setInputStyles(prev => ({ ...prev, [styleType]: !prev[styleType] }))
    }
    
    // フォーカスを戻してから処理を実行
    if (editorRef.current) {
      editorRef.current.focus()
      
      setTimeout(() => {
        if (!editorRef.current) return
        const selection = window.getSelection()
        
        if (styleType === 'fontSize') {
        
        // フォントサイズの変更
        const sizeStyles = {
          'large': { html: '<span style="font-size: 28px; font-weight: normal;">&#8203;</span>', size: '28px' },
          'medium': { html: '<span style="font-size: 22px; font-weight: normal;">&#8203;</span>', size: '22px' },
          'normal': { html: '<span style="font-size: 18px; font-weight: normal;">&#8203;</span>', size: '18px' }
        }
        
        if (selection.toString().length > 0) {
          // 選択されているテキストのサイズを変更
          const selectedText = selection.toString()
          const range = selection.getRangeAt(0)
          range.deleteContents()
          
          const span = document.createElement('span')
          span.style.fontSize = sizeStyles[value].size
          span.textContent = selectedText
          range.insertNode(span)
          
          // 選択を解除
          selection.removeAllRanges()
        } else {
          // 新しく入力するテキストのサイズを設定
          const sel = window.getSelection()
          
          // 現在のカーソル位置に新しいスパンを挿入
          if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0)
            
            // 現在のスパンから抜け出す
            const currentNode = range.startContainer
            const parentSpan = currentNode.nodeType === Node.TEXT_NODE 
              ? currentNode.parentElement 
              : currentNode
            
            // 新しいスパンを作成
            const newSpan = document.createElement('span')
            newSpan.style.fontSize = sizeStyles[value].size
            // 現在の太字状態を維持
            if (inputStyles.bold) {
              newSpan.style.fontWeight = 'bold'
            }
            newSpan.innerHTML = '&#8203;' // ゼロ幅スペース
            
            // 親要素がスパンの場合、その後に挿入
            if (parentSpan && parentSpan.tagName === 'SPAN') {
              // スパンの外側に新しいスパンを挿入
              if (parentSpan.nextSibling) {
                parentSpan.parentNode.insertBefore(newSpan, parentSpan.nextSibling)
              } else {
                parentSpan.parentNode.appendChild(newSpan)
              }
            } else {
              // そうでない場合は現在の位置に挿入
              range.insertNode(newSpan)
            }
            
            // カーソルを新しいスパン内に移動
            const newRange = document.createRange()
            newRange.selectNodeContents(newSpan)
            newRange.collapse(false)
            sel.removeAllRanges()
            sel.addRange(newRange)
          }
        }
        // fontSize の状態は既に更新済み
      } else {
        // 太字、斜体、下線の切り替え
        const commands = {
          'bold': 'bold',
          'italic': 'italic',
          'underline': 'underline'
        }
        
        const selection = window.getSelection()
        
        if (selection.toString().length > 0) {
          // テキストが選択されている場合は、選択範囲に適用
          document.execCommand(commands[styleType], false, null)
        } else {
          // テキストが選択されていない場合は、次の入力から適用
          const range = selection.getRangeAt(0)
          
          // 現在のノードを取得
          const currentNode = range.startContainer
          const parentElement = currentNode.nodeType === Node.TEXT_NODE 
            ? currentNode.parentElement 
            : currentNode
          
          // 新しいスパンを作成
          const span = document.createElement('span')
          
          // 現在のスタイルを継承
          if (parentElement && parentElement.tagName === 'SPAN') {
            // 既存のスパンのスタイルをコピー
            span.style.fontSize = parentElement.style.fontSize || '18px'
            span.style.fontWeight = parentElement.style.fontWeight || 'normal'
            span.style.fontStyle = parentElement.style.fontStyle || 'normal'
            span.style.textDecoration = parentElement.style.textDecoration || 'none'
          }
          
          // 新しいスタイルを適用/解除
          if (styleType === 'bold') {
            span.style.fontWeight = inputStyles.bold ? 'normal' : 'bold'
          } else if (styleType === 'italic') {
            span.style.fontStyle = inputStyles.italic ? 'normal' : 'italic'
          } else if (styleType === 'underline') {
            span.style.textDecoration = inputStyles.underline ? 'none' : 'underline'
          }
          
          span.innerHTML = '&#8203;' // ゼロ幅スペース
          
          // 親要素がスパンの場合、その後に挿入
          if (parentElement && parentElement.tagName === 'SPAN') {
            if (parentElement.nextSibling) {
              parentElement.parentNode.insertBefore(span, parentElement.nextSibling)
            } else {
              parentElement.parentNode.appendChild(span)
            }
          } else {
            range.insertNode(span)
          }
          
          // カーソルを新しいスパン内に移動
          const newRange = document.createRange()
          newRange.selectNodeContents(span)
          newRange.collapse(false)
          selection.removeAllRanges()
          selection.addRange(newRange)
        }
        
        // スタイルは既に更新済み
      }
      
      onChange(editorRef.current.innerHTML)
      }, 10) // setTimeout の終了
=======
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
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
    }
  }

  // テキスト入力時の処理
  const handleInput = (e) => {
    if (editorRef.current) {
<<<<<<< HEAD
      onChange(editorRef.current.innerHTML)
      saveCursorPosition()
      
      // Enterキーで改行した場合、現在のスタイルを維持
      if (e.inputType === 'insertParagraph' || e.inputType === 'insertLineBreak') {
        maintainStyleAfterLineBreak()
      }
      
      // 空のスパンタグをクリーンアップ
      const emptySpans = editorRef.current.querySelectorAll('span:empty')
      emptySpans.forEach(span => {
        if (span.innerHTML === '' || span.innerHTML === '&#8203;') {
          // カーソルが入っていない空のスパンは削除
          const selection = window.getSelection()
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            if (!span.contains(range.startContainer)) {
              span.remove()
            }
          }
        }
      })
    }
  }
  
  // 改行後もスタイルを維持
  const maintainStyleAfterLineBreak = () => {
    if (inputStyles.fontSize !== 'normal' || inputStyles.bold || inputStyles.italic || inputStyles.underline) {
      setTimeout(() => {
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          
          // 新しいスパンを作成してスタイルを適用
          const span = document.createElement('span')
          
          // 現在のスタイルを適用
          if (inputStyles.fontSize === 'large') {
            span.style.fontSize = '28px'
          } else if (inputStyles.fontSize === 'medium') {
            span.style.fontSize = '22px'
          }
          
          if (inputStyles.bold) {
            span.style.fontWeight = 'bold'
          }
          if (inputStyles.italic) {
            span.style.fontStyle = 'italic'
          }
          if (inputStyles.underline) {
            span.style.textDecoration = 'underline'
          }
          
          span.innerHTML = '&#8203;'
          range.insertNode(span)
          
          // カーソルをスパン内に移動
          const newRange = document.createRange()
          newRange.selectNodeContents(span)
          newRange.collapse(false)
          selection.removeAllRanges()
          selection.addRange(newRange)
        }
      }, 10)
=======
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
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
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
      <div className="mobile-toolbar" ref={toolbarRef}>
        <div className="toolbar-scroll">
          <button
<<<<<<< HEAD
            className={`toolbar-btn ${inputStyles.fontSize === 'large' ? 'active' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleStyle('fontSize', 'large')
            }}
=======
            className={`toolbar-btn ${currentStyle.fontSize === 'large' ? 'active' : ''}`}
            onClick={() => toggleStyle('fontSize', 'large')}
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
            type="button"
          >
            <span className="text-large">A</span>
          </button>
          <button
<<<<<<< HEAD
            className={`toolbar-btn ${inputStyles.fontSize === 'medium' ? 'active' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleStyle('fontSize', 'medium')
            }}
=======
            className={`toolbar-btn ${currentStyle.fontSize === 'medium' ? 'active' : ''}`}
            onClick={() => toggleStyle('fontSize', 'medium')}
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
            type="button"
          >
            <span className="text-medium">A</span>
          </button>
          <button
<<<<<<< HEAD
            className={`toolbar-btn ${inputStyles.fontSize === 'normal' ? 'active' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleStyle('fontSize', 'normal')
            }}
=======
            className={`toolbar-btn ${currentStyle.fontSize === 'normal' ? 'active' : ''}`}
            onClick={() => toggleStyle('fontSize', 'normal')}
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
            type="button"
          >
            <span className="text-normal">A</span>
          </button>
          
          <div className="toolbar-divider" />
          
          <button
<<<<<<< HEAD
            className={`toolbar-btn ${inputStyles.bold ? 'active' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleStyle('bold')
            }}
=======
            className={`toolbar-btn ${currentStyle.bold ? 'active' : ''}`}
            onClick={() => toggleStyle('bold')}
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
            type="button"
          >
            <strong>B</strong>
          </button>
          <button
<<<<<<< HEAD
            className={`toolbar-btn ${inputStyles.italic ? 'active' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleStyle('italic')
            }}
=======
            className={`toolbar-btn ${currentStyle.italic ? 'active' : ''}`}
            onClick={() => toggleStyle('italic')}
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
            type="button"
          >
            <em>I</em>
          </button>
          <button
<<<<<<< HEAD
            className={`toolbar-btn ${inputStyles.underline ? 'active' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleStyle('underline')
            }}
=======
            className={`toolbar-btn ${currentStyle.underline ? 'active' : ''}`}
            onClick={() => toggleStyle('underline')}
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
            type="button"
          >
            <u>U</u>
          </button>
          
          <div className="toolbar-divider" />
          
          <button
            className="toolbar-btn"
<<<<<<< HEAD
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              insertList('bullet')
            }}
=======
            onClick={() => insertList('bullet')}
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
            type="button"
          >
            •
          </button>
          <button
            className="toolbar-btn"
<<<<<<< HEAD
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              insertList('number')
            }}
=======
            onClick={() => insertList('number')}
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
            type="button"
          >
            1.
          </button>
          
          <div className="toolbar-divider" />
          
          <button
            className="toolbar-btn"
<<<<<<< HEAD
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              insertImage()
            }}
=======
            onClick={insertImage}
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
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
<<<<<<< HEAD
        onFocus={() => {
          saveCursorPosition()
          // フォーカス時にスタイルを更新
          setTimeout(saveCursorPosition, 10)
        }}
        onClick={() => {
          saveCursorPosition()
          // クリック時にもスタイルを更新
          setTimeout(saveCursorPosition, 10)
        }}
        onKeyUp={() => {
          saveCursorPosition()
          // キー入力後もスタイルを更新
          setTimeout(saveCursorPosition, 10)
        }}
        onKeyDown={(e) => {
          // Enterキーが押されたときの処理
          if (e.key === 'Enter') {
            e.preventDefault()
            
            // 改行を挿入
            document.execCommand('insertHTML', false, '<br>')
            
            // スタイルを維持
            maintainStyleAfterLineBreak()
          }
        }}
=======
        onFocus={saveCursorPosition}
        onClick={saveCursorPosition}
        onKeyUp={saveCursorPosition}
>>>>>>> bd324152f1aaa266fe5ac8dabea71b4087509a98
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