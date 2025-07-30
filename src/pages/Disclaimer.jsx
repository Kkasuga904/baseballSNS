import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './Disclaimer.css'

function Disclaimer() {
  const location = useLocation()
  
  useEffect(() => {
    // URLのハッシュが#contactの場合、お問い合わせフォームまでスクロール
    if (location.hash === '#contact') {
      const element = document.getElementById('contact')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [location])
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // ここで実際の送信処理を行う（メール送信APIなど）
    console.log('お問い合わせ内容:', contactForm)
    
    // 成功メッセージを表示
    setShowSuccess(true)
    
    // フォームをリセット
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    
    // 3秒後に成功メッセージを非表示
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <div className="disclaimer-page">
      <div className="disclaimer-container">
        <h1>免責事項</h1>
        
        <div className="disclaimer-content">
          <section>
            <h2>1. 情報の正確性について</h2>
            <p>
              当アプリケーション「野球SNS」（以下、「本サービス」といいます）に掲載されている情報については、
              慎重に作成または掲載されていますが、その正確性、完全性、有用性、安全性等について、
              いかなる保証をするものではありません。
            </p>
          </section>

          <section>
            <h2>2. 損害等の責任について</h2>
            <p>
              本サービスの利用により、利用者および第三者に生じたいかなる損害（直接的、間接的を問わず）について、
              理由の如何を問わず、当方は一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2>3. 外部リンクについて</h2>
            <p>
              本サービスから外部サイトへのリンクまたは外部サイトから本サービスへのリンクが含まれる場合がありますが、
              当方は外部サイトの内容について一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2>4. 情報の変更・削除について</h2>
            <p>
              本サービスに掲載されている情報は、予告なく変更、削除される場合があります。
              あらかじめご了承ください。
            </p>
          </section>

          <section>
            <h2>5. 著作権・商標について</h2>
            <p>
              本サービスに掲載されているコンテンツ（文章、画像、動画等）の著作権は、
              当方または正当な権利を有する第三者に帰属します。
              これらの無断転載、複製、改変等は禁止されています。
            </p>
            <p>
              また、本サービスで使用されている商標、ロゴマーク等は、
              当方または各権利者に帰属します。
            </p>
          </section>

          <section>
            <h2>6. 利用者の責任</h2>
            <p>
              本サービスのご利用については、利用者ご自身の責任において行っていただきますようお願いいたします。
              本サービスを利用することで生じるいかなる損害についても、当方は責任を負いません。
            </p>
          </section>

          <section>
            <h2>7. 免責事項の変更</h2>
            <p>
              本免責事項は、予告なく変更される場合があります。
              変更後の免責事項については、本サービス上に掲載された時点から効力を生じるものとします。
            </p>
          </section>
        </div>

        <div className="contact-section" id="contact">
          <h2>お問い合わせ</h2>
          <p>本サービスに関するお問い合わせは、以下のフォームよりお願いいたします。</p>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">お名前 <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                value={contactForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="山田 太郎"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">メールアドレス <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                value={contactForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="example@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">件名 <span className="required">*</span></label>
              <input
                type="text"
                id="subject"
                value={contactForm.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
                placeholder="お問い合わせの件名"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">お問い合わせ内容 <span className="required">*</span></label>
              <textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required
                rows="6"
                placeholder="お問い合わせ内容をご記入ください"
              />
            </div>

            <button type="submit" className="submit-button">
              送信する
            </button>

            {showSuccess && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                お問い合わせを受け付けました。ご連絡ありがとうございます。
              </div>
            )}
          </form>
        </div>

        <div className="last-updated">
          最終更新日: 2025年1月30日
        </div>
      </div>
    </div>
  )
}

export default Disclaimer