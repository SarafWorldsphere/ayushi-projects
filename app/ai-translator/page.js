"use client";

import { useState } from "react";
import DashboardShell from "../dashboard-shell";
import { translateText, textToVoice } from "../../src/services/aiService";
import { useLanguage } from "../../src/context/LanguageContext";

export default function AiTranslatorPage() {
  const { selectedLanguage, LANGUAGES } = useLanguage();
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Find the name of the currently selected language
  const currentLangName = LANGUAGES.find(l => l.code === selectedLanguage)?.name || "English";

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    
    try {
      const response = await translateText(inputText, selectedLanguage);
      if (response && response.translated_text) {
        setTranslatedText(response.translated_text);
      } else if (response && typeof response === 'string') {
        setTranslatedText(response); // Fallback if API returns raw string
      } else {
        setTranslatedText("Translation failed. Please try again.");
      }
    } catch (error) {
      console.error("Translation error", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!translatedText.trim()) return;
    setIsPlaying(true);
    
    try {
      const audioUrl = await textToVoice(translatedText, selectedLanguage);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error("Audio error", error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <DashboardShell>
      <div style={{ padding: '24px', color: '#fff', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          AI Language Translator
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Input Section */}
          <div style={{ background: '#16253D', padding: '20px', borderRadius: '8px', border: '1px solid #475569' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Text to Translate:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste text here..."
              style={{ width: '100%', height: '150px', padding: '10px', borderRadius: '4px', background: '#0A1220', color: '#fff', border: '1px solid #334155', resize: 'none' }}
            />
            <button 
              onClick={handleTranslate}
              disabled={isTranslating}
              style={{ marginTop: '15px', padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
            >
              {isTranslating ? 'Translating...' : `Translate to ${currentLangName}`}
            </button>
          </div>

          {/* Output Section */}
          <div style={{ background: '#16253D', padding: '20px', borderRadius: '8px', border: '1px solid #475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>
                Translation ({currentLangName}):
              </label>
              {translatedText && (
                <button 
                  onClick={handlePlayAudio}
                  disabled={isPlaying}
                  title="Listen to Translation"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                >
                  {isPlaying ? '⏳' : '🔊'}
                </button>
              )}
            </div>
            <div style={{ width: '100%', height: '150px', padding: '10px', borderRadius: '4px', background: '#0A1220', color: '#cbd5e1', border: '1px solid #334155', overflowY: 'auto' }}>
              {translatedText || <span style={{ color: '#64748b' }}>Translation will appear here...</span>}
            </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
}
