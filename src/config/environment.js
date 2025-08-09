// 環境変数の管理とバリデーション
const env = process.env.REACT_APP_ENV || 'development'

const config = {
  env,
  isDevelopment: env === 'development',
  isStaging: env === 'staging',
  isProduction: env === 'production',
  
  // API設定
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  appUrl: process.env.REACT_APP_APP_URL || 'http://localhost:3000',
  
  // Firebase設定
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  },
  
  // Analytics設定
  analytics: {
    enabled: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID,
  },
  
  // Sentry設定
  sentry: {
    enabled: process.env.REACT_APP_ENABLE_SENTRY === 'true',
    dsn: process.env.REACT_APP_SENTRY_DSN,
  },
  
  // UI設定
  showEnvBadge: process.env.REACT_APP_SHOW_ENV_BADGE === 'true',
}

// 必須環境変数のバリデーション
const validateConfig = () => {
  const required = []
  
  if (!config.isDevelopment) {
    required.push(
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_AUTH_DOMAIN',
      'REACT_APP_FIREBASE_PROJECT_ID'
    )
  }
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

validateConfig()

export default config