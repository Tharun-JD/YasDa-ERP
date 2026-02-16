import { useState } from 'react'
import './index.css'
import Home from './Home.jsx'
import Login from './Login.jsx'

const SESSION_STORAGE_KEY = 'app_session_user'

function readSavedSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => readSavedSession())
  const isLoggedIn = Boolean(currentUser)

  return isLoggedIn ? (
    <Home
      user={currentUser}
      onSignOut={() => {
        localStorage.removeItem(SESSION_STORAGE_KEY)
        setCurrentUser(null)
      }}
    />
  ) : (
    <Login
      onLoginSuccess={(user) => {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
        setCurrentUser(user)
      }}
    />
  )
}

export default App
