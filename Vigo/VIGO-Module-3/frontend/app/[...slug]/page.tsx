// app/[...slug]/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface Stat {
  label: string;
  value: string | number;
  highlight: boolean;
}

interface ListItem {
  title: string;
  amount: string;
  subtitle: string;
  status: string;
}

interface PageContent {
  title: string;
  module: string;
  stats: Stat[];
  list: ListItem[];
}

export default function DynamicModulePage() {
  const pathname = usePathname();
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch dynamic content based on the pathname route
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token") || "test_token";
        
        // Use a generic catch-all endpoint, or route specific fetches based on pathname
        // Example: if pathname is "/history", fetch from "/orders/history"
        const apiRoute = pathname === "/history" ? "/orders/active" : "/orders/active"; 

        const response = await fetch(`http://localhost:8000${apiRoute}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to load module data");
        }

        const data = await response.json();
        
        // Map the backend data to our generic page structure
        const mappedContent: PageContent = {
          title: pathname.replace('/', '').toUpperCase() || "Module Overview",
          module: "Dynamic Data Fetch",
          stats: [
            { label: "Total Active Orders", value: data.length || 0, highlight: true },
            { label: "Last Updated", value: new Date().toLocaleTimeString(), highlight: false }
          ],
          list: data.map((order: any) => ({
            title: order.order_number,
            amount: `₹${order.delivery_fee}`,
            subtitle: order.customer_name,
            status: order.status
          }))
        };
        
        setContent(mappedContent);

      } catch (err: any) {
        // Fallback for screens without active APIs implemented yet
        setContent({
          title: pathname.replace('/', '').toUpperCase() || "System Module",
          module: "Development Preview",
          stats: [
            { label: "Status", value: "Awaiting API Integration", highlight: false },
            { label: "Current Path", value: pathname, highlight: true }
          ],
          list: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#FFFDF8] text-[#1F2937]">
        <p className="font-bold text-lg">Loading module data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative z-0 bg-[#FFFDF8] text-[#1F2937] p-8">
      
      {/* Dynamic Header */}
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-black text-[#1F2937] tracking-tight drop-shadow-sm">
          {content?.title}
        </h2>
        <p className="text-sm font-bold text-[#0F766E] uppercase tracking-widest mt-1">
          {content?.module} | Path: {pathname}
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
            {content && content.list.length > 0 ? (
              <ul className="divide-y divide-gray-100 overflow-y-auto max-h-[500px]">
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
              <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[300px]">
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