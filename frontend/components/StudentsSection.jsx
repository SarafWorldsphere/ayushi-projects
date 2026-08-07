"use client";

import { useEffect, useState } from "react";
import { useLanguage } from '../context/LanguageContext';

export default function StudentsSection({ students = [], searchText = "", loaded = false }) {
  const { language, translateText } = useLanguage();

  // State to hold translated UI text
  const [uiText, setUiText] = useState({
    title: "Students Management",
    adminNo: "Admission No",
    name: "Name",
    cls: "Class",
    section: "Section",
    parent: "Parent",
    mobile: "Mobile",
    email: "Email",
    notFound: "No students found"
  });

  // AI Translation Hook
  useEffect(() => {
    const fetchTranslations = async () => {
      if (language === "English" || language === "en") {
        setUiText({
          title: "Students Management", adminNo: "Admission No", name: "Name",
          cls: "Class", section: "Section", parent: "Parent", mobile: "Mobile",
          email: "Email", notFound: "No students found"
        });
        return;
      }

      const [t1, t2, t3, t4, t5, t6, t7, t8, t9] = await Promise.all([
        translateText("Students Management"), translateText("Admission No"),
        translateText("Name"), translateText("Class"), translateText("Section"),
        translateText("Parent"), translateText("Mobile"), translateText("Email"),
        translateText("No students found")
      ]);

      setUiText({
        title: t1, adminNo: t2, name: t3, cls: t4,
        section: t5, parent: t6, mobile: t7, email: t8, notFound: t9
      });
    };
    fetchTranslations();
  }, [language, translateText]);

  const tabs = [
    ...new Set(
      students
        .filter((student) => student.class_name && student.section_name)
        .map((student) => `${student.class_name} - Section ${student.section_name}`)
    ),
  ];

  const [activeSectionTab, setActiveSectionTab] = useState("");

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

    return `${student.class_name} - Section ${student.section_name}` === activeSectionTab;
  });

  return (
    <div className="page-card">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{uiText.title}</h2>
      </div>

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
            <th>{uiText.adminNo}</th>
            <th>{uiText.name}</th>
            <th>{uiText.cls}</th>
            <th>{uiText.section}</th>
            <th>{uiText.parent}</th>
            <th>{uiText.mobile}</th>
            <th>{uiText.email}</th>
          </tr>
        </thead>
        <tbody>
          {!loaded ? null : filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>{uiText.notFound}</td>
            </tr>
          ) : (
            filteredStudents.map((student, index) => (
              <tr key={`${student.student_id}-${index}`}>
                <td>{student.admission_no || "-"}</td>
                <td>{student.full_name || "-"}</td>
                <td>{student.class_name || "-"}</td>
                <td>{student.section_name || "-"}</td>
                <td>{student.parent_name || "-"}</td>
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
