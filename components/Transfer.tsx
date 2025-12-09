import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, ShieldCheck, Globe, Smartphone, ArrowRightLeft, Plus, XCircle, Landmark, ScanFace, CheckCircle, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_LINKED_ACCOUNTS } from '../constants';
import { Account } from '../types';

type TransferType = 'ach' | 'wire' | 'rtp' | 'internal';

interface TransferProps {
  accounts: Account[];
  onTransferSuccess: (amount: number, fromAccountId: string, description: string, category: string) => void;
}

const Transfer: React.FC<TransferProps> = ({ accounts, onTransferSuccess }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TransferType>('ach');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  
  // Progress Logic
  const [progressStages, setProgressStages] = useState<string[]>([]);
  const [transferError, setTransferError] = useState<string | null>(null);

  // Form States
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [achSpeed, setAchSpeed] = useState('standard'); // standard | next-day
  const [selectedLinkedAccount, setSelectedLinkedAccount] = useState('');

  // Update fromAccount if accounts change or empty
  useEffect(() => {
    if (accounts.length > 0 && !fromAccount) {
      setFromAccount(accounts[0].id);
    }
  }, [accounts, fromAccount]);

  // Check 2FA Status on mount
  useEffect(() => {
    const enabled = localStorage.getItem('trustbank_2fa') === 'true';
    setIs2FAEnabled(enabled);
  }, []);

  // Focus logic for OTP
  useEffect(() => {
    if (step === 3) {
      setTimeout(() => {
        document.getElementById('otp-0')?.focus();
      }, 100);
    }
  }, [step]);

  // Biometric Scan Logic
  useEffect(() => {
    let scanTimer: ReturnType<typeof setTimeout>;
    let transitionTimer: ReturnType<typeof setTimeout>;

    if (step === 2) {
      scanTimer = setTimeout(() => {
        setIsBiometricVerified(true);
        transitionTimer = setTimeout(() => {
          setStep(3);
        }, 1500);
      }, 2500);
    }
    return () => {
      clearTimeout(scanTimer);
      clearTimeout(transitionTimer);
    };
  }, [step]);

  const handleTransferInit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // Move to Biometric Scan
    }, 1000);
  };

  const handleOtpVerification = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate OTP presence
    if (otp.some(d => d === '')) {
       alert("Invalid Code – Please enter the complete 6-digit code.");
       return;
    }

    // If we are in setup mode (2FA was disabled), enable it now
    if (!is2FAEnabled) {
      localStorage.setItem('trustbank_2fa', 'true');
      setIs2FAEnabled(true);
    }

    // Move to Processing View
    setStep(4); 
    setProgressStages([]);
    setTransferError(null);

    const sourceAccount = accounts.find(a => a.id === fromAccount);
    const transferAmount = Number(amount);
    
    // Execute Sequence
    const runSequence = async () => {
        // Stage 1: Sending
        await new Promise(r => setTimeout(r, 800));
        setProgressStages(prev => [...prev, "Sending..."]);

        // Stage 2: System Verification
        await new Promise(r => setTimeout(r, 1000));
        setProgressStages(prev => [...prev, "System Verification..."]);
        
        // CHECK BALANCE
        if (!sourceAccount || sourceAccount.balance < transferAmount) {
            await new Promise(r => setTimeout(r, 1000));
            setTransferError("❌ Low Balance – Transfer Not Possible");
            return;
        }

        // Stage 3: Processing
        await new Promise(r => setTimeout(r, 1000));
        setProgressStages(prev => [...prev, "Processing..."]);

        // Stage 4: Processed
        await new Promise(r => setTimeout(r, 1000));
        setProgressStages(prev => [...prev, "Processed"]);

        // Stage 5: Approved
        await new Promise(r => setTimeout(r, 800));
        setProgressStages(prev => [...prev, "✅ Approved"]);

        // ACTUAL STATE UPDATE
        const description = `Transfer to ${activeTab === 'ach' ? 'External Linked' : 'Recipient'}`;
        const category = activeTab === 'internal' ? 'Internal Transfer' : 'Transfer';
        onTransferSuccess(transferAmount, fromAccount, description, category);

        // Move to Receipt
        setTimeout(() => {
            setStep(5);
        }, 1200);
    };

    runSequence();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };
  
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.every(char => !isNaN(Number(char)))) {
      const newOtp = [...otp];
      pastedData.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      document.getElementById(`otp-${Math.min(pastedData.length, 5)}`)?.focus();
    }
  };

  const renderTabButton = (type: TransferType, label: string, Icon: React.ElementType) => (
    <button
      onClick={() => { setActiveTab(type); setStep(1); }}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
        activeTab === type 
          ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20 transform scale-105' 
          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className={`w-6 h-6 mb-2 ${activeTab === type ? 'text-white' : 'text-slate-500'}`} />
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
  );

  // STEP 5: Success Receipt
  if (step === 5) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
          <CheckCircle2 className="w-12 h-12 text-orange-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 font-bank">Transfer Approved</h2>
        <p className="text-slate-400 mb-6 text-lg">
          Your funds have been securely transferred.
        </p>
        
        <div className="bg-slate-950 rounded-xl p-4 mb-8 text-left space-y-2 border border-slate-800">
           <div className="flex justify-between text-sm">
              <span className="text-slate-500">Amount</span>
              <span className="text-white font-mono font-bold">${Number(amount).toLocaleString()}</span>
           </div>
           <div className="flex justify-between text-sm">
              <span className="text-slate-500">Type</span>
              <span className="text-orange-400 font-bold uppercase">{activeTab}</span>
           </div>
           <div className="flex justify-between text-sm">
              <span className="text-slate-500">Ref ID</span>
              <span className="text-slate-300 font-mono">#TRX-{Math.floor(Math.random() * 10000)}</span>
           </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 font-bold uppercase tracking-wider"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // STEP 4: Processing Logic Visualization
  if (step === 4) {
      return (
        <div className="max-w-md mx-auto mt-10 bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 font-bank text-center">Processing Request</h2>
            
            <div className="space-y-4">
                {["Sending...", "System Verification...", "Processing...", "Processed", "✅ Approved"].map((stageLabel, idx) => {
                    const isCompleted = progressStages.includes(stageLabel);
                    const isCurrent = !isCompleted && (progressStages.length === idx);
                    const isError = transferError && idx === progressStages.length;

                    if (isError && idx === 2) return null; 

                    return (
                        <div key={idx} className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-500 ${isCompleted ? 'bg-slate-800/50 border-orange-500/30' : 'border-transparent'}`}>
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                                 isCompleted ? 'bg-orange-600 border-orange-600' : 
                                 isCurrent ? 'border-orange-500 border-t-transparent animate-spin' : 
                                 'border-slate-700 bg-slate-950'
                             }`}>
                                 {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                             </div>
                             <span className={`text-sm font-medium ${isCompleted ? 'text-white' : isCurrent ? 'text-orange-400' : 'text-slate-600'}`}>
                                 {stageLabel}
                             </span>
                        </div>
                    );
                })}

                {transferError && (
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-red-900/10 border border-red-500/50 animate-in shake">
                        <XCircle className="w-6 h-6 text-red-500" />
                        <span className="text-sm font-bold text-red-400">{transferError}</span>
                    </div>
                )}
            </div>

            {transferError && (
                <button 
                  onClick={() => setStep(1)}
                  className="w-full mt-6 bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-700 transition font-bold uppercase"
                >
                   Try Again
                </button>
            )}
        </div>
      );
  }

  // STEP 3: OTP Input (Combined Setup or Verify)
  if (step === 3) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 animate-in slide-in-from-right duration-300">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
              {is2FAEnabled ? (
                <ShieldCheck className="w-8 h-8 text-orange-500" />
              ) : (
                <QrCode className="w-8 h-8 text-orange-500" />
              )}
           </div>
           <h2 className="text-2xl font-bold text-white mb-2 font-bank">
             {is2FAEnabled ? 'Authenticator Verification' : 'Setup Security'}
           </h2>
           <p className="text-slate-400 text-sm">
             {is2FAEnabled 
               ? <span>Open your <span className="text-white font-bold">Google Authenticator</span> app and enter the 6-digit code.</span>
               : <span>To secure this transaction, please scan this code with <span className="text-white font-bold">Google Authenticator</span>.</span>
             }
           </p>
        </div>

        {/* QR Code Generator Display (Only if 2FA NOT enabled) */}
        {!is2FAEnabled && (
          <div className="flex flex-col items-center justify-center mb-8 animate-in zoom-in duration-300">
             <div className="bg-white p-3 rounded-xl shadow-lg border-4 border-slate-800">
               <img 
                 src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/TrustBank:howard.woods@trustbank.com?secret=JBSWY3DPEHPK3PXP&issuer=TrustBank" 
                 alt="QR Code" 
                 className="w-32 h-32"
               />
             </div>
             <p className="text-xs text-slate-500 mt-4 font-mono bg-slate-950 px-3 py-1 rounded border border-slate-800">
               Secret: JBSW Y3DP EHPK 3PXP
             </p>
          </div>
        )}

        <form onSubmit={handleOtpVerification}>
          <div className="flex justify-center gap-2 mb-8" onPaste={handleOtpPaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                placeholder={!is2FAEnabled ? "-" : ""}
                className="w-12 h-14 bg-slate-950 border border-slate-700 rounded-lg text-center text-2xl font-bold text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
              />
            ))}
          </div>

          <button 
            type="submit"
            disabled={isLoading || otp.some(d => d === '')}
            className="w-full bg-orange-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-orange-700 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-900/20 mb-4"
          >
            {isLoading ? <span>Verifying...</span> : <span>{is2FAEnabled ? 'Confirm Transfer' : 'Verify & Enable'}</span>}
          </button>
        </form>

        <div className="text-center">
            <p className="text-slate-600 text-xs">
              {is2FAEnabled ? 'Secure transfer initialized. TOTP code required.' : 'Setup is required once to secure all future transfers.'}
            </p>
        </div>
      </div>
    );
  }

  // STEP 2: Biometric Scan
  if (step === 2) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-slate-900 p-10 rounded-2xl shadow-xl border border-slate-800 animate-in zoom-in duration-500 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-bold text-white mb-8 font-bank tracking-widest uppercase">Biometric Security</h2>
        
        <div className="relative mb-8">
          {!isBiometricVerified ? (
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center relative overflow-hidden bg-slate-950">
                 <ScanFace className="w-16 h-16 text-slate-600" />
                 <div className="absolute inset-0 border-t-4 border-orange-500/80 animate-scan shadow-[0_0_20px_rgba(249,115,22,0.5)]"></div>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-green-500/30 flex items-center justify-center bg-green-500/10 animate-in zoom-in duration-300">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          )}
        </div>
        <p className="text-slate-400 font-mono text-sm animate-pulse">
          {isBiometricVerified ? 'Identity Verified' : 'Scanning Face ID...'}
        </p>
      </div>
    );
  }

  // STEP 1: Main Transfer Interface
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white font-bank">Money Transfer</h1>
           <p className="text-slate-400 mt-1">Securely move funds between internal and external accounts.</p>
        </div>
        <button 
          onClick={() => navigate('/link-account')}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-3 rounded-xl border border-slate-700 transition font-bold text-sm uppercase tracking-wide"
        >
          <Plus className="w-4 h-4" />
          <span>Link External Account</span>
        </button>
      </div>

      {/* Type Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {renderTabButton('ach', 'ACH Transfer', Landmark)}
        {renderTabButton('wire', 'Wire Transfer', Globe)}
        {renderTabButton('rtp', 'Real-Time (RTP)', Smartphone)}
        {renderTabButton('internal', 'Internal Transfer', ArrowRightLeft)}
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 md:p-8">
        <form onSubmit={handleTransferInit} className="space-y-8">
          
          {/* FROM Account */}
          <div className="space-y-4">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">From Source Account</label>
             <select 
               value={fromAccount}
               onChange={(e) => setFromAccount(e.target.value)}
               className="w-full px-4 py-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-orange-500 outline-none text-lg"
             >
               {accounts.map(acc => (
                 <option key={acc.id} value={acc.id}>
                   {acc.name} (...{acc.accountNumber}) - ${acc.balance.toLocaleString()}
                 </option>
               ))}
             </select>
          </div>

          {/* Dynamic Content Based on Tab */}
          
          {/* ACH Content */}
          {activeTab === 'ach' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipient Account (Linked)</label>
                    <select 
                      value={selectedLinkedAccount}
                      onChange={(e) => setSelectedLinkedAccount(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      <option value="">Select a linked account</option>
                      {MOCK_LINKED_ACCOUNTS.map(link => (
                        <option key={link.id} value={link.id}>{link.institution} - {link.name} (...{link.mask})</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => navigate('/link-account')} className="text-orange-500 text-xs font-bold mt-2 hover:underline">+ Link New Account</button>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Delivery Speed</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                        type="button" 
                        onClick={() => setAchSpeed('standard')}
                        className={`p-3 rounded-xl border text-left ${achSpeed === 'standard' ? 'bg-slate-800 border-orange-500 text-white' : 'bg-slate-950 border-slate-700 text-slate-500'}`}
                       >
                         <span className="block text-xs font-bold uppercase">Standard</span>
                         <span className="text-[10px] opacity-70">1-3 Days (Free)</span>
                       </button>
                       <button 
                        type="button" 
                        onClick={() => setAchSpeed('next-day')}
                        className={`p-3 rounded-xl border text-left ${achSpeed === 'next-day' ? 'bg-slate-800 border-orange-500 text-white' : 'bg-slate-950 border-slate-700 text-slate-500'}`}
                       >
                         <span className="block text-xs font-bold uppercase">Next Day</span>
                         <span className="text-[10px] opacity-70">Tomorrow ($10)</span>
                       </button>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {/* Wire Content */}
          {activeTab === 'wire' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl mb-4">
                <p className="text-blue-400 text-xs font-mono">
                  <Globe className="w-3 h-3 inline mr-2" />
                  International & Domestic Wires sent before 4PM ET are processed same-day.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Beneficiary Name</label>
                   <input required type="text" placeholder="FULL LEGAL NAME" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">SWIFT / BIC Code</label>
                   <input required type="text" placeholder="ABCDUS33XXX" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 font-mono uppercase" />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">IBAN / Account Number</label>
                   <input required type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 font-mono" />
                 </div>
              </div>
            </div>
          )}

          {/* RTP/Instant Content */}
          {activeTab === 'rtp' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
               <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl mb-4">
                <p className="text-purple-400 text-xs font-mono">
                  <Smartphone className="w-3 h-3 inline mr-2" />
                  Real-Time Payments sent to US mobile numbers or emails settle instantly.
                </p>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Recipient Email or Mobile</label>
                 <input required type="text" placeholder="name@example.com or 555-0123" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500" />
              </div>
            </div>
          )}

          {/* Internal Content */}
          {activeTab === 'internal' && (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Destination Account</label>
                <select className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-orange-500 outline-none">
                  {accounts.filter(a => a.id !== fromAccount).map(acc => (
                     <option key={acc.id} value={acc.id}>{acc.name} (...{acc.accountNumber})</option>
                  ))}
                </select>
             </div>
          )}

          {/* Amount Input (Common) */}
          <div className="space-y-4 pt-6 border-t border-slate-800">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</label>
             <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">$</span>
                <input 
                  required
                  type="number" 
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 text-3xl font-bold text-white bg-slate-950 rounded-xl border border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none transition font-mono"
                />
             </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading || !amount}
            className="w-full bg-orange-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-orange-700 transition flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-orange-900/20 uppercase tracking-wide"
          >
            {isLoading ? <span>Processing...</span> : <span>Initiate {activeTab} Transfer</span>}
            <Send className="w-5 h-5" />
          </button>

        </form>
      </div>
    </div>
  );
};

export default Transfer;