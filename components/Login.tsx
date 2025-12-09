import React, { useState, useEffect } from 'react';
import { Landmark, Lock, Mail, ScanFace, CheckCircle, ChevronRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  // Setup Steps: 1 = Credentials, 2 = OTP, 3 = Biometric Fallback (Optional)
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Credentials
  const [email, setEmail] = useState('howard.woods@trustbank.com');
  const [password, setPassword] = useState('');
  
  // OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);

  // Biometric
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);

  // Biometric Effect
  useEffect(() => {
    let scanTimer: ReturnType<typeof setTimeout>;
    let verifyTimer: ReturnType<typeof setTimeout>;

    if (isBiometricScanning) {
      scanTimer = setTimeout(() => {
        setIsBiometricVerified(true);
        verifyTimer = setTimeout(() => {
           onLogin(); // Biometric bypasses OTP for this demo, or acts as strong auth
        }, 1000);
      }, 2000);
    }

    return () => {
      clearTimeout(scanTimer);
      clearTimeout(verifyTimer);
    };
  }, [isBiometricScanning, onLogin]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate Network Call
    setTimeout(() => {
      setIsLoading(false);
      // Mock Check: In a real app, backend tells us if OTP is required
      const is2FAEnabled = localStorage.getItem('trustbank_2fa') === 'true';
      
      if (is2FAEnabled) {
        setStep(2);
      } else {
        onLogin();
      }
    }, 800);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 6) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 800);
    } else {
      setOtpError(true);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      document.getElementById(`login-otp-${index + 1}`)?.focus();
    }
    setOtpError(false);
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasted.every(c => !isNaN(Number(c)))) {
      const newOtp = [...otp];
      pasted.forEach((d, i) => { if(i < 6) newOtp[i] = d });
      setOtp(newOtp);
      document.getElementById(`login-otp-${Math.min(pasted.length, 5)}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-inter text-slate-200">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 z-10 animate-in fade-in zoom-in duration-500 relative">
        
        {/* Header */}
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
          <>
            {/* STEP 1: Credentials */}
            {step === 1 && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Client ID</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder-slate-600 font-medium"
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
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder-slate-600 font-medium"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl text-base font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95 uppercase tracking-wide flex items-center justify-center space-x-2"
                >
                  {isLoading ? <span>Verifying...</span> : <><span>Sign In</span> <ChevronRight className="w-4 h-4" /></>}
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
                  onClick={() => setIsBiometricScanning(true)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 py-4 rounded-xl text-base font-bold hover:bg-slate-750 hover:text-white hover:border-slate-600 transition active:scale-95 flex items-center justify-center space-x-3"
                >
                  <ScanFace className="w-5 h-5" />
                  <span>Biometric ID</span>
                </button>
              </form>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="text-center mb-6">
                   <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-700">
                      <ShieldCheck className="w-6 h-6 text-orange-500" />
                   </div>
                   <h2 className="text-lg font-bold text-white">2FA Verification</h2>
                   <p className="text-slate-400 text-sm mt-1">Enter the 6-digit code from your authenticator app.</p>
                </div>

                <div className="flex justify-center gap-2 mb-4" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`login-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-14 bg-slate-950 border border-slate-700 rounded-lg text-center text-2xl font-bold text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                    />
                  ))}
                </div>

                {otpError && (
                   <div className="flex items-center justify-center space-x-2 text-red-400 text-xs font-bold animate-pulse">
                     <AlertCircle className="w-4 h-4" />
                     <span>Invalid authentication code.</span>
                   </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl text-base font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Identity'}
                </button>

                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-slate-500 text-sm font-bold hover:text-white transition flex items-center justify-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </button>
              </form>
            )}
          </>
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