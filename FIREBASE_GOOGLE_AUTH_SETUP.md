# Firebase Google認証セットアップガイド

## 概要
BaseLogアプリケーションでGoogle認証を使用するための設定手順です。

## 前提条件
- Googleアカウント
- Firebaseプロジェクト（未作成の場合は以下の手順で作成）

## セットアップ手順

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを作成」をクリック
3. プロジェクト名を入力（例：`baselog-app`）
4. Googleアナリティクスの設定（任意）
5. 「プロジェクトを作成」をクリック

### 2. Authenticationの有効化

1. Firebaseコンソールの左メニューから「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブを選択
4. 「Google」を選択して有効化
   - プロジェクトのサポートメールを設定
   - 「有効にする」をクリック

### 3. Webアプリの追加

1. Firebaseコンソールの「プロジェクトの概要」ページ
2. 「ウェブ」アイコン（</>）をクリック
3. アプリのニックネームを入力（例：`BaseLog Web`）
4. 「Firebase Hosting」は今回は不要なのでチェックしない
5. 「アプリを登録」をクリック

### 4. Firebase設定の取得

登録後に表示される設定情報をコピー：

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

### 5. 環境変数の設定

1. プロジェクトルートに`.env`ファイルを作成（存在しない場合）
2. 以下の環境変数を設定：

```env
VITE_FIREBASE_API_KEY=AIza...（上記のapiKey）
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...
```

### 6. 承認済みドメインの設定

1. Firebase Console > Authentication > Settings > 承認済みドメイン
2. 以下のドメインを追加：
   - `localhost` （開発用）
   - `baselog.jp` （本番用、ドメイン取得後）
   - Vercelのドメイン（例：`your-app.vercel.app`）

### 7. アプリケーションの再起動

```bash
npm run dev
```

## トラブルシューティング

### エラー: "Google認証機能が利用できません"
- `.env`ファイルが正しく設定されているか確認
- Firebase ConsoleでGoogle認証が有効になっているか確認

### エラー: "This domain is not authorized"
- Firebase Consoleの承認済みドメインにアクセス元のドメインを追加

### エラー: "Web client ID not found"
- Firebase ConsoleでWebアプリが正しく登録されているか確認
- Google認証の設定でプロジェクトのサポートメールが設定されているか確認

## セキュリティの注意事項

- `.env`ファイルは絶対にGitにコミットしない（`.gitignore`に含まれていることを確認）
- Firebase APIキーは公開されても問題ないが、Firebaseのセキュリティルールを適切に設定すること
- 本番環境では承認済みドメインを適切に制限すること

## 参考リンク

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Google Sign-In for Websites](https://firebase.google.com/docs/auth/web/google-signin)