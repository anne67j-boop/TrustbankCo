// src/pages/Transfer.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_ACCOUNTS } from '../constants'

const Transfer: React.FC = () => {
  const navigate = useNavigate()
  const [fromAccountId, setFromAccountId] = useState(MOCK_ACCOUNTS[0]?.id)
  const [toAccount, setToAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fromAccountId || !toAccount || !amount) {
      setStatus('Please fill in all required fields.')
      return
    }

    // In real production, call backend API here
    setStatus('Transfer submitted (demo only, not processed).')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Transfer Funds</h1>
        <button
          className="text-sm underline"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="max-w-xl mx-auto p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              From account
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={fromAccountId}
              onChange={e => setFromAccountId(e.target.value)}
            >
              {MOCK_ACCOUNTS.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} • **** {acc.accountNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              To account / beneficiary
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="e.g. 0123456789 or beneficiary name"
              value={toAccount}
              onChange={e => setToAccount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Amount (₦)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border rounded px-3 py-2 text-sm"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Note (optional)
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {status && (
            <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded px-3 py-2">
              {status}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm font-medium"
          >
            Submit Transfer
          </button>
        </form>
      </main>
    </div>
  )
}

export default Transfer
