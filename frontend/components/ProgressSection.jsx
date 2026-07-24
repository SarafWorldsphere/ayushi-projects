"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { assessClassroom } from '../src/aiServices';
import TranslatedText from './TranslatedText';

export default function ProgressSection({ progressData = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlClass = searchParams.get("class") || "";
  const urlStudent = searchParams.get("student") || "";

  // -------- AI ASSESSMENT STATE ----------
  const [classroomReport, setClassroomReport] = useState(null);
  const [isAssessing, setIsAssessing] = useState(false);

  // -------- UPDATE URL ----------
  const updateURL = (cls, student) => {
    const params = new URLSearchParams();

    if (cls) params.set("class", cls);
    if (student) params.set("student", student);

    router.push(`?${params.toString()}`);
  };

  // -------- CLASS LIST ----------
  const classTabs = useMemo(() => {
    return [
      ...new Set(
        progressData.map(
          (item) => `${item.class_name} - Section ${item.section_name}`
        )
      ),
    ];
  }, [progressData]);

  // -------- CLASS DATA ----------
  const classData = progressData.filter(
    (item) =>
      `${item.class_name} - Section ${item.section_name}` === urlClass
  );

  // -------- STUDENTS ----------
  const students = [
    ...new Map(
      classData.map((item) => [item.student_id || item.full_name, item])
    ).values(),
  ];

  // -------- SELECTED STUDENT ----------
  const selectedStudent = students.find(
    (s) => String(s.student_id || s.full_name) === urlStudent
  );

  const studentRecords = selectedStudent
    ? classData.filter(
        (item) =>
          item.student_id === selectedStudent.student_id ||
          item.full_name === selectedStudent.full_name
      )
    : [];

  // -------- AI HANDLER ----------
  const handleClassroomAssessment = async () => {
    setIsAssessing(true);
    setClassroomReport(null);

    // EXACT match for FastAPI Schema: { class_name, metrics }
    // If a class is selected in the UI, assess that class. Otherwise, assess all classes.
    const payload = {
      class_name: urlClass || "Overall School Progress",
      metrics: {
        total_students_in_view: urlClass ? students.length : progressData.length,
        data_summary: urlClass 
          ? classData.map(s => ({ name: s.full_name, subject: s.subject_name, score: s.percentage }))
          : "Overview of all classes"
      }
    };

    try {
      const result = await assessClassroom(payload);
      
      const reportText = typeof result === 'string' 
        ? result 
        : (result?.assessment || result?.report || JSON.stringify(result, null, 2));
        
      setClassroomReport({ text: reportText });
    } catch (error) {
      console.error("Classroom assessment error:", error);
      setClassroomReport({ error: "Failed to generate classroom assessment." });
    } finally {
      setIsAssessing(false);
    }
  };

  // -------- HELPERS ----------
  const getAverage = () => {
    if (!studentRecords.length) return "0.00";
    const total = studentRecords.reduce(
      (sum, i) => sum + Number(i.percentage || 0),
      0
    );
    return (total / studentRecords.length).toFixed(2);
  };

  const getBestSubject = () => {
    const map = {};

    studentRecords.forEach((i) => {
      if (!i.subject_name) return;
      if (!map[i.subject_name]) map[i.subject_name] = { t: 0, c: 0 };

      map[i.subject_name].t += Number(i.percentage || 0);
      map[i.subject_name].c += 1;
    });

    let best = "-";
    let bestAvg = -1;

    Object.entries(map).forEach(([sub, d]) => {
      const avg = d.t / d.c;
      if (avg > bestAvg) {
        bestAvg = avg;
        best = sub;
      }
    });

    return best;
  };

  const getMarks = (subject, exam) => {
    const record = studentRecords.find(
      (i) => i.subject_name === subject && i.exam_name === exam
    );
    return record?.marks_obtained ?? "-";
  };

  const examNames = [
    ...new Set(studentRecords.map((i) => i.exam_name).filter(Boolean)),
  ];

  const subjects = [
    ...new Set(studentRecords.map((i) => i.subject_name).filter(Boolean)),
  ];

  // ================= UI =================
  return (
    <div className="page-card">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2><TranslatedText text="Student Progress" /></h2>

        <button
          onClick={handleClassroomAssessment}
          disabled={isAssessing || progressData.length === 0}
          style={{
            padding: '8px 16px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isAssessing ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isAssessing ? <TranslatedText text="⏳ Generating..." /> : <TranslatedText text="🏫 AI Classroom Assessment" />}
        </button>
      </div>

      {/* -------- AI REPORT DISPLAY -------- */}
      {classroomReport && (
        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0, color: '#166534' }}>📈 <TranslatedText text="Classroom Analytics Report" /></h3>

          {classroomReport.error ? (
            <p style={{ color: 'red' }}>{classroomReport.error}</p>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px', color: '#14532d' }}>
              {classroomReport.text || "No assessment generated."}
            </div>
          )}

          <button
            onClick={() => setClassroomReport(null)}
            style={{ marginTop: '12px', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #86efac', backgroundColor: '#fff' }}
          >
            <TranslatedText text="Close Report" />
          </button>
        </div>
      )}

      {/* -------- BREADCRUMB -------- */}
      <div className="progress-breadcrumb">
        <TranslatedText text="Progress" />

        {urlClass && (
          <>
            <span>›</span>
            <button onClick={() => updateURL("", "")}>
              {urlClass}
            </button>
          </>
        )}

        {selectedStudent && (
          <>
            <span>›</span>
            <strong>{selectedStudent.full_name}</strong>
          </>
        )}
      </div>

      {/* -------- CLASS GRID -------- */}
      {!urlClass && (
        <div className="progress-class-grid">
          {classTabs.map((className) => (
            <button
              key={className}
              className="progress-class-card"
              onClick={() => updateURL(className, "")}
            >
              {className}
            </button>
          ))}
        </div>
      )}

      {/* -------- STUDENT LIST -------- */}
      {urlClass && !urlStudent && (
        <>
          <h3 className="progress-subtitle">
            {urlClass} • {students.length} <TranslatedText text="Students" />
          </h3>

          <table>
            <tbody>
              {students.map((student) => {
                const key = String(student.student_id || student.full_name);

                return (
                  <tr
                    key={key}
                    className="clickable-row"
                    onClick={() => updateURL(urlClass, key)}
                  >
                    <td>{student.roll_no || "-"}</td>
                    <td>{student.full_name || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {/* -------- STUDENT DETAILS -------- */}
      {selectedStudent && (
    <>
     <div className="progress-summary-grid">
      <div className="progress-summary-card">
        <span><TranslatedText text="Student" /></span>
        <strong>{selectedStudent.full_name || "-"}</strong>
      </div>

      <div className="progress-summary-card">
        <span><TranslatedText text="Overall Performance" /></span>
        <strong>{getAverage()}%</strong>
      </div>

      <div className="progress-summary-card">
        <span><TranslatedText text="Best Subject" /></span>
        <strong>{getBestSubject()}</strong>
      </div>

      <div className="progress-summary-card">
        <span><TranslatedText text="Exams Taken" /></span>
        <strong>{examNames.length}</strong>
      </div>
    </div>

    <div className="progress-table-scroll">
      <table>
        <thead>
          <tr>
            <th><TranslatedText text="Subject" /></th>
            {examNames.map((e) => (
              <th key={e}>{e}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {subjects.map((sub) => (
            <tr key={sub}>
              <td>{sub}</td>
              {examNames.map((ex) => (
                <td key={`${sub}-${ex}`}>
                  {getMarks(sub, ex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   </>
   )}
    </div>
  );
}
