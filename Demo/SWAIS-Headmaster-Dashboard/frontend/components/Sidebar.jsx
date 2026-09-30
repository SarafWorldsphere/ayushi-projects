"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Users, GraduationCap, TrendingUp, Bell, CalendarDays, MapPinned, LogOut, BookOpen } from "lucide-react";
import Image from "next/image";
import LogoutModal from "@/components/LogoutModal";
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  
  const { language, translateText } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = useState("Headmaster Dashboard");
  const [translatedMenu, setTranslatedMenu] = useState([]);

  const baseMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "students", label: "Students", icon: Users },
    { id: "teachers", label: "Teachers", icon: GraduationCap },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "functions", label: "Functions", icon: CalendarDays },
    { id: "tours", label: "Tours", icon: MapPinned },
    { id: "classTeachers", label: "Class Teacher", icon: BookOpen },
    { id: "logout", label: "Logout", icon: LogOut, danger: true },
  ];

  // AI Translation Hook
  useEffect(() => {
    const fetchTranslations = async () => {
      // Revert to English if selected
      if (language === "English" || language === "en") {
        setTranslatedTitle("Headmaster Dashboard");
        setTranslatedMenu(baseMenuItems);
        return;
      }

      // Translate the subtitle
      const title = await translateText("Headmaster Dashboard");
      setTranslatedTitle(title);

      // Translate all sidebar menu items dynamically
      const newMenu = await Promise.all(
        baseMenuItems.map(async (item) => {
          const translatedLabel = await translateText(item.label);
          return { ...item, translatedLabel };
        })
      );
      setTranslatedMenu(newMenu);
    };

    fetchTranslations();
  }, [language, translateText]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.clear();
    document.cookie = "dem_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    window.location.href = "https://staging.dem.swais.in"; 
  };

  const handleClick = (item) => {
    if (item.id === "logout") {
      setShowLogout(true);
      return;
    }
    setActiveTab(item.id);
  };

  return (
    <>
      <div className="sidebar">
        <div>
          <div className="brand-box">
            <div className="logo-circle">
              <Image src="/DEM Logo.jpeg" alt="DEMO Logo" width={80} height={80} className="school-logo" />
            </div>
            {/* School Brand strictly remains untranslated */}
            <h2>DEMO SCHOOL</h2>
            <p>{translatedTitle}</p>
          </div>
          <div className="menu-list">
            {(translatedMenu.length > 0 ? translatedMenu : baseMenuItems).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`menu-btn ${activeTab === item.id ? "active" : ""} ${item.danger ? "logout-style" : ""}`}
                  onClick={() => handleClick(item)}
                >
                  <Icon size={18} />
                  <span>{item.translatedLabel || item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <LogoutModal open={showLogout} onCancel={() => setShowLogout(false)} onConfirm={handleLogout} />
    </>
  );
}
