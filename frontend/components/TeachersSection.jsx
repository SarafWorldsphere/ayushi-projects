"use client";
import { useState, useEffect } from "react";
import { useLanguage } from '../context/LanguageContext';

export default function TeachersSection({ teachers }) {
  const { language, translateText } = useLanguage();

  const [uiText, setUiText] = useState({
    title: "Teachers Management",
    id: "Teacher ID",
    name: "Name",
    subject: "Subject",
    role: "Role",
    sec1: "Section 1",
    sec2: "Section 2",
    email: "Email",
    phone: "Phone"
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      if (language === "English" || language === "en") {
        setUiText({
          title: "Teachers Management", id: "Teacher ID", name: "Name",
          subject: "Subject", role: "Role", sec1: "Section 1",
          sec2: "Section 2", email: "Email", phone: "Phone"
        });
        return;
      }

      const [t1, t2, t3, t4, t5, t6, t7, t8, t9] = await Promise.all([
        translateText("Teachers Management"), translateText("Teacher ID"),
        translateText("Name"), translateText("Subject"), translateText("Role"),
        translateText("Section 1"), translateText("Section 2"), translateText("Email"), translateText("Phone")
      ]);

      setUiText({
        title: t1, id: t2, name: t3, subject: t4, role: t5,
        sec1: t6, sec2: t7, email: t8, phone: t9
      });
    };
    fetchTranslations();
  }, [language, translateText]);

  return (
    <div className="page-card">
      <div className="page-header">
        <h2>{uiText.title}</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>{uiText.id}</th>
            <th>{uiText.name}</th>
            <th>{uiText.subject}</th>
            <th>{uiText.role}</th>
            <th>{uiText.sec1}</th>
            <th>{uiText.sec2}</th>
            <th>{uiText.email}</th>
            <th>{uiText.phone}</th>
          </tr>
        </thead>

        <tbody>
          {teachers?.map((teacher) => (
            <tr key={teacher.teacher_id}>
              <td>{teacher.teacher_id}</td>
              <td>{teacher.full_name}</td>
              <td>{teacher.subject_name}</td>
              <td>{teacher.role}</td>
              <td>{teacher.section_1 || "-"}</td>
              <td>{teacher.section_2 || "-"}</td>
              <td>{teacher.email_id}</td>
              <td>{teacher.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
