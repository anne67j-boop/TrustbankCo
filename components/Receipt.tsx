import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Printer, CheckCircle2, Landmark, MapPin, Receipt as ReceiptIcon } from 'lucide-react';
import { Transaction, Account } from '../types';
import Tooltip from './ui/Tooltip';

interface ReceiptProps {
  transactions: Transaction[];
  accounts: Account[];
}

const Receipt: React.FC<ReceiptProps> = ({ transactions, accounts }) => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();

  const transaction = transactions.find(t => t.id === transactionId);
  
  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in">
        <ReceiptIcon className="w-16 h-16 text-slate-700" />
        <h2 className="text-2xl font-bold text-white">Receipt Not Found</h2>
        <button onClick={() => navigate('/')} className="text-orange-400 font-bold hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const account = accounts.find(a => a.id === transaction.accountId);

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12 animate-in slide-in-from-bottom-6 duration-500">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-wider">Back</span>
        </button>
        <div className="flex space-x-2">
          <Tooltip content="Print Receipt">
            <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition">
              <Printer className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip content="Share Secure Link">
            <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip content="Download PDF">
            <button className="p-2 bg-orange-600 rounded-lg text-white hover:bg-orange-700 transition shadow-lg shadow-orange-900/20">
              <Download className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Digital Receipt Card */}
      <div className="bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
        {/* Top Decorative Bar */}
        <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
        
        {/* Receipt Header */}
        <div className="p-8 pb-0 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-full mb-4 shadow-xl">
             <Landmark className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight mb-1">TrustBank</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Transaction Record</p>
          
          <div className="my-8">
             <h2 className={`text-5xl font-bold tracking-tighter ${transaction.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
               {transaction.type === 'credit' ? '+' : ''}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
             </h2>
             <div className="flex items-center justify-center mt-2 space-x-2">
               <CheckCircle2 className="w-4 h-4 text-green-500" />
               <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Approved & Verified</span>
             </div>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="px-8 pb-8 relative z-10">
           {/* Tear line visual */}
           <div className="border-b-2 border-dashed border-slate-200 mb-8 relative">
              <div className="absolute -left-10 -bottom-2.5 w-5 h-5 bg-[#020617] rounded-full"></div>
              <div className="absolute -right-10 -bottom-2.5 w-5 h-5 bg-[#020617] rounded-full"></div>
           </div>

           <div className="space-y-4 text-sm">
             <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <span className="font-bold text-slate-900">{transaction.date}, 2024 &bull; 2:41 PM</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Merchant</span>
                <span className="font-bold text-slate-900">{transaction.merchant || transaction.description}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Category</span>
                <span className="font-bold text-slate-900 inline-flex items-center px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs uppercase">
                  {transaction.category}
                </span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Payment Method</span>
                <span className="font-bold text-slate-900 flex items-center">
                   {account ? `${account.name} (...${account.accountNumber})` : 'External Transfer'}
                </span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Reference ID</span>
                <span className="font-mono text-xs text-slate-400">{transaction.id.toUpperCase()}-TRX-8829</span>
             </div>
           </div>
           
           {/* Map Placeholder */}
           <div className="mt-8 rounded-lg bg-slate-100 border border-slate-200 h-24 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="flex items-center space-x-2 text-slate-500 font-bold text-xs uppercase tracking-wider z-10">
                 <MapPin className="w-4 h-4" />
                 <span>Location Data Hidden</span>
              </div>
           </div>
        </div>

        {/* Receipt Footer / Barcode */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col items-center justify-center text-center">
           <div className="h-12 w-3/4 bg-slate-900 opacity-90 mb-2" style={{ maskImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px)' }}></div>
           <p className="font-mono text-[10px] text-slate-400 tracking-[0.5em]">{transaction.id.toUpperCase()}00019283</p>
           <p className="text-[10px] text-slate-400 mt-4 max-w-xs leading-relaxed">
             TrustBank Private Wealth. Member FDIC. Equal Housing Lender. 
             This electronic receipt is a valid proof of transaction.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;