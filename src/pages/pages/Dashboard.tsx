import React from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('auth')
    navigate('/')
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h2>Welcome to your dashboard</h2>
      <p>Account Balance: ₦100,000</p>
      <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
        Logout
      </button>
    </div>
  )
}

export default Dashboard
