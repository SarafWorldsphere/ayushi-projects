'use client';
import { useState } from 'react';

export default function Module5Dashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  // AI Analysis (Module 5) State
  const [studentId, setStudentId] = useState('1');
  const [student, setStudent] = useState<any>(null);
  const [interests, setInterests] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const API_BASE = 'http://16.112.236.67:16005/api/module5';

  const handleFetchStudent = async () => {
    setLoading(true);
    setAiInsight('');
    try {
      const res = await fetch(`${API_BASE}/student-profile/${studentId}`);
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        setStudent(null);
      } else {
        setStudent(data);
      }
    } catch (err) {
      alert('Error connecting to backend API. Ensure the AWS server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!student) return alert('Please load a student profile first.');
    if (!interests) return alert('Please enter student subject interests.');

    setAiLoading(true);
    try {
      const res = await fetch(`${API_BASE}/generate-insight/${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests }),
      });
      const data = await res.json();
      setAiInsight(data.recommendation);
    } catch (err) {
      alert('Failed to generate AI recommendations.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL || "/";
  };

  const menuTabs = ['Dashboard', 'Students', 'Academics', 'AI Analysis', 'Progress', 'Reports'];

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-[28px] font-bold text-white mb-8">Junior College Overview</h2>
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="bg-[#1E293B] p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-700/50 border-l-[6px] border-l-[#EA580C] flex-1 min-w-[200px] hover:translate-y-[-2px] transition-transform">
          <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Total Enrollment</p>
          <p className="text-[32px] font-bold text-white">1,248</p>
        </div>
        <div className="bg-[#1E293B] p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-700/50 border-l-[6px] border-l-[#3B82F6] flex-1 min-w-[200px] hover:translate-y-[-2px] transition-transform">
          <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Avg Attendance</p>
          <p className="text-[32px] font-bold text-white">92.4%</p>
        </div>
        <div className="bg-[#1E293B] p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-700/50 border-l-[6px] border-l-[#10B981] flex-1 min-w-[200px] hover:translate-y-[-2px] transition-transform">
          <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Science Stream</p>
          <p className="text-[32px] font-bold text-white">485</p>
        </div>
        <div className="bg-[#1E293B] p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-700/50 border-l-[6px] border-l-[#F59E0B] flex-1 min-w-[200px] hover:translate-y-[-2px] transition-transform">
          <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Commerce Stream</p>
          <p className="text-[32px] font-bold text-white">520</p>
        </div>
      </div>
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-8 shadow-[0_0_20px_rgba(234,88,12,0.05)]">
        <h3 className="text-xl font-bold text-slate-200 mb-6">Recent Administrative Alerts</h3>
        <div className="space-y-4">
          <div className="p-4 bg-[#1E293B] border border-slate-700 rounded-lg flex justify-between items-center hover:bg-[#233147] transition-colors">
            <div>
              <p className="font-semibold text-white">Term 1 Practical Examinations</p>
              <p className="text-sm text-slate-400">Lab schedules and batch allocations pending approval.</p>
            </div>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full font-bold uppercase border border-orange-500/30">Pending</span>
          </div>
          <div className="p-4 bg-[#1E293B] border border-slate-700 rounded-lg flex justify-between items-center hover:bg-[#233147] transition-colors">
            <div>
              <p className="font-semibold text-white">Board Exam Registration</p>
              <p className="text-sm text-slate-400">All Grade 12 candidate details submitted successfully.</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-bold uppercase border border-green-500/30">Complete</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[28px] font-bold text-white">Student Directory</h2>
        <button className="bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#d94a06] hover:to-[#9a3412] shadow-lg shadow-orange-500/20 text-white px-5 py-2.5 rounded-lg font-medium transition-all">+ Add Student</button>
      </div>
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1E293B] border-b border-slate-700">
            <tr>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Grade / Stream</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Subjects</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {[
              { id: '101', name: 'Arjun Verma', dept: '12th - Science (PCM)', tools: 'Physics, Mathematics', status: 'Excellent' },
              { id: '102', name: 'Neha Sharma', dept: '11th - Commerce', tools: 'Accounts, Economics', status: 'Good' },
              { id: '103', name: 'Rohan Gupta', dept: '12th - Arts', tools: 'History, Sociology', status: 'At Risk' },
              { id: '104', name: 'Priya Patel', dept: '12th - Science (PCB)', tools: 'Biology, Chemistry', status: 'Excellent' },
            ].map(s => (
              <tr key={s.id} className="hover:bg-[#1E293B]/60 transition-colors group">
                <td className="p-5 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{s.id}</td>
                <td className="p-5 text-sm text-slate-300 group-hover:text-white transition-colors">{s.name}</td>
                <td className="p-5 text-sm text-slate-400">{s.dept}</td>
                <td className="p-5 text-sm font-mono text-slate-400">{s.tools}</td>
                <td className="p-5">
                  <span className={`px-2.5 py-1 text-xs rounded-full font-bold uppercase border ${s.status === 'Excellent' ? 'bg-green-500/10 text-green-400 border-green-500/20' : s.status === 'Good' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAcademics = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-[28px] font-bold text-white mb-8">Academic Programs & Subjects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Advanced Physics (Grade 12)', code: 'PHY-101', prof: 'Dr. Mehta', enrolled: 142, avgScore: '88%' },
          { title: 'Financial Accounting', code: 'ACC-201', prof: 'Prof. Desai', enrolled: 120, avgScore: '92%' },
          { title: 'Macroeconomics', code: 'ECO-102', prof: 'Dr. Singh', enrolled: 95, avgScore: '85%' },
        ].map(course => (
          <div key={course.code} className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-6 shadow-lg hover:shadow-[0_0_20px_rgba(234,88,12,0.15)] hover:border-[#EA580C]/50 transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white leading-tight pr-4">{course.title}</h3>
              <span className="px-2 py-1 bg-[#0F172A] border border-slate-700 text-slate-300 text-xs rounded-md font-mono shrink-0">{course.code}</span>
            </div>
            <p className="text-sm text-slate-400 mb-6">Instructor: {course.prof}</p>
            <div className="flex justify-between border-t border-slate-700/80 pt-4">
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Enrolled</p>
                <p className="font-semibold text-slate-200">{course.enrolled}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Avg Score</p>
                <p className="font-bold text-[#EA580C]">{course.avgScore}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAIAnalysis = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-[28px] font-bold text-white mb-8">Programme & Career Guidance (Module 5)</h2>

      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.4)] max-w-[890px]">
        <h3 className="text-[22px] font-bold text-[#EA580C] mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          AI Assistant / Insights
        </h3>
        <ul className="list-disc list-inside text-slate-300 space-y-2 mb-8 text-[15px] marker:text-[#EA580C]">
          <li>AI summarizes student performance and attendance.</li>
          <li>AI detects risk patterns and suggests academic interventions.</li>
          <li>AI provides personalized undergraduate career and stream guidance.</li>
        </ul>

        <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-7 shadow-inner">
          <h4 className="text-white font-bold mb-5 text-lg">Generate Interactive Guidance</h4>

          <div className="flex flex-col md:flex-row gap-6 mb-4">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">1. Load Student (ID)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-600 text-white rounded-lg px-4 py-2.5 outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]/50 transition-all"
                />
                <button
                  onClick={handleFetchStudent}
                  disabled={loading}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors border border-slate-600"
                >
                  {loading ? '...' : 'Load'}
                </button>
              </div>
            </div>

            <div className="flex-[2]">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">2. Subject Interests</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Computer Science, Economics, Biology"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-600 text-white rounded-lg px-4 py-2.5 outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]/50 transition-all"
                />
                <button
                  onClick={handleGenerateAI}
                  disabled={aiLoading}
                  className="bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#d94a06] hover:to-[#9a3412] disabled:opacity-70 text-white px-6 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all shadow-lg shadow-orange-500/20"
                >
                  {aiLoading ? 'Analyzing...' : 'Generate AI Path'}
                </button>
              </div>
            </div>
          </div>

          {student && (
            <div className="text-sm text-slate-200 mb-4 bg-[#0F172A] px-4 py-3 inline-block border border-[#10B981]/30 rounded-lg shadow-sm">
              <span className="text-[#10B981] font-semibold mr-2 flex inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Loaded Profile
              </span>
              {student.name} <span className="text-slate-500 ml-2 font-mono text-xs">(Group: {student.group})</span>
            </div>
          )}

          {aiInsight && (
            <div className="p-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#EA580C]/40 rounded-xl text-slate-200 text-sm leading-relaxed shadow-[0_4px_20px_rgba(234,88,12,0.1)] mt-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#EA580C]"></div>
              <strong className="text-[#EA580C] block mb-3 text-base flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                AI Recommendation
              </strong>
              <p className="text-[15px]">{aiInsight}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-[28px] font-bold text-white mb-8">Academic Progress Tracking</h2>
      <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-8 max-w-3xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-200 mb-8">Term 1 Completion Milestones</h3>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between text-sm mb-3">
              <span className="font-semibold text-white">Syllabus Covered</span>
              <span className="text-[#EA580C] font-bold bg-[#EA580C]/10 px-2 py-0.5 rounded border border-[#EA580C]/20">75%</span>
            </div>
            <div className="w-full bg-[#0F172A] rounded-full h-3 border border-slate-700/50">
              <div className="bg-gradient-to-r from-[#EA580C] to-[#F59E0B] h-3 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.5)]" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-3">
              <span className="font-semibold text-white">Practical Submissions</span>
              <span className="text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">90%</span>
            </div>
            <div className="w-full bg-[#0F172A] rounded-full h-3 border border-slate-700/50">
              <div className="bg-gradient-to-r from-emerald-500 to-green-400 h-3 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-3">
              <span className="font-semibold text-white">Mock Boards Scheduled</span>
              <span className="text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">30%</span>
            </div>
            <div className="w-full bg-[#0F172A] rounded-full h-3 border border-slate-700/50">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-[28px] font-bold text-white mb-8">System Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {[
          { title: 'Stream Selection Trends', date: 'Aug 15, 2026', type: 'PDF' },
          { title: 'Board Exam Predictions', date: 'Aug 10, 2026', type: 'CSV' },
          { title: 'Monthly Attendance Deficits', date: 'Aug 1, 2026', type: 'XLSX' },
          { title: 'Faculty Subject Distribution', date: 'Jul 28, 2026', type: 'PDF' },
        ].map(report => (
          <div key={report.title} className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-6 flex justify-between items-center hover:bg-[#233147] hover:border-slate-500 transition-all cursor-pointer shadow-md hover:shadow-lg group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0F172A] border border-slate-700 flex items-center justify-center group-hover:border-[#EA580C]/50 transition-colors">
                <svg className="w-5 h-5 text-slate-400 group-hover:text-[#EA580C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-[#EA580C] transition-colors">{report.title}</h3>
                <p className="text-xs text-slate-400">Generated: {report.date}</p>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-[#0F172A] border border-slate-700 text-slate-300 text-[11px] rounded-md font-bold tracking-wider">
              {report.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0B1120] font-sans text-slate-200">

      {/* SIDEBAR */}
      <aside className="w-[260px] bg-[#0F172A] min-h-screen flex flex-col pt-8 border-r border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-10">
        <div className="px-8 mb-10 flex flex-col items-start">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-[#EA580C] text-3xl font-bold tracking-wide drop-shadow-md">JCLG</h1>
            <img src="/demlogo.jpeg" alt="JCLG Logo" className="h-16 w-16 rounded-full object-cover border-2 border-slate-600 shadow-lg" />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-semibold border-b border-slate-700/50 pb-4 w-full">Junior College Administration</p>
        </div>
        <nav className="flex flex-col gap-2 px-4 flex-1">
          {menuTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-5 py-3.5 rounded-lg font-medium transition-all flex items-center justify-between group ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white shadow-lg shadow-orange-500/20 border border-orange-500/50'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-white border border-transparent'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              )}
            </button>
          ))}

          <div className="mt-auto pb-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-start gap-3 px-5 py-3.5 rounded-lg font-medium transition-all text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
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
