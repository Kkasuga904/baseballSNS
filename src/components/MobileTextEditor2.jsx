import React, { useRef, useEffect, useState } from 'react'
import './MobileTextEditor.css'

function MobileTextEditor({ content, onChange, placeholder }) {
  const editorRef = useRef(null)
  const toolbarRef = useRef(null)
  
  // 実際の入力に使用するスタイル
  const [inputStyles, setInputStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    fontSize: 'normal'
  })
  
  // inputStylesをrefでも保持（イベントハンドラ内での参照用）
  const inputStylesRef = useRef(inputStyles)
  useEffect(() => {
    inputStylesRef.current = inputStyles
    console.log('inputStyles updated in ref:', inputStyles)
    console.log('fontSize in ref:', inputStyles.fontSize)
  }, [inputStyles])
  
  // displayStylesは削除（inputStylesのみ使用）
  
  // カーソル位置のスタイルをチェック（参考用のみ、実際の表示はinputStylesを使用）
  const updateActiveStyles = () => {
    // この関数は現在使用していないが、将来的にカーソル位置の情報が必要になった場合のために残す
    // ツールバーの表示はinputStylesに基づくため、ここでの更新は不要
  }

  // コンテンツの初期化
  useEffect(() => {
    if (editorRef.current && content !== undefined) {
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content || ''
      }
    }
  }, [content])
  
  // コンポーネントマウント確認
  useEffect(() => {
    console.log('MTE v2 mounted')
    return () => console.log('MTE v2 unmounted')
  }, [])
  
  // エディタのフォーカス管理
  useEffect(() => {
    const handleFocus = () => {
      console.log('Editor focused')
    }
    
    const handleBlur = () => {
      console.log('Editor blurred')
    }
    
    if (editorRef.current) {
      editorRef.current.addEventListener('focus', handleFocus)
      editorRef.current.addEventListener('blur', handleBlur)
    }
    
    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener('focus', handleFocus)
        editorRef.current.removeEventListener('blur', handleBlur)
      }
    }
  }, [])

  // キーボード検出は不要に（stickyポジションで対応）
  // ツールバーは常にエディタの上部に固定

  // スタイル適用（改善版）
  const applyStyle = (type, value = null) => {
    if (!editorRef.current) return
    
    // フォーカスを確実に設定
    editorRef.current.focus()
    
    // 少し待ってから処理（全画面時の安定性向上）
    setTimeout(() => {
      applyStyleInternal(type, value)
    }, 10)
  }
  
  const applyStyleInternal = (type, value = null) => {
    // エディタがフォーカスされているか確認
    if (document.activeElement !== editorRef.current) {
      editorRef.current.focus()
    }
    
    const selection = window.getSelection()
    
    // 選択範囲がない場合はカーソル位置を設定
    if (selection.rangeCount === 0) {
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      selection.addRange(range)
    }
    
    if (type === 'fontSize') {
      // フォントサイズ変更
      const sizes = {
        'large': '28px',
        'medium': '22px', 
        'normal': '18px'
      }
      
      const selectedText = selection.toString()
      
      if (selectedText) {
        // テキストが選択されている場合
        const range = selection.getRangeAt(0)
        const span = document.createElement('span')
        
        // サイズを設定
        span.style.fontSize = sizes[value]
        
        // 現在の入力スタイルを保持（更新後の値を使用）
        const updatedStyles = { ...inputStyles, fontSize: value }
        if (updatedStyles.bold) span.style.fontWeight = 'bold'
        if (updatedStyles.italic) span.style.fontStyle = 'italic'
        if (updatedStyles.underline) span.style.textDecoration = 'underline'
        
        console.log('applyStyle - Created span for selected text:', {
          fontSize: span.style.fontSize,
          fontWeight: span.style.fontWeight,
          value: value
        })
        
        span.textContent = selectedText
        
        range.deleteContents()
        range.insertNode(span)
        
        // 選択を解除
        selection.removeAllRanges()
      } else {
        // テキストが選択されていない場合
        const range = selection.getRangeAt(0)
        
        // 現在のノードから抜け出す
        const currentNode = range.startContainer
        const parentElement = currentNode.nodeType === Node.TEXT_NODE 
          ? currentNode.parentElement 
          : currentNode
        
        // 新しいスパンを作成
        const newSpan = document.createElement('span')
        
        // サイズを設定
        newSpan.style.fontSize = sizes[value]
        
        // 現在の入力スタイルを保持（更新された値を使用）
        const newInputStyles = { ...inputStyles, fontSize: value }
        if (newInputStyles.bold) newSpan.style.fontWeight = 'bold'
        if (newInputStyles.italic) newSpan.style.fontStyle = 'italic'
        if (newInputStyles.underline) newSpan.style.textDecoration = 'underline'
        
        console.log('applyStyle - Created new span for cursor position:', {
          fontSize: newSpan.style.fontSize,
          fontWeight: newSpan.style.fontWeight,
          value: value,
          actualHTML: newSpan.outerHTML
        })
        
        newSpan.innerHTML = '&#8203;' // ゼロ幅スペース
        
        // 既存のスパンの外側に挿入
        if (parentElement && parentElement.tagName === 'SPAN') {
          parentElement.insertAdjacentElement('afterend', newSpan)
        } else {
          range.insertNode(newSpan)
        }
        
        // カーソルを新しいスパンに移動
        const newRange = document.createRange()
        newRange.selectNodeContents(newSpan)
        newRange.collapse(false)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
      
      // 入力スタイルを更新（他のスタイルは保持）
      setInputStyles(prev => {
        const newStyles = { ...prev, fontSize: value }
        console.log('fontSize change - inputStyles:', newStyles)
        console.log('fontSize value:', value)
        console.log('Current selection:', window.getSelection().toString())
        return newStyles
      })
      
    } else {
      // 太字、斜体、下線の処理
      const selectedText = selection.toString()
      
      if (selectedText) {
        // テキストが選択されている場合
        document.execCommand(type, false, null)
        // 選択されているテキストがある場合の状態更新
        setInputStyles(prev => {
          const newStyles = { ...prev, [type]: !prev[type] }
          console.log('Selected text style change - inputStyles:', newStyles)
          return newStyles
        })
      } else {
        // テキストが選択されていない場合
        const range = selection.getRangeAt(0)
        const currentNode = range.startContainer
        const parentElement = currentNode.nodeType === Node.TEXT_NODE 
          ? currentNode.parentElement 
          : currentNode
        
        // 新しいスパンを作成
        const newSpan = document.createElement('span')
        
        // 現在のinputStylesからスタイルを設定
        const sizes = {
          'large': '28px',
          'medium': '22px',
          'normal': '18px'
        }
        newSpan.style.fontSize = sizes[inputStyles.fontSize]
        newSpan.style.fontWeight = inputStyles.bold ? 'bold' : 'normal'
        newSpan.style.fontStyle = inputStyles.italic ? 'italic' : 'normal'
        newSpan.style.textDecoration = inputStyles.underline ? 'underline' : 'none'
        
        // 新しいスタイルを適用/解除
        const newInputStyles = { ...inputStyles }
        
        if (type === 'bold') {
          newInputStyles.bold = !inputStyles.bold
          newSpan.style.fontWeight = newInputStyles.bold ? 'bold' : 'normal'
        } else if (type === 'italic') {
          newInputStyles.italic = !inputStyles.italic
          newSpan.style.fontStyle = newInputStyles.italic ? 'italic' : 'normal'
        } else if (type === 'underline') {
          newInputStyles.underline = !inputStyles.underline
          newSpan.style.textDecoration = newInputStyles.underline ? 'underline' : 'none'
        }
        
        newSpan.innerHTML = '&#8203;'
        
        // 既存のスパンの外側に挿入
        if (parentElement && parentElement.tagName === 'SPAN') {
          parentElement.insertAdjacentElement('afterend', newSpan)
        } else {
          range.insertNode(newSpan)
        }
        
        // カーソルを新しいスパンに移動
        const newRange = document.createRange()
        newRange.selectNodeContents(newSpan)
        newRange.collapse(false)
        selection.removeAllRanges()
        selection.addRange(newRange)
        
        // 入力スタイルを更新
        setInputStyles(newInputStyles)
        console.log('applyStyle - Updated inputStyles:', newInputStyles)
      }
    }
    
    // 変更を通知
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
    
    // フォーカスを維持
    editorRef.current.focus()
  }

  // リスト追加
  const insertList = (type) => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand(type === 'bullet' ? 'insertUnorderedList' : 'insertOrderedList')
      onChange(editorRef.current.innerHTML)
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

  // 入力処理
  const handleInput = (e) => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
      
      // デバッグ: inputStylesの状態を確認
      console.log('handleInput - inputStyles:', inputStyles)
      console.log('handleInput - inputType:', e.inputType)
      
      // 空のスパンをクリーンアップ（修正: カーソルがあるspanは削除しない）
      const emptySpans = editorRef.current.querySelectorAll('span')
      const selection = window.getSelection()
      emptySpans.forEach(span => {
        // ゼロ幅スペースのみの場合、かつカーソルが入っていない場合のみ削除
        if ((span.innerHTML === '' || span.innerHTML === '​') && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          if (!span.contains(range.startContainer) && !span.contains(range.endContainer)) {
            span.remove()
          }
        }
      })
    }
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

  // Enterキー処理
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      console.log('Enter key - inputStyles before:', inputStyles)
      
      // 改行を挿入
      document.execCommand('insertHTML', false, '<br>')
      
      // 現在の入力スタイルを維持
      if (inputStyles.fontSize !== 'normal' || inputStyles.bold || inputStyles.italic || inputStyles.underline) {
        setTimeout(() => {
          const selection = window.getSelection()
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const span = document.createElement('span')
            
            // 現在のスタイルを適用
            const sizes = {
              'large': '28px',
              'medium': '22px',
              'normal': '18px'
            }
            span.style.fontSize = sizes[inputStyles.fontSize]
            
            if (inputStyles.bold) span.style.fontWeight = 'bold'
            if (inputStyles.italic) span.style.fontStyle = 'italic'
            if (inputStyles.underline) span.style.textDecoration = 'underline'
            
            span.innerHTML = '&#8203;'
            range.insertNode(span)
            
            // カーソルをスパン内に移動
            const newRange = document.createRange()
            newRange.selectNodeContents(span)
            newRange.collapse(false)
            selection.removeAllRanges()
            selection.addRange(newRange)
            
            console.log('Enter key - Created new span with styles:', {
              fontSize: span.style.fontSize,
              fontWeight: span.style.fontWeight,
              fontStyle: span.style.fontStyle,
              textDecoration: span.style.textDecoration
            })
          }
        }, 10)
      }
    }
  }

  return (
    <div className="mobile-text-editor">
      {/* ツールバー */}
      <div className="mobile-toolbar" ref={toolbarRef}>
        <div className="toolbar-scroll">
          <button
            className={`toolbar-btn ${inputStyles.fontSize === 'large' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Large button clicked')
              applyStyle('fontSize', 'large')
            }}
            onMouseDown={(e) => e.preventDefault()}
            type="button"
          >
            <span className="text-large">A</span>
          </button>
          <button
            className={`toolbar-btn ${inputStyles.fontSize === 'medium' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Medium button clicked')
              applyStyle('fontSize', 'medium')
            }}
            onMouseDown={(e) => e.preventDefault()}
            type="button"
          >
            <span className="text-medium">A</span>
          </button>
          <button
            className={`toolbar-btn ${inputStyles.fontSize === 'normal' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Normal button clicked')
              applyStyle('fontSize', 'normal')
            }}
            onMouseDown={(e) => e.preventDefault()}
            type="button"
          >
            <span className="text-normal">A</span>
          </button>
          
          <div className="toolbar-divider" />
          
          <button
            className={`toolbar-btn ${inputStyles.bold ? 'active' : ''}`}
            onClick={() => {
              console.log('bold before:', inputStyles.bold);
              applyStyle('bold');
              setTimeout(() => console.log('bold after:', inputStyles.bold), 0);
            }}
            type="button"
          >
            <strong>B</strong>
          </button>
          <button
            className={`toolbar-btn ${inputStyles.italic ? 'active' : ''}`}
            onClick={() => applyStyle('italic')}
            type="button"
          >
            <em>I</em>
          </button>
          <button
            className={`toolbar-btn ${inputStyles.underline ? 'active' : ''}`}
            onClick={() => applyStyle('underline')}
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
        onBeforeInput={(e) => {
          // 入力前のスタイル状態を確認
          console.log('onBeforeInput - inputStyles:', inputStyles)
          console.log('onBeforeInput - data:', e.data)
          
          // スタイルが設定されている場合、入力をインターセプト
          const styles = inputStylesRef.current
          console.log('onBeforeInput - checking styles:', styles)
          console.log('onBeforeInput - window width:', window.innerWidth)
          
          if (e.data && (styles.fontSize !== 'normal' || styles.bold || styles.italic || styles.underline)) {
            e.preventDefault()
            console.log('Intercepting input with styles:', styles)
            
            const selection = window.getSelection()
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0)
              
              // 新しいspanを作成または既存のspanを使用
              let targetSpan = null
              const container = range.startContainer
              const parent = container.nodeType === Node.TEXT_NODE ? container.parentElement : container
              
              console.log('Current container:', container)
              console.log('Parent element:', parent)
              
              // 現在のコンテナが適切なスタイルを持つspanかチェック（fontSizeも含めて判定）
              if (parent && parent.tagName === 'SPAN') {
                const sizes = {
                  'large': '28px',
                  'medium': '22px',
                  'normal': '18px'
                }
                const expectedFontSize = sizes[styles.fontSize]
                const hasCorrectStyle = 
                  parent.style.fontSize === expectedFontSize &&
                  parent.style.fontWeight === (styles.bold ? 'bold' : '') &&
                  parent.style.fontStyle === (styles.italic ? 'italic' : '') &&
                  parent.style.textDecoration === (styles.underline ? 'underline' : '')
                
                console.log('Parent span styles:', {
                  fontSize: parent.style.fontSize,
                  expectedFontSize: expectedFontSize,
                  fontWeight: parent.style.fontWeight,
                  fontStyle: parent.style.fontStyle,
                  textDecoration: parent.style.textDecoration,
                  hasCorrectStyle: hasCorrectStyle
                })
                
                if (hasCorrectStyle) {
                  targetSpan = parent
                  console.log('Using existing span')
                }
              }
              
              // 適切なspanがない場合は新しく作成
              if (!targetSpan) {
                targetSpan = document.createElement('span')
                const sizes = {
                  'large': '28px',
                  'medium': '22px',
                  'normal': '18px'
                }
                
                // スタイルを確実に設定
                const fontSize = sizes[styles.fontSize]
                targetSpan.style.fontSize = fontSize
                if (styles.bold) targetSpan.style.fontWeight = 'bold'
                if (styles.italic) targetSpan.style.fontStyle = 'italic'
                if (styles.underline) targetSpan.style.textDecoration = 'underline'
                
                console.log('Creating new span with styles:', {
                  fontSize: fontSize,
                  fontWeight: targetSpan.style.fontWeight,
                  fontStyle: targetSpan.style.fontStyle,
                  textDecoration: targetSpan.style.textDecoration,
                  actualHTML: targetSpan.outerHTML
                })
                
                // spanを挿入
                range.insertNode(targetSpan)
                
                // カーソルをspan内に移動
                const newRange = document.createRange()
                newRange.selectNodeContents(targetSpan)
                newRange.collapse(false)
                selection.removeAllRanges()
                selection.addRange(newRange)
              }
              
              // テキストをtargetSpan内に挿入
              const textNode = document.createTextNode(e.data)
              
              // targetSpan内にテキストを追加
              if (targetSpan.childNodes.length === 0 || 
                  (targetSpan.childNodes.length === 1 && targetSpan.textContent === '\u200b')) {
                // 空またはゼロ幅スペースのみの場合は置き換え
                targetSpan.textContent = e.data
              } else {
                // 既存のテキストがある場合は追加
                targetSpan.appendChild(textNode)
              }
              
              // カーソルをテキストの後に移動
              const newRange = document.createRange()
              newRange.selectNodeContents(targetSpan)
              newRange.collapse(false)
              selection.removeAllRanges()
              selection.addRange(newRange)
              
              console.log('Final HTML after insertion:', targetSpan.outerHTML)
              console.log('Editor HTML:', editorRef.current.innerHTML)
              
              // 変更を通知
              onChange(editorRef.current.innerHTML)
            }
          }
        }}
        onKeyDown={handleKeyDown}
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