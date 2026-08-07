"use client";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function NotificationsSection({ notifications = [], loaded = false }) {
  const { language, translateText } = useLanguage();
  
  const [uiText, setUiText] = useState({
    title: "Notifications",
    thTitle: "Title",
    notice: "Notice",
    date: "Date",
    cls: "Class",
    loading: "Loading notifications...",
    notFound: "No notifications found"
  });

  useEffect(() => {
    const fetchUI = async () => {
      if (language === "English" || language === "en") {
        setUiText({
          title: "Notifications", thTitle: "Title", notice: "Notice",
          date: "Date", cls: "Class", loading: "Loading notifications...", notFound: "No notifications found"
        });
        return;
      }

      const [t1, t2, t3, t4, t5, t6, t7] = await Promise.all([
        translateText("Notifications"), translateText("Title"), translateText("Notice"),
        translateText("Date"), translateText("Class"), translateText("Loading notifications..."), translateText("No notifications found")
      ]);

      setUiText({ title: t1, thTitle: t2, notice: t3, date: t4, cls: t5, loading: t6, notFound: t7 });
    };
    fetchUI();
  }, [language, translateText]);

  return (
    <div className="page-card">
      <h2>{uiText.title}</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{uiText.thTitle}</th>
              <th>{uiText.notice}</th>
              <th>{uiText.date}</th>
              <th>{uiText.cls}</th>
            </tr>
          </thead>

          <tbody>
            {!loaded ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>{uiText.loading}</td>
              </tr>
            ) : notifications.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>{uiText.notFound}</td>
              </tr>
            ) : (
              notifications.map((item) => (
                <tr key={item.notice_id}>
                  {/* Removed API Translation Calls here to prevent server DDOS / Rate Limits */}
                  <td>{item.notice_title || "-"}</td>
                  <td>{item.notice_text || "-"}</td>
                  <td>{item.notice_date || "-"}</td>
                  <td>{item.applicable_class || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
