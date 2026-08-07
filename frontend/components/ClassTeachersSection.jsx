"use client";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ClassTeachersSection({ classTeachers }) {
  const { language, translateText } = useLanguage();
  
  const [uiText, setUiText] = useState({
    title: "Class Teachers", cls: "Class", teacher: "Teacher",
    section: "Section", year: "Academic Year"
  });

  useEffect(() => {
    const fetchUI = async () => {
      if (language === "English" || language === "en") {
        setUiText({
          title: "Class Teachers", cls: "Class", teacher: "Teacher",
          section: "Section", year: "Academic Year"
        });
        return;
      }

      const [t1, t2, t3, t4, t5] = await Promise.all([
        translateText("Class Teachers"), translateText("Class"), translateText("Teacher"),
        translateText("Section"), translateText("Academic Year")
      ]);

      setUiText({ title: t1, cls: t2, teacher: t3, section: t4, year: t5 });
    };
    fetchUI();
  }, [language, translateText]);

  return (
    <div className="page-card">
      <div className="page-header"><h2>{uiText.title}</h2></div>
      <table>
        <thead>
          <tr>
            <th>{uiText.cls}</th>
            <th>{uiText.teacher}</th>
            <th>{uiText.section}</th>
            <th>{uiText.year}</th>
          </tr>
        </thead>
        <tbody>
          {classTeachers && classTeachers.map((item, index) => (
            <tr key={index}>
              <td>{item.class_name || "-"}</td>
              <td>{item.class_teacher_name || "-"}</td>
              <td>{item.section_name || "-"}</td>
              <td>{item.academic_year || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
