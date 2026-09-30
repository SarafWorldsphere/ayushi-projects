"use client";

import { useState, useEffect } from "react";
import DashboardShell from "../dashboard-shell";
import StudyTabs from "../study-tabs";
import { useLanguage } from "../../src/context/LanguageContext";
import { translateText } from "../../src/services/aiService";

// Base English Data
const unitTest = {
  title: "Unit Test",
  subject: "Social Science",
  chapter: "Democratic India",
  question: "Explain why elections are important in a democratic country like India.",
  studentAnswer: "Elections are important because people can choose their leaders. If leaders do not work properly, citizens can vote for another leader in the next election.",
  aiAnswer: "Elections are important in democratic India because they give citizens the power to choose their representatives. Regular elections make leaders accountable to the people, protect public participation, and allow citizens to peacefully change the government when they are not satisfied."
};

const subjectScores = [
  ["Mathematics", "97%", "blue"],
  ["Science", "80%", "orange"],
  ["English", "78%", "teal"],
  ["Social Studies", "45%", "navy"]
];

const learners = [
  ["Aarav Sharma", "92%", "red"],
  ["Diya Patel", "78%", "yellow"],
  ["Rohan Verma", "85%", "green"],
  ["Meera Singh", "90%", "green"]
];

const testRows = [
  ["Quiz 1", ["Math: 97%", "Physics: 80%", "Chem: 88%"]],
  ["Project 1", ["Math: 95%", "Physics: 80%", "Chem: 82%"]],
  ["Unit Test 1", ["Math: 97%", "Physics: 80%", "Chem: 80%"]],
  ["Presentation 1", ["Math: 78%", "Physics: 85%", "Chem: 70%"]]
];

const focusRows = [
  ["Algebra", "72%", "92%", "blue"],
  ["Mechanics", "58%", "86%", "orange"],
  ["Organic Chemistry", "64%", "82%", "green"],
  ["Essay Writing", "66%", "84%", "green"]
];

// --- TRANSLATION DICTIONARY ---
const DEFAULT_TEXT = {
  unitTestBtn: "Unit Test",
  mockTestBtn: "Mock Test",
  studentAnalysisBtn: "Student Analysis",
  teacherRemarkBtn: "Teacher Remark",
  
  // Unit Test View
  evaluatedStatus: "Evaluated",
  readyStatus: "Ready",
  totalMarksLabel: "Total Marks:",
  studentAnswerLabel: "Student Answer",
  aiEvalBtn: "AI Evaluation",
  resetBtn: "Reset",
  aiEvalTitle: "AI Evaluation",
  chapterLabel: "Chapter",
  scoreLabel: "Score",
  statusLabel: "Status",
  completedStatus: "Completed",
  pendingStatus: "Pending",
  aiAnswerLabel: "AI Answer",
  feedbackLabel: "Feedback",
  feedbackText: "Your answer is correct and clear. Add points about accountability and peaceful change of government to make it stronger.",

  // Teacher Remark View
  dashboardTitle: "Dashboard",
  performanceOverview: "Performance Overview",
  excellent: "Excellent 40%",
  good: "Good 30%",
  average: "Average 20%",
  needsSupport: "Needs Support 10%",
  atRiskStudents: "At-Risk Students",
  topSubjects: "Top Subjects",
  engagementHeatmap: "Engagement Heatmap",
  learningProgress: "Learning Progress",
  growthTrend: "Growth Trend",
  totalStudents: "Total Students",

  // Student Analysis View
  studentAssesmentTitle: "Student Self-Assessment: Academic Year 2023-24",
  finalSubjectPerf: "Final Subject Performance",
  avgOfTests: "(Average of all Tests)",
  overallAvg: "Overall Average",
  testResultTimeline: "Test Result Timeline",
  detailedTestPerf: "Detailed Test Performance by Subject",
  studyDistribution: "Study Subject Distribution Heatmap",
  focusAreaImprov: "Focus Area Improvements",
  overallGrowthTrend: "Overall Growth Trend"
};

function RingChart({ label = "365", caption = "Total Students", t, tt }) {
  return (
    <div className="ring-chart">
      <div className="ring-number">{label}</div>
      <span>{tt ? tt(caption) : caption}</span>
    </div>
  );
}

function MiniBars() {
  return (
    <span className="mini-bars" aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}

function LineChart({ labels, values, dashed = false }) {
  const max = Math.max(...values);
  const points = values.map((value, index) => `${24 + index * 58},${150 - (value / max) * 116}`).join(" ");

  return (
    <div className="chart-panel">
      <svg viewBox="0 0 380 190" role="img" aria-label="Growth trend chart">
        {[40, 75, 110, 145].map((y) => <line className="chart-grid-line" x1="18" x2="354" y1={y} y2={y} key={y} />)}
        <polyline className={dashed ? "line-dashed" : "line-solid"} points={points} />
        {values.map((value, index) => {
          const x = 24 + index * 58;
          const y = 150 - (value / max) * 116;
          return <circle className="line-dot" cx={x} cy={y} r="5" key={`${value}-${index}`} />;
        })}
      </svg>
      <div className="chart-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div>
    </div>
  );
}

function BarChart() {
  const bars = [42, 30, 48, 72, 60, 74, 104];

  return (
    <div className="bar-chart" aria-label="At-risk students by month">
      {bars.map((height, index) => (
        <div className="bar-stack" key={height}>
          <span style={{ height: `${height}px` }} />
          <i style={{ height: `${Math.max(18, height - 22)}px` }} />
        </div>
      ))}
      <div className="chart-labels">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((label) => <span key={label}>{label}</span>)}</div>
    </div>
  );
}

function Heatmap({ compact = false }) {
  const colors = ["green", "lime", "yellow", "orange", "red"];
  const rows = compact ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] : ["Mon", "Tue", "Wed", "Thu", "Sat"];
  const cols = compact ? ["Math", "Phys", "Chem", "Bio", "Eng"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <div className={`heatmap ${compact ? "subject-heatmap" : ""}`}>
      <div className="heatmap-body">
        {rows.map((row, rowIndex) => (
          <div className="heatmap-row" key={row}>
            <span>{row}</span>
            {cols.map((col, colIndex) => <i className={colors[(rowIndex + colIndex * 2) % colors.length]} key={`${row}-${col}`} />)}
          </div>
        ))}
      </div>
      <div className="heatmap-labels">{cols.map((col) => <span key={col}>{col}</span>)}</div>
    </div>
  );
}

function TeacherRemarkView({ tt }) {
  return (
    <section className="assessment-dashboard">
      <div className="assessment-dashboard-head">
        <h2>{tt("dashboardTitle")}</h2>
        <div className="dashboard-actions"><span>!</span><span>...</span><div className="tiny-avatar">AS</div></div>
      </div>
      <div className="analysis-grid">
        <article className="analysis-card performance-card">
          <h3>{tt("performanceOverview")}</h3>
          <div className="performance-row">
            <RingChart tt={tt} caption="totalStudents" />
            <div className="legend-list">
              {[tt("excellent"), tt("good"), tt("average"), tt("needsSupport")].map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </article>
        <article className="analysis-card"><h3>{tt("atRiskStudents")}</h3><BarChart /></article>
        <article className="analysis-card">
          <h3>{tt("topSubjects")}</h3>
          <div className="subject-list">{subjectScores.map(([name, score, tone]) => <div className="subject-row" key={name}><i className={tone}>{name[0]}</i><span>{name}</span><strong>{score}</strong></div>)}</div>
        </article>
        <article className="analysis-card"><h3>{tt("engagementHeatmap")}</h3><Heatmap /></article>
        <article className="analysis-card">
          <h3>{tt("learningProgress")}</h3>
          <div className="learner-list">{learners.map(([name, score, tone]) => <div className="learner-row" key={name}><i className={tone} /><div className="tiny-avatar">{name.split(" ").map((part) => part[0]).join("")}</div><span>{name}</span><MiniBars /><strong>{score}</strong></div>)}</div>
        </article>
        <article className="analysis-card"><h3>{tt("growthTrend")}</h3><LineChart labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]} values={[40, 210, 190, 340, 260, 420, 660]} /></article>
      </div>
    </section>
  );
}

function StudentAnalysisView({ tt }) {
  return (
    <section className="assessment-dashboard student-analysis-view">
      <div className="assessment-dashboard-head">
        <h2>{tt("studentAssesmentTitle")}</h2>
        <div className="tiny-avatar">AS</div>
      </div>
      <div className="analysis-grid">
        <article className="analysis-card performance-card">
          <h3>{tt("finalSubjectPerf")}</h3>
          <p>{tt("avgOfTests")}</p>
          <div className="performance-row">
            <RingChart label="88%" caption="overallAvg" tt={tt} />
            <div className="legend-list subjects">{["Math", "Physics", "Chemistry", "Biology"].map((item) => <span key={item}>{item}</span>)}</div>
          </div>
        </article>
        <article className="analysis-card"><h3>{tt("testResultTimeline")}</h3><LineChart labels={["Quarter 1", "Mid-Term", "Quarter 2", "Final Exam"]} values={[78, 80, 93, 94]} /></article>
        <article className="analysis-card">
          <h3>{tt("detailedTestPerf")}</h3>
          <div className="test-performance-list">{testRows.map(([name, scores]) => <div className="test-row" key={name}><strong>{name}</strong><span>{scores.join("  |  ")}</span></div>)}</div>
        </article>
        <article className="analysis-card"><h3>{tt("studyDistribution")}</h3><Heatmap compact /></article>
        <article className="analysis-card">
          <h3>{tt("focusAreaImprov")}</h3>
          <div className="focus-list">{focusRows.map(([name, before, after, tone]) => <div className="focus-row" key={name}><strong>{name}</strong><div><span style={{ width: before }} /><i className={tone} style={{ width: after }} /></div></div>)}</div>
        </article>
        <article className="analysis-card"><h3>{tt("overallGrowthTrend")}</h3><LineChart labels={["Quarter 1", "Mid-Term", "Quarter 2", "Final Exam"]} values={[20, 64, 85, 116]} dashed /></article>
      </div>
    </section>
  );
}

export default function AssessmentsPage() {
  const [activeOption, setActiveOption] = useState("unit-test");
  const [showEvaluation, setShowEvaluation] = useState(false);

  // AI Translation Setup
  const { selectedLanguage } = useLanguage();
  const [t, setT] = useState(DEFAULT_TEXT);
  const [translatedData, setTranslatedData] = useState(unitTest);
  const [isTranslating, setIsTranslating] = useState(false);
  const isEnglish = !selectedLanguage || selectedLanguage === "English" || selectedLanguage === "en";

  useEffect(() => {
    if (isEnglish) {
      setT(DEFAULT_TEXT);
      setTranslatedData(unitTest);
      setIsTranslating(false);
      return;
    }

    const fetchTranslations = async () => {
      setIsTranslating(true);
      try {
        // 1. Translate standard labels
        const keys = Object.keys(DEFAULT_TEXT);
        const values = Object.values(DEFAULT_TEXT);
        const labelResponses = await Promise.all(values.map(text => translateText(text, selectedLanguage)));
        const newT = {};
        keys.forEach((key, index) => {
          const res = labelResponses[index];
          newT[key] = res?.translated_text || res?.text || res?.data || DEFAULT_TEXT[key];
        });
        setT(newT);

        // 2. Translate Unit Test Data
        const testKeys = Object.keys(unitTest);
        const testValues = Object.values(unitTest);
        const testResponses = await Promise.all(testValues.map(text => translateText(text, selectedLanguage)));
        const newTestData = {};
        testKeys.forEach((key, index) => {
          const res = testResponses[index];
          newTestData[key] = res?.translated_text || res?.text || res?.data || unitTest[key];
        });
        setTranslatedData(newTestData);

      } catch (err) {
        console.error("Assessments Translation failed:", err);
        setT(DEFAULT_TEXT);
        setTranslatedData(unitTest);
      } finally {
        setIsTranslating(false);
      }
    };

    fetchTranslations();
  }, [selectedLanguage, isEnglish]);

  function handleUnitTest() {
    setActiveOption("unit-test");
    setShowEvaluation(false);
  }

  function handleAiEvaluation() {
    setActiveOption("unit-test");
    setShowEvaluation(true);
  }

  const tt = (key) => isTranslating && !isEnglish ? "..." : t[key];

  return (
    <DashboardShell>
      <section className="module-page">
        <StudyTabs />
        <div className="module-content-area assessment-content-area">
          <div className="module-action-grid assessment-option-grid">
            <button className={`module-action ${activeOption === "unit-test" ? "active" : ""}`} type="button" onClick={handleUnitTest}>{tt("unitTestBtn")}</button>
            <button className="module-action" type="button">{tt("mockTestBtn")}</button>
            <button className={`module-action ${activeOption === "student-analysis" ? "active" : ""}`} type="button" onClick={() => setActiveOption("student-analysis")}>{tt("studentAnalysisBtn")}</button>
            <button className={`module-action ${activeOption === "teacher-remark" ? "active" : ""}`} type="button" onClick={() => setActiveOption("teacher-remark")}>{tt("teacherRemarkBtn")}</button>
          </div>

          {activeOption === "unit-test" && (
            <div className="quiz-layout assessment-layout">
              <article className="module-card purple-module">
                <div className="card-title-row">
                  <h2>{isTranslating && !isEnglish ? "..." : translatedData.title}</h2>
                  <span className={`status-pill ${showEvaluation ? "completed" : "in-progress"}`}>{showEvaluation ? tt("evaluatedStatus") : tt("readyStatus")}</span>
                </div>

                <div className="meta-row">
                  <span>{isTranslating && !isEnglish ? "..." : translatedData.subject}</span>
                  <span>{isTranslating && !isEnglish ? "..." : translatedData.chapter}</span>
                  <span>{tt("totalMarksLabel")} 10</span>
                </div>

                <div className="quiz-question-list">
                  <fieldset className="quiz-question">
                    <legend>1. {isTranslating && !isEnglish ? "..." : translatedData.question}</legend>
                    <div className="assessment-answer-box">
                      <span>{tt("studentAnswerLabel")}</span>
                      <p>{isTranslating && !isEnglish ? "..." : translatedData.studentAnswer}</p>
                    </div>
                  </fieldset>
                </div>

                <div className="quiz-submit-row">
                  <button className="primary-button" type="button" onClick={handleAiEvaluation}>{tt("aiEvalBtn")}</button>
                  <button className="soft-button" type="button" onClick={handleUnitTest}>{tt("resetBtn")}</button>
                </div>
              </article>

              <article className="module-card latest-result-card">
                <h2>{tt("aiEvalTitle")}</h2>
                <div className="result-grid quiz-result-grid">
                  <div><span>{tt("chapterLabel")}</span><strong>{isTranslating && !isEnglish ? "..." : translatedData.chapter}</strong></div>
                  <div><span>{tt("scoreLabel")}</span><strong className="score-text">{showEvaluation ? "8 / 10" : "- / 10"}</strong></div>
                  <div><span>{tt("statusLabel")}</span><strong>{showEvaluation ? tt("completedStatus") : tt("pendingStatus")}</strong></div>
                </div>

                {showEvaluation && (
                  <div className="quiz-score-card assessment-ai-card">
                    <strong>{tt("aiAnswerLabel")}</strong>
                    <p>{isTranslating && !isEnglish ? "..." : translatedData.aiAnswer}</p>
                    <strong>{tt("feedbackLabel")}</strong>
                    <p>{tt("feedbackText")}</p>
                  </div>
                )}
              </article>
            </div>
          )}

          {activeOption === "student-analysis" && <StudentAnalysisView tt={tt} />}
          {activeOption === "teacher-remark" && <TeacherRemarkView tt={tt} />}
        </div>
      </section>
    </DashboardShell>
  );
}
