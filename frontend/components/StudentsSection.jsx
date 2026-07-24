"use client";

import { useEffect, useState } from "react";
import { assessStudent } from '../src/aiServices';
import TranslatedText from './TranslatedText';

export default function StudentsSection({
  students = [],
  searchText = "",
  loaded = false,
}) {
  const tabs = [
    ...new Set(
      students
        .filter((student) => student.class_name && student.section_name)
        .map(
          (student) =>
            `${student.class_name} - Section ${student.section_name}`
        )
    ),
  ];

  const [activeSectionTab, setActiveSectionTab] = useState("");
  const [assessmentReport, setAssessmentReport] = useState(null);
  const [isAssessing, setIsAssessing] = useState(false);

  useEffect(() => {
    if (!activeSectionTab && tabs.length > 0) {
      setActiveSectionTab(tabs[0]);
    }
  }, [tabs, activeSectionTab]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      !searchText ||
      student.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.admission_no?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.class_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.section_name?.toLowerCase().includes(searchText.toLowerCase());

    if (searchText) {
      return matchesSearch;
    }

    return (
      `${student.class_name} - Section ${student.section_name}` ===
      activeSectionTab
    );
  });

  const handleStudentAssessment = async () => {
    setIsAssessing(true);
    setAssessmentReport(null);

    // EXACT payload match for the backend schema: { student_name, metrics }
    const studentData = {
      student_name: activeSectionTab || "All Students in Section",
      metrics: {
        total_students: filteredStudents.length,
        student_list: filteredStudents.map(s => ({
          name: s.full_name || "Unknown",
          admission_no: s.admission_no || "-",
          parent: s.parent_name || "-"
        }))
      }
    };

    try {
      const result = await assessStudent(studentData);
      
      // Handle backend returning a raw string vs an object
      const reportText = typeof result === 'string' 
        ? result 
        : (result?.assessment || result?.report || JSON.stringify(result, null, 2));
        
      setAssessmentReport({ text: reportText });
    } catch (error) {
      console.error("Failed to generate student assessment:", error);
      setAssessmentReport({ error: "Failed to generate assessment. Please check your backend connection." });
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <div className="page-card">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2><TranslatedText text="Students Management" /></h2>

        <button
          onClick={handleStudentAssessment}
          disabled={isAssessing || filteredStudents.length === 0}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isAssessing ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isAssessing ? <TranslatedText text="⏳ Generating..." /> : <TranslatedText text="✨ AI Student Assessment" />}
        </button>
      </div>

      {assessmentReport && (
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0, color: '#334155' }}>🤖 <TranslatedText text="AI Assessment Report" /></h3>

          {assessmentReport.error ? (
            <p style={{ color: 'red' }}>{assessmentReport.error}</p>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px', color: '#1e293b' }}>
              {assessmentReport.text || "No assessment generated."}
            </div>
          )}

          <button
            onClick={() => setAssessmentReport(null)}
            style={{ marginTop: '12px', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          >
            <TranslatedText text="Close Report" />
          </button>
        </div>
      )}

      <div className="student-section-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSectionTab(tab)}
            className={activeSectionTab === tab ? "active-student-tab" : ""}
          >
            {tab}
          </button>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th><TranslatedText text="Admission No" /></th>
            <th><TranslatedText text="Name" /></th>
            <th><TranslatedText text="Class" /></th>
            <th><TranslatedText text="Section" /></th>
            <th><TranslatedText text="Parent" /></th>
            <th><TranslatedText text="Mobile" /></th>
            <th><TranslatedText text="Email" /></th>
          </tr>
        </thead>
        <tbody>
          {!loaded ? null : filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="7"><TranslatedText text="No students found" /></td>
            </tr>
          ) : (
            filteredStudents.map((student, index) => (
              <tr key={`${student.student_id}-${index}`}>
                {/* DO NOT translate admission number, mobile, or email */}
                <td>{student.admission_no || "-"}</td>

                {/* Translate Names and Classes */}
                <td>{student.full_name ? <TranslatedText text={student.full_name} /> : "-"}</td>
                <td>{student.class_name ? <TranslatedText text={student.class_name} /> : "-"}</td>
                <td>{student.section_name ? <TranslatedText text={student.section_name} /> : "-"}</td>
                <td>{student.parent_name ? <TranslatedText text={student.parent_name} /> : "-"}</td>

                <td>{student.mobile_no || "-"}</td>
                <td>{student.email_id || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
