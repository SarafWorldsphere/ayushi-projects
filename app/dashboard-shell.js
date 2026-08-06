"use client";

import { usePathname } from "next/navigation";
import Link from "next/link"; // <-- THE FIX: Added Next.js Link
import { useState, useRef, useEffect } from "react";
import StudentProfile from "./student-profile";
import { useLanguage } from "../src/context/LanguageContext";
import { voiceToText, textToVoice, translateText } from "../src/services/aiService";

// 1. DEFAULT ENGLISH TEXT
const DEFAULT_TEXT = {
  dashboard: "Dashboard",
  coreStudy: "Core Study",
  assignments: "Assignments",
  assessments: "Assessments",
  progress: "My Progress",
  translator: "AI Translator",
  settings: "Settings",
  help: "Help & Support",
  logout: "Logout",
  searchPlaceholder: "Search or speak...",
  languageLabel: "Language"
};

const navItems = [
  ["home", "dashboard", "/"],
  ["book-open", "coreStudy", "/chapters"],
  ["clipboard", "assignments", "/assignments"],
  ["target", "assessments", "/assessments"],
  ["chart", "progress", "/progress"],
  ["globe", "translator", "/ai-translator"]
];

const settingsItems = [
  ["settings", "settings", "/settings"],
  ["help", "help", "/help"]
];

function Icon({ name, className = "" }) {
  return <span className={`icon ${name} ${className}`} aria-hidden="true" />;
}

function BrandMark() {
  return (
    <img
      src="/DEM%20Logo.jpeg"
      alt="DEM Logo"
      style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
    />
  );
}

function Avatar() {
  return (
    <div className="avatar" aria-hidden="true">
      <svg viewBox="0 0 120 120" role="img">
        <circle cx="60" cy="60" r="58" fill="#f4f5f7" />
        <circle cx="60" cy="42" r="29" fill="#3b291f" />
        <path d="M24 113c7-25 24-39 36-39s29 14 36 39" fill="#fff" stroke="#07192c" strokeWidth="3" />
        <path d="M52 79h16l-3 35H55z" fill="#1a62a3" />
        <path d="M38 40c1-19 11-28 23-28 13 0 22 10 22 28v11c0 18-11 32-22 32-12 0-23-14-23-32z" fill="#ffd2a3" stroke="#07192c" strokeWidth="3" />
        <circle cx="49" cy="50" r="3.2" fill="#07192c" />
        <circle cx="72" cy="50" r="3.2" fill="#07192c" />
        <path d="M53 64c5 5 12 5 17 0" fill="none" stroke="#07192c" strokeWidth="3" strokeLinecap="round" />
        <path d="M33 49c3-18 12-27 28-28 15 1 25 12 27 29-11-1-22-7-29-17-5 10-15 15-26 16z" fill="#2d2018" />
        <path d="M45 82l15 11 15-11" fill="none" stroke="#07192c" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const { selectedLanguage, changeLanguage, LANGUAGES } = useLanguage();

  const [t, setT] = useState(DEFAULT_TEXT);
  const [isTranslatingUI, setIsTranslatingUI] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const isEnglish = !selectedLanguage || selectedLanguage === "English" || selectedLanguage === "en";

  useEffect(() => {
    if (isEnglish) {
      setT(DEFAULT_TEXT);
      setIsTranslatingUI(false);
      return;
    }

    const fetchAITranslations = async () => {
      setIsTranslatingUI(true);
      try {
        const keys = Object.keys(DEFAULT_TEXT);
        const values = Object.values(DEFAULT_TEXT);

        const translatedResponses = await Promise.all(
          values.map(text => translateText(text, selectedLanguage))
        );

        const newT = {};
        keys.forEach((key, index) => {
          const res = translatedResponses[index];
          const finalString = res?.translated_text || res?.text || res?.data || DEFAULT_TEXT[key];
          newT[key] = finalString;
        });

        setT(newT);
      } catch (err) {
        console.error("AI UI Translation failed:", err);
        setT(DEFAULT_TEXT); 
      } finally {
        setIsTranslatingUI(false);
      }
    };

    fetchAITranslations();
  }, [selectedLanguage, isEnglish]);

  function isActive(href) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const handleMicClick = async () => {
    // ... existing logic ...
  };

  const handleSpeakerClick = async () => {
    // ... existing logic ...
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <BrandMark />
          <div>
            <div className="brand-title">DEM</div>
            <div className="brand-subtitle">Saraswati Demo School</div>
          </div>
        </div>

        <nav className="nav-list" aria-label="Student navigation">
          {navItems.map(([icon, labelKey, href]) => (
            /* THE FIX: Replaced <a> with <Link> */
            <Link className={`nav-item ${isActive(href) ? "active" : ""}`} href={href} key={labelKey}>
              <Icon name={icon} />
              <span>{isTranslatingUI && !isEnglish ? "..." : t[labelKey]}</span>
            </Link>
          ))}
        </nav>

        <div className="nav-divider" />

        <nav className="nav-list compact" aria-label="Settings navigation">
          {settingsItems.map(([icon, labelKey, href]) => (
            /* THE FIX: Replaced <a> with <Link> */
            <Link className={`nav-item ${isActive(href) ? "active" : ""}`} href={href} key={labelKey}>
              <Icon name={icon} />
              <span>{isTranslatingUI && !isEnglish ? "..." : t[labelKey]}</span>
            </Link>
          ))}
        </nav>

        <div className="nav-divider" />

        {/* THE FIX: Replaced <a> with <Link> */}
        <Link className="nav-item logout-link" href="#">
          <Icon name="power" />
          <span>{isTranslatingUI && !isEnglish ? "..." : t.logout}</span>
        </Link>
      </aside>

      <section className="workspace">
        <header className="topbar">
          {/* ... Topbar UI ... */}
          <div className="student-card">
            <Avatar />
            <StudentProfile />
          </div>

          <div className="top-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff20', borderRadius: '20px', padding: '6px 12px', border: '1px solid #475569' }}>
              <span style={{ marginRight: '8px' }}>🔍</span>
              <input
                type="text"
                placeholder={isTranslatingUI && !isEnglish ? "..." : t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'inherit', outline: 'none', width: '200px', fontSize: '14px' }}
              />
              <button onClick={handleSpeakerClick} type="button" title="Listen" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '5px', fontSize: '16px' }}>
                {isLoadingAudio ? '⏳' : '🔊'}
              </button>
              <button onClick={handleMicClick} type="button" title="Speak" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '5px', fontSize: '16px' }}>
                {isRecording ? '🔴' : '🎙️'}
              </button>
            </div>

            <label className="language-select" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ffffff', fontWeight: '500' }}>{isTranslatingUI && !isEnglish ? "..." : t.languageLabel}:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                aria-label="Select language"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #475569',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {LANGUAGES && LANGUAGES.length > 0 ? (
                    LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                        {lang.name}
                      </option>
                    ))
                ) : (
                    <option value="en" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>English</option>
                )}
              </select>
            </label>

            <button className="bell-button" aria-label="Notifications">
              <span className="bell-icon" aria-hidden="true" />
              <span className="badge">3</span>
            </button>
            <button className="top-logout" type="button">
              <span className="exit-icon" aria-hidden="true" />
              <span>{isTranslatingUI && !isEnglish ? "..." : t.logout}</span>
            </button>
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}
