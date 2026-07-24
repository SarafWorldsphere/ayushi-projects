'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Pencil, Trash2, Search, X,
  Users as UsersIcon, UserCheck, UserX,
  BookOpen
} from 'lucide-react';

interface Student {
  id: string;
  admissionNo: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  fatherName: string;
  fatherPhone: string;
  fatherEmail: string;
  fatherPhoto?: string; 
  motherName: string;
  motherPhone: string;
  motherEmail: string;
  motherPhoto?: string;
  contact: string;
  email: string;
  guardianName: string;
  guardianPhone: string;
  status: 'active' | 'inactive';
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'modify'>('add');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    admissionNo: '',
    name: '',
    class: '',
    section: '',
    rollNo: '',
    fatherName: '',
    fatherPhone: '',
    fatherEmail: '',
    fatherPhoto: null as File | null,
    motherName: '',
    motherPhone: '',
    motherEmail: '',
    motherPhoto: null as File | null,
    contact: '',
    email: '',
    guardianName: '',
    guardianPhone: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    return email.toLowerCase().endsWith('@gmail.com');
  };

const uploadToS3 = async (file: File) => {
    try {
      // 1. Ask our Next.js backend for a secure S3 Pre-Signed URL
      const urlRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      
      if (!urlRes.ok) throw new Error('Failed to get upload URL');
      const { uploadUrl, fileKey } = await urlRes.json();

      // 2. Upload the file DIRECTLY to AWS S3 using the Pre-Signed URL
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error('S3 Direct Upload failed');

      // 3. Return the key to save in your DB
      return fileKey;
    } catch (error) {
      console.error('Error in uploadToS3:', error);
      throw error;
    }
  };

  const handleAdd = async () => {
    if (!formData.name) {
      alert('Please fill Student Name');
      return;
    }
    if (formData.email && !validateEmail(formData.email)) {
      alert('Student Email must end with @gmail.com');
      return;
    }
    if (formData.fatherEmail && !validateEmail(formData.fatherEmail)) {
       alert('Father Email must end with @gmail.com');
       return;
    }
    if (formData.motherEmail && !validateEmail(formData.motherEmail)) {
       alert('Mother Email must end with @gmail.com');
       return;
    }

    try {
      let fatherPhotoKey = '';
      let motherPhotoKey = '';
      
      if (formData.fatherPhoto) {
        fatherPhotoKey = await uploadToS3(formData.fatherPhoto);
      }
      if (formData.motherPhoto) {
        motherPhotoKey = await uploadToS3(formData.motherPhoto);
      }

      // Use FormData so Port 7003 can read it properly
      const submitData = new FormData();
      submitData.append('admissionNo', formData.admissionNo);
      submitData.append('name', formData.name);
      submitData.append('class_id', formData.class); // using class_id for DB!
      submitData.append('section', formData.section);
      submitData.append('rollNo', formData.rollNo);
      submitData.append('contact', formData.contact);
      submitData.append('email', formData.email);
      submitData.append('guardianName', formData.guardianName);
      submitData.append('guardianPhone', formData.guardianPhone);
      submitData.append('status', 'active');
      submitData.append('fatherName', formData.fatherName);
      submitData.append('fatherPhone', formData.fatherPhone);
      submitData.append('fatherEmail', formData.fatherEmail);
      submitData.append('motherName', formData.motherName);
      submitData.append('motherPhone', formData.motherPhone);
      submitData.append('motherEmail', formData.motherEmail);

      // Only append photos if they were successfully uploaded
      if (fatherPhotoKey) submitData.append('fatherPhoto', fatherPhotoKey);
      if (motherPhotoKey) submitData.append('motherPhoto', motherPhotoKey);

      const response = await fetch('/api/students', {
        method: 'POST',
        // DO NOT set 'Content-Type' header here. 
        // The browser sets it automatically to 'multipart/form-data'
        body: submitData
      });

      const data = await response.json();
      if (data.success) {
        await fetchStudents();
        setIsModalOpen(false);
        resetForm();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student');
    }
  };
 
  const handleModify = async () => {
    if (selectedStudent) {
      try {
        let fatherPhotoKey = '';
        let motherPhotoKey = '';
        
        // Only upload if a new file was actually selected
        if (formData.fatherPhoto) {
          fatherPhotoKey = await uploadToS3(formData.fatherPhoto);
        }
        if (formData.motherPhoto) {
          motherPhotoKey = await uploadToS3(formData.motherPhoto);
        }

        // Use FormData so Port 7003 can read it properly
        const submitData = new FormData();
        submitData.append('id', selectedStudent.id);
        submitData.append('admissionNo', formData.admissionNo);
        submitData.append('name', formData.name);
        submitData.append('class_id', formData.class); // using class_id for DB!
        submitData.append('section', formData.section);
        submitData.append('rollNo', formData.rollNo);
        submitData.append('contact', formData.contact);
        submitData.append('email', formData.email);
        submitData.append('guardianName', formData.guardianName);
        submitData.append('guardianPhone', formData.guardianPhone);
        submitData.append('fatherName', formData.fatherName);
        submitData.append('fatherPhone', formData.fatherPhone);
        submitData.append('fatherEmail', formData.fatherEmail);
        submitData.append('motherName', formData.motherName);
        submitData.append('motherPhone', formData.motherPhone);
        submitData.append('motherEmail', formData.motherEmail);

        // Only append photos if new ones were successfully uploaded
        if (fatherPhotoKey) submitData.append('fatherPhoto', fatherPhotoKey);
        if (motherPhotoKey) submitData.append('motherPhoto', motherPhotoKey);

        const response = await fetch(`/api/students/${selectedStudent.id}`, {
          method: 'PUT',
          // DO NOT set 'Content-Type' header here.
          body: submitData,
        });

        const data = await response.json();
        if (data.success) {
          await fetchStudents();
          setIsModalOpen(false);
          resetForm();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (error) {
        console.error('Error modifying student:', error);
        alert('Error modifying student');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await fetch(`/api/students/${id}`, { method: 'DELETE' });
        await fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      const newStatus = student.status === 'active' ? 'inactive' : 'active';
      try {
        await fetch(`/api/students/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        await fetchStudents();
      } catch (error) {
        console.error('Error toggling status:', error);
      }
    }
  };

  function resetForm() {
    setFormData({
      admissionNo: '', name: '', class: '', section: '', rollNo: '',
      fatherName: '', fatherPhone: '', fatherEmail: '', fatherPhoto: null,
      motherName: '', motherPhone: '', motherEmail: '', motherPhoto: null,
      contact: '', email: '', guardianName: '', guardianPhone: ''
  });
    setSelectedStudent(null);
  };

  const openModal = (type: 'add' | 'modify', student?: Student) => {
    setModalType(type);
    if (type === 'modify' && student) {
      setSelectedStudent(student);
      setFormData({
        admissionNo: student.admissionNo || '',
        name: student.name,
        class: student.class || '',
        section: student.section || '',
        rollNo: student.rollNo || '',
        fatherName: student.fatherName || '',
        fatherPhone: student.fatherPhone || '',
        fatherEmail: student.fatherEmail || '',
        fatherPhoto: null, 
        motherName: student.motherName || '',
        motherPhone: student.motherPhone || '',
        motherEmail: student.motherEmail || '',
        motherPhoto: null,
        contact: student.contact || '',
        email: student.email || '',
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || ''
      });
    }
    setIsModalOpen(true);
  };

  const filteredStudents = students.filter(s => 
    (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.class?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.section?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.fatherName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.motherName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Students', value: students.length, icon: UsersIcon, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Students', value: students.filter(s => s.status === 'active').length, icon: UserCheck, color: 'from-green-500 to-emerald-500' },
    { label: 'Inactive Students', value: students.filter(s => s.status === 'inactive').length, icon: UserX, color: 'from-orange-500 to-red-500' },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-white/60">Loading students...</div></div>;
  }

  return (
    <div>
      <motion.div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-blue-400" />
          Student Management
        </h1>
        <p className="text-white/60">Manage all students, track their progress, and update records</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats?.map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-r ${stat.color} rounded-2xl p-6 shadow-xl`}>
            <div className="flex items-center justify-between">
              <div><p className="text-white/80 text-sm">{stat.label}</p><p className="text-white text-4xl font-bold mt-2">{stat.value}</p></div>
              <stat.icon className="w-12 h-12 text-white/30" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <button onClick={() => openModal('add')} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2">
          <Plus size={20} /> Add Student
        </button>
        <button onClick={() => {
          if (filteredStudents.length === 1) openModal('modify', filteredStudents[0]);
          else if (filteredStudents.length > 0) {
            const id = prompt('Enter Student ID to modify:');
            const student = students.find(s => s.id === id);
            if (student) openModal('modify', student);
            else alert('Student not found!');
          } else alert('No students available');
        }} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2">
          <Pencil size={20} /> Modify Student
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
        <input type="text" placeholder="Search by name, ID, class, section, or parent..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white" />
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[1600px]">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-4 text-left text-white">ID</th>
              <th className="px-4 py-4 text-left text-white">Admission No</th>
              <th className="px-4 py-4 text-left text-white">Name</th>
              <th className="px-4 py-4 text-left text-white">Class</th>
              <th className="px-4 py-4 text-left text-white">Section</th>
              <th className="px-4 py-4 text-left text-white">Roll No</th>
              <th className="px-4 py-4 text-left text-white">Father Name</th>
              <th className="px-4 py-4 text-left text-white">Father Phone</th>
              <th className="px-4 py-4 text-left text-white">Father Photo</th>
              <th className="px-4 py-4 text-left text-white">Mother Name</th>
              <th className="px-4 py-4 text-left text-white">Mother Phone</th>
              <th className="px-4 py-4 text-left text-white">Mother Photo</th>
              <th className="px-4 py-4 text-left text-white">Student Contact</th>
              <th className="px-4 py-4 text-left text-white">Student Email</th>
              <th className="px-4 py-4 text-left text-white">Guardian Name</th>
              <th className="px-4 py-4 text-left text-white">Guardian Phone</th>
              <th className="px-4 py-4 text-left text-white">Status</th>
              <th className="px-4 py-4 text-left text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents?.map((student) => (
              <tr key={student.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-4 text-white/80">{student.id}</td>
                <td className="px-4 py-4 text-white/80">{student.admissionNo || '—'}</td>
                <td className="px-4 py-4 text-white font-medium">{student.name}</td>
                <td className="px-4 py-4 text-white/80">{student.class || '—'}</td>
                <td className="px-4 py-4 text-white/80">{student.section || '—'}</td>
                <td className="px-4 py-4 text-white/80">{student.rollNo || '—'}</td>
                <td className="px-4 py-4 text-white/80">{student.fatherName || '-'}</td>
                <td className="px-4 py-4 text-white/80">{student.fatherPhone || '-'}</td>
                <td className="px-4 py-4 text-white/80">
                  {student.fatherPhoto ? (
                    <img src={student.fatherPhoto.startsWith('http') ? student.fatherPhoto : `/api/photo?key=${student.fatherPhoto}`} alt="Father" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-4 text-white/80">{student.motherName || '-'}</td>
                <td className="px-4 py-4 text-white/80">{student.motherPhone || '-'}</td>
                <td className="px-4 py-4 text-white/80">
                  {student.motherPhoto ? (
                    <img src={student.motherPhoto.startsWith('http') ? student.motherPhoto : `/api/photo?key=${student.motherPhoto}`} alt="Mother" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                  ) : (
                    '—'
                  )} 
                </td>
                <td className="px-4 py-4 text-white/80">{student.contact || '—'}</td>
                <td className="px-4 py-4 text-white/80">{student.email || '—'}</td>
                <td className="px-4 py-4 text-white/80">{student.guardianName || '—'}</td>
                <td className="px-4 py-4 text-white/80">{student.guardianPhone || '—'}</td>
                <td className="px-4 py-4"><button onClick={() => handleToggleStatus(student.id)} className={`px-3 py-1 rounded-full text-sm font-semibold ${student.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{student.status}</button></td>
                <td className="px-4 py-4"><div className="flex gap-2"><button onClick={() => openModal('modify', student)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"><Pencil size={16} /></button><button onClick={() => handleDelete(student.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 size={16} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{modalType === 'add' ? 'Add New Student' : 'Modify Student'}</h2>
                <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-white/40" /></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Admission Number" value={formData.admissionNo} onChange={(e) => setFormData({...formData, admissionNo: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <input type="text" placeholder="Student Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <select
                   value={formData.class}
                   onChange={(e) => setFormData({...formData, class: e.target.value})}
                   className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none"
                >
                   <option value="" style={{ background: '#1e293b', color: 'white' }}>Select a Class...</option>
                   <option value="8" style={{ background: '#1e293b', color: 'white' }}>8th Grade</option>
                   <option value="7" style={{ background: '#1e293b', color: 'white' }}>9th Grade</option>
                   <option value="5" style={{ background: '#1e293b', color: 'white' }}>10th Grade</option>
                </select>
                <input type="text" placeholder="Section" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <input type="text" placeholder="Roll Number" value={formData.rollNo} onChange={(e) => setFormData({...formData, rollNo: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <input type="text" placeholder="Father Name" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <input type="tel" placeholder="Father Phone" value={formData.fatherPhone} onChange={(e) => setFormData({...formData, fatherPhone: e.target.value})} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <input type="email" placeholder="Father Email" value={formData.fatherEmail} onChange={(e) => setFormData({...formData, fatherEmail: e.target.value})} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <div className="flex flex-col justify-center">
                  <label className="text-white/60 text-xs mb-1 px-1">Upload Father Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, fatherPhoto: e.target.files?.[0] || null})} className="text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-500 file:text-white" />
                </div>
                <input type="text" placeholder="Mother Name" value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <input type="tel" placeholder="Mother Phone" value={formData.motherPhone} onChange={(e) => setFormData({...formData, motherPhone: e.target.value})} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <input type="email" placeholder="Mother Email" value={formData.motherEmail} onChange={(e) => setFormData({...formData, motherEmail: e.target.value})} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <div className="flex flex-col justify-center">
                 <label className="text-white/60 text-xs mb-1 px-1">Upload Mother Photo</label>
                 <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, motherPhoto: e.target.files?.[0] || null})} className="text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-500 file:text-white" />
                </div>                
                <input type="tel" placeholder="Student Contact" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <input type="email" placeholder="Student Email (must end with @gmail.com)" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <input type="text" placeholder="Guardian Name" value={formData.guardianName} onChange={(e) => setFormData({...formData, guardianName: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                <input type="tel" placeholder="Guardian Phone" value={formData.guardianPhone} onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={modalType === 'add' ? handleAdd : handleModify} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold">
                  {modalType === 'add' ? 'Add Student' : 'Save Changes'}
                </button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>  
    </div>
  );
}

