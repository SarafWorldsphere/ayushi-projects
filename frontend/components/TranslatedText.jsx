"use client";
import React, { useState, useEffect, useRef, memo } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Wrapped in memo so it doesn't re-render unless the 'text' prop changes
const TranslatedText = memo(({ text }) => {
  const context = useLanguage();

  const language = context?.language || 'English';
  const translateText = context?.translateText || (async (t) => t);

  // Store the translation function in a ref so it doesn't trigger useEffect loops
  const translateRef = useRef(translateText);
  useEffect(() => {
    translateRef.current = translateText;
  }, [translateText]);

  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let isMounted = true;

    const fetchTranslation = async () => {
      // Instantly return original text if English or empty
      if (language === 'English' || language === 'en' || !text) {
        if (isMounted) setTranslated(text);
        return;
      }

      try {
        // Use the ref to call the function
        const result = await translateRef.current(text);
        if (isMounted) setTranslated(result);
      } catch (error) {
        console.error("Translation Component Error:", error);
        if (isMounted) setTranslated(text);
      }
    };

    fetchTranslation();

    return () => { 
      isMounted = false; 
    };
  // Removed translateText to prevent infinite loop risks
  }, [text, language]); 

  return <>{translated}</>;
});

// Explicit display name is good practice when using memo
TranslatedText.displayName = 'TranslatedText';

export default TranslatedText;
