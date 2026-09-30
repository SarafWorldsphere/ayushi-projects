"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "./api-base-url";
import { useLanguage } from "../src/context/LanguageContext";
import { translateText } from "../src/services/aiService";

const chapterSubjects = ["Social Science", "Maths", "Hindi", "Telugu"];
const chapterLessons = ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 5", "Lesson 6", "Lesson 7", "Lesson 8", "Lesson 9", "Lesson 10"];
const API_BASE_URL = getApiBaseUrl();

const DEFAULT_TEXT = {
  selectSubject: "Select Subject...",
  selectBook: "Select Book Title...",
  loadingBtn: "Loading",
  goBtn: "Go",
  loadingContent: "Loading chapter content...",
  contentNotAvail: "Content not available",
  restartAudio: "Restart Audio",
  readAloud: "Read Aloud",
  pause: "Pause",
  resume: "Resume",
  stop: "Stop",
  audioNotSupported: "Audio reading is not supported in this browser."
};

// Maps dashboard language to browser speech synthesis language codes
const speechLangMap = {
  Telugu: "te-IN",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Marathi: "mr-IN",
  English: "en-IN"
};

export default function ChapterSelector({ showReader = false }) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [chapterContent, setChapterContent] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // AI Translation States
  const { selectedLanguage } = useLanguage();
  const [t, setT] = useState(DEFAULT_TEXT);
  const [translatedSubjects, setTranslatedSubjects] = useState(chapterSubjects);
  const [translatedLessons, setTranslatedLessons] = useState(chapterLessons);
  const [translatedChapter, setTranslatedChapter] = useState(null);
  const [isTranslatingUI, setIsTranslatingUI] = useState(false);
  const [isTranslatingChapter, setIsTranslatingChapter] = useState(false);

  const isEnglish = !selectedLanguage || selectedLanguage === "English" || selectedLanguage === "en";

  // 1. Translate Static UI & Dropdowns
  useEffect(() => {
    if (isEnglish) {
      setT(DEFAULT_TEXT);
      setTranslatedSubjects(chapterSubjects);
      setTranslatedLessons(chapterLessons);
      setIsTranslatingUI(false);
      return;
    }

    const fetchUITranslations = async () => {
      setIsTranslatingUI(true);
      try {
        // Translate labels
        const keys = Object.keys(DEFAULT_TEXT);
        const values = Object.values(DEFAULT_TEXT);
        const labelRes = await Promise.all(values.map(text => translateText(text, selectedLanguage)));
        const newT = {};
        keys.forEach((key, index) => {
          const res = labelRes[index];
          newT[key] = res?.translated_text || res?.text || res?.data || DEFAULT_TEXT[key];
        });
        setT(newT);

        // Translate Dropdown Arrays
        const subRes = await Promise.all(chapterSubjects.map(sub => translateText(sub, selectedLanguage)));
        setTranslatedSubjects(subRes.map((r, i) => r?.translated_text || r?.text || r?.data || chapterSubjects[i]));

        const lesRes = await Promise.all(chapterLessons.map(les => translateText(les, selectedLanguage)));
        setTranslatedLessons(lesRes.map((r, i) => r?.translated_text || r?.text || r?.data || chapterLessons[i]));

      } catch (err) {
        console.error("UI Translation failed", err);
      } finally {
        setIsTranslatingUI(false);
      }
    };
    fetchUITranslations();
  }, [selectedLanguage, isEnglish]);

  // 2. Translate Dynamic Chapter Content from Database
  useEffect(() => {
    if (!chapterContent) {
      setTranslatedChapter(null);
      return;
    }
    if (isEnglish) {
      setTranslatedChapter(chapterContent);
      return;
    }

    const translateChapterContent = async () => {
      setIsTranslatingChapter(true);
      try {
        const titleRes = await translateText(chapterContent.content_title, selectedLanguage);
        const textRes = await translateText(chapterContent.full_text_content, selectedLanguage);
        
        setTranslatedChapter({
          ...chapterContent,
          content_title: titleRes?.translated_text || titleRes?.text || titleRes?.data || chapterContent.content_title,
          full_text_content: textRes?.translated_text || textRes?.text || textRes?.data || chapterContent.full_text_content
        });
      } catch (err) {
        console.error("Chapter translation failed", err);
        setTranslatedChapter(chapterContent);
      } finally {
        setIsTranslatingChapter(false);
      }
    };
    translateChapterContent();
  }, [chapterContent, selectedLanguage, isEnglish]);

  // Split paragraphs using the translated chapter text
  const paragraphs = useMemo(() => {
    if (!translatedChapter?.full_text_content) return [];
    return translatedChapter.full_text_content
      .split(/\n\s*\n|\r\n\s*\r\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [translatedChapter]);

  // Speech Synthesis Setup
  useEffect(() => {
    setSpeechSupported(typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setIsPaused(false);
    }
  }, [translatedChapter, speechSupported]);

  function handleReadAloud() {
    if (!speechSupported || !translatedChapter) return;

    window.speechSynthesis.cancel();

    const textToRead = `${translatedChapter.content_title}. ${translatedChapter.full_text_content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Automatically match the speech voice to the selected dashboard language!
    utterance.lang = speechLangMap[selectedLanguage] || "en-IN"; 
    utterance.rate = 0.92;
    utterance.pitch = 1;

    utterance.onend = () => { setIsReading(false); setIsPaused(false); };
    utterance.onerror = () => { setIsReading(false); setIsPaused(false); };

    setIsReading(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
  }

  function handlePauseResume() {
    if (!speechSupported || !isReading) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }

  function handleStopReading() {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!showReader) return;

    // Notice we use the original English array values for the API call 
    // by finding the index of the translated selection
    const subjectIndex = translatedSubjects.indexOf(selectedSubject);
    const lessonIndex = translatedLessons.indexOf(selectedLesson);
    
    const apiSubject = subjectIndex !== -1 ? chapterSubjects[subjectIndex] : selectedSubject;
    const apiLesson = lessonIndex !== -1 ? chapterLessons[lessonIndex] : selectedLesson;

    if (!apiSubject || !apiLesson) {
      setError("Please select a subject and lesson.");
      setChapterContent(null);
      return;
    }

    setLoading(true);
    setError("");
    setChapterContent(null);

    try {
      const params = new URLSearchParams({ subject: apiSubject, lesson: apiLesson });
      const response = await fetch(`${API_BASE_URL}/chapter-content?${params.toString()}`);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(typeof data.detail === "string" ? data.detail : "No chapter content found for this selection.");
      }

      setChapterContent(data);
    } catch (fetchError) {
      setError(fetchError.message || "Unable to load chapter content. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const tt = (key) => isTranslatingUI && !isEnglish ? "..." : t[key];

  return (
    <>
      <form className="chapter-selector chapter-page-selector" aria-label="Chapter selection" onSubmit={handleSubmit}>
        <select value={selectedSubject} aria-label="Select subject" onChange={(event) => setSelectedSubject(event.target.value)}>
          <option value="" disabled>{tt("selectSubject")}</option>
          {translatedSubjects.map((subject) => (
            <option value={subject} key={subject}>{subject}</option>
          ))}
        </select>
        <select value={selectedLesson} aria-label="Select lesson" onChange={(event) => setSelectedLesson(event.target.value)}>
          <option value="" disabled>{tt("selectBook")}</option>
          {translatedLessons.map((lesson) => (
            <option value={lesson} key={lesson}>{lesson}</option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? tt("loadingBtn") : tt("goBtn")}
        </button>
      </form>

      {showReader && (
        <div className="chapter-content-area" aria-live="polite">
          {loading && (
            <article className="chapter-message-card">
              <div className="loading-line" />
              <p>{tt("loadingContent")}</p>
            </article>
          )}

          {!loading && error && (
            <article className="chapter-message-card error">
              <h2>{tt("contentNotAvail")}</h2>
              <p>{error}</p>
            </article>
          )}

          {!loading && translatedChapter && (
            <article className="chapter-content-card">
              <div className="chapter-content-header">
                <h2>{isTranslatingChapter ? "..." : translatedChapter.content_title}</h2>
                <div className="chapter-audio-controls" aria-label="Chapter audio controls">
                  <button type="button" onClick={handleReadAloud} disabled={!speechSupported || isTranslatingChapter}>
                    {isReading ? tt("restartAudio") : tt("readAloud")}
                  </button>
                  <button type="button" onClick={handlePauseResume} disabled={!speechSupported || !isReading || isTranslatingChapter}>
                    {isPaused ? tt("resume") : tt("pause")}
                  </button>
                  <button type="button" onClick={handleStopReading} disabled={!speechSupported || !isReading || isTranslatingChapter}>
                    {tt("stop")}
                  </button>
                </div>
              </div>
              {!speechSupported && <p className="chapter-audio-note">{tt("audioNotSupported")}</p>}
              <div className="chapter-text">
                {isTranslatingChapter ? (
                   <p>...</p>
                ) : paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => <p key={`${paragraph.slice(0, 18)}-${index}`}>{paragraph}</p>)
                ) : (
                  <p>{translatedChapter.full_text_content}</p>
                )}
              </div>
            </article>
          )}
        </div>
      )}
    </>
  );
}
