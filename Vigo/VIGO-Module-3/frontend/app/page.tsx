// app/page.tsx
"use client";
import { riderProfile, assignedOrders, routeSteps } from "@/app/lib/mockData";

export default function RiderDashboard() {
  return (
    <div className="flex flex-col h-screen relative z-0 bg-[#FFFDF8] text-[#1F2937]">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F97316]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="h-24 flex items-center justify-between px-8 shrink-0 z-10 border-b border-gray-200 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#1F2937] tracking-tight drop-shadow-sm">Order Assignment</h2>
          <p className="text-xs text-[#0F766E] font-bold tracking-widest uppercase mt-1">Modules 3.3</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
          <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse"></div>
          <span className="text-[13px] font-bold text-[#1F2937]">Status: {riderProfile.status}</span>
        </div>
      </header>
      
      <div className="flex-1 px-8 pb-8 overflow-hidden z-10">
        <div className="flex flex-col lg:flex-row gap-6 h-full max-w-[1400px] mx-auto">
          
          {/* Active Orders List */}
          <div className="flex-1 bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col h-full overflow-hidden">
            <h3 className="text-lg font-bold text-[#1F2937] mb-4 flex justify-between items-center border-b border-gray-100 pb-3 shrink-0">
              Assigned Orders
              <span className="bg-[#F97316]/10 text-[#F97316] py-1 px-3 rounded-full text-xs font-bold border border-[#F97316]/20">
                {assignedOrders.length} Active
              </span>
            </h3>
            <ul className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
              {assignedOrders.map((order) => (
                <li key={order.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 shrink-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[#1F2937]">{order.id}</span>
                    <span className="font-bold text-[#16A34A]">₹{order.fee}</span>
                  </div>
                  <div className="text-xs font-medium text-gray-500 flex items-center gap-2">
                    <span className="truncate text-[#0F766E]">{order.restaurant}</span>
                    <span>→</span>
                    <span className="truncate text-gray-600">{order.customer}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* UPGRADED LIVE MAP AREA */}
          <div className="flex-[2] bg-[#E8EAED] rounded-2xl shadow-md border border-gray-200 overflow-hidden relative flex flex-col h-full">
            
            {/* Map Street Background Texture */}
            <div className="absolute inset-0 opacity-40 z-0" style={{
              backgroundImage: `linear-gradient(#CBD5E1 1.5px, transparent 1.5px), linear-gradient(90deg, #CBD5E1 1.5px, transparent 1.5px)`,
              backgroundSize: `40px 40px`,
              backgroundPosition: `-19px -19px`
            }}></div>
            
            {/* Fake Major Roads using SVG for Realism */}
            <svg className="absolute inset-0 w-full h-full z-0 opacity-60" xmlns="http://www.w3.org/2000/svg">
              <path d="M -100,100 L 800,150 M 200,-100 L 250,600 M 400,-100 L 350,600 M -100,300 L 800,250 M 600,-100 L 650,600 M -100,450 L 800,500" stroke="#FFFFFF" strokeWidth="12" fill="none" />
              <path d="M 150,-100 L 300,600 M -100,200 L 800,350" stroke="#FFFFFF" strokeWidth="20" fill="none" />
            </svg>

            {/* Active Route Tracking SVG */}
            <svg viewBox="0 0 800 500" className="w-full h-full absolute inset-0 z-10">
              <style>{`
                @keyframes dash {
                  to { stroke-dashoffset: -20; }
                }
                .route-dash {
                  animation: dash 1s linear infinite;
                }
              `}</style>
              
              {/* Solid Route Line */}
              <polyline points="250,380 400,320 550,380 650,150" fill="none" stroke="#0F766E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              {/* Moving Dashed Line Overlay */}
              <polyline points="250,380 400,320 550,380 650,150" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10, 10" className="route-dash opacity-80" />

              {/* Restaurant Pin (Origin) */}
              <g transform="translate(250, 380)">
                <circle cx="0" cy="0" r="16" fill="#1F2937" shadow="0px 4px 10px rgba(0,0,0,0.5)" />
                <svg x="-10" y="-10" width="20" height="20" viewBox="0 0 24 24" fill="white">
                   <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                </svg>
              </g>

              {/* Customer Pin (Destination) */}
              <g transform="translate(650, 150)">
                <circle cx="0" cy="-12" r="22" fill="#DC2626" className="animate-pulse" opacity="0.2"/>
                <path d="M0,0 C-12,-12 -16,-18 -16,-26 A16,16 0 1,1 16,-26 C16,-18 12,-12 0,0 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
                <svg x="-10" y="-35" width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </g>

              {/* Rider / Bike Icon (Current Location) */}
              <g transform="translate(530, 365) scale(1.1)">
                <circle cx="0" cy="0" r="24" fill="#F97316" opacity="0.25" className="animate-ping" />
                <circle cx="0" cy="0" r="18" fill="white" stroke="#F97316" strokeWidth="3" />
                <svg x="-12" y="-12" width="24" height="24" viewBox="0 0 24 24" fill="#1F2937">
                   <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
                </svg>
              </g>
            </svg>

            {/* Floating Top Left Card (Order ID) */}
            <div className="absolute top-6 left-6 z-20">
              <div className="bg-white/90 backdrop-blur-md border border-gray-200 p-4 rounded-xl shadow-lg w-56">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Current Order</p>
                <p className="text-xl font-black text-[#1F2937]">{assignedOrders[0].id}</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  <p className="text-[11px] font-bold text-[#16A34A] uppercase tracking-wider">On The Way</p>
                </div>
              </div>
            </div>

            {/* Floating Bottom Card (ETA & Navigation) */}
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="bg-white/95 backdrop-blur-md border border-gray-200 p-4 rounded-xl shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#F97316]/10 p-3 rounded-xl">
                    <svg className="w-7 h-7 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#1F2937]">10 min</p>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">2.5 km • ETA 14:25</p>
                  </div>
                </div>
                <button className="bg-[#0F766E] hover:bg-[#0c5c56] text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md text-sm uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  Navigate
                </button>
              </div>
            </div>
          </div>

          {/* Trip Progress Tracking */}
          <div className="flex-1 bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col h-full overflow-hidden">
            <h3 className="text-lg font-bold text-[#1F2937] mb-6 border-b border-gray-100 pb-3 shrink-0">Trip Progress</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {routeSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4 mb-6 relative">
                  {idx !== routeSteps.length - 1 && (
                    <div className={`absolute left-[11px] top-7 w-0.5 h-16 ${step.completed ? 'bg-[#0F766E]' : 'bg-gray-200'}`}></div>
                  )}
                  <div className={`w-6 h-6 rounded-full shrink-0 mt-1 border-4 flex items-center justify-center z-10 ${step.completed ? 'bg-[#0F766E] border-white' : 'bg-gray-100 border-gray-300'}`}></div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1">
                    <p className={`text-sm font-bold ${step.completed ? 'text-[#1F2937]' : 'text-gray-400'}`}>{step.step}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{step.location}</p>
                    <p className={`text-xs font-bold mt-2 ${step.completed ? 'text-[#F97316]' : 'text-gray-400'}`}>{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}