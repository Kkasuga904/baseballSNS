# Firebase セットアップガイド

このアプリでGoogle認証を有効にするには、以下の手順でFirebaseプロジェクトをセットアップしてください。

## 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを作成」をクリック
3. プロジェクト名を入力（例：baseball-sns-app）
4. Google Analyticsは任意（オフでもOK）
5. プロジェクトを作成

## 2. Authentication の設定

1. 左側のメニューから「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブを選択
4. 「Google」を有効化
   - プロジェクトのサポートメールを選択
   - 「有効にする」をクリック

## 3. ウェブアプリの追加

1. Firebaseプロジェクトの概要ページで「ウェブ」アイコンをクリック
2. アプリのニックネームを入力（例：Baseball SNS Web）
3. 「Firebase Hosting」はチェックしなくてOK
4. 「アプリを登録」をクリック

## 4. Firebase設定の取得

登録後に表示される設定情報をコピーして、`src/firebase/config.js`に貼り付けます：

```javascript
const firebaseConfig = {
  apiKey: "実際のAPIキー",
  authDomain: "実際のauthDomain",
  projectId: "実際のprojectId",
  storageBucket: "実際のstorageBucket",
  messagingSenderId: "実際のmessagingSenderId",
  appId: "実際のappId"
}
```

## 5. 認証ドメインの設定

1. Firebase Console > Authentication > Settings > Authorized domains
2. `localhost`が含まれていることを確認
3. 本番環境のドメインも追加（例：your-app.com）

## 6. 環境変数での管理（推奨）

`.env`ファイルを作成して環境変数として管理：

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

そして`config.js`で使用：

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...
}
```

## 注意事項

- Firebaseの設定値（APIキーなど）は公開されても問題ありません
- セキュリティはFirebaseのセキュリティルールで管理されます
- 本番環境では必ず適切なセキュリティルールを設定してください