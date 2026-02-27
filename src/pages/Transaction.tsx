// src/pages/Transactions.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_TRANSACTIONS, MOCK_ACCOUNTS } from '../constants'

const Transactions: React.FC = () => {
  const navigate = useNavigate()

  const getAccountName = (accountId: string) => {
    const acc = MOCK_ACCOUNTS.find(a => a.id === accountId)
    return acc ? acc.name : 'Account'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Transactions</h1>
        <button
          className="text-sm underline"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Account</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map(tx => (
                <tr key={tx.id} className="border-t">
                  <td className="px-4 py-2">{tx.date}</td>
                  <td className="px-4 py-2">{tx.description}</td>
                  <td className="px-4 py-2">
                    {getAccountName(tx.accountId)}
                  </td>
                  <td
                    className={
                      'px-4 py-2 text-right font-semibold ' +
                      (tx.type === 'credit'
                        ? 'text-green-600'
                        : 'text-red-600')
                    }
                  >
                    {tx.type === 'credit' ? '+' : '-'}₦
                    {tx.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{tx.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Transactions
