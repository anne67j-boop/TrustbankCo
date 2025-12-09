import React, { useState, useEffect } from 'react';
import { Landmark, Lock, Mail, ScanFace, CheckCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [email, setEmail] = useState('howard.woods@trustbank.com');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleBiometricLogin = () => {
    setIsBiometricScanning(true);
  };

  useEffect(() => {
    let scanTimer: ReturnType<typeof setTimeout>;
    let redirectTimer: ReturnType<typeof setTimeout>;

    if (isBiometricScanning) {
      // Simulate scanning delay
      scanTimer = setTimeout(() => {
        setIsBiometricVerified(true);
      }, 2000);
    }
    
    if (isBiometricVerified) {
       // Simulate redirect after success
       redirectTimer = setTimeout(() => {
          onLogin();
       }, 1000);
    }

    return () => {
      clearTimeout(scanTimer);
      clearTimeout(redirectTimer);
    };
  }, [isBiometricScanning, isBiometricVerified, onLogin]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-inter text-slate-200">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 z-10 animate-in fade-in zoom-in duration-500">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl shadow-lg shadow-orange-500/20 mb-4">
            <Landmark className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-bank">TRUSTBANK</h1>
          <p className="text-xs text-orange-400 uppercase tracking-[0.2em] font-bold mt-1">Private Wealth Portal</p>
        </div>

        {isBiometricScanning ? (
           <div className="flex flex-col items-center justify-center py-10 space-y-6">
              <div className="relative">
                 {!isBiometricVerified ? (
                    <div className="relative">
                       <ScanFace className="w-24 h-24 text-slate-600 animate-pulse" />
                       <div className="absolute inset-0 border-t-2 border-orange-500 animate-scan"></div>
                    </div>
                 ) : (
                    <CheckCircle className="w-24 h-24 text-green-500 animate-in zoom-in duration-300" />
                 )}
              </div>
              <p className="text-slate-400 font-mono text-sm">
                 {isBiometricVerified ? 'Identity Verified' : 'Scanning FaceID...'}
              </p>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Client ID / Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-slate-600 font-medium"
                    placeholder="name@trustbank.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-slate-600 font-medium"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
               <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-orange-600 focus:ring-orange-600 focus:ring-offset-slate-900" />
                  <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
               </label>
               <button type="button" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">Forgot password?</button>
            </div>

            <button 
              type="submit" 
              className="w-full bg-orange-600 text-white py-4 rounded-xl text-base font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95 uppercase tracking-wide"
            >
              Sign In
            </button>

            <div className="relative py-2">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
               </div>
               <div className="relative flex justify-center">
                  <span className="px-4 bg-slate-900 text-xs text-slate-500 uppercase tracking-wider font-semibold">Or verify with</span>
               </div>
            </div>

            <button 
              type="button"
              onClick={handleBiometricLogin}
              className="w-full bg-slate-800 border border-slate-700 text-slate-300 py-4 rounded-xl text-base font-bold hover:bg-slate-750 hover:text-white hover:border-slate-600 transition active:scale-95 flex items-center justify-center space-x-3"
            >
              <ScanFace className="w-5 h-5" />
              <span>Biometric ID</span>
            </button>
          </form>
        )}
      </div>

      <div className="absolute bottom-6 text-center">
         <p className="text-xs text-slate-600 font-medium">
            Authorized Personnel Only • Secure 256-bit Encryption
         </p>
      </div>
    </div>
  );
};

export default Login;