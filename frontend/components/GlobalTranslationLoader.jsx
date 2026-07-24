"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function GlobalTranslationLoader() {
  const { isTranslating } = useLanguage();

  if (!isTranslating) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 bg-opacity-80 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-white animate-pulse">
        Translating Dashboard...
      </h2>
      <p className="text-slate-300 mt-2 text-sm">Please wait while we process the language change.</p>
    </div>
  );
}
