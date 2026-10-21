// app/[...slug]/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface Stat {
  label: string;
  value: string | number;
  highlight: boolean;
}

interface PageContent {
  title: string;
  module: string;
  icon: string;
  stats: Stat[];
}

export default function DynamicModulePage() {
  const pathname = usePathname();
  const [content, setContent] = useState<PageContent | null>(null);
  
  // Instantly load content based on the route without waiting for a slow backend fetch
  useEffect(() => {
    let title = "Module Overview";
    let moduleStr = "System Module";
    let icon = "📦";

    // Dynamically map the sidebar routes to their UI titles
    if (pathname.includes("status")) {
      title = "Order Status"; moduleStr = "Module 3.4"; icon = "📦";
    } else if (pathname.includes("tracking")) {
      title = "Real-time Tracking"; moduleStr = "Module 3.5"; icon = "📍";
    } else if (pathname.includes("history")) {
      title = "Order History"; moduleStr = "Module 3.6"; icon = "📋";
    } else if (pathname.includes("earnings")) {
      title = "Earnings & Payouts"; moduleStr = "Module 3.7"; icon = "💰";
    }

    // Set instant mock content to prevent UI freezing
    setContent({
      title: title,
      module: moduleStr,
      icon: icon,
      stats: [
        { label: "Status", value: "Awaiting API Integration", highlight: false },
        { label: "Current Path", value: pathname, highlight: true }
      ]
    });
  }, [pathname]);

  // We removed the full-screen "loading" block so the UI renders instantly
  return (
    <div className="flex flex-col h-full relative z-0 bg-[#FFFDF8] text-[#1F2937] p-8">
      
      {/* Dynamic Header */}
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-black text-[#1F2937] tracking-tight drop-shadow-sm flex items-center gap-3">
          <span className="text-4xl">{content?.icon}</span>
          {content?.title}
        </h2>
        <p className="text-sm font-bold text-[#0F766E] uppercase tracking-widest mt-2 ml-[3.25rem]">
          {content?.module}
        </p>
      </header>
      
      <div className="max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Statistics & Info Cards */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[#1F2937] mb-2">Module Overview</h3>
          {content?.stats.map((stat, idx) => (
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
              {/* Empty State UI matching your theme */}
              <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[300px]">
                 <div className="w-16 h-16 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                <p className="text-gray-400 font-bold tracking-wide">NO RECENT RECORDS</p>
                <p className="text-xs text-gray-400 mt-1">Detailed module logs will appear here once connected.</p>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
}