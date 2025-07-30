import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration)
        
        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000) // Check every hour
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error)
      })
  })
}

// Add PWA install prompt handling
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault()
  // Store the event so it can be triggered later
  window.deferredPrompt = e
  // Optionally, notify your UI that install is available
  console.log('PWA install available')
})

// Handle app installed event
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed')
  window.deferredPrompt = null
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)