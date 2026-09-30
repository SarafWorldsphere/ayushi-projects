'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  Settings,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import SessionManager from '../../components/SessionManager';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState('English');

  // Trigger translation when path (tab) or language changes
  useEffect(() => {
    const savedLang = localStorage.getItem('dashboard_language');
    if (savedLang && savedLang !== 'English') {
      setCurrentLang(savedLang);

      // Check if we already translated this tab
      const cacheKeyMain = `trans_${savedLang}_main_${pathname}`;
      if (sessionStorage.getItem(cacheKeyMain)) {
      // Wait 150ms for Next.js to render the new tab, THEN apply cache
      setTimeout(() => translatePage(savedLang), 150);
    } else {
      // First time visiting: Give the page 1000ms to load table data
       const timer = setTimeout(() => {
          translatePage(savedLang);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  const translatePage = async (targetLang: string) => {
    if (targetLang === 'English') {
      localStorage.setItem('dashboard_language', 'English');
      window.location.reload();
      return;
    }

    try {
      const mainDiv = document.getElementById("main-content");
      const sideDiv = document.getElementById("sidebar-menu");
      if (!mainDiv || !sideDiv) return;

      // 1. Instant Memory Check
      const cacheKeyMain = `trans_${targetLang}_main_${pathname}`;
      const cacheKeySide = `trans_${targetLang}_side_${pathname}`;
      const cachedMain = sessionStorage.getItem(cacheKeyMain);
      const cachedSide = sessionStorage.getItem(cacheKeySide);

      if (cachedMain && cachedSide) {
        mainDiv.innerHTML = cachedMain;
        sideDiv.innerHTML = cachedSide;
        return; // Exit instantly, no AI network wait time!
      }

      // 2. Fetch from Fast AI Port 7008
      const [mainRes, sideRes] = await Promise.all([
        fetch("http://16.112.236.67:7008/api/v1/admin/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_language: targetLang, text: mainDiv.innerHTML })
        }),
        fetch("http://16.112.236.67:7008/api/v1/admin/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_language: targetLang, text: sideDiv.innerHTML })
        })
      ]);

      const mainData = await mainRes.json();
      const sideData = await sideRes.json();

      // 3. Apply translations and SAVE to memory for next time
      if (mainData && mainData.translated_text) {
        mainDiv.innerHTML = mainData.translated_text;
        sessionStorage.setItem(cacheKeyMain, mainData.translated_text);
      }
      if (sideData && sideData.translated_text) {
        sideDiv.innerHTML = sideData.translated_text;
        sessionStorage.setItem(cacheKeySide, sideData.translated_text);
      }

      localStorage.setItem('dashboard_language', targetLang);
    } catch (err) {
      console.error("AI Translation failed:", err);
    }
  };
        
  const menuItems = [
    { id: 'students', name: 'Students', icon: Users, path: '/admin/students', color: 'from-blue-500 to-cyan-500' },
    { id: 'teachers', name: 'Teachers', icon: BookOpen, path: '/admin/teachers', color: 'from-green-500 to-emerald-500' },
    { id: 'classes', name: 'Classes', icon: GraduationCap, path: '/admin/classes', color: 'from-orange-500 to-amber-500' },
    { id: 'others', name: 'Others', icon: Settings, path: '/admin/others', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <SessionManager>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? '280px' : '80px' }}
          className="fixed left-0 top-0 h-full bg-white/5 backdrop-blur-xl border-r border-white/10 z-50"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-10">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <img src="/ai-logo.jpeg" alt="AI Logo" className="w-12 h-12 object-cover rounded-xl" />
                  <div>
                    <h1 className="text-white font-bold text-xl">DEMO School</h1>
                    <p className="text-white/40 text-xs">Admin Portal</p>
                  </div>
                </motion.div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white/70 hover:text-white transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <nav id="sidebar-menu" className="space-y-2 px-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link href={item.path} key={item.id}>
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon size={20} />
                    {sidebarOpen && <span className="font-medium">{item.name}</span>}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {sidebarOpen && (
            <div className="absolute bottom-8 left-0 right-0 px-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <p className="text-white/30 text-xs text-center">
                  © 2026 DEMO School<br />
                  Management System
                </p>
              </motion.div>
            </div>
          )}
        </motion.aside>

        {/* Main Content */}
        <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
          <header className="flex justify-end items-center px-8 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
            <select
              value={currentLang}
              className="bg-white text-black border border-gray-300 rounded-full px-4 py-2 text-sm hover:border-cyan-500 transition-colors cursor-pointer outline-none"
              onChange={(e) => {
                const newLang = e.target.value;
                setCurrentLang(newLang);
                localStorage.setItem('dashboard_language', newLang);
                translatePage(newLang);
              }}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
              <option value="Tamil">Tamil</option>
              <option value="Kannada">Kannada</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Marathi">Marathi</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Punjabi">Punjabi</option>
            </select>
          </header>

          <div id="main-content" className="p-8">
            {children}
          </div>
        </main>
      </div>
    </SessionManager>
  );
}
