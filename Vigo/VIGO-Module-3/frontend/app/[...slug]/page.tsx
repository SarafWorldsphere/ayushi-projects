// app/[...slug]/page.tsx
"use client";
import { usePathname } from 'next/navigation';
import { mockDataContent } from '../lib/mockData';

export default function DynamicModulePage() {
  const pathname = usePathname();
  
  // Look up the current URL path in our mock data map. If it's a testing route without specific data, use a fallback.
  const content = mockDataContent[pathname as keyof typeof mockDataContent] || {
    title: "System Testing Module",
    module: "Technical Validation",
    stats: [
      { label: "System Status", value: "All Systems Operational", highlight: true },
      { label: "Last Ping", value: "Just now", highlight: false }
    ],
    list: []
  };

  return (
    <div className="flex flex-col h-full relative z-0 bg-[#FFFDF8] text-[#1F2937] p-8">
      
      {/* Dynamic Header */}
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-black text-[#1F2937] tracking-tight drop-shadow-sm">{content.title}</h2>
        <p className="text-sm font-bold text-[#0F766E] uppercase tracking-widest mt-1">
          {content.module} | Path: {pathname}
        </p>
      </header>
      
      <div className="max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Statistics & Info Cards */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[#1F2937] mb-2">Module Overview</h3>
          {content.stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center transition-all hover:border-[#0F766E]/30">
              <span className="text-gray-500 font-medium">{stat.label}</span>
              <span className={`font-black text-lg ${stat.highlight ? 'text-[#16A34A]' : 'text-[#1F2937]'}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column: Dynamic Lists (History, Status Steps, etc.) */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[#1F2937] mb-2">Details & Records</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full min-h-[300px]">
            {content.list.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {content.list.map((item, idx) => (
                  <li key={idx} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-[#1F2937]">{item.title}</span>
                      <span className="font-black text-[#F97316]">{item.amount}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-2">
                      <span className="text-gray-500 font-medium">{item.subtitle}</span>
                      <span className={`px-2 py-1 rounded font-bold uppercase tracking-wider ${
                        item.status === 'Pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#0F766E]/10 text-[#0F766E]'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                 <div className="w-16 h-16 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                <p className="text-gray-400 font-bold tracking-wide">NO RECENT RECORDS</p>
                <p className="text-xs text-gray-400 mt-1">Detailed module logs will appear here.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}