import React from 'react';
import TranslatedText from './TranslatedText';

export default function NotificationsSection({
  notifications = [],
  loaded = false,
}) {
  return (
    <div className="page-card">
      <h2><TranslatedText text="Notifications" /></h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th><TranslatedText text="Title" /></th>
              <th><TranslatedText text="Notice" /></th>
              <th><TranslatedText text="Date" /></th>
              <th><TranslatedText text="Class" /></th>
            </tr>
          </thead>

          <tbody>
            {!loaded ? (
              <tr>
                <td colSpan="4"><TranslatedText text="Loading notifications..." /></td>
              </tr>
            ) : notifications.length === 0 ? (
              <tr>
                <td colSpan="4"><TranslatedText text="No notifications found" /></td>
              </tr>
            ) : (
              notifications.map((item) => (
                <tr key={item.notice_id}>
                  {/* Translated dynamic data */}
                  <td>{item.notice_title ? <TranslatedText text={item.notice_title} /> : "-"}</td>
                  <td>{item.notice_text ? <TranslatedText text={item.notice_text} /> : "-"}</td>
                  
                  {/* DO NOT translate dates or IDs */}
                  <td>{item.notice_date}</td>
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
