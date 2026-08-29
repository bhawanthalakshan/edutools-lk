import React, { useEffect, useState } from 'react';
import { 
  FaFilePdf, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle, 
  FaEyeSlash, 
  FaTimes, 
  FaUpload, 
  FaSearch, 
  FaFilter,
  FaShieldAlt
} from 'react-icons/fa';
import Seo from '../../components/Seo';
import api from '../../services/api';
import { createPastPaper, updatePastPaper, deletePastPaper, togglePastPaperStatus } from '../../services/pastPaperService';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const AdminPastPapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    examType: 'OL',
    level: 'O/L',
    stream: 'General',
    subject: 'Mathematics',
    year: '2025',
    medium: 'English',
    paperType: 'Past Paper',
    term: 'Final',
    description: '',
    source: 'Official Department of Examinations',
    permissionConfirmed: false,
    status: 'published',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/past-papers?all=true&limit=200');
      setPapers(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch past papers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const openCreateModal = () => {
    setEditingPaper(null);
    setSelectedFile(null);
    setFormError('');
    setFormSuccess('');
    setFormData({
      title: '',
      slug: '',
      examType: 'OL',
      level: 'O/L',
      stream: 'General',
      subject: 'Mathematics',
      year: '2025',
      medium: 'English',
      paperType: 'Past Paper',
      term: 'Final',
      description: '',
      source: 'Official Department of Examinations',
      permissionConfirmed: false,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (paper) => {
    setEditingPaper(paper);
    setSelectedFile(null);
    setFormError('');
    setFormSuccess('');
    setFormData({
      title: paper.title || '',
      slug: paper.slug || '',
      examType: paper.examType || 'OL',
      level: paper.level || 'O/L',
      stream: paper.stream || 'General',
      subject: paper.subject || '',
      year: paper.year ? String(paper.year) : '2025',
      medium: paper.medium || 'English',
      paperType: paper.paperType || 'Past Paper',
      term: paper.term || 'Final',
      description: paper.description || '',
      source: paper.source || 'Official Department of Examinations',
      permissionConfirmed: paper.permissionConfirmed || false,
      status: paper.status || 'published',
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (title) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.permissionConfirmed) {
      setFormError('You must explicitly confirm permission before uploading or publishing this document.');
      return;
    }

    if (!editingPaper && !selectedFile) {
      setFormError('Please select a PDF document file to upload.');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (selectedFile) {
        data.append('file', selectedFile);
      }

      if (editingPaper) {
        await updatePastPaper(editingPaper._id, data);
        setFormSuccess('Past paper updated successfully!');
      } else {
        await createPastPaper(data);
        setFormSuccess('Past paper uploaded and saved successfully!');
      }

      fetchPapers();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1200);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save past paper.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await togglePastPaperStatus(id);
      fetchPapers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will permanently erase the file.`)) {
      return;
    }
    try {
      await deletePastPaper(id);
      fetchPapers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete past paper');
    }
  };

  // Client-side filter
  const filteredPapers = papers.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchExam = !examTypeFilter || p.examType === examTypeFilter;
    return matchSearch && matchExam;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Seo title="Manage Past Papers - Admin" description="Upload, edit, and manage educational past papers and PDFs." />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <FaFilePdf className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Past Papers Management</h1>
            <p className="text-xs text-slate-500">Upload PDF documents, manage exam levels, and track download counts.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors shrink-0"
        >
          <FaPlus /> Upload New Past Paper
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or subject..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <FaFilter className="text-[10px]" /> Exam Level:
          </span>
          <select
            value={examTypeFilter}
            onChange={(e) => setExamTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none"
          >
            <option value="">All Levels</option>
            <option value="OL">G.C.E. O/L</option>
            <option value="AL">G.C.E. A/L</option>
            <option value="UNIVERSITY">University</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm animate-pulse">
            Loading past paper files...
          </div>
        ) : filteredPapers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[11px]">
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Exam</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Year</th>
                  <th className="py-3.5 px-4">Medium</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Downloads</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPapers.map((paper) => (
                  <tr key={paper._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <FaFilePdf className="text-rose-500 shrink-0" />
                        <span className="truncate max-w-xs">{paper.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold text-[10px]">
                        {paper.examType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{paper.subject}</td>
                    <td className="py-3.5 px-4">{paper.year}</td>
                    <td className="py-3.5 px-4">{paper.medium}</td>
                    <td className="py-3.5 px-4">{formatFileSize(paper.fileSize)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          paper.status === 'published'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}
                      >
                        {paper.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">{paper.downloadCount}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(paper._id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        title="Toggle Publish / Draft"
                      >
                        {paper.status === 'published' ? <FaEyeSlash className="text-amber-600 inline" /> : <FaCheckCircle className="text-emerald-600 inline" />}
                      </button>
                      <button
                        onClick={() => openEditModal(paper)}
                        className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold"
                      >
                        <FaEdit className="inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(paper._id, paper.title)}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold"
                      >
                        <FaTrash className="inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            No past papers found. Click "Upload New Past Paper" to add a PDF document.
          </div>
        )}
      </div>

      {/* Upload / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FaFilePdf className="text-rose-600" />
                <span>{editingPaper ? 'Edit Past Paper Document' : 'Upload New Past Paper PDF'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <FaTimes />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <FaShieldAlt className="text-sm shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Title & Auto-Slug */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 2025 O/L Mathematics Past Paper"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Grid 1: Exam Type, Subject, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Type *</label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value, level: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  >
                    <option value="OL">G.C.E. O/L</option>
                    <option value="AL">G.C.E. A/L</option>
                    <option value="UNIVERSITY">University</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid 2: Medium, Paper Type, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Medium *</label>
                  <select
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Paper Type *</label>
                  <select
                    value={formData.paperType}
                    onChange={(e) => setFormData({ ...formData, paperType: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  >
                    <option value="Past Paper">Past Paper</option>
                    <option value="Model Paper">Model Paper</option>
                    <option value="Term Test">Term Test</option>
                    <option value="Revision Paper">Revision Paper</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* PDF File Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PDF Document File {editingPaper ? '(Leave blank to keep existing file)' : '*'}
                </label>
                <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                  <FaUpload className="text-xl text-slate-400 mx-auto" />
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                  />
                  {selectedFile && (
                    <p className="text-xs font-semibold text-blue-600">Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})</p>
                  )}
                </div>
              </div>

              {/* Source & Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Source / Attribution</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="Official Department of Examinations"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary or paper syllabus notes..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                ></textarea>
              </div>

              {/* MANDATORY COPYRIGHT PERMISSION CONFIRMATION CHECKBOX */}
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.permissionConfirmed}
                    onChange={(e) => setFormData({ ...formData, permissionConfirmed: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-amber-950 leading-snug">
                    I explicitly confirm that I have the legal right or permission to distribute this educational document file on EduTools LK. *
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? 'Processing Upload...' : 'Save & Publish Past Paper'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPastPapers;
