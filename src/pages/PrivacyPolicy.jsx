import React from 'react'
import { Link } from 'react-router-dom'
import './PrivacyPolicy.css'

function PrivacyPolicy() {
  return (
    <div className="privacy-policy-page">
      <div className="privacy-policy-container">
        <div className="privacy-header">
          <Link to="/" className="back-link">
            ← ホームに戻る
          </Link>
          <h1>プライバシーポリシー</h1>
          <p className="last-updated">最終更新日: 2025年1月8日</p>
        </div>

        <div className="privacy-content">
          <section className="privacy-section">
            <h2>1. はじめに</h2>
            <p>
              Baselog（以下、「本サービス」）は、ユーザーの皆様のプライバシーを尊重し、個人情報の保護に努めています。
              本プライバシーポリシーは、本サービスがどのような情報を収集し、どのように使用・保護するかを説明するものです。
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. 収集する情報</h2>
            <h3>2.1 ユーザー登録情報</h3>
            <ul>
              <li>メールアドレス</li>
              <li>パスワード（暗号化して保存）</li>
              <li>ニックネーム</li>
              <li>本名（任意・非公開）</li>
            </ul>

            <h3>2.2 プロフィール情報</h3>
            <ul>
              <li>野球・ソフトボールに関する情報（ポジション、投打など）</li>
              <li>身体情報（身長、体重など - 任意）</li>
              <li>生年月日（任意）</li>
              <li>プロフィール画像（任意）</li>
            </ul>

            <h3>2.3 活動記録</h3>
            <ul>
              <li>練習記録</li>
              <li>試合結果</li>
              <li>健康・食事記録</li>
              <li>投稿内容（テキスト、画像、動画）</li>
            </ul>

            <h3>2.4 自動的に収集される情報</h3>
            <ul>
              <li>ログイン日時</li>
              <li>アプリの使用状況</li>
              <li>デバイス情報（ブラウザの種類、OSなど）</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. 情報の使用目的</h2>
            <p>収集した情報は以下の目的で使用します：</p>
            <ul>
              <li>サービスの提供・運営</li>
              <li>ユーザー認証とアカウント管理</li>
              <li>パーソナライズされた機能の提供</li>
              <li>統計情報の作成（個人を特定しない形で）</li>
              <li>サービスの改善</li>
              <li>お問い合わせへの対応</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. 情報の共有と開示</h2>
            <p>
              本サービスは、以下の場合を除き、ユーザーの個人情報を第三者に開示・共有することはありません：
            </p>
            <ul>
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく開示請求があった場合</li>
              <li>サービスの運営に必要な業務委託先への提供（守秘義務契約を締結）</li>
            </ul>
            <p className="privacy-note">
              ⚠️ 本名は非公開設定となっており、他のユーザーには表示されません。
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. データの保存と削除</h2>
            <h3>5.1 データの保存期間</h3>
            <p>
              ユーザーデータは、アカウントが有効である限り保存されます。
            </p>

            <h3>5.2 データの削除</h3>
            <ul>
              <li>アカウント削除時に、関連するすべての個人データを削除します</li>
              <li>一部の匿名化された統計データは保持される場合があります</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>6. セキュリティ</h2>
            <p>
              本サービスは、ユーザーの個人情報を保護するため、以下のセキュリティ対策を実施しています：
            </p>
            <ul>
              <li>パスワードの暗号化保存</li>
              <li>HTTPS通信の使用</li>
              <li>定期的なセキュリティ監査</li>
              <li>アクセス制御の実施</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>7. Cookie（クッキー）の使用</h2>
            <p>
              本サービスは、ユーザー体験の向上のためCookieを使用しています：
            </p>
            <ul>
              <li>ログイン状態の維持</li>
              <li>ユーザー設定の保存</li>
              <li>サービスの利用状況の分析</li>
            </ul>
            <p>
              ブラウザの設定でCookieを無効にすることができますが、一部の機能が利用できなくなる場合があります。
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. 子どものプライバシー</h2>
            <p>
              本サービスは13歳未満の子どもを対象としていません。
              13歳未満の方は保護者の同意を得てご利用ください。
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. プライバシーポリシーの変更</h2>
            <p>
              本プライバシーポリシーは、法令の変更やサービスの変更に応じて更新される場合があります。
              重要な変更がある場合は、サービス内でお知らせします。
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. お問い合わせ</h2>
            <p>
              プライバシーに関するご質問やご要望がございましたら、以下までお問い合わせください：
            </p>
            <div className="contact-info">
              <p>メール: privacy@baselog.app</p>
              <p>（※架空のメールアドレスです）</p>
            </div>
          </section>

          <section className="privacy-section">
            <h2>11. 同意について</h2>
            <p>
              本サービスを利用することにより、本プライバシーポリシーに同意したものとみなされます。
            </p>
          </section>
        </div>

        <div className="privacy-footer">
          <Link to="/" className="back-button">
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy