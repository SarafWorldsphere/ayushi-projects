"use client";

import { useState } from "react";
import { assessClassroom } from '../src/aiServices';

export default function ClassTeachersSection({ classTeachers }) {
  // States for AI Assessment
  const [classroomReport, setClassroomReport] = useState(null);
  const [isClassAssessing, setIsClassAssessing] = useState(false);

  // AI Assessment Function
  const handleClassroomAssessment = async () => {
    setIsClassAssessing(true);
    setClassroomReport(null);

    // Package the table data to send to your AI API
    const classData = {
      totalClasses: classTeachers?.length || 0,
      classes: classTeachers?.map(c => ({
        className: c.class_name,
        teacher: c.class_teacher_name,
        section: c.section_name
      })) || []
    };

    try {
      const result = await assessClassroom(classData);
      setClassroomReport(result);
    } catch (error) {
      console.error("Classroom Assessment failed:", error);
      setClassroomReport({ error: "Failed to generate classroom assessment. Please check your backend connection." });
    } finally {
      setIsClassAssessing(false);
    }
  };

  return (
    <div className="page-card">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Class Teachers</h2>
        
        {/* New Generate Assessment Button */}
        <button
          onClick={handleClassroomAssessment}
          disabled={isClassAssessing || !classTeachers || classTeachers.length === 0}
          style={{
            padding: '8px 16px',
            backgroundColor: '#059669', // Green color to differentiate from Students section
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isClassAssessing || !classTeachers || classTeachers.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isClassAssessing ? "⏳ Generating..." : "✨ AI Classroom Assessment"}
        </button>
      </div>

      {/* AI Assessment Report Display */}
      {classroomReport && (
        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0, color: '#166534' }}>🏫 AI Classroom Assessment Report</h3>
          
          {classroomReport.error ? (
            <p style={{ color: 'red' }}>{classroomReport.error}</p>
          ) : (
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '14px', color: '#15803d' }}>
              {JSON.stringify(classroomReport, null, 2)}
            </pre>
          )}
          
          <button 
            onClick={() => setClassroomReport(null)} 
            style={{ marginTop: '12px', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #bbf7d0', backgroundColor: '#ffffff' }}
          >
            Close Report
          </button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Teacher</th>
            <th>Section</th>
            <th>Academic Year</th>
          </tr>
        </thead>
        <tbody>
          {classTeachers && classTeachers.map((item, index) => (
            <tr key={index}>
              <td>{item.class_name}</td>
              <td>{item.class_teacher_name}</td>
              <td>{item.section_name}</td>
              <td>{item.academic_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
