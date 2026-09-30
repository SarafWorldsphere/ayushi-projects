"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link"; // <-- THE FIX: Added Next.js Link
import { useLanguage } from "../src/context/LanguageContext";
import { translateText } from "../src/services/aiService";

// 1. Base English Data
const ENGLISH_TABS = [
  {
    tone: "green",
    icon: "book-open",
    title: "Study A: Core Material",
    href: "/chapters",
    rows: [
      ["1) Chapters", "/chapters"],
      ["2) Study Material", "/study-material"],
      ["3) Quizzes", "/quizzes"],
      ["4) AI Learning Path", "/ai-learning-path"]
    ]
  },
  {
    tone: "orange",
    icon: "clipboard",
    title: "Study B: Assignment",
    href: "/assignments",
    rows: [
      ["1) My Assignments", "/assignments"],
      ["2) Submit Assignment", "/assignments"],
      ["3) Feedback & Marks", "/assignments"]
    ]
  },
  {
    tone: "purple",
    icon: "target",
    title: "Study C: Assessment",
    href: "/assessments",
    rows: [
      ["1) Unit Test", "/assessments"],
      ["2) Mock Test", "/assessments"],
      ["3) Feedback & Marks", "/assessments"],
      ["4) Student Analysis", "/assessments"],
      ["5) Teacher Remark", "/assessments"]
    ]
  }
];

function PanelIcon({ name }) {
  // ... icon svgs ...
  if (name === "book-open") {
    return (
      <svg className="panel-svg" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4.5 7.4c4.1-.9 7.7-.2 10.8 2.1v16.1c-3.1-2.3-6.7-3-10.8-2.1z" />
        <path d="M27.5 7.4c-4.1-.9-7.7-.2-10.8 2.1v16.1c3.1-2.3 6.7-3 10.8-2.1z" />
        <path d="M8.2 11.3c1.9-.2 3.6.2 5.1 1.1M8.2 15.1c1.9-.2 3.6.2 5.1 1.1M8.2 18.9c1.9-.2 3.6.2 5.1 1.1M23.8 11.3c-1.9-.2-3.6.2-5.1 1.1M23.8 15.1c-1.9-.2-3.6.2-5.1 1.1M23.8 18.9c-1.9-.2-3.6.2-5.1 1.1" />
      </svg>
    );
  }

  if (name === "clipboard") {
    return (
      <svg className="panel-svg" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M10.2 6.8H8.5a2.3 2.3 0 0 0-2.3 2.3v17.1a2.3 2.3 0 0 0 2.3 2.3h15a2.3 2.3 0 0 0 2.3-2.3V9.1a2.3 2.3 0 0 0-2.3-2.3h-1.7" />
        <path d="M12.1 8.8h7.8V5.9h-2.1a2 2 0 0 0-3.6 0h-2.1z" />
        <path d="m11.1 14.2 1.7 1.7 3.1-3.2M18.5 15h4.2M11.1 20.2l1.7 1.7 3.1-3.2M18.5 21h4.2" />
      </svg>
    );
  }

  return (
    <svg className="panel-svg" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="14.3" cy="17.7" r="9.8" />
      <circle cx="14.3" cy="17.7" r="5.2" />
      <circle cx="14.3" cy="17.7" r="1.8" />
      <path d="M20.8 11.2 27.4 4.6v5h-5M20.8 11.2h5.1" />
    </svg>
  );
}

export default function StudyTabs() {
  const pathname = usePathname();
  const { selectedLanguage } = useLanguage();

  const [tabs, setTabs] = useState(ENGLISH_TABS);
  const [isTranslating, setIsTranslating] = useState(false);

  const activeIndex = tabs.findIndex((tab) => tab.rows.some(([, href]) => pathname === href || pathname.startsWith(`${href}/`)));
  const [openPanel, setOpenPanel] = useState(activeIndex >= 0 ? activeIndex : null);

  const isEnglish = !selectedLanguage || selectedLanguage === "English" || selectedLanguage === "en";

  useEffect(() => {
    if (isEnglish) {
      setTabs(ENGLISH_TABS);
      setIsTranslating(false);
      return;
    }

    const fetchTranslations = async () => {
      setIsTranslating(true);
      try {
        const stringsToTranslate = [];
        ENGLISH_TABS.forEach(tab => {
          stringsToTranslate.push(tab.title);
          tab.rows.forEach(row => stringsToTranslate.push(row[0]));
        });

        const results = await Promise.all(
          stringsToTranslate.map(text => translateText(text, selectedLanguage))
        );

        let resultIndex = 0;
        const translatedTabs = ENGLISH_TABS.map(tab => {
          const titleRes = results[resultIndex++];
          const newTitle = titleRes?.translated_text || titleRes?.text || titleRes?.data || tab.title;

          const newRows = tab.rows.map(row => {
            const rowRes = results[resultIndex++];
            const newLabel = rowRes?.translated_text || rowRes?.text || rowRes?.data || row[0];
            return [newLabel, row[1]];
          });

          return { ...tab, title: newTitle, rows: newRows };
        });

        setTabs(translatedTabs);
      } catch (error) {
        console.error("Tab translation failed:", error);
        setTabs(ENGLISH_TABS);
      } finally {
        setIsTranslating(false);
      }
    };

    fetchTranslations();
  }, [selectedLanguage, isEnglish]);

  return (
    <section className="content-grid study-tab-strip" aria-label="Study modules">
      {tabs.map((tab, index) => (
        <article className={`study-panel ${tab.tone} ${openPanel === index ? "" : "collapsed"} ${activeIndex === index ? "active-tab" : ""}`} key={index}>
          <button className="panel-head" type="button" aria-expanded={openPanel === index} onClick={() => setOpenPanel((current) => (current === index ? null : index))}>
            <PanelIcon name={tab.icon} />
            <span className="panel-title">{isTranslating && !isEnglish ? "..." : tab.title}</span>
            <span className="chevron" aria-hidden="true" />
          </button>
          <div className="accent-line" />
          <div className="panel-body">
            {tab.rows.map(([label, href], rowIndex) => (
              /* THE FIX: Replaced <a> with <Link> */
              <Link className="study-row" href={href} key={rowIndex}>
                <span>{isTranslating && !isEnglish ? "..." : label}</span>
              </Link>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
