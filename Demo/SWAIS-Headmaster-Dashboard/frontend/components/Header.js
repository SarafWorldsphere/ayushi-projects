"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const { language, setLanguage } = useLanguage();

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 30px', 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #e5e7eb'
    }}>
      
      {/* PROTECTED LOGO TEXT: Hardcoded so it NEVER changes language */}
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          Demo School
        </h1>
      </div>

      {/* LANGUAGE SELECTOR BAR: Upper right corner with requested languages */}
      <div>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          style={{ 
            padding: '8px 16px', 
            borderRadius: '6px', 
            border: '1px solid #ccc',
            cursor: 'pointer',
            fontSize: '14px',
            backgroundColor: '#f9fafb'
          }}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Tamil">Tamil</option>
          <option value="Telugu">Telugu</option>
          <option value="Malayalam">Malayalam</option>
          <option value="Kannada">Kannada</option>
          <option value="Gujarati">Gujarati</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Marathi">Marathi</option>
        </select>
      </div>
      
    </header>
  );
}
