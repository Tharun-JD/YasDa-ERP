import { useState } from 'react'

const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
}

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (message) setMessage('')
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.username.trim()) {
      nextErrors.username = 'Username is required.'
    } else if (formData.username.trim().length < 3) {
      nextErrors.username = 'Username must be at least 3 characters.'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    if (
      !nextErrors.username &&
      !nextErrors.password &&
      (formData.username !== DEMO_CREDENTIALS.username || formData.password !== DEMO_CREDENTIALS.password)
    ) {
      nextErrors.password = 'Invalid username or password.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 120))
      setMessage('Login successful. Welcome back!')
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess({
          name: formData.username,
          email: `${formData.username}@gmail.com`,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-shell">
      <section className="login-panel">
        <header className="reveal" style={{ '--delay': '80ms' }}>
          <span className="panel-kicker">Secure Login</span>
          <h1 className="panel-title">Sign in</h1>
          <p className="panel-subtitle">Use your account to continue.</p>
        </header>

        <form onSubmit={handleSubmit} className="form-grid" noValidate>
          <div className="field reveal" style={{ '--delay': '150ms' }}>
            <label htmlFor="username" className="field-label">
              Username
            </label>
            <div className="input-shell">
              <span className="field-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8.5" r="3.5" />
                  <path d="M4 19c1.8-3.2 4.8-4.8 8-4.8s6.2 1.6 8 4.8" />
                </svg>
              </span>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="field-input"
              />
            </div>
            {errors.username ? <p className="field-error">{errors.username}</p> : null}
          </div>

          <div className="field reveal" style={{ '--delay': '220ms' }}>
            <div className="field-top">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <button type="button" className="plain-link">
                Forgot password?
              </button>
            </div>
            <div className="input-shell">
              <span className="field-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="5.5" y="10.5" width="13" height="9" rx="2.2" />
                  <path d="M8.8 10.4V8.6a3.2 3.2 0 1 1 6.4 0v1.8" />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="field-input"
              />
              <button
                type="button"
                className="field-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password ? <p className="field-error">{errors.password}</p> : null}
          </div>

          <div className="meta-row reveal" style={{ '--delay': '290ms' }}>
            <label className="remember-label">
              <input
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="check"
              />
              Remember me
            </label>
            <span className="meta-hint">Private device</span>
          </div>

          <div className="reveal" style={{ '--delay': '360ms' }}>
            <button type="submit" disabled={isSubmitting} className="cta-btn">
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {message ? (
            <p className="success-msg reveal" style={{ '--delay': '420ms' }}>
              {message}
            </p>
          ) : null}
        </form>

        <p className="footer-note reveal" style={{ '--delay': '470ms' }}>
          {/* Demo login: <span className="strong-link">admin / admin123</span> */}
        </p>

        <p className="footer-note reveal" style={{ '--delay': '500ms' }}>
          New here?{' '}
          <button type="button" className="plain-link strong-link">
            Create an account
          </button>
        </p>
      </section>
    </main>
  )
}

export default Login
