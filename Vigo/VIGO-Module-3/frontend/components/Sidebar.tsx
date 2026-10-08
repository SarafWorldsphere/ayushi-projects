"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { sidebarModules } from '../app/lib/mockData';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] bg-[#FFFDF8] text-[#1F2937] flex flex-col h-screen p-4 border-r border-gray-200 shadow-md z-20">
      
      {/* VIGO Branding with Logo Image */}
      <div className="flex items-center gap-3 mb-6 px-2 mt-2 shrink-0">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm overflow-hidden bg-white">
           <Image 
             src="/logo.jpeg" 
             alt="VIGO FEAST Logo" 
             width={40} 
             height={40} 
             className="object-cover w-full h-full"
           />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            VIGO<span className="text-[#F97316]">FEAST</span>
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Delivery Partner App</p>
        </div>
      </div>

      {/* Navigation List - Using space-y-4 for larger gaps */}
      <nav className="flex-1 flex flex-col justify-start mt-8"> 
        <ul className="space-y-4">
          {sidebarModules.map((module) => {
            const isActive = pathname === module.path;
            return (
              <li key={module.id}>
                {/* Using py-4 to make the buttons taller */}
                <Link 
                  href={module.path}
                  className={`w-full flex items-center gap-3 px-3 py-4 rounded-lg transition-all duration-200 ${
                    isActive ? "bg-[#0F766E] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-white' : 'bg-gray-400'}`}></div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-teal-100' : 'text-gray-400'}`}>
                      Mod {module.id}
                    </span>
                    <span className="text-[15px] font-bold leading-tight">{module.title}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Container */}
      <div className="mt-2 pt-3 border-t border-gray-200 shrink-0">
        <Link href="/login" className="flex items-center gap-3 px-3 py-2 text-[#DC2626] hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-bold w-full text-sm">
           <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
           Logout
        </Link>
      </div>
    </aside>
  );
}