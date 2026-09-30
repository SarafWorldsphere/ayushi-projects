"use client";

import { useMemo, useState, useEffect } from "react";
import { assessTeacher, assessStudent } from '../src/aiServices';
import { useLanguage } from '../context/LanguageContext';

export default function ProgressSection({ progressData = [] }) {
  const { language, translateText } = useLanguage();

  const [uiText, setUiText] = useState({
    pa: "Performance Analytics",
    tpr: "Teacher Performance Report",
    spr: "Student Performance Report",
    sub: "Type a name, select a class, and generate AI-powered insights.",
    tn: "Teacher Name",
    sn: "Student Name",
    c: "Class",
    s: "Subject",
    rg: "Ready to Generate",
    desc: "Leave inputs blank to use Mock Data for testing.",
    gen: "Generate Report",
    wait: "⏳ Generating...",
    close: "Close Report"
  });

  useEffect(() => {
    const fetchUI = async () => {
      if (language === "English" || language === "en") {
        setUiText({
          pa: "Performance Analytics", tpr: "Teacher Performance Report", spr: "Student Performance Report",
          sub: "Type a name, select a class, and generate AI-powered insights.", tn: "Teacher Name",
          sn: "Student Name", c: "Class", s: "Subject", rg: "Ready to Generate",
          desc: "Leave inputs blank to use Mock Data for testing.", gen: "Generate Report",
          wait: "⏳ Generating...", close: "Close Report"
        });
        return;
      }
      
      const keys = [
        "Performance Analytics", "Teacher Performance Report", "Student Performance Report", 
        "Type a name, select a class, and generate AI-powered insights.", "Teacher Name", 
        "Student Name", "Class", "Subject", "Ready to Generate", 
        "Leave inputs blank to use Mock Data for testing.", "Generate Report", 
        "⏳ Generating...", "Close Report"
      ];
      
      const res = await Promise.all(keys.map(k => translateText(k)));
      
      setUiText({
        pa: res[0], tpr: res[1], spr: res[2], sub: res[3], tn: res[4], sn: res[5],
        c: res[6], s: res[7], rg: res[8], desc: res[9], gen: res[10], wait: res[11], close: res[12]
      });
    };
    fetchUI();
  }, [language, translateText]);

  const [activeTab, setActiveTab] = useState("teacher");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [teacherNameInput, setTeacherNameInput] = useState("");
  const [studentNameInput, setStudentNameInput] = useState("");
  const [isAssessing, setIsAssessing] = useState(false);

  const [rawReport, setRawReport] = useState(null);
  const [translatedReport, setTranslatedReport] = useState(null);

  // Dynamic AI Output Translation
  useEffect(() => {
    let isMounted = true;
    async function updateReportLanguage() {
      if (rawReport && !rawReport.error && translateText && language !== "English" && language !== "en") {
        try {
          const trans = await translateText(rawReport.text);
          if (isMounted) setTranslatedReport({ text: trans || rawReport.text });
        } catch (error) { if(isMounted) setTranslatedReport(rawReport); }
      } else {
        if (isMounted) setTranslatedReport(rawReport);
      }
    }
    updateReportLanguage();
    return () => { isMounted = false; };
  }, [language, rawReport, translateText]);

  const safeProgressData = Array.isArray(progressData) ? progressData : [];
  const classList = useMemo(() => [...new Set(safeProgressData.map(i => i?.class_name).filter(Boolean))], [safeProgressData]);
  const subjectList = useMemo(() => ["All Subjects", ...new Set(safeProgressData.map(i => i?.subject_name).filter(Boolean))], [safeProgressData]);

  const handleGenerateReport = async () => {
    setIsAssessing(true);
    setRawReport(null);
    setTranslatedReport(null);

    try {
      let result;
      if (activeTab === "teacher") {
        const payload = {
          class_name: selectedClass || "10th Grade", teacher_name: teacherNameInput.trim() || "Anjali Sharma",
          metrics: { attendance_rate: "96.5%", student_satisfaction: "4.8/5", syllabus_completion_status: "85% Complete" },
          performance_metrics: { average_class_score: "78%", highest_score: "99%" },
          subjects_taught: selectedSubject === "All Subjects" ? ["Advanced Mathematics", "Physics"] : [selectedSubject]
        };
        result = await assessTeacher(payload);
      } else {
        const payload = {
          student_name: studentNameInput.trim() || "Ravi Kumar", class_name: selectedClass || "10th Grade - Section A",
          metrics: { attendance: "92%", classroom_behavior: "Excellent and attentive" },
          assessments: { mathematics: "94%", science: "88%", english: "76%" },
          assignments: { homework_completion: "100%", late_submissions: "0" }
        };
        result = await assessStudent(payload);
      }
      const finalReportText = typeof result === 'string' ? result : (result?.assessment || result?.report || JSON.stringify(result, null, 2));
      setRawReport({ text: finalReportText });
    } catch (error) {
      setRawReport({ error: "Failed to generate assessment. Please check AI backend connection." });
    } finally {
      setIsAssessing(false);
    }
  };

  const inputStyle = { padding: '10px', borderRadius: '6px', backgroundColor: '#2a2a40', color: 'white', border: '1px solid #3f3f5a', width: '100%' };

  return (
    <div className="page-card">
      <div className="page-header"><h2>{uiText.pa}</h2></div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #1e293b', paddingBottom: '10px' }}>
        <button onClick={() => { setActiveTab("teacher"); setRawReport(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeTab === "teacher" ? '#9333ea' : '#1e1e2f', color: activeTab === "teacher" ? 'white' : '#94a3b8' }}>
          👨‍🏫 {uiText.tpr}
        </button>
        <button onClick={() => { setActiveTab("student"); setRawReport(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeTab === "student" ? '#4f46e5' : '#1e1e2f', color: activeTab === "student" ? 'white' : '#94a3b8' }}>
          🎓 {uiText.spr}
        </button>
      </div>

      <div style={{ backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '12px', color: 'white', marginBottom: '20px' }}>
        <p style={{ marginBottom: '15px' }}>{uiText.sub}</p>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {activeTab === "teacher" && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <label style={{ fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>{uiText.tn}</label>
              <input type="text" value={teacherNameInput} onChange={(e) => setTeacherNameInput(e.target.value)} style={inputStyle} />
            </div>
          )}
          {activeTab === "student" && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <label style={{ fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>{uiText.sn}</label>
              <input type="text" value={studentNameInput} onChange={(e) => setStudentNameInput(e.target.value)} style={inputStyle} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label style={{ fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>{uiText.c}</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={inputStyle}>
              <option value="">-</option>
              {classList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label style={{ fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>{uiText.s}</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} style={inputStyle}>
              {subjectList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '20px', border: '2px dashed #4f46e5', borderRadius: '8px', textAlign: 'center', backgroundColor: '#232336' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{uiText.rg}</h3>
          <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#94a3b8' }}>{uiText.desc}</p>
          <button onClick={handleGenerateReport} disabled={isAssessing} style={{ padding: '10px 24px', backgroundColor: activeTab === "teacher" ? '#9333ea' : '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: isAssessing ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            {isAssessing ? uiText.wait : uiText.gen}
          </button>
        </div>
      </div>

      {translatedReport && (
        <div style={{ padding: '20px', backgroundColor: activeTab === "teacher" ? '#faf5ff' : '#eff6ff', border: `1px solid ${activeTab === "teacher" ? '#e9d5ff' : '#bfdbfe'}`, borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: activeTab === "teacher" ? '#6b21a8' : '#1d4ed8' }}>
            {activeTab === "teacher" ? '📋 ' : '📈 '} {activeTab === "teacher" ? uiText.tpr : uiText.spr}
          </h3>
          {translatedReport.error ? (
            <p style={{ color: 'red', fontWeight: 'bold' }}>{translatedReport.error}</p>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '15px', color: '#334155' }}>
              {translatedReport.text}
            </div>
          )}
          <button onClick={() => { setRawReport(null); setTranslatedReport(null); }} style={{ marginTop: '15px', padding: '8px 16px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontWeight: 'bold' }}>
            {uiText.close}
          </button>
        </div>
      )}
    </div>
  );
}
