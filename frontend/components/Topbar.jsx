"use client";

import { useState, useRef, useEffect } from "react";
import { Shield, Bell, Search, Mic, Volume2, Languages, Check, ChevronDown } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { audioTranslator } from '../src/aiServices';

export default function Topbar({ headmaster, searchText, setSearchText, notificationCount = 0 }) {
  const { language, setLanguage, translateText } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAudioTranslating, setIsAudioTranslating] = useState(false);

  // State to hold translated UI text
  const [uiText, setUiText] = useState({
    welcome: "Welcome",
    headmaster: "Headmaster",
    adminAccess: "Admin Access",
    search: "Search students..."
  });

  const langRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // PROTECTED: These exact strings will render in the dropdown without AI translation
  const displayLanguages = [
    "English", "Hindi", "Tamil", "Telugu", "Malayalam",
    "Kannada", "Gujarati", "Punjabi", "Marathi"
  ];

  const langCodeMap = {
    "English": "en-US", "Hindi": "hi-IN", "Tamil": "ta-IN",
    "Telugu": "te-IN", "Malayalam": "ml-IN", "Kannada": "kn-IN",
    "Gujarati": "gu-IN", "Punjabi": "pa-IN", "Marathi": "mr-IN"
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // AI Translation Hook
  useEffect(() => {
    const fetchTranslations = async () => {
      if (language === "English" || language === "en") {
        setUiText({
          welcome: "Welcome", headmaster: "Headmaster", 
          adminAccess: "Admin Access", search: "Search students..."
        });
        return;
      }

      const [w, h, a, s] = await Promise.all([
        translateText("Welcome"),
        translateText("Headmaster"),
        translateText("Admin Access"),
        translateText("Search students...")
      ]);

      setUiText({ welcome: w, headmaster: h, adminAccess: a, search: s });
    };
    fetchTranslations();
  }, [language, translateText]);

  const handleSpeakText = (textToSpeak) => {
    if (!textToSpeak || !textToSpeak.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCodeMap[language] || "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleChromeNativeMic = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = langCodeMap[language] || "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setSearchText(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleAudioTranslate = async () => {
    if (isAudioTranslating) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setIsAudioTranslating(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        try {
          const result = await audioTranslator(audioBlob, language);
          if (result && result.translated_text) {
            setSearchText(result.translated_text);
          }
        } catch (err) {
          console.error("Audio translate error:", err);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsAudioTranslating(true);
    } catch (err) {
      alert("Microphone access denied or unavailable.");
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="search-box">
          <div className="search-icon"><Search size={18} /></div>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={uiText.search}
            className="search-input"
          />

          <div className="search-actions" style={{ display: 'flex', gap: '8px' }}>
            <button
              className="speak-btn"
              onClick={() => handleSpeakText(searchText || uiText.welcome)}
              title="Speak Text"
              type="button"
            >
              <Volume2 size={16} />
            </button>

            <button
              className={`mic-btn ${isListening ? "active" : ""}`}
              onClick={handleChromeNativeMic}
              title="Chrome Search Mic"
              type="button"
              style={{ color: isListening ? "red" : "inherit" }}
            >
              <Mic size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        {/* PROTECTED LANGUAGE SELECTOR BAR */}
        <div className="language-wrapper" ref={langRef}>
          <button
            className="language-btn"
            type="button"
            onClick={() => setShowLangMenu(prev => !prev)}
          >
            <Languages size={18} />
            <span>{language}</span>
            <ChevronDown size={16} className={showLangMenu ? "rotate" : ""} />
          </button>

          {showLangMenu && (
            <div className="language-dropdown">
              {displayLanguages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`language-item ${language === lang ? "selected" : ""}`}
                  onClick={() => {
                    setLanguage(lang);
                    setShowLangMenu(false);
                  }}
                >
                  <span>{lang}</span>
                  {language === lang && <Check size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="notification-bell">
          <Bell size={22} />
          {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
        </div>

        <div className="profile-card">
          <Shield size={22} />
          <div>
            <h3>{uiText.welcome} {headmaster?.name || uiText.headmaster}</h3>
            <p>{uiText.adminAccess}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
