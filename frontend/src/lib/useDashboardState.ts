import { useState, useEffect } from 'react';

/**
 * Persistent dashboard state backed by localStorage.
 *
 * studentId and parentId default to 0 (meaning "not yet loaded / not set").
 * Pages should guard API calls with `if (!studentId) return;` to avoid
 * firing requests with an invalid ID before localStorage is read or before
 * ChildSelector has auto-selected the first real child.
 *
 * Demo bootstrap: if no parent_id is stored in localStorage the hook defaults
 * to parent_id=1 (the seeded demo parent). ChildSelector then auto-fetches
 * that parent's children and selects the first one automatically.
 */
export function useDashboardState() {
  const [mounted,   setMounted]   = useState(false);
  const [studentId, setStudentId] = useState<number>(0); // 0 = not set yet
  const [parentId,  setParentId]  = useState<number>(0); // 0 = not set yet
  const [language,  setLanguage]  = useState<string>('en');

  // Read persisted values from localStorage once on mount (client-side only).
  // Defaults parentId to 10 (seeded demo) when nothing is stored so the app
  // loads with real data without any manual localStorage intervention.
  useEffect(() => {
    const savedStudent = localStorage.getItem('dem_student_id');
    const savedParent  = localStorage.getItem('dem_parent_id');
    const savedLang    = localStorage.getItem('dem_language');

    const sid = savedStudent ? Number(savedStudent) : 1;
    const pid = savedParent  ? Number(savedParent)  : 1; 

    if (sid > 0) setStudentId(sid);
    if (pid > 0) setParentId(pid);
    if (savedLang) setLanguage(savedLang);
    setMounted(true);

    console.log('[DEMO] localStorage → student_id:', sid, ' parent_id:', pid);
  }, []);

  const updateStudentId = (id: number) => {
    setStudentId(id);
    localStorage.setItem('dem_student_id', id.toString());
    console.log('[DEMO] studentId updated →', id);
  };

  const updateParentId = (id: number) => {
    setParentId(id);
    localStorage.setItem('dem_parent_id', id.toString());
    console.log('[DEMO] parentId updated →', id);
  };

  const updateLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('dem_language', lang);
  };

  return {
    mounted,
    studentId,
    setStudentId: updateStudentId,
    parentId,
    setParentId: updateParentId,
    language,
    setLanguage: updateLanguage,
  };
}
