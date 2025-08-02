# Firebase プロジェクトセットアップ手順

## ステップ 1: Firebaseプロジェクトの作成

1. **Firebase Consoleにアクセス**
   - ブラウザで https://console.firebase.google.com/ を開く
   - Googleアカウントでログイン

2. **新規プロジェクトを作成**
   - 「プロジェクトを作成」をクリック
   - プロジェクト名を入力: `baseball-sns-app`（または任意の名前）
   - 「続行」をクリック

3. **Google Analytics（任意）**
   - 有効/無効を選択（無効でもOK）
   - 「プロジェクトを作成」をクリック

## ステップ 2: Google認証の有効化

1. **Authenticationを開く**
   - 左側メニューから「Authentication」をクリック
   - 「始める」をクリック

2. **Sign-in methodタブ**
   - 「Sign-in method」タブを選択
   - プロバイダ一覧から「Google」をクリック

3. **Googleプロバイダを有効化**
   - 「有効にする」をオンに切り替え
   - プロジェクトのサポートメールを選択（あなたのGmailアドレス）
   - 「保存」をクリック

## ステップ 3: ウェブアプリの追加

1. **プロジェクト概要に戻る**
   - 左上の「プロジェクトの概要」をクリック

2. **ウェブアプリを追加**
   - 「</> ウェブ」アイコンをクリック
   - アプリのニックネーム: `Baseball SNS Web`
   - 「Firebase Hosting」のチェックは不要
   - 「アプリを登録」をクリック

3. **設定情報をコピー**
   - 表示されるfirebaseConfigをコピー
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

## ステップ 4: アプリに設定を適用

1. **baseball-sns-appフォルダに.envファイルを作成**

2. **以下の内容を.envファイルに貼り付け**
   ```
   VITE_FIREBASE_API_KEY=コピーしたapiKey
   VITE_FIREBASE_AUTH_DOMAIN=コピーしたauthDomain
   VITE_FIREBASE_PROJECT_ID=コピーしたprojectId
   VITE_FIREBASE_STORAGE_BUCKET=コピーしたstorageBucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=コピーしたmessagingSenderId
   VITE_FIREBASE_APP_ID=コピーしたappId
   ```

3. **例（実際の値に置き換えてください）**
   ```
   VITE_FIREBASE_API_KEY=AIzaSyB7t3_FzgGvHvhHMYLyPYP7aFKgP_JtR8k
   VITE_FIREBASE_AUTH_DOMAIN=baseball-sns-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=baseball-sns-app
   VITE_FIREBASE_STORAGE_BUCKET=baseball-sns-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
   ```

## ステップ 5: 認証ドメインの確認

1. **Firebase Console > Authentication > Settings**
   - 「Authorized domains」タブを開く
   - `localhost`が含まれていることを確認
   - 本番ドメインがある場合は追加

## ステップ 6: アプリを再起動

1. **ターミナルで以下を実行**
   ```bash
   # Ctrl+C で一度停止してから
   npm run dev
   ```

2. **動作確認**
   - http://localhost:3000/signup にアクセス
   - 「Googleで新規登録」をクリック
   - 実際のGoogle認証画面が表示されればOK！

## トラブルシューティング

### エラー: "auth/unauthorized-domain"
- Firebase Console > Authentication > Settings > Authorized domains
- `localhost`を追加

### エラー: "auth/operation-not-allowed"
- Google認証が有効になっているか確認
- Firebase Console > Authentication > Sign-in method

### 認証画面が表示されない
- .envファイルが正しく作成されているか確認
- アプリを再起動したか確認
- ブラウザのコンソールでエラーを確認