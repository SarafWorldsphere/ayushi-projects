"use client";
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DeliveryPartnerLogin() {
  const router = useRouter();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [language, setLanguage] = useState('en'); // New language state
  const [step, setStep] = useState('phone'); // Tracks whether to show Phone or OTP input
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Soft-coded API URL targeting the Rider backend on the new port
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:21105';

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, language }), // Passing language to backend
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || 'Failed to send OTP. Please try again.');
      }
      
      // Move to OTP verification step
      setStep('otp');
    } catch (err: any) {
      setError(err.message || "Failed to connect to the server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Invalid or expired OTP');

      // Set tokens for layout compatibility and routing
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("rider_access_token", data.access_token);
      
      // Redirect to dashboard
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google Login authentication will be integrated in the upcoming phase.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8] p-4">
      
      <div className="max-w-[850px] w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side: Branding */}
        <div className="w-full md:w-1/2 relative bg-[#F97316] p-8 flex flex-col justify-center items-center text-center overflow-hidden min-h-[400px]">
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-md overflow-hidden bg-white relative">
              <Image 
                src="/logo.jpeg" 
                alt="Vigo Feast Logo" 
                fill 
                style={{ objectFit: 'contain' }} 
                className="p-1"
                priority
              />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">
              VIGO<span className="text-[#1F2937]">FEAST</span>
            </h1>
            <h2 className="text-xl font-bold text-white mb-2">Deliver Happiness</h2>
            <h3 className="text-2xl font-black text-white/90">Earn More</h3>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full md:w-1/2 p-10 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1F2937]">Delivery Partner Login</h2>
            <p className="text-[#0F766E] font-bold text-sm mt-1 uppercase tracking-widest">Module 3.1</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 text-[#DC2626] text-sm font-medium p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Dynamic Form: Toggles between Phone input and OTP input */}
          {step === 'phone' ? (
            <form className="space-y-5" onSubmit={handleSendOtp}>
              
              {/* Language Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">OTP Language</label>
                <div className="flex gap-3">
                  <label className={`flex-1 text-center py-2 px-3 border rounded-lg cursor-pointer transition-colors text-sm font-bold ${language === 'en' ? 'bg-[#0F766E] text-white border-[#0F766E]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                    <input type="radio" name="lang" value="en" checked={language === 'en'} onChange={() => setLanguage('en')} className="hidden" />
                    English
                  </label>
                  <label className={`flex-1 text-center py-2 px-3 border rounded-lg cursor-pointer transition-colors text-sm font-bold ${language === 'hi' ? 'bg-[#0F766E] text-white border-[#0F766E]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                    <input type="radio" name="lang" value="hi" checked={language === 'hi'} onChange={() => setLanguage('hi')} className="hidden" />
                    Hindi
                  </label>
                  <label className={`flex-1 text-center py-2 px-3 border rounded-lg cursor-pointer transition-colors text-sm font-bold ${language === 'te' ? 'bg-[#0F766E] text-white border-[#0F766E]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                    <input type="radio" name="lang" value="te" checked={language === 'te'} onChange={() => setLanguage('te')} className="hidden" />
                    Telugu
                  </label>
                </div>
              </div>

              <div>
                <input 
                  type="tel" 
                  placeholder="Enter Mobile Number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1F2937] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]" />
                  <span className="text-gray-600 font-medium">Remember me</span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-70 text-white font-bold py-3.5 rounded-lg transition-colors shadow-md flex justify-center items-center"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1F2937] text-center text-lg tracking-widest focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-colors"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0F766E] hover:bg-[#0d645d] disabled:opacity-70 text-white font-bold py-3.5 rounded-lg transition-colors shadow-md flex justify-center items-center"
              >
                {isLoading ? "Verifying..." : "Verify & Login"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                  className="text-sm font-medium text-gray-500 hover:text-[#F97316] transition-colors"
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-xs font-bold uppercase">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google Login Button */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="mt-6 w-full border border-gray-200 bg-white text-[#1F2937] font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors flex justify-center items-center gap-3 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}