"use client";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ToursSection({ toursData }) {
  const { language, translateText } = useLanguage();
  
  const [uiText, setUiText] = useState({
    title: "School Tours", tour: "Tour", loc: "Location", date: "Date",
    students: "Students", incharge: "Incharge", status: "Status"
  });

  useEffect(() => {
    const fetchUI = async () => {
      if (language === "English" || language === "en") {
        setUiText({
          title: "School Tours", tour: "Tour", loc: "Location", date: "Date",
          students: "Students", incharge: "Incharge", status: "Status"
        });
        return;
      }

      const [t1, t2, t3, t4, t5, t6, t7] = await Promise.all([
        translateText("School Tours"), translateText("Tour"), translateText("Location"),
        translateText("Date"), translateText("Students"), translateText("Incharge"), translateText("Status")
      ]);

      setUiText({ title: t1, tour: t2, loc: t3, date: t4, students: t5, incharge: t6, status: t7 });
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
            <th>{uiText.tour}</th>
            <th>{uiText.loc}</th>
            <th>{uiText.date}</th>
            <th>{uiText.students}</th>
            <th>{uiText.incharge}</th>
            <th>{uiText.status}</th>
          </tr>
        </thead>
        <tbody>
          {toursData && toursData.map((tour) => (
            <tr key={tour.tour_id}>
              <td>{tour.tour_name || "-"}</td>
              <td>{tour.location_name || "-"}</td>
              <td>{tour.tour_date || "-"}</td>
              <td>{tour.students_count || "-"}</td>
              <td>{tour.incharge_name || "-"}</td>
              <td>{tour.status || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
