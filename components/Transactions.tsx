import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Calendar, ArrowUpDown } from 'lucide-react';
import Skeleton from './ui/Skeleton';
import Tooltip from './ui/Tooltip';

interface TransactionsProps {
  transactions: Transaction[];
}

const Transactions: React.FC<TransactionsProps> = ({ transactions }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filtered = transactions.filter(t => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'income' && t.type === 'credit') ||
                         (filter === 'expense' && t.type === 'debit');
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = t.description.toLowerCase().includes(searchLower) ||
                          (t.merchant && t.merchant.toLowerCase().includes(searchLower)) ||
                          t.category.toLowerCase().includes(searchLower);
    
    // Parse transaction date (Assuming format 'Oct 25' implies current year, effectively mocking '2024')
    // In a real app, t.date would be an ISO string or Date object. 
    // For this mock, we skip complex date parsing if string is just 'Oct 25', 
    // but if user inputs date, we should try to match.
    // For simplicity in this mock upgrade, we'll only filter if date is ISO-like or user inputs match string.
    
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
  });

  const toggleSort = () => {
    setSortOrder(current => current === 'desc' ? 'asc' : 'desc');
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
         <div className="flex justify-between items-center">
            <div className="space-y-2">
               <Skeleton className="h-10 w-48" />
               <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-12 w-32" />
         </div>
         <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Wealth Reports</h1>
          <p className="text-slate-400 text-base mt-2 font-medium">Detailed transaction history and statement generation.</p>
        </div>
        <div className="flex space-x-3">
          <Tooltip content="Export data to CSV">
            <button className="flex items-center space-x-2 px-6 py-3 bg-slate-900 border border-slate-700 rounded-xl text-base font-bold text-slate-300 hover:bg-slate-800 hover:text-orange-400 transition-colors shadow-sm">
              <Download className="w-5 h-5" />
              <span>Export CSV</span>
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-800 bg-slate-800/50 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
           
           {/* Search */}
           <div className="relative flex-1 w-full xl:max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
             <input 
               type="text"
               placeholder="Search merchant, category..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-5 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-600 font-medium text-white"
             />
           </div>
           
           {/* Filters */}
           <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4">
             {/* Date Range */}
             <div className="flex items-center space-x-2 bg-slate-950 border border-slate-700 rounded-xl p-1">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-slate-300 text-sm px-3 py-2 outline-none border-none focus:ring-0 w-32"
                />
                <span className="text-slate-600">-</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-slate-300 text-sm px-3 py-2 outline-none border-none focus:ring-0 w-32"
                />
             </div>

             <div className="flex gap-4">
                <div className="relative flex-1 sm:flex-none">
                  <select 
                   value={filter}
                   onChange={(e) => setFilter(e.target.value)}
                   className="w-full appearance-none pl-5 pr-12 py-3.5 border border-slate-700 rounded-xl text-base bg-slate-950 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all cursor-pointer min-w-[160px] font-medium text-slate-300"
                  >
                    <option value="all">All Activity</option>
                    <option value="income">Deposits</option>
                    <option value="expense">Withdrawals</option>
                  </select>
                  <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                </div>

                <Tooltip content={`Sort by Amount: ${sortOrder === 'asc' ? 'Low to High' : 'High to Low'}`}>
                  <button 
                    onClick={toggleSort}
                    className={`flex items-center justify-center px-4 border border-slate-700 rounded-xl transition-colors ${sortOrder ? 'bg-orange-500/10 text-orange-400 border-orange-500/50' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
                  >
                    <ArrowUpDown className="w-5 h-5" />
                  </button>
                </Tooltip>
             </div>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base text-slate-300">
            <thead className="bg-slate-950 text-sm uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="px-8 py-5 w-32">Date</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5 text-right">Amount</th>
                <th className="px-8 py-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length > 0 ? filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/60 transition-colors group cursor-pointer">
                  <td className="px-8 py-5 whitespace-nowrap font-semibold text-slate-400 text-base">{t.date}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${t.type === 'credit' ? 'bg-orange-900/30 text-orange-500' : 'bg-slate-800 text-slate-500'}`}>
                        {t.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">{t.description}</div>
                        <div className="text-sm text-slate-500 group-hover:text-orange-400 transition-colors font-semibold mt-0.5">{t.merchant}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-slate-800 text-slate-400 border border-slate-700">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-8 py-5 text-right font-bold tabular-nums text-lg ${t.type === 'credit' ? 'text-orange-400' : 'text-white'}`}>
                    {t.type === 'credit' ? '+' : ''} ${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="inline-flex items-center px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-slate-800 text-orange-400 border border-slate-700">
                      Posted
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500 bg-slate-900/50">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-10 h-10 mb-4 text-slate-700" />
                      <p className="font-bold text-lg">No transactions found</p>
                      <p className="text-base mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-900 border-t border-slate-800 p-6 text-sm text-slate-500 flex justify-between items-center">
          <span className="font-semibold">Showing {filtered.length} transactions</span>
          <div className="flex gap-3">
            <button disabled className="px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-600 cursor-not-allowed font-medium">Previous</button>
            <button disabled className="px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-600 cursor-not-allowed font-medium">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;