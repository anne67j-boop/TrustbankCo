import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Receipt as ReceiptIcon, Calendar } from 'lucide-react';
import { Transaction } from '../types';
import Tooltip from './ui/Tooltip';

interface ReceiptsProps {
  transactions: Transaction[];
}

const Receipts: React.FC<ReceiptsProps> = ({ transactions }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.amount.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Receipts Center</h1>
          <p className="text-slate-400 text-base mt-2 font-medium">Digital archive of all authenticated transaction records.</p>
        </div>
        <div className="relative w-full md:w-72">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
           <input 
             type="text" 
             placeholder="Search receipts..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(t => (
          <div 
            key={t.id}
            onClick={() => navigate(`/receipt/${t.id}`)}
            className="bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl group flex flex-col justify-between h-48 relative overflow-hidden"
          >
            {/* Paper texture visual */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>

            <div>
               <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <ReceiptIcon className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                   Verified
                 </span>
               </div>
               
               <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-1">{t.description}</h3>
               <p className="text-slate-500 text-xs font-mono">{t.date}, 2024</p>
            </div>

            <div className="pt-4 border-t border-slate-800/50 flex justify-between items-end">
               <div>
                 <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Total Amount</p>
                 <p className={`text-xl font-serif font-bold ${t.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                    ${t.amount.toLocaleString()}
                 </p>
               </div>
               <button className="text-xs font-bold text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                  View &rarr;
               </button>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
         <div className="py-20 text-center">
            <p className="text-slate-500 font-medium">No receipts found matching your search.</p>
         </div>
      )}
    </div>
  );
};

export default Receipts;