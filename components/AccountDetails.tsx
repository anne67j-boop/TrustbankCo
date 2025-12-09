import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Send, Settings, FileText, CreditCard, Landmark, Copy } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center h-96 text-center animate-in fade-in">
        <h2 className="text-2xl font-bold text-white mb-2 font-bank">Account Not Found</h2>
        <p className="text-slate-400 mb-6">The requested account could not be located in your portfolio.</p>
        <button onClick={() => navigate('/')} className="text-orange-400 font-bold hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isCredit = account.type === 'Credit';
  const isSavings = account.type === 'Savings';
  
  // Mock details based on account type
  const routingNumber = "122000218"; // Mock Chase/NY routing
  const interestRate = isSavings ? "4.35% APY" : isCredit ? "24.99% APR" : "0.01% APY";
  const openDate = "Nov 12, 2018";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Navigation */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm uppercase tracking-wider">Back to Portfolio</span>
      </button>

      {/* Hero Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 md:p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-slate-800 rounded-full opacity-30 blur-3xl group-hover:opacity-40 transition-opacity duration-700"></div>
        <div className={`absolute bottom-0 left-0 w-full h-1.5 ${isCredit ? 'bg-rose-600' : isSavings ? 'bg-orange-600' : 'bg-blue-600'}`}></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <span className={`px-3 py-1 rounded-md bg-slate-950 border border-slate-700 text-xs font-bold uppercase tracking-widest ${isCredit ? 'text-rose-400' : isSavings ? 'text-orange-400' : 'text-blue-400'}`}>
                 {account.type} Account
               </span>
               <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-green-900/20 border border-green-900/30">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-bold uppercase text-green-400">Active Status</span>
               </div>
             </div>
             
             <div>
               <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2 leading-tight">{account.name}</h1>
               <div className="flex items-center gap-3 text-slate-400 font-mono text-lg tracking-wider">
                 <span>**** **** **** {account.accountNumber}</span>
                 <Tooltip content="Copy Account Number">
                   <button className="text-slate-600 hover:text-white transition-colors">
                     <Copy className="w-4 h-4" />
                   </button>
                 </Tooltip>
               </div>
             </div>
          </div>
          
          <div className="text-left lg:text-right">
             <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Current Balance</p>
             <h2 className={`text-4xl md:text-6xl font-serif tracking-tight ${account.balance < 0 ? 'text-rose-400' : 'text-white'}`}>
               {account.balance < 0 ? '-' : ''}${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
             </h2>
             <p className="text-slate-500 text-sm mt-2 font-medium">Available for immediate withdrawal</p>
          </div>
        </div>
      </div>

      {/* Details & Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Info Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
             <div className="p-5 border-b border-slate-800 bg-slate-800/30">
               <h3 className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                 <Landmark className="w-4 h-4 text-orange-500" />
                 Account Details
               </h3>
             </div>
             <div className="p-5 space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                 <span className="text-slate-500 text-sm font-medium">Routing Number</span>
                 <span className="text-white font-mono font-bold tracking-wider">{routingNumber}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                 <span className="text-slate-500 text-sm font-medium">{isCredit ? 'Current APR' : 'Interest Rate'}</span>
                 <span className="text-orange-400 font-bold">{interestRate}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                 <span className="text-slate-500 text-sm font-medium">Opened On</span>
                 <span className="text-slate-300 text-sm">{openDate}</span>
               </div>
               <div className="flex justify-between items-center py-2">
                 <span className="text-slate-500 text-sm font-medium">Monthly Status</span>
                 <span className="text-green-400 text-sm font-bold uppercase">Good Standing</span>
               </div>
             </div>
          </div>

          {/* Quick Actions for Account */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
             <div className="p-5 border-b border-slate-800 bg-slate-800/30">
               <h3 className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                 <Settings className="w-4 h-4 text-slate-400" />
                 Account Actions
               </h3>
             </div>
             <div className="p-4 grid grid-cols-2 gap-3">
               <button onClick={() => navigate('/transfer')} className="flex flex-col items-center justify-center p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-orange-500/50 hover:bg-slate-900 transition group">
                 <Send className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-bold text-slate-400 group-hover:text-white">Transfer</span>
               </button>
               <button className="flex flex-col items-center justify-center p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-orange-500/50 hover:bg-slate-900 transition group">
                 <FileText className="w-5 h-5 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-bold text-slate-400 group-hover:text-white">Statements</span>
               </button>
               {isCredit && (
                 <button className="flex flex-col items-center justify-center p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-orange-500/50 hover:bg-slate-900 transition group">
                   <CreditCard className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                   <span className="text-xs font-bold text-slate-400 group-hover:text-white">Pay Card</span>
                 </button>
               )}
               <button className="flex flex-col items-center justify-center p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-orange-500/50 hover:bg-slate-900 transition group">
                 <Settings className="w-5 h-5 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-bold text-slate-400 group-hover:text-white">Manage</span>
               </button>
             </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
               <h2 className="font-bold text-white text-lg">Transaction History</h2>
               <div className="flex gap-2">
                  <Tooltip content="Export CSV">
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors border border-slate-700">
                      <Download className="w-4 h-4" />
                    </button>
                  </Tooltip>
               </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-base text-slate-300">
                <thead className="bg-slate-950 text-sm uppercase font-bold text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-center">Category</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {accountTransactions.length > 0 ? accountTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-400 text-sm">{t.date}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm md:text-base">{t.description}</div>
                        <div className="text-xs text-slate-500 font-semibold mt-0.5">{t.merchant}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-950 text-slate-400 border border-slate-800">
                          {t.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold tabular-nums text-sm md:text-base ${t.type === 'credit' ? 'text-orange-400' : 'text-white'}`}>
                        {t.type === 'credit' ? '+' : ''} ${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                         <div className="flex flex-col items-center">
                           <FileText className="w-10 h-10 mb-3 opacity-20" />
                           <p>No transactions found for this period.</p>
                         </div>
                       </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination / Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
               <p className="text-xs text-center text-slate-600 font-medium">
                  Showing recent activity. For older statements, please visit the Documents center.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;