'use client';
import { useState, useEffect } from 'react';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the data as soon as the page loads
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      if (data.success) {
        setClasses(data.classes);
      }
    } catch (error) {
      console.error("Failed to fetch classes", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Class Management</h1>
        <p className="text-gray-400">View and manage all academic classes and sections.</p>
      </div>
      
      {loading ? (
        <div className="text-white text-center py-10">Loading classes...</div>
      ) : (
        <div className="bg-[#1e1e2d] rounded-xl overflow-hidden shadow-lg border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-white">
              <thead className="bg-[#2b2b40] text-sm uppercase tracking-wider text-gray-300">
                <tr>
                  <th className="p-5 font-medium border-b border-gray-700">ID</th>
                  <th className="p-5 font-medium border-b border-gray-700">Class Name</th>
                  <th className="p-5 font-medium border-b border-gray-700">Section</th>
                  <th className="p-5 font-medium border-b border-gray-700">Academic Year</th>
                  <th className="p-5 font-medium border-b border-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {classes.map((cls) => (
                  <tr key={cls.id} className="border-b border-gray-800 hover:bg-[#252538] transition-colors">
                    <td className="p-5">{cls.id}</td>
                    {/* FIXED: Changed cls.className to cls.classname */}
                    <td className="p-5 font-semibold">{cls.classname}</td>
                    <td className="p-5">{cls.section || '—'}</td>
                    <td className="p-5">{cls.year}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        cls.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {cls.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {classes.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-500">No classes found in the database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}