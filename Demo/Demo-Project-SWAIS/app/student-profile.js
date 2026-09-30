"use client";

import { useEffect, useState } from "react";
import { getApiBaseUrl } from "./api-base-url";
import { useLanguage } from "../src/context/LanguageContext";
import { translateText } from "../src/services/aiService";

const API_BASE_URL = getApiBaseUrl();

// Your established student details
const fallbackStudent = {
  full_name: "Ayushi Gupta",
  roll_no: "25",
  admission_no: "A001",
  class_name: "8th",
};

// Base English labels to translate
const DEFAULT_LABELS = {
  welcome: "Welcome back,",
  roll: "Roll No.:",
  admission: "Admission No.:",
  class: "Class:"
};

export default function StudentProfile() {
  const [student, setStudent] = useState(fallbackStudent);
  const { selectedLanguage } = useLanguage();
  
  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [isTranslating, setIsTranslating] = useState(false);

  const isEnglish = !selectedLanguage || selectedLanguage === "English" || selectedLanguage === "en";

  // 1. Fetch Student Data
  useEffect(() => {
    let cancelled = false;

    async function loadStudent() {
      try {
        const response = await fetch(`${API_BASE_URL}/students/current`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.student) return;

        if (!cancelled) {
          setStudent({ 
            ...fallbackStudent, 
            ...data.student,
            roll_no: "25",
            admission_no: "A001",
            class_name: "8th"
          });
        }
      } catch {
        if (!cancelled) setStudent(fallbackStudent);
      }
    }

    loadStudent();
    return () => { cancelled = true; };
  }, []);

  // 2. AI Translation for Labels
  useEffect(() => {
    if (isEnglish) {
      setLabels(DEFAULT_LABELS);
      setIsTranslating(false);
      return;
    }

    const fetchTranslations = async () => {
      setIsTranslating(true);
      try {
        const keys = Object.keys(DEFAULT_LABELS);
        const values = Object.values(DEFAULT_LABELS);

        const translatedResponses = await Promise.all(
          values.map(text => translateText(text, selectedLanguage))
        );

        const newLabels = {};
        keys.forEach((key, index) => {
          const res = translatedResponses[index];
          newLabels[key] = res?.translated_text || res?.text || res?.data || DEFAULT_LABELS[key];
        });

        setLabels(newLabels);
      } catch (err) {
        console.error("Profile translation failed:", err);
        setLabels(DEFAULT_LABELS);
      } finally {
        setIsTranslating(false);
      }
    };

    fetchTranslations();
  }, [selectedLanguage, isEnglish]);

  return (
    <div className="student-info" style={{ marginBottom: '15px' }}>
      <p style={{ margin: 0, fontSize: '14px', color: '#ccc' }}>
        {isTranslating && !isEnglish ? "..." : labels.welcome}
      </p>
      <h1 style={{ margin: '4px 0 12px 0', fontSize: '24px', fontWeight: 'bold' }}>{student.full_name}</h1>
      
      <div className="chips" style={{ display: 'flex', flexDirection: 'row', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '13px', border: '1px solid rgba(255,255,255,0.2)' }}>
          {isTranslating && !isEnglish ? "..." : labels.roll} {student.roll_no}
        </span>
        <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '13px', border: '1px solid rgba(255,255,255,0.2)' }}>
          {isTranslating && !isEnglish ? "..." : labels.admission} {student.admission_no}
        </span>
        <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '13px', border: '1px solid rgba(255,255,255,0.2)' }}>
          {isTranslating && !isEnglish ? "..." : labels.class} {student.class_name}
        </span>
      </div>
    </div>
  );
}
