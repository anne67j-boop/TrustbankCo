import React, { useMemo, useState, useEffect } from 'react';
import { ArrowUpRight, Send, FileText, Smartphone, CreditCard, ChevronRight, MoreHorizontal, ShieldCheck, Plus, ArrowRightLeft } from 'lucide-react';
import { Transaction, Account } from '../types';
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Skeleton from './ui/Skeleton';
import Tooltip from './ui/Tooltip';

interface DashboardProps {
  transactions: Transaction[];
  accounts: Account[];
}

const AccountCard: React.FC<{ account: Account; onClick: () => void }> = ({ account, onClick }) => {
  const isCredit = account.type === 'Credit';
  const isSavings = account.type === 'Savings';
  
  let accentColor = 'bg-blue-600'; 
  let badgeColor = 'bg-blue-900/50 text-blue-300 border-blue-800';
  let textColor = 'text-white';
  
  if (isSavings) {
    accentColor = 'bg-orange-600';
    badgeColor = 'bg-orange-900/50 text-orange-300 border-orange-800';
  } else if (isCredit) {
    accentColor = 'bg-rose-600';
    badgeColor = 'bg-rose-900/50 text-rose-300 border-rose-800';
  }
  
  return (
    <div 
      onClick={onClick}
      className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between h-48 relative overflow-hidden group hover:border-orange-500/30 hover:shadow-orange-900/10 cursor-pointer transition-all duration-300"
    >
       <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColor}`}></div>

       <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">{account.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5 font-semibold tracking-tight">...{account.accountNumber}</p>
          </div>
          {isCredit ? (
             <CreditCard className="w-5 h-5 text-slate-600" /> 
           ) : (
             <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${badgeColor}`}>Active</div>
           )}
        </div>
      </div>
      
      <div>
        <div className={`text-3xl md:text-3xl lg:text-4xl font-serif tracking-tight mb-2 ${textColor}`}>
          {account.balance < 0 ? '-' : ''}${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <div className="flex justify-between items-center">
           <p className="text-xs text-slate-400 font-semibold">Available Balance</p>
           {!isCredit && (
             <span className="text-xs text-orange-400 font-bold flex items-center bg-orange-900/20 px-2 py-0.5 rounded-full border border-orange-900/30">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {account.change}%
             </span>
           )}
        </div>
      </div>
      
      <div className="hidden md:flex absolute inset-x-0 bottom-0 bg-slate-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-slate-700">
        <button className="flex-1 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white uppercase tracking-wide transition-colors">View Activity</button>
      </div>
    </div>
  );
};

interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  colorClass: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon: Icon, label, colorClass, onClick }) => (
  <Tooltip content={label} position="top">
    <button onClick={onClick} className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-orange-500/50 transition-all duration-300 group active:scale-95 w-full">
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-2 md:mb-3 transition-colors duration-300 bg-slate-950 border border-slate-800 group-hover:bg-slate-800`}>
        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${colorClass}`} />
      </div>
      <span className="text-xs font-bold text-slate-400 group-hover:text-white">{label}</span>
    </button>
  </Tooltip>
);

const Dashboard: React.FC<DashboardProps> = ({ transactions, accounts }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const chartData = useMemo(() => [
    { name: 'Mon', in: 40000, out: 24000 },
    { name: 'Tue', in: 130000, out: 13980 },
    { name: 'Wed', in: 20000, out: 98000 },
    { name: 'Thu', in: 278000, out: 39080 },
    { name: 'Fri', in: 189000, out: 48000 },
    { name: 'Sat', in: 239000, out: 38000 },
    { name: 'Sun', in: 349000, out: 43000 },
  ], []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
           <div className="space-y-2">
             <Skeleton className="h-10 w-64" />
             <Skeleton className="h-4 w-48" />
           </div>
           <div className="flex gap-3">
             <Skeleton className="h-10 w-24 rounded-lg" />
             <Skeleton className="h-10 w-36 rounded-lg" />
           </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div>
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="grid grid-cols-6 gap-4">
             <Skeleton className="h-24 w-full rounded-xl" />
             <Skeleton className="h-24 w-full rounded-xl" />
             <Skeleton className="h-24 w-full rounded-xl" />
             <Skeleton className="h-24 w-full rounded-xl" />
             <Skeleton className="h-24 w-full rounded-xl" />
             <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="xl:col-span-2 h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
           <h1 className="text-3xl md:text-4xl font-serif text-white mb-2 leading-tight">Good morning, Howard</h1>
           <p className="text-slate-400 font-medium text-base">Your portfolio performance is <span className="text-orange-400 font-bold">up 12.4%</span> this month.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Tooltip content="Generate financial reports">
            <button 
              onClick={() => navigate('/transactions')}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-900 border border-slate-700 text-slate-200 px-5 py-3 rounded-lg text-sm font-bold hover:bg-slate-800 hover:border-slate-600 transition shadow-sm active:scale-95"
            >
               <FileText className="w-4 h-4" />
               <span>Reports</span>
            </button>
          </Tooltip>
          <Tooltip content="Start a new investment portfolio">
            <button 
              onClick={() => navigate('/advisor')}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-orange-600 text-white px-5 py-3 rounded-lg text-sm font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95"
            >
               <Plus className="w-4 h-4 text-orange-100" />
               <span>New Investment</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {accounts.map(account => (
          <AccountCard 
            key={account.id} 
            account={account} 
            onClick={() => navigate(`/account/${account.id}`)}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center">
          <span className="w-8 h-1 bg-orange-500 mr-3 rounded-full"></span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <QuickAction 
            icon={ArrowRightLeft} 
            label="Transfer" 
            colorClass="text-blue-400" 
            onClick={() => navigate('/transfer')}
          />
          <QuickAction 
            icon={Send} 
            label="Pay" 
            colorClass="text-orange-400" 
            onClick={() => navigate('/pay')}
          />
          <QuickAction 
            icon={Smartphone} 
            label="Deposit" 
            colorClass="text-purple-400" 
            onClick={() => navigate('/deposit')}
          />
          <QuickAction 
            icon={FileText} 
            label="Tax Docs" 
            colorClass="text-amber-400" 
            onClick={() => navigate('/documents')}
          />
          <QuickAction 
            icon={CreditCard} 
            label="Cards" 
            colorClass="text-rose-400" 
            onClick={() => navigate('/cards')}
          />
          <QuickAction 
            icon={MoreHorizontal} 
            label="More" 
            colorClass="text-slate-400" 
            onClick={() => navigate('/settings')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Content - Transactions (Left 2/3) */}
        <div className="xl:col-span-2 space-y-6">
           {/* Chart Section */}
           <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="font-bold text-white text-lg md:text-xl">Capital Flow</h2>
                  <p className="text-slate-400 text-sm font-medium mt-0.5">7-Day Performance Analysis</p>
                </div>
                <div className="flex space-x-4 text-xs font-bold">
                  <div className="flex items-center text-slate-300"><div className="w-2.5 h-2.5 bg-orange-500 rounded-full mr-1.5"></div>Inflow</div>
                  <div className="flex items-center text-slate-300"><div className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-1.5"></div>Outflow</div>
                </div>
              </div>
              <div className="h-64 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', padding: '12px', color: '#f8fafc', fontSize: '13px' }}
                      itemStyle={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 'bold' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="in" stroke="#f97316" fillOpacity={1} fill="url(#colorIn)" strokeWidth={3} />
                    <Area type="monotone" dataKey="out" stroke="#2563eb" fillOpacity={1} fill="url(#colorOut)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Transaction Table */}
           <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
               <h2 className="font-bold text-white text-lg">Recent Transactions</h2>
               <Tooltip content="View all transactions">
                 <button onClick={() => navigate('/transactions')} className="text-xs text-orange-400 font-bold hover:text-orange-300 transition-colors uppercase tracking-wide">View All</button>
               </Tooltip>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 w-28">Date</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="hidden sm:table-cell px-6 py-4">Source</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {transactions.slice(0, 5).map(t => (
                      <tr 
                        key={t.id} 
                        onClick={() => navigate(`/receipt/${t.id}`)}
                        className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4 text-slate-300 font-medium whitespace-nowrap text-sm">{t.date}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm md:text-base truncate max-w-[140px] sm:max-w-none">{t.description}</div>
                          <div className="text-xs text-slate-500 font-semibold group-hover:text-orange-400 uppercase tracking-wide mt-1 transition-colors">{t.category}</div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wide">
                          {accounts.find(a => a.id === t.accountId)?.name.split(' ')[0] || 'Unknown'} ...{accounts.find(a => a.id === t.accountId)?.accountNumber}
                        </td>
                        <td className={`px-6 py-4 text-right font-bold text-sm md:text-base whitespace-nowrap ${t.type === 'credit' ? 'text-orange-400' : 'text-white'}`}>
                           {t.type === 'credit' ? '+' : ''} ${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        </div>

        {/* Sidebar Widgets (Right 1/3) */}
        <div className="space-y-6">
          
          {/* Credit Score Widget */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-base">FICO® Score</h3>
                <ShieldCheck className="w-5 h-5 text-orange-500" />
             </div>
             <div className="flex items-end space-x-3 mb-3">
               <span className="text-4xl md:text-5xl font-serif text-white">850</span>
               <span className="text-xs text-orange-400 font-bold mb-2 flex items-center bg-orange-900/20 px-2 py-0.5 rounded border border-orange-900/50">
                 <ArrowUpRight className="w-3 h-3 mr-1" /> Perfect
               </span>
             </div>
             <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                <div className="bg-gradient-to-r from-orange-600 to-amber-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
             </div>
             <p className="text-xs text-slate-400 font-medium">Updated today. Exceptional credit standing.</p>
          </div>

          {/* Ad / Promo */}
          <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden border border-blue-900/50">
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-orange-600 rounded-full opacity-10 blur-3xl mix-blend-screen"></div>
             <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-blue-600 rounded-full opacity-10 blur-3xl mix-blend-screen"></div>
             
             <div className="relative z-10">
               <h3 className="text-xl font-serif mb-2 text-white">Private Equity Access</h3>
               <p className="text-slate-300 text-sm mb-6 leading-relaxed font-medium">Exclusive opportunity for Chairman's Circle members.</p>
               <button className="bg-orange-600 text-white px-5 py-3 rounded-lg text-sm font-bold shadow-lg hover:bg-orange-700 transition w-full active:scale-95">
                 Request Prospectus
               </button>
             </div>
          </div>

           {/* Planning */}
           <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-0 overflow-hidden">
             <div className="p-5 border-b border-slate-800 bg-slate-800/30">
               <h3 className="font-bold text-white text-sm">Wealth Management</h3>
             </div>
             <div className="divide-y divide-slate-800">
               <button onClick={() => navigate('/advisor')} className="w-full flex items-center justify-between p-5 hover:bg-slate-800 transition text-left group">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-orange-400 transition-colors">Estate Planning</span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-orange-500 transition-colors" />
               </button>
               <button onClick={() => navigate('/advisor')} className="w-full flex items-center justify-between p-5 hover:bg-slate-800 transition text-left group">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-orange-400 transition-colors">Tax Optimization</span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-orange-500 transition-colors" />
               </button>
               <button onClick={() => navigate('/advisor')} className="w-full flex items-center justify-between p-5 hover:bg-slate-800 transition text-left group">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-orange-400 transition-colors">Contact Advisor</span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-orange-500 transition-colors" />
               </button>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;