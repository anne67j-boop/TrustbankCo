// src/App.tsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Transfer from './pages/Transfer'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transfer" element={<Transfer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
