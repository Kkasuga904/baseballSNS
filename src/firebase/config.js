import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Firebaseの設定
// これらの値は公開されても問題ありません（Firebaseのセキュリティルールで保護されます）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummy-YourActualAPIKey",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "baseball-sns-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "baseball-sns-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "baseball-sns-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456789012345"
}

// Firebase設定が有効かチェック
const isFirebaseConfigured = firebaseConfig.apiKey !== "AIzaSyDummy-YourActualAPIKey" && 
                            firebaseConfig.apiKey !== "your-actual-api-key-here" &&
                            firebaseConfig.apiKey.startsWith("AIza")

let app, auth, googleProvider

if (isFirebaseConfigured) {
  try {
    // Firebaseアプリの初期化
    app = initializeApp(firebaseConfig)
    
    // Firebase Authenticationの初期化
    auth = getAuth(app)
    
    // Google認証プロバイダーの設定
    googleProvider = new GoogleAuthProvider()
    
    console.log('Firebase initialized successfully')
  } catch (error) {
    console.error('Firebase initialization error:', error)
    console.log('Falling back to demo mode')
    auth = null
    googleProvider = null
  }
} else {
  console.log('Firebase not configured - using demo mode')
  auth = null
  googleProvider = null
}

export { auth, googleProvider, isFirebaseConfigured }
export default app