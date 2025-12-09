import React, { useState } from 'react';
import { Building2, ShieldCheck, Lock, ChevronRight, Loader2, CheckCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INSTITUTIONS = [
  { name: 'Chase', color: 'bg-blue-600' },
  { name: 'Bank of America', color: 'bg-red-600' },
  { name: 'Wells Fargo', color: 'bg-yellow-600' },
  { name: 'Citi', color: 'bg-blue-500' },
  { name: 'American Express', color: 'bg-blue-400' },
  { name: 'Fidelity', color: 'bg-green-600' },
  { name: 'Charles Schwab', color: 'bg-blue-300' },
  { name: 'Vanguard', color: 'bg-red-800' },
];

const LinkAccount: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'select' | 'credentials' | 'verifying' | 'success'>('select');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSelect = (bank: string) => {
    setSelectedBank(bank);
    setStep('credentials');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verifying');
    // Simulate API call
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center space-x-2 text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/transfer')}>
        <span className="text-sm font-bold uppercase tracking-wider">Cancel Linkage</span>
      </div>

      <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-950 p-8 border-b border-slate-800 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
            <Building2 className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-white font-bank tracking-wide">Link External Account</h1>
          <p className="text-slate-400 mt-2 text-sm flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            SECURE ENCRYPTED CONNECTION
          </p>
        </div>

        <div className="p-8 min-h-[400px]">
          
          {step === 'select' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search your institution"
                  className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none placeholder-slate-600 font-medium transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INSTITUTIONS.map((inst) => (
                  <button 
                    key={inst.name}
                    onClick={() => handleSelect(inst.name)}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-900 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full ${inst.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {inst.name[0]}
                      </div>
                      <span className="font-bold text-slate-300 group-hover:text-white">{inst.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-orange-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'credentials' && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
               <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-white">Log in to {selectedBank}</h3>
                  <p className="text-sm text-slate-500">Enter your credentials to authorize access.</p>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">User ID</label>
                   <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 outline-none"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
                   <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 outline-none"
                   />
                 </div>
                 <button 
                   type="submit"
                   className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 mt-4"
                 >
                   Agree & Connect
                 </button>
               </form>
            </div>
          )}

          {step === 'verifying' && (
            <div className="flex flex-col items-center justify-center h-full py-12 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin"></div>
                <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-slate-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">Verifying Credentials</h3>
                <p className="text-slate-500 text-sm mt-1">Establishing secure handshake with {selectedBank}...</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center h-full py-12 space-y-6 animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                 <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">Account Linked</h3>
                <p className="text-slate-400 max-w-xs mx-auto">
                  Your {selectedBank} account has been successfully verified and added to your portfolio.
                </p>
              </div>
              <button 
                onClick={() => navigate('/transfer')}
                className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition"
              >
                Return to Transfers
              </button>
            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
            Data provided by secure open banking protocol
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkAccount;