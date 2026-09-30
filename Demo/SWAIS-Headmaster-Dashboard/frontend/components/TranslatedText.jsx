"use client";
import React, { useState, useEffect, memo } from 'react';
import { useLanguage } from '../context/LanguageContext';

// GLOBAL MEMORY BANK: Prevents sending the same word to the API twice!
const globalTranslationCache = {};

const TranslatedText = memo(({ text }) => {
  const context = useLanguage();
  const language = context?.language || 'English';
  const translateText = context?.translateText || (async (t) => t);

  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let isMounted = true;

    const fetchTranslation = async () => {
      // 1. Instantly return if English or empty
      if (!text || language === 'English' || language === 'en') {
        if (isMounted) setTranslated(text);
        return;
      }

      // 2. Create a unique memory key (e.g., "Hindi_Dashboard")
      const cacheKey = `${language}_${text}`;

      // 3. CHECK MEMORY FIRST: If already translated, load instantly with 0 API calls!
      if (globalTranslationCache[cacheKey]) {
        if (isMounted) setTranslated(globalTranslationCache[cacheKey]);
        return;
      }

      // 4. IF NOT IN MEMORY: Call the AI API
      try {
        const result = await translateText(text);
        
        // 5. SAVE TO MEMORY FOR NEXT TIME
        globalTranslationCache[cacheKey] = result;
        
        if (isMounted) setTranslated(result);
      } catch (error) {
        console.error("Translation API Error:", error);
        if (isMounted) setTranslated(text);
      }
    };

    fetchTranslation();

    return () => {
      isMounted = false;
    };
  }, [text, language, translateText]);

  return <>{translated}</>;
});

TranslatedText.displayName = 'TranslatedText';
export default TranslatedText;
