import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Transfer from './components/Transfer';
import AIChat from './components/AIChat';
import Login from './components/Login';
import AccountDetails from './components/AccountDetails';
import LinkAccount from './components/LinkAccount';
import { CURRENT_USER, MOCK_TRANSACTIONS, MOCK_ACCOUNTS } from './constants';
import { Construction, ArrowLeft } from 'lucide-react';
import { Account, Transaction } from './types';

// Reusable placeholder for features that are linked but not fully implemented in this demo
const ServicePlaceholder: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500 p-8">
      <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 shadow-2xl relative">
        <Construction className="w-10 h-10 text-orange-500" />
        <div className="absolute inset-0 border-t-2 border-orange-500/20 rounded-full animate-spin duration-[3s]"></div>
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-3xl font-serif font-bold text-white">{title}</h1>
        <p className="text-slate-400 text-lg leading-relaxed">{description}</p>
      </div>
      <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg max-w-md">
        <p className="text-blue-400 text-sm font-mono">
          System Notice: This secure module is currently undergoing scheduled maintenance for the Q4 Private Wealth upgrade.
        </p>
      </div>
      <button 
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group px-6 py-3 rounded-lg hover:bg-slate-900"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-wider text-sm">Return to Dashboard</span>
      </button>
    </div>
  );
};

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, onLogout, children }) => {
  return isAuthenticated ? (
    <Layout user={CURRENT_USER} onLogout={onLogout}>
      {children}
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App: React.FC = () => {
  // Initialize state based on localStorage existence
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth_session') === 'active';
  });

  // Global State for Accounts and Transactions to support updates
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const handleLogin = () => {
    // Persist login state
    localStorage.setItem('auth_session', 'active');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear persisted state
    localStorage.removeItem('auth_session');
    setIsAuthenticated(false);
  };

  // Logic to process a transfer, update balance, and add history
  const processTransfer = (amount: number, fromAccountId: string, description: string, category: string) => {
    // 1. Update Account Balance
    setAccounts(prevAccounts => prevAccounts.map(acc => {
      if (acc.id === fromAccountId) {
        return { ...acc, balance: acc.balance - amount };
      }
      return acc;
    }));

    // 2. Add New Transaction
    const newTransaction: Transaction = {
      id: `t_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      description: description,
      amount: amount,
      type: 'debit',
      category: category,
      merchant: 'Transfer',
      accountId: fromAccountId
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={
          !isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />
        } />
        
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <Dashboard transactions={transactions} accounts={accounts} />
          </ProtectedRoute>
        } />

        <Route path="/account/:accountId" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <AccountDetails accounts={accounts} transactions={transactions} />
          </ProtectedRoute>
        } />

        <Route path="/transactions" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <Transactions transactions={transactions} />
          </ProtectedRoute>
        } />

        <Route path="/transfer" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <Transfer accounts={accounts} onTransferSuccess={processTransfer} />
          </ProtectedRoute>
        } />

        <Route path="/link-account" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <LinkAccount />
          </ProtectedRoute>
        } />

        <Route path="/advisor" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <AIChat transactions={transactions} />
          </ProtectedRoute>
        } />

        {/* Quick Action Routes */}
        <Route path="/pay" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <ServicePlaceholder 
              title="Bill Pay & Settlements" 
              description="Manage external payees, schedule recurring payments, and handle settlement instructions."
            />
          </ProtectedRoute>
        } />

        <Route path="/deposit" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <ServicePlaceholder 
              title="Remote Deposit Capture" 
              description="Securely deposit checks via high-resolution image capture. Daily limits apply based on client tier."
            />
          </ProtectedRoute>
        } />

        <Route path="/documents" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <ServicePlaceholder 
              title="Tax Documents & Statements" 
              description="Access 1099s, K-1s, and monthly consolidated wealth statements."
            />
          </ProtectedRoute>
        } />

        <Route path="/cards" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <ServicePlaceholder 
              title="Card Management" 
              description="Configure spending limits, travel notices, and request metal replacement cards."
            />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <ServicePlaceholder 
              title="Client Settings" 
              description="Manage security preferences, trusted devices, and authorized user access."
            />
          </ProtectedRoute>
        } />

      </Routes>
    </HashRouter>
  );
};

export default App;