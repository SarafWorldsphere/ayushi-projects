"use client";

import { useEffect, useRef, useState } from "react";
import { getApiBaseUrl } from "../api-base-url";
import DashboardShell from "../dashboard-shell";
import StudyTabs from "../study-tabs";
import { useLanguage } from "../../src/context/LanguageContext";
import { translateText } from "../../src/services/aiService";

const API_BASE_URL = getApiBaseUrl();
const ACTIVE_ASSIGNMENT = {
  id: 2,
  title: "Data Privacy Analysis",
  dueDate: "28 May 2024",
  maxMarks: 25
};
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const supportedFileTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];

const assignments = [
  ["1", "AI Ethics Case Study", "20 May 2024", "Submitted", "View"],
  ["2", "Data Privacy Analysis", "28 May 2024", "In Progress", "Continue"],
  ["3", "Logistics Problem Set", "05 Jun 2024", "Not Started", "Start"],
  ["4", "Algorithm Bias Report", "12 Jun 2024", "Not Started", "Start"],
  ["5", "Sustainable Supply Chain", "20 Jun 2024", "Not Started", "Start"]
];

// DEFAULT ENGLISH LABELS FOR TRANSLATION
const DEFAULT_TEXT = {
  mainTitle: "Your Assignments",
  viewAll: "View All",
  col1: "#",
  col2: "Assignment Title",
  col3: "Due Date",
  col4: "Status",
  col5: "Action",
  tipBox: "Tip: Submit your assignments on time to get early feedback and improve your score!",
  assignmentPrefix: "Assignment",
  dueDateLabel: "Due Date:",
  maxMarksLabel: "Max Marks:",
  assignmentDesc: "Analyze a real-world data privacy scenario and identify potential risks. Suggest proper mitigation strategies.",
  askAiBtn: "Ask AI",
  aiSummaryTitle: "AI Summary",
  aiSummaryDesc: "Data Privacy Analysis asks you to study how personal data can be exposed or misused, identify privacy risks, and recommend practical safeguards such as consent, access control, encryption, and responsible data handling.",
  uploadText: "Upload",
  dragDropText: "Drag & drop your file here",
  orText: "or",
  browseText: "Browse Files",
  supportedText: "Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10 MB)",
  typePrompt: "Type assignment in portal",
  typePlaceholder: "Write your assignment answer here...",
  noFile: "No file uploaded yet",
  notSubmitted: "Not submitted yet",
  submitBtn: "Submit Assignment",
  submittingBtn: "Submitting...",
  workflowTitle: "Assignment Submission & Feedback",
  step1: "Upload / Type Assignment",
  step2: "Teacher Review & Feedback",
  step3: "Revise (If Needed)",
  step4: "Final Submission Done"
};

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(new Error("Unable to read selected file."));
    reader.readAsDataURL(file);
  });
}

export default function AssignmentsPage() {
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [savedSubmission, setSavedSubmission] = useState(null);
  const fileInputRef = useRef(null);

  // TRANSLATION STATE
  const { selectedLanguage } = useLanguage();
  const [t, setT] = useState(DEFAULT_TEXT);
  const [isTranslating, setIsTranslating] = useState(false);
  const isEnglish = !selectedLanguage || selectedLanguage === "English" || selectedLanguage === "en";

  useEffect(() => {
    let cancelled = false;
    async function loadCurrentStudent() {
      try {
        const response = await fetch(`${API_BASE_URL}/students/current`);
        const data = await response.json().catch(() => ({}));
        if (!cancelled && response.ok && data.student?.student_id) {
          setStudentId(data.student.student_id);
        }
      } catch {
        if (!cancelled) setError("Unable to load the current student.");
      }
    }
    loadCurrentStudent();
    return () => { cancelled = true; };
  }, []);

  // TRANSLATION EFFECT
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
        console.error("Assignments Translation failed:", err);
        setT(DEFAULT_TEXT);
      } finally {
        setIsTranslating(false);
      }
    };

    fetchTranslations();
  }, [selectedLanguage, isEnglish]);

  function handleFileSelect(file) {
    setError("");
    if (!file) { setSelectedFile(null); return; }
    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setError("File size must be 10 MB or smaller.");
      return;
    }
    const lowerName = file.name.toLowerCase();
    const isSupported = supportedFileTypes.some((extension) => lowerName.endsWith(extension));
    if (!isSupported) {
      setSelectedFile(null);
      setError("Only PDF, DOC, DOCX, JPG, or PNG files are supported.");
      return;
    }
    setSelectedFile(file);
    setStatus(`File selected: ${file.name}`);
  }

  async function handleSubmitAssignment() {
    const trimmedAnswer = typedAnswer.trim();
    if (!selectedFile && !trimmedAnswer) {
      setError("Upload a file or type an answer before submitting.");
      return;
    }
    if (!studentId) {
      setError("Please wait for the current student to load before submitting.");
      return;
    }
    setSubmitting(true);
    setStatus("Submitting assignment...");
    setError("");

    try {
      const fileContentBase64 = selectedFile ? await readFileAsBase64(selectedFile) : null;
      const response = await fetch(`${API_BASE_URL}/assignment-submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          assignment_id: ACTIVE_ASSIGNMENT.id,
          assignment_title: ACTIVE_ASSIGNMENT.title,
          typed_answer: trimmedAnswer || null,
          file_name: selectedFile?.name || null,
          file_type: selectedFile?.type || null,
          file_size: selectedFile?.size || null,
          file_content_base64: fileContentBase64
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Unable to submit assignment.");
      setSavedSubmission(data.submission);
      setStatus("Assignment saved to the database.");
    } catch (submitError) {
      setStatus("");
      setError(submitError.message || "Unable to submit assignment.");
    } finally {
      setSubmitting(false);
    }
  }

  const tt = (key) => isTranslating && !isEnglish ? "..." : t[key];

  return (
    <DashboardShell>
      <section className="module-page">
        <StudyTabs />
        <div className="module-content-area">
          <div className="assignment-layout">
            <article className="module-card assignment-list-card">
              <div className="card-title-row">
                <h2>{tt("mainTitle")}</h2>
                <button className="soft-button" type="button">{tt("viewAll")}</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{tt("col1")}</th>
                    <th>{tt("col2")}</th>
                    <th>{tt("col3")}</th>
                    <th>{tt("col4")}</th>
                    <th>{tt("col5")}</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(([number, title, dueDate, currentStatus, action]) => (
                    <tr className={currentStatus === "In Progress" ? "highlight-row" : ""} key={number}>
                      <td>{number}</td>
                      <td>{title}</td>
                      <td>{dueDate}</td>
                      <td><span className={`status-pill ${currentStatus.toLowerCase().replaceAll(" ", "-")}`}>{currentStatus}</span></td>
                      <td><button className="table-action" type="button">{action}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="tip-box">{tt("tipBox")}</div>
            </article>

            <article className="module-card assignment-upload-card">
              <div className="card-title-row">
                <h2>{tt("assignmentPrefix")} {ACTIVE_ASSIGNMENT.id}: {ACTIVE_ASSIGNMENT.title}</h2>
                <span className={`status-pill ${savedSubmission ? "submitted" : "in-progress"}`}>{savedSubmission ? "Submitted" : "In Progress"}</span>
              </div>
              <div className="meta-row">
                <span>{tt("dueDateLabel")} {ACTIVE_ASSIGNMENT.dueDate}</span>
                <span>{tt("maxMarksLabel")} {ACTIVE_ASSIGNMENT.maxMarks}</span>
              </div>
              <p>{tt("assignmentDesc")}</p>
              <div className="quiz-submit-row assignment-ai-row">
                <button className="primary-button" type="button" onClick={() => setShowAiSummary(true)}>{tt("askAiBtn")}</button>
              </div>
              {showAiSummary && (
                <div className="assignment-ai-summary">
                  <strong>{tt("aiSummaryTitle")}</strong>
                  <p>{tt("aiSummaryDesc")}</p>
                </div>
              )}
              <div
                className="upload-zone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleFileSelect(event.dataTransfer.files?.[0]);
                }}
              >
                <div className="upload-icon">{tt("uploadText")}</div>
                <strong>{tt("dragDropText")}</strong>
                <span>{tt("orText")}</span>
                <button className="soft-button upload-browse" type="button" onClick={() => fileInputRef.current?.click()}>{tt("browseText")}</button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(event) => handleFileSelect(event.target.files?.[0])}
                />
                <small>{tt("supportedText")}</small>
              </div>
              <label className="typed-assignment-box">
                <span>{tt("typePrompt")}</span>
                <textarea
                  value={typedAnswer}
                  onChange={(event) => setTypedAnswer(event.target.value)}
                  placeholder={tt("typePlaceholder")}
                  rows={8}
                />
              </label>
              <div className="submit-row">
                <div>
                  <p>{selectedFile ? `${tt("selected")} ${selectedFile.name}` : tt("noFile")}</p>
                  <p>{savedSubmission ? `${tt("lastSaved")} ${new Date(savedSubmission.submitted_at).toLocaleString()}` : tt("notSubmitted")}</p>
                </div>
                <button className="primary-button" type="button" onClick={handleSubmitAssignment} disabled={submitting}>
                  {submitting ? tt("submittingBtn") : tt("submitBtn")}
                </button>
              </div>
              {status && <div className="learning-status success" role="status">{status}</div>}
              {error && <div className="learning-status error" role="alert">{error}</div>}
            </article>
          </div>

          <article className="module-card workflow-card">
            <h2>{tt("workflowTitle")}</h2>
            <div className="workflow-steps">
              <div><span>1</span><p>{tt("step1")}</p></div>
              <div><span>2</span><p>{tt("step2")}</p></div>
              <div><span>3</span><p>{tt("step3")}</p></div>
              <div><span>4</span><p>{tt("step4")}</p></div>
            </div>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
