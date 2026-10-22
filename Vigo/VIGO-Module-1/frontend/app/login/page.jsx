"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [language, setLanguage] = useState('en'); 
  const router = useRouter();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Pointing to the new Module 1 backend port 21103
      const response = await fetch('http://localhost:21103/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, language }), 
      });

      if (!response.ok) throw new Error('Failed to send OTP. Please check the number.');
      setStep('otp');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Pointing to the new Module 1 backend port 21103
      const response = await fetch('http://localhost:21103/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Invalid or expired OTP');

      localStorage.setItem('access_token', data.access_token);
      
      router.push('/dashboard');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google Login Integration Pending!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fafafa] p-4 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-[850px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden min-h-[500px]">
        
        {/* Left Side */}
        <div className="w-full md:w-5/12 bg-[#f97316] p-8 flex flex-col items-center justify-center text-center text-white relative">
          <div className="w-20 h-20 bg-white rounded-2xl p-1 mb-6 shadow-md relative overflow-hidden">
             <Image src="/logo.jpeg" alt="Vigo Feast Logo" fill style={{ objectFit: 'contain' }} />
          </div>
          
          <h1 className="text-3xl font-black tracking-widest mb-2 uppercase">Vigofeast</h1>
          <p className="text-lg font-semibold text-white/90 mb-1 tracking-wide">Deliver Happiness</p>
          <p className="text-xl font-extrabold tracking-wide">Earn More</p>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white">
          <h2 className="text-[22px] font-bold text-gray-900 mb-1">Customer Login</h2>
          <p className="text-[11px] font-bold text-[#0f766e] tracking-widest uppercase mb-8">Customer Module</p>

          {errorMsg && <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-100">{errorMsg}</p>}

          {/* OTP Flow Forms */}
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              
              {/* OTP Language Selector */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase">OTP Language</label>
                <div className="flex gap-2 mt-2">
                  <button 
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`flex-1 py-2 text-sm rounded-md border transition-colors ${language === "en" ? "bg-[#0f766e] text-white border-[#0f766e]" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                  >
                    English
                  </button>
                  <button 
                    type="button"
                    onClick={() => setLanguage("hi")}
                    className={`flex-1 py-2 text-sm rounded-md border transition-colors ${language === "hi" ? "bg-[#0f766e] text-white border-[#0f766e]" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                  >
                    Hindi
                  </button>
                  <button 
                    type="button"
                    onClick={() => setLanguage("te")}
                    className={`flex-1 py-2 text-sm rounded-md border transition-colors ${language === "te" ? "bg-[#0f766e] text-white border-[#0f766e]" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                  >
                    Telugu
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="w-full px-4 py-3 bg-[#fcfcfc] border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder:text-gray-400"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 pb-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                    Remember me
                 </label>
                 <button type="button" className="hover:text-orange-500 transition-colors">Forgot Password?</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-bold text-white transition bg-[#f97316] rounded-lg shadow-sm hover:bg-[#ea580c] disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 bg-[#fcfcfc] border border-gray-200 rounded-lg text-sm tracking-widest text-center text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder:tracking-normal placeholder:text-gray-400"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 pb-2">
                 <button type="button" onClick={() => setStep('phone')} className="hover:text-orange-500 transition-colors underline">Change Mobile Number</button>
                 <button type="button" onClick={handleSendOtp} className="hover:text-orange-500 font-bold transition-colors">Resend OTP</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-bold text-white transition bg-[#f97316] rounded-lg shadow-sm hover:bg-[#ea580c] disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Login'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center my-6 opacity-80">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-4 text-[10px] text-gray-400 font-medium tracking-wide">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google Login Button */}
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-bold text-gray-700">Continue with Google</span>
          </button>

        </div>
      </div>
    </div>
  );
}