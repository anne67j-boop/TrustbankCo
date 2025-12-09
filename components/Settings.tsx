import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Lock, CheckCircle, Copy, AlertCircle, RefreshCw } from 'lucide-react';
import Tooltip from './ui/Tooltip';

const Settings: React.FC = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState<'idle' | 'qr' | 'verify' | 'success'>('idle');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verificationError, setVerificationError] = useState(false);

  useEffect(() => {
    // Check mock backend state
    const enabled = localStorage.getItem('trustbank_2fa') === 'true';
    setIs2FAEnabled(enabled);
  }, []);

  const handleStartSetup = () => {
    setSetupStep('qr');
  };

  const handleVerify = () => {
    if (otp.join('').length === 6) {
      // Mock verification
      setSetupStep('success');
      setIs2FAEnabled(true);
      localStorage.setItem('trustbank_2fa', 'true');
      setOtp(['', '', '', '', '', '']);
    } else {
      setVerificationError(true);
    }
  };

  const handleDisable = () => {
    if (confirm("Are you sure you want to disable 2FA? This will lower your account security.")) {
      setIs2FAEnabled(false);
      localStorage.removeItem('trustbank_2fa');
      setSetupStep('idle');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      document.getElementById(`setup-otp-${index + 1}`)?.focus();
    }
    setVerificationError(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Security Settings</h1>
          <p className="text-slate-400 text-base mt-2 font-medium">Manage your account security and two-factor authentication.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-800/30">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            Two-Factor Authentication (2FA)
          </h2>
        </div>

        <div className="p-8">
          {!is2FAEnabled && setupStep === 'idle' && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <p className="text-slate-300 leading-relaxed">
                  Protect your account by adding an extra layer of security. When you sign in, you'll need to enter a code from Google Authenticator.
                </p>
                <div className="flex items-start gap-3">
                   <div className="bg-slate-800 p-2 rounded-lg">
                     <Lock className="w-5 h-5 text-green-400" />
                   </div>
                   <div>
                     <h4 className="font-bold text-white text-sm">Enhanced Protection</h4>
                     <p className="text-slate-500 text-xs mt-1">Prevents unauthorized access even if your password is compromised.</p>
                   </div>
                </div>
              </div>
              <button 
                onClick={handleStartSetup}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-900/20 whitespace-nowrap"
              >
                Enable 2FA
              </button>
            </div>
          )}

          {/* Setup Flow */}
          {setupStep === 'qr' && (
             <div className="max-w-md mx-auto text-center space-y-6 animate-in slide-in-from-right duration-300">
                <h3 className="text-xl font-bold text-white">Scan QR Code</h3>
                <p className="text-slate-400 text-sm">Open Google Authenticator and scan this code.</p>
                
                <div className="bg-white p-4 rounded-xl inline-block mx-auto shadow-lg">
                   {/* Mock QR Code pointing to a dummy otpauth URL */}
                   <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/TrustBank:howard.woods@trustbank.com?secret=JBSWY3DPEHPK3PXP&issuer=TrustBank" 
                    alt="QR Code" 
                    className="w-48 h-48"
                   />
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
                   <code className="text-orange-400 font-mono tracking-widest text-sm">JBSW Y3DP EHPK 3PXP</code>
                   <Tooltip content="Copy Secret">
                     <button className="text-slate-500 hover:text-white"><Copy className="w-4 h-4" /></button>
                   </Tooltip>
                </div>

                <div className="flex gap-4 justify-center">
                  <button onClick={() => setSetupStep('idle')} className="text-slate-500 font-bold text-sm hover:text-white">Cancel</button>
                  <button 
                    onClick={() => setSetupStep('verify')}
                    className="px-8 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold rounded-xl transition"
                  >
                    Next Step
                  </button>
                </div>
             </div>
          )}

          {setupStep === 'verify' && (
             <div className="max-w-md mx-auto text-center space-y-6 animate-in slide-in-from-right duration-300">
                <h3 className="text-xl font-bold text-white">Verify Code</h3>
                <p className="text-slate-400 text-sm">Enter the 6-digit code from your authenticator app.</p>
                
                <div className="flex justify-center gap-2 my-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`setup-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-14 bg-slate-950 border border-slate-700 rounded-lg text-center text-2xl font-bold text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                    />
                  ))}
                </div>
                
                {verificationError && (
                   <p className="text-red-400 text-xs font-bold flex items-center justify-center gap-1">
                     <AlertCircle className="w-3 h-3" /> Invalid code. Please try again.
                   </p>
                )}

                <button 
                  onClick={handleVerify}
                  disabled={otp.join('').length !== 6}
                  className="w-full py-4 bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-lg"
                >
                  Verify & Activate
                </button>
                
                <button onClick={() => setSetupStep('qr')} className="text-slate-500 font-bold text-sm hover:text-white mt-4">Back</button>
             </div>
          )}

          {(is2FAEnabled && setupStep !== 'qr' && setupStep !== 'verify') && (
            <div className="flex items-center justify-between p-4 bg-green-900/10 border border-green-500/20 rounded-xl animate-in fade-in duration-300">
               <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">2FA is Enabled</h3>
                    <p className="text-slate-400 text-sm">Your account is secured with Google Authenticator.</p>
                  </div>
               </div>
               <button onClick={handleDisable} className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-bold transition">
                 Disable
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Other Settings Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 opacity-60 pointer-events-none">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Trusted Devices</h3>
          <p className="text-slate-500 text-sm">Manage devices that are authorized to access your account.</p>
        </div>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 opacity-60 pointer-events-none">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Password Rotation</h3>
          <p className="text-slate-500 text-sm">Configure mandatory password updates policies.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;