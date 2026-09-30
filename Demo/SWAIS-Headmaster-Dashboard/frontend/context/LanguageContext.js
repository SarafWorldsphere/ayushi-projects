"use client";
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { translateText as apiTranslateText } from '../src/aiServices';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('English');
  const [dictionary, setDictionary] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);

  const translationQueue = useRef([]);
  const debounceTimer = useRef(null);

  // Load cached translations on start
  useEffect(() => {
    const savedDict = localStorage.getItem('dashboardTranslations');
    if (savedDict) {
      try { 
        setDictionary(JSON.parse(savedDict)); 
      } catch (e) { 
        console.error("Cache load error", e); 
      }
    }
  }, []);

  // Language switch handler: Clears old queue instantly
  const setLanguage = (newLang) => {
    translationQueue.current = [];
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setIsTranslating(false);
    setLanguageState(newLang);
  };

  const processQueue = async (currentLanguage) => {
    if (translationQueue.current.length === 0) return;

    setIsTranslating(true);

    const batch = [...translationQueue.current];
    translationQueue.current = [];

    // 1. Deduplicate: Send only UNIQUE phrases to the API
    const uniqueTexts = [...new Set(batch.map(item => item.text))];

    try {
      // 2. Fetch all unique strings in parallel using your existing /translate endpoint
      const results = await Promise.all(
        uniqueTexts.map(async (text) => {
          try {
            const res = await apiTranslateText(text, currentLanguage);
            const translated = res?.translated_text || res?.translation || res?.text || text;
            return { text, translated };
          } catch (err) {
            return { text, translated: text };
          }
        })
      );

      // Map results for quick lookup
      const resultMap = {};
      results.forEach(item => {
        resultMap[item.text] = item.translated;
      });

      // 3. Update dictionary state and cache in local storage
      setDictionary(prev => {
        const newDict = { ...prev };
        batch.forEach(item => {
          const translatedText = resultMap[item.text] || item.text;
          const cacheKey = `${currentLanguage}_${item.text}`;
          newDict[cacheKey] = translatedText;
          item.resolve(translatedText);
        });
        localStorage.setItem('dashboardTranslations', JSON.stringify(newDict));
        return newDict;
      });

    } catch (error) {
      console.error("Queue processing error:", error);
      batch.forEach(item => item.resolve(item.text));
    } finally {
      setIsTranslating(false);
    }
  };

  const translateText = useCallback((text) => {
    return new Promise((resolve) => {
      if (language === 'English' || !text) return resolve(text);

      const cacheKey = `${language}_${text}`;
      
      // Return INSTANTLY if already translated (0 seconds)
      if (dictionary[cacheKey]) return resolve(dictionary[cacheKey]);

      // Add to batch queue
      translationQueue.current.push({ text, resolve });

      // Gather all components on screen for 40ms before making parallel API calls
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => processQueue(language), 40);
    });
  }, [language, dictionary]);

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    translateText,
    isTranslating
  }), [language, setLanguage, translateText, isTranslating]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
