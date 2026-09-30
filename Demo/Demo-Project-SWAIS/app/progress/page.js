"use client";

import { useState, useEffect } from "react";
import DashboardShell from "../dashboard-shell";
import { useLanguage } from "../../src/context/LanguageContext";
import { translateText } from "../../src/services/aiService";

const DEFAULT_TEXT = {
  title: "My Progress",
  description: "Your chapter reading, assignments, assessment scores, and teacher feedback will appear here."
};

export default function ProgressPage() {
  const { selectedLanguage } = useLanguage();
  const [t, setT] = useState(DEFAULT_TEXT);
  const [isTranslating, setIsTranslating] = useState(false);
  const isEnglish = !selectedLanguage || selectedLanguage === "English" || selectedLanguage === "en";

  useEffect(() => {
    if (isEnglish) {
      setT(DEFAULT_TEXT);
      setIsTranslating(false);
      return;
    }

    const fetchTranslations = async () => {
      setIsTranslating(true);
      try {
        const keys = Object.keys(DEFAULT_TEXT);
        const values = Object.values(DEFAULT_TEXT);

        const translatedResponses = await Promise.all(
          values.map(text => translateText(text, selectedLanguage))
        );

        const newT = {};
        keys.forEach((key, index) => {
          const res = translatedResponses[index];
          newT[key] = res?.translated_text || res?.text || res?.data || DEFAULT_TEXT[key];
        });

        setT(newT);
      } catch (err) {
        setT(DEFAULT_TEXT);
      } finally {
        setIsTranslating(false);
      }
    };

    fetchTranslations();
  }, [selectedLanguage, isEnglish]);

  return (
    <DashboardShell>
      <section className="module-page">
        <div className="module-content-area">
          <article className="module-card blue-module">
            <h2>{isTranslating && !isEnglish ? "..." : t.title}</h2>
            <p>{isTranslating && !isEnglish ? "..." : t.description}</p>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
