"use client";
import Image from 'next/image'; // Import Image

export default function DeliveryPartnerLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8]">
      
      {/* Main Split-Screen Card */}
      <div className="max-w-[850px] w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side: Branding */}
        <div className="w-full md:w-1/2 relative bg-[#F97316] p-8 flex flex-col justify-center items-center text-center overflow-hidden min-h-[400px]">
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-sm overflow-hidden bg-white">
               {/* Replace SVG with Next.js Image */}
               <Image 
                 src="/logo.jpeg" 
                 alt="VIGO FEAST Logo" 
                 width={64} 
                 height={64} 
                 className="object-cover w-full h-full"
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
        <div className="w-full md:w-1/2 p-10 bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1F2937]">Delivery Partner Login</h2>
            <p className="text-[#0F766E] font-bold text-sm mt-1 uppercase tracking-widest">Module 3.1</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input 
                type="text" 
                placeholder="Mobile Number" 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1F2937] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-colors"
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1F2937] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]" />
                <span className="text-gray-600 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-gray-500 hover:text-[#0F766E] font-medium">Forgot Password?</a>
            </div>

            <button className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3.5 rounded-lg transition-colors shadow-md">
              Login
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-xs font-bold uppercase">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Restored Google Icon inside Button */}
          <button className="mt-6 w-full border border-gray-200 bg-white text-[#1F2937] font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors flex justify-center items-center gap-3 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}