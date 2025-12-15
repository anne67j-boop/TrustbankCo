import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('auth', 'true')
      navigate('/dashboard')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h2>Login to TrustBankCo</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ margin: '0.5rem', padding: '0.5rem' }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: '0.5rem', padding: '0.5rem' }}
      />
      <br />
      <button onClick={handleLogin} style={{ padding: '0.5rem 1rem' }}>
        Login
      </button>
    </div>
  )
}

export default Login
