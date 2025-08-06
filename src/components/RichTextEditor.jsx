import React, { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Underline from '@tiptap/extension-underline'
import './RichTextEditor.css'

function RichTextEditor({ content, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Youtube.configure({
        width: 480,
        height: 270,
        nocookie: true,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content',
      },
    },
  })

  // 画像追加
  const addImage = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target.result
          editor.chain().focus().setImage({ src: url }).run()
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }, [editor])

  // 動画追加
  const addVideo = useCallback(() => {
    const url = prompt('YouTube動画のURLを入力してください')
    if (url) {
      // YouTube URLからIDを抽出
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]*)/)?.[1]
      if (videoId) {
        editor.chain().focus().setYoutubeVideo({
          src: `https://www.youtube.com/watch?v=${videoId}`,
        }).run()
      } else {
        alert('有効なYouTube URLを入力してください')
      }
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        {/* テキストサイズ */}
        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
            title="大"
          >
            <span className="text-size-large">A</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
            title="中"
          >
            <span className="text-size-medium">A</span>
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive('paragraph') ? 'active' : ''}
            title="小"
          >
            <span className="text-size-small">A</span>
          </button>
        </div>

        {/* テキスト装飾 */}
        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'active' : ''}
            title="太字"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'active' : ''}
            title="斜体"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'active' : ''}
            title="下線"
          >
            <u>U</u>
          </button>
        </div>

        {/* リスト */}
        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'active' : ''}
            title="箇条書き"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'active' : ''}
            title="番号付きリスト"
          >
            1.
          </button>
        </div>

        {/* メディア */}
        <div className="toolbar-group">
          <button onClick={addImage} title="画像を追加">
            🖼️
          </button>
          <button onClick={addVideo} title="動画を追加">
            🎥
          </button>
        </div>

        {/* 元に戻す・やり直し */}
        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="元に戻す"
          >
            ↶
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="やり直し"
          >
            ↷
          </button>
        </div>
      </div>

      <EditorContent 
        editor={editor} 
        placeholder={placeholder}
      />
    </div>
  )
}

export default RichTextEditor