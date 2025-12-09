import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import Tooltip from './ui/Tooltip';
import { Account, Transaction } from '../types';

interface AccountDetailsProps {
  accounts: Account[];
  transactions: Transaction[];
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ accounts, transactions }) => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  
  const account = accounts.find(a => a.id === accountId);
  const accountTransactions = transactions.filter(t => t.accountId === accountId);

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Account Not Found</h2>
        <button onClick={() => navigate('/')} className="text-orange-400 font-bold hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isCredit = account.type === 'Credit';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm uppercase tracking-wider">Back to Portfolio</span>
      </button>

      {/* Account Header Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-slate-800 rounded-full opacity-30 blur-3xl"></div>
        <div className={`absolute bottom-0 left-0 w-full h-1 ${isCredit ? 'bg-rose-600' : 'bg-orange-600'}`}></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="flex items-center gap-3 mb-2">
               <span className="px-3 py-1 rounded-md bg-slate-950 border border-slate-700 text-xs font-bold text-slate-300 uppercase tracking-widest">
                 {account.type} Account
               </span>
               <div className="flex items-center space-x-1 text-slate-500">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                 <span className="text-xs font-bold uppercase">Active</span>
               </div>
             </div>
             <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">{account.name}</h1>
             <p className="text-slate-400 font-mono text-lg tracking-wider">**** **** **** {account.accountNumber}</p>
          </div>
          <div className="text-left md:text-right">
             <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Current Balance</p>
             <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight">
               {account.balance < 0 ? '-' : ''}${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
             </h2>
          </div>
        </div>
      </div>

      {/* Account Transactions */}
      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
           <h2 className="font-bold text-white text-lg">Transaction History</h2>
           <Tooltip content="Download Statement">
             <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
               <Download className="w-5 h-5" />
             </button>
           </Tooltip>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-base text-slate-300">
            <thead className="bg-slate-950 text-sm uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {accountTransactions.length > 0 ? accountTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/60 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap font-semibold text-slate-400 text-base">{t.date}</td>
                  <td className="px-8 py-5">
                    <div className="font-bold text-white text-lg">{t.description}</div>
                    <div className="text-sm text-slate-500 font-semibold mt-0.5">{t.merchant}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-slate-800 text-slate-400 border border-slate-700">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-8 py-5 text-right font-bold tabular-nums text-lg ${t.type === 'credit' ? 'text-orange-400' : 'text-white'}`}>
                    {t.type === 'credit' ? '+' : ''} ${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={4} className="px-8 py-12 text-center text-slate-500">
                     No transactions found for this account.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;