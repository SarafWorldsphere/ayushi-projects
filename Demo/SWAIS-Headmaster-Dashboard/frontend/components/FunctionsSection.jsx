"use client";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function FunctionsSection({ functionsData }) {
  const { language, translateText } = useLanguage();
  
  const [uiText, setUiText] = useState({
    title: "School Functions", func: "Function", date: "Date",
    coord: "Coordinator", part: "Participants", status: "Status"
  });

  useEffect(() => {
    const fetchUI = async () => {
      if (language === "English" || language === "en") {
        setUiText({
          title: "School Functions", func: "Function", date: "Date",
          coord: "Coordinator", part: "Participants", status: "Status"
        });
        return;
      }

      const [t1, t2, t3, t4, t5, t6] = await Promise.all([
        translateText("School Functions"), translateText("Function"), translateText("Date"),
        translateText("Coordinator"), translateText("Participants"), translateText("Status")
      ]);

      setUiText({ title: t1, func: t2, date: t3, coord: t4, part: t5, status: t6 });
    };
    fetchUI();
  }, [language, translateText]);

  return (
    <div className="page-card">
      <div className="page-header">
        <h2>{uiText.title}</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>{uiText.func}</th>
            <th>{uiText.date}</th>
            <th>{uiText.coord}</th>
            <th>{uiText.part}</th>
            <th>{uiText.status}</th>
          </tr>
        </thead>
        <tbody>
          {functionsData && functionsData.map((item) => (
            <tr key={item.function_id}>
              <td>{item.function_name || "-"}</td>
              <td>{item.function_date || "-"}</td>
              <td>{item.coordinator_name || "-"}</td>
              <td>{item.participants_count || "-"}</td>
              <td>{item.status || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
