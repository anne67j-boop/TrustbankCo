// src/pages/Dashboard.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, CURRENT_USER } from '../constants'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const primaryAccount = MOCK_ACCOUNTS[0]
  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 3)
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">TrustBankCo</h1>
          <p className="text-sm">Your digital banking experience starts here.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm hidden sm:inline">
            {CURRENT_USER.name}
          </span>
          <img
            src={CURRENT_USER.avatar}
            alt={CURRENT_USER.name}
            className="w-8 h-8 rounded-full border border-white/40"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col md:flex-row gap-6 p-6">
        {/* Account Overview */}
        <section className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Account Overview</h2>
          <p className="text-sm text-gray-500 mb-4">
            {primaryAccount.name} • **** {primaryAccount.accountNumber}
          </p>

          <p className="text-sm text-gray-500">Available balance</p>
          <p className="text-3xl font-bold mb-4">
            ₦{primaryAccount.balance.toLocaleString()}
          </p>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate('/transactions')}
          >
            View Transactions
          </button>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Recent activity
            </h3>
            <ul className="space-y-2">
              {recentTransactions.map(tx => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-gray-500 text-xs">
                      {tx.date} • {tx.merchant}
                    </p>
                  </div>
                  <span
                    className={
                      tx.type === 'credit'
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {tx.type === 'credit' ? '+' : '-'}₦
                    {tx.amount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => navigate('/transfer')}
            >
              Transfer Funds
            </button>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={() => navigate('/transactions')}
            >
              View All Transactions
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 p-4">
        © {currentYear} TrustBankCo. All rights reserved.
      </footer>
    </div>
  )
}

export default Dashboard
