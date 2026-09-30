'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Search, X, Bell, Mic, Volume2, Globe } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  noticeDate: string;
  createdAt: string;
  status: string;
}

export default function OthersPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAudience: '',
    noticeDate: ''
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notices');
      const data = await response.json();
      if (data.success) {
        setNotices(data.notices);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.title) {
      alert('Please fill Title');
      return;
    }
    
    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'active' })
      });
      const data = await response.json();
      if (data.success) {
        await fetchNotices();
        setIsModalOpen(false);
        setFormData({ title: '', description: '', targetAudience: '', noticeDate: '' });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding notice:', error);
    }
  };

  const filteredNotices = notices.filter(n => 
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white/60">Loading notices...</div>
      </div>
    );
  }

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Bell className="w-10 h-10 text-blue-400" />
          Notice Board
        </h1>
        <p className="text-white/60">Manage announcements and important updates</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 mb-8"
      >
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
        >
          <Plus size={20} /> Add Notice
        </button>
      </motion.div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
        <input
          type="text"
          placeholder="Search notices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotices.map((notice) => (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <h3 className="text-xl font-semibold text-white mb-2">{notice.title}</h3>
            <p className="text-white/70 mb-3">{notice.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-white/40">Target: {notice.targetAudience || 'All'}</span>
              <span className="text-white/40">Date: {notice.noticeDate ? new Date(notice.noticeDate).toLocaleDateString() : '-'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNotices.length === 0 && (
        <div className="text-center py-12 text-white/40">
          No notices found
        </div>
      )}
      {/* --- START OF AI AUDIO HUB --- */}
      <div className="mt-16 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Globe className="w-8 h-8 text-purple-400" />
          AI Audio & Translation Hub
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Text-to-Voice Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg"><Volume2 className="text-blue-400 w-6 h-6"/></div>
              <h3 className="text-xl font-semibold text-white">Text to Voice</h3>
            </div>
            <textarea 
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 mb-4 resize-none" 
              rows={3} 
              placeholder="Enter text to convert to speech..."
            ></textarea>
            <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Generate Audio
            </button>
          </div>

          {/* 2. Voice-to-Text Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-lg"><Mic className="text-emerald-400 w-6 h-6"/></div>
              <h3 className="text-xl font-semibold text-white">Voice to Text</h3>
            </div>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-5 text-center mb-4 text-white/40 hover:border-emerald-500/50 hover:bg-white/5 transition-all cursor-pointer">
              Click to Upload Audio File
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Transcribe Audio
            </button>
          </div>

          {/* 3. Audio Translator Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg"><Globe className="text-purple-400 w-6 h-6"/></div>
              <h3 className="text-xl font-semibold text-white">Audio Translator</h3>
            </div>
            <select className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 mb-4">
              <option value="English" className="text-black">Translate to English</option>
              <option value="Hindi" className="text-black">Translate to Hindi</option>
              <option value="Marathi" className="text-black">Translate to Marathi</option>
              <option value="Telugu" className="text-black">Translate to Telugu</option>
            </select>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-2.5 text-center mb-4 text-white/40 hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer">
              Upload Audio
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Translate Audio
            </button>
          </div>

        </div>
      </div>
      {/* --- END OF AI AUDIO HUB --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Add Notice</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                />
                <input
                  type="text"
                  placeholder="Target Audience (Students, Teachers, All)"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                />
                <input
                  type="date"
                  placeholder="Notice Date"
                  value={formData.noticeDate}
                  onChange={(e) => setFormData({...formData, noticeDate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  Add Notice
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
