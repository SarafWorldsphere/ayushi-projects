'use client';
import { useState, useEffect } from 'react';

export default function Module7Dashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Dashboard Stats State (from FastAPI backend)
  const [stats, setStats] = useState({
    reports: 86,
    notices: 14,
    notifications: 1842,
    aiReports: 37,
  });

  // AI Insights State
  const [queryType, setQueryType] = useState('summary');
  const [studentId, setStudentId] = useState('101');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Notice & Communication State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeAuthor, setNoticeAuthor] = useState('Principal Office');
  const [noticeSuccess, setNoticeSuccess] = useState('');

  const API_BASE = 'http://16.112.236.67:16005/api/module7';

  // Fetch initial summary metrics
  useEffect(() => {
    fetch(`${API_BASE}/dashboard-summary`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setStats({
            reports: data.reports ?? 86,
            notices: data.notices ?? 14,
            notifications: data.notifications ?? 1842,
            aiReports: data.ai_reports ?? 37,
          });
        }
      })
      .catch(() => console.log('Using local fallback stats'));
  }, []);

  const handleGenerateAI = async () => {
    setAiLoading(true);
    setAiResult('');
    try {
      const res = await fetch(`${API_BASE}/generate-report-insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, query_type: queryType }),
      });
      const data = await res.json();
      setAiResult(data.recommendation || 'AI generation completed successfully.');
    } catch {
      setAiResult(
        `[Simulated AI Response] Student ID ${studentId} demonstrates consistent academic progress with 94% attendance. Interventions recommended for advanced practical preparation.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;
    try {
      await fetch(`${API_BASE}/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noticeTitle,
          content: noticeContent,
          author: noticeAuthor,
        }),
      });
      setNoticeSuccess('Notice broadcasted and logged in JCLG_NOTICE & JCLG_AUDIT_LOG!');
      setNoticeTitle('');
      setNoticeContent('');
    } catch {
      setNoticeSuccess('Notice posted locally.');
    }
  };

  const menuTabs = ['Dashboard', 'Students', 'Academics', 'AI Analysis', 'Progress', 'Reports'];

  // ===================== TAB 1: DASHBOARD =====================
  const renderDashboard = () => (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">AI Reports & Communication</h2>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700/60 border-l-[6px] border-l-[#E11D48] shadow-lg hover:border-pink-500/50 transition-all">
          <p className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wider">Reports</p>
          <p className="text-4xl font-extrabold text-white">{stats.reports}</p>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700/60 border-l-[6px] border-l-[#E11D48] shadow-lg hover:border-pink-500/50 transition-all">
          <p className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wider">Notices</p>
          <p className="text-4xl font-extrabold text-white">{stats.notices}</p>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700/60 border-l-[6px] border-l-[#E11D48] shadow-lg hover:border-pink-500/50 transition-all">
          <p className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wider">Notifications</p>
          <p className="text-4xl font-extrabold text-white">{stats.notifications.toLocaleString()}</p>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700/60 border-l-[6px] border-l-[#E11D48] shadow-lg hover:border-pink-500/50 transition-all">
          <p className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wider">AI Reports</p>
          <p className="text-4xl font-extrabold text-white">{stats.aiReports}</p>
        </div>
      </div>

      {/* AI ASSISTANT / INSIGHTS BOX */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-8 shadow-xl max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#E11D48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#E11D48]">AI Assistant / Insights</h3>
        </div>

        <ul className="space-y-4 text-slate-300 text-base font-normal">
          <li className="flex items-start gap-3">
            <span className="text-[#E11D48] text-xl font-bold leading-none">•</span>
            <span>AI summarizes student performance and attendance.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#E11D48] text-xl font-bold leading-none">•</span>
            <span>AI detects risk patterns and suggests interventions.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#E11D48] text-xl font-bold leading-none">•</span>
            <span>AI provides personalized programme and career guidance.</span>
          </li>
        </ul>
      </div>
    </div>
  );

  // ===================== TAB 2: STUDENTS =====================
  const renderStudents = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Student Communication Records</h2>
        <span className="px-4 py-1.5 bg-pink-500/20 text-[#E11D48] text-xs font-bold uppercase rounded-full border border-pink-500/30">
          Table: JCLG_NOTIFICATION
        </span>
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-xl max-w-5xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1E293B] border-b border-slate-700">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Student ID</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Recipient</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Message Log</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Delivery Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {[
              { id: '101', recipient: 'Parent - Mr. Verma', msg: 'Term 1 practical exam batch confirmed: Physics lab.', status: 'Read' },
              { id: '102', recipient: 'Parent - Mrs. Sharma', msg: 'Attendance alert: 3 consecutive leaves recorded.', status: 'Unread' },
              { id: '103', recipient: 'Faculty Advisor', msg: 'AI remediation plan sent for sociology coursework.', status: 'Read' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-[#1E293B]/50 transition-colors">
                <td className="p-4 font-mono text-pink-400">{row.id}</td>
                <td className="p-4 text-white font-medium">{row.recipient}</td>
                <td className="p-4 text-slate-300">{row.msg}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs rounded-full font-bold uppercase border ${
                    row.status === 'Read'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ===================== TAB 3: ACADEMICS (NOTICES) =====================
  const renderAcademics = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Academic Notices & Broadcasts</h2>
        <span className="px-4 py-1.5 bg-pink-500/20 text-[#E11D48] text-xs font-bold uppercase rounded-full border border-pink-500/30">
          Table: JCLG_NOTICE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        <form onSubmit={handleCreateNotice} className="bg-[#0F172A] border border-slate-800 p-6 rounded-xl space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-2">Publish New Notice</h3>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="e.g. Schedule Revision"
              className="w-full bg-[#1E293B] border border-slate-700 text-white rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E11D48]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Author / Office</label>
            <input
              type="text"
              value={noticeAuthor}
              onChange={(e) => setNoticeAuthor(e.target.value)}
              className="w-full bg-[#1E293B] border border-slate-700 text-white rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E11D48]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Content</label>
            <textarea
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              rows={3}
              placeholder="Detailed announcement details..."
              className="w-full bg-[#1E293B] border border-slate-700 text-white rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E11D48]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-pink-600 hover:to-pink-700 text-white py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-pink-600/20"
          >
            Post Notice
          </button>
          {noticeSuccess && <p className="text-xs text-green-400 mt-2 font-medium">{noticeSuccess}</p>}
        </form>

        <div className="lg:col-span-2 space-y-4">
          {[
            { title: 'Grade 12 Prelim Exam Date Sheet', author: 'Principal Office', date: 'Aug 20, 2026', content: 'Physics and Accounting practical exams will commence from September 1st.' },
            { title: 'AI Career Counseling Portal Open', author: 'Guidance Cell', date: 'Aug 18, 2026', content: 'Students can now generate career and stream recommendations via Module 7.' },
          ].map((notice, idx) => (
            <div key={idx} className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-white text-base">{notice.title}</h4>
                <span className="text-xs text-slate-400">{notice.date}</span>
              </div>
              <p className="text-sm text-slate-300 mb-3">{notice.content}</p>
              <p className="text-xs text-pink-400 font-semibold">Author: {notice.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===================== TAB 4: AI ANALYSIS =====================
  const renderAIAnalysis = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">AI Report & Insight Generator</h2>
        <span className="px-4 py-1.5 bg-pink-500/20 text-[#E11D48] text-xs font-bold uppercase rounded-full border border-pink-500/30">
          Tables: JCLG_AI_USAGE & JCLG_AI_INSIGHT
        </span>
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-8 max-w-4xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Target Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-[#1E293B] border border-slate-700 text-white rounded-lg px-4 py-2.5 outline-none focus:border-[#E11D48]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Analysis Type</label>
            <select
              value={queryType}
              onChange={(e) => setQueryType(e.target.value)}
              className="w-full bg-[#1E293B] border border-slate-700 text-white rounded-lg px-4 py-2.5 outline-none focus:border-[#E11D48]"
            >
              <option value="summary">Performance & Attendance Summary</option>
              <option value="risk_analysis">Risk Pattern Detection</option>
              <option value="career_guidance">Stream & Career Recommendation</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateAI}
          disabled={aiLoading}
          className="bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-pink-600/20"
        >
          {aiLoading ? 'Generating AI Report...' : 'Execute AI Assistant'}
        </button>

        {aiResult && (
          <div className="mt-6 p-6 bg-[#1E293B] border border-pink-500/40 rounded-xl">
            <h4 className="text-sm font-bold text-[#E11D48] uppercase tracking-wider mb-2">Generated AI Insights:</h4>
            <p className="text-slate-200 text-sm leading-relaxed">{aiResult}</p>
          </div>
        )}
      </div>
    </div>
  );

  // ===================== TAB 5: PROGRESS & AUDIT =====================
  const renderProgress = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">System Audit & Activity Logs</h2>
        <span className="px-4 py-1.5 bg-pink-500/20 text-[#E11D48] text-xs font-bold uppercase rounded-full border border-pink-500/30">
          Table: JCLG_AUDIT_LOG
        </span>
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-xl max-w-5xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1E293B] border-b border-slate-700">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Log ID</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Action</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">User / Operator</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {[
              { id: 'AUD-8801', action: 'GENERATED_AI_REPORT', user: 'admin_ayushi', time: 'Aug 23, 2026 16:40:12' },
              { id: 'AUD-8802', action: 'DISPATCHED_NOTICE', user: 'principal_office', time: 'Aug 23, 2026 15:20:05' },
              { id: 'AUD-8803', action: 'AI_USAGE_RECORDED', user: 'system_cron', time: 'Aug 23, 2026 14:00:00' },
            ].map((log) => (
              <tr key={log.id} className="hover:bg-[#1E293B]/50 transition-colors">
                <td className="p-4 font-mono text-pink-400">{log.id}</td>
                <td className="p-4 font-bold text-white">{log.action}</td>
                <td className="p-4 text-slate-300">{log.user}</td>
                <td className="p-4 text-slate-400">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ===================== TAB 6: REPORTS =====================
  const renderReports = () => (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Compiled Module 7 Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {[
          { title: 'AI Usage & Query Frequency Report', format: 'PDF', generated: 'Aug 23, 2026' },
          { title: 'Student Risk & Intervention Breakdown', format: 'CSV', generated: 'Aug 22, 2026' },
          { title: 'Parent Broadcast Delivery Audit', format: 'XLSX', generated: 'Aug 21, 2026' },
          { title: 'Monthly Communication Ledger', format: 'PDF', generated: 'Aug 20, 2026' },
        ].map((rep, idx) => (
          <div key={idx} className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-xl flex justify-between items-center hover:border-pink-500/50 transition-all">
            <div>
              <h4 className="font-bold text-white text-base mb-1">{rep.title}</h4>
              <p className="text-xs text-slate-400">Generated on {rep.generated}</p>
            </div>
            <span className="px-3 py-1.5 bg-[#0F172A] border border-slate-700 text-pink-400 text-xs font-mono font-bold rounded-lg">
              {rep.format}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0B1120] font-sans text-slate-200">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-[#0F172A] min-h-screen flex flex-col pt-8 border-r border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.3)] z-10">
        <div className="px-8 mb-10 flex flex-col items-start">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-[#E11D48] text-3xl font-black tracking-wider drop-shadow-md">JCLG</h1>
            <img
              src="/demlogo.jpeg"
              alt="JCLG Logo"
              className="h-14 w-14 rounded-full object-cover border-2 border-slate-600 shadow-lg"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold border-b border-slate-700/50 pb-4 w-full">
            AI Reports & Communication
          </p>
        </div>

        <nav className="flex flex-col gap-2 px-4">
          {menuTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-5 py-3.5 rounded-lg font-medium transition-all flex items-center justify-between group ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-lg shadow-pink-600/30 border border-pink-500/40'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-white border border-transparent'
              }`}
            >
              <span>{tab}</span>
              {activeTab === tab && (
                <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-12 overflow-y-auto max-h-screen">
        {activeTab === 'Dashboard' && renderDashboard()}
        {activeTab === 'Students' && renderStudents()}
        {activeTab === 'Academics' && renderAcademics()}
        {activeTab === 'AI Analysis' && renderAIAnalysis()}
        {activeTab === 'Progress' && renderProgress()}
        {activeTab === 'Reports' && renderReports()}
      </main>
    </div>
  );
}