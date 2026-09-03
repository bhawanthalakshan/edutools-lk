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
  FaShieldAlt,
  FaBookReader,
  FaGraduationCap,
  FaUniversity,
  FaChartBar,
  FaDownload,
  FaCog,
  FaArrowLeft,
  FaBook
} from 'react-icons/fa';
import Seo from '../../components/Seo';
import api from '../../services/api';
import { 
  createPastPaper, 
  updatePastPaper, 
  deletePastPaper, 
  togglePastPaperStatus,
  getPastPaperStats,
  getSubjects,
  createSubject,
  getUniversities,
  createUniversity,
  getCourses,
  createCourse,
  getModules,
  createModule
} from '../../services/pastPaperService';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const AdminPastPapers = () => {
  // Navigation Tabs: 'ol' | 'al' | 'university' | 'subjects' | 'hierarchy'
  const [activeTab, setActiveTab] = useState('ol');

  // Stats
  const [stats, setStats] = useState({
    totalPapers: 0,
    olPapers: 0,
    alPapers: 0,
    universityPapers: 0,
    olSubjectsCount: 0,
    alSubjectsCount: 0,
    universityCount: 0,
    totalDownloads: 0,
  });

  // Level & Subject Context Selection
  const [selectedSubject, setSelectedSubject] = useState(null); // For OL & AL
  const [selectedUni, setSelectedUni] = useState(null); // For University
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  // Data Collections
  const [papers, setPapers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Paper Upload/Edit Modal State
  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form Data
  const [paperFormData, setPaperFormData] = useState({
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

  // Subject Management Modal State
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [newSubjectData, setNewSubjectData] = useState({ name: '', slug: '', examType: 'OL', description: '', icon: 'FaBook' });

  // University Management Modal State
  const [isUniModalOpen, setIsUniModalOpen] = useState(false);
  const [newUniData, setNewUniData] = useState({ name: '', slug: '', description: '' });

  // Fetch Stats & Subjects / Papers
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const statsRes = await getPastPaperStats().catch(() => null);
      if (statsRes?.data) setStats(statsRes.data);

      const subjectsRes = await getSubjects({ all: true }).catch(() => ({ data: [] }));
      setSubjects(subjectsRes.data || []);

      const unisRes = await getUniversities({ all: true }).catch(() => ({ data: [] }));
      setUniversities(unisRes.data || []);

      // Fetch Papers matching current view
      let papersQuery = '/past-papers?all=true&limit=200';
      if (activeTab === 'ol') papersQuery += '&examType=OL';
      if (activeTab === 'al') papersQuery += '&examType=AL';
      if (activeTab === 'university') papersQuery += '&examType=UNIVERSITY';
      if (selectedSubject) papersQuery += `&subjectId=${selectedSubject._id}`;
      if (selectedModule) papersQuery += `&moduleId=${selectedModule._id}`;

      const papersRes = await api.get(papersQuery);
      setPapers(papersRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load admin past papers data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [activeTab, selectedSubject, selectedModule]);

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedSubject(null);
    setSelectedUni(null);
    setSelectedCourse(null);
    setSelectedModule(null);
    setSearchQuery('');
  };

  // Open Paper Upload Modal with Auto-filled Context
  const openCreatePaperModal = () => {
    setEditingPaper(null);
    setSelectedFile(null);
    setFormError('');
    setFormSuccess('');

    const defaultExam = activeTab === 'al' ? 'AL' : activeTab === 'university' ? 'UNIVERSITY' : 'OL';
    const defaultSub = selectedSubject ? selectedSubject.name : (defaultExam === 'OL' ? 'Mathematics' : defaultExam === 'AL' ? 'Physics' : 'General Module');

    setPaperFormData({
      title: '',
      slug: '',
      examType: defaultExam,
      level: defaultExam,
      stream: 'General',
      subject: defaultSub,
      subjectId: selectedSubject ? selectedSubject._id : '',
      universityId: selectedUni ? selectedUni._id : '',
      courseId: selectedCourse ? selectedCourse._id : '',
      moduleId: selectedModule ? selectedModule._id : '',
      year: '2025',
      medium: 'English',
      paperType: 'Past Paper',
      term: 'Final',
      description: '',
      source: 'Official Department of Examinations',
      permissionConfirmed: false,
      status: 'published',
    });
    setIsPaperModalOpen(true);
  };

  const openEditPaperModal = (paper) => {
    setEditingPaper(paper);
    setSelectedFile(null);
    setFormError('');
    setFormSuccess('');

    setPaperFormData({
      title: paper.title || '',
      slug: paper.slug || '',
      examType: paper.examType || 'OL',
      level: paper.level || 'O/L',
      stream: paper.stream || 'General',
      subject: paper.subject || '',
      subjectId: paper.subjectId?._id || paper.subjectId || '',
      universityId: paper.universityId?._id || paper.universityId || '',
      courseId: paper.courseId?._id || paper.courseId || '',
      moduleId: paper.moduleId?._id || paper.moduleId || '',
      year: paper.year ? String(paper.year) : '2025',
      medium: paper.medium || 'English',
      paperType: paper.paperType || 'Past Paper',
      term: paper.term || 'Final',
      description: paper.description || '',
      source: paper.source || 'Official Department of Examinations',
      permissionConfirmed: paper.permissionConfirmed || false,
      status: paper.status || 'published',
    });
    setIsPaperModalOpen(true);
  };

  const handleTitleChange = (title) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setPaperFormData((prev) => ({ ...prev, title, slug }));
  };

  const handlePaperSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!paperFormData.permissionConfirmed) {
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
      Object.keys(paperFormData).forEach((key) => {
        if (paperFormData[key] !== null && paperFormData[key] !== undefined) {
          data.append(key, paperFormData[key]);
        }
      });

      if (selectedFile) {
        data.append('file', selectedFile);
      }

      if (editingPaper) {
        await updatePastPaper(editingPaper._id, data);
        setFormSuccess('Past paper updated successfully! Old Cloudinary file replaced.');
      } else {
        await createPastPaper(data);
        setFormSuccess('Past paper uploaded and saved successfully to Cloudinary!');
      }

      fetchAllData();
      setTimeout(() => {
        setIsPaperModalOpen(false);
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
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePaper = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will permanently remove the file from Cloudinary.`)) {
      return;
    }
    try {
      await deletePastPaper(id);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete past paper');
    }
  };

  // Create Subject Submit
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSubject(newSubjectData);
      setIsSubjectModalOpen(false);
      setNewSubjectData({ name: '', slug: '', examType: 'OL', description: '', icon: 'FaBook' });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create subject');
    }
  };

  // Create University Submit
  const handleUniSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUniversity(newUniData);
      setIsUniModalOpen(false);
      setNewUniData({ name: '', slug: '', description: '' });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create university');
    }
  };

  // Filter papers for current table view
  const filteredPapers = papers.filter((p) => {
    return (
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const currentSubjects = subjects.filter((s) => s.examType === (activeTab === 'al' ? 'AL' : 'OL'));

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Seo title="Admin Past Papers Management" description="Upload, edit, and organize educational past paper archives on Examora." />

      {/* Header & Main Stats Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
              <FaFilePdf className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Past Papers Admin Dashboard</h1>
              <p className="text-xs text-slate-500">Manage O/L, A/L, and University past papers, subjects, and Cloudinary uploads.</p>
            </div>
          </div>

          <button
            onClick={openCreatePaperModal}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors shrink-0"
          >
            <FaPlus /> Upload New Past Paper
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-semibold block">Total Papers</span>
            <span className="text-lg font-black text-slate-900">{stats.totalPapers}</span>
          </div>
          <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
            <span className="text-blue-600 font-semibold block">O/L Papers</span>
            <span className="text-lg font-black text-blue-900">{stats.olPapers}</span>
          </div>
          <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <span className="text-indigo-600 font-semibold block">A/L Papers</span>
            <span className="text-lg font-black text-indigo-900">{stats.alPapers}</span>
          </div>
          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
            <span className="text-purple-600 font-semibold block">University Papers</span>
            <span className="text-lg font-black text-purple-900">{stats.universityPapers}</span>
          </div>
          <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <span className="text-emerald-600 font-semibold block">Active Subjects</span>
            <span className="text-lg font-black text-emerald-900">{stats.olSubjectsCount + stats.alSubjectsCount}</span>
          </div>
          <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100">
            <span className="text-amber-600 font-semibold block">Total Downloads</span>
            <span className="text-lg font-black text-amber-900">{stats.totalDownloads}</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => handleTabChange('ol')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'ol'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FaBookReader /> O/L Management
        </button>

        <button
          onClick={() => handleTabChange('al')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'al'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FaGraduationCap /> A/L Management
        </button>

        <button
          onClick={() => handleTabChange('university')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'university'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FaUniversity /> University Management
        </button>

        <button
          onClick={() => handleTabChange('subjects')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'subjects'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FaCog /> Subject Settings
        </button>
      </div>

      {/* TAB 1 & 2: O/L AND A/L SUBJECT HIERARCHY BAR */}
      {(activeTab === 'ol' || activeTab === 'al') && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Select {activeTab.toUpperCase()} Subject to Scope Papers</span>
              {selectedSubject && (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Selected: {selectedSubject.name}
                </span>
              )}
            </h2>

            {selectedSubject && (
              <button
                onClick={() => setSelectedSubject(null)}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Clear Subject Scope (Show All)
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubject(null)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                !selectedSubject ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All {activeTab.toUpperCase()} Subjects
            </button>

            {currentSubjects.map((sub) => (
              <button
                key={sub._id}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSubject?._id === sub._id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sub.name} ({sub.paperCount || 0})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH & PAPERS TABLE */}
      {activeTab !== 'subjects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search table by title or subject..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Showing {filteredPapers.length} papers
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-sm animate-pulse">
                Loading past papers catalog...
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
                            title="Toggle Status"
                          >
                            {paper.status === 'published' ? <FaEyeSlash className="text-amber-600 inline" /> : <FaCheckCircle className="text-emerald-600 inline" />}
                          </button>
                          <button
                            onClick={() => openEditPaperModal(paper)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold"
                          >
                            <FaEdit className="inline" />
                          </button>
                          <button
                            onClick={() => handleDeletePaper(paper._id, paper.title)}
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
                No past papers found in this view. Click "Upload New Past Paper" to add a document.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SUBJECTS MANAGEMENT */}
      {activeTab === 'subjects' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Database Subject Settings</h2>
              <p className="text-xs text-slate-500">Add or manage subjects for O/L and A/L exam levels.</p>
            </div>
            <button
              onClick={() => setIsSubjectModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <FaPlus /> Add New Subject
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* O/L Subjects List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">O/L Subjects ({subjects.filter((s) => s.examType === 'OL').length})</h3>
              <div className="space-y-2">
                {subjects.filter((s) => s.examType === 'OL').map((s) => (
                  <div key={s._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{s.name}</span>
                    <span className="text-slate-500">{s.paperCount || 0} Papers</span>
                  </div>
                ))}
              </div>
            </div>

            {/* A/L Subjects List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">A/L Subjects ({subjects.filter((s) => s.examType === 'AL').length})</h3>
              <div className="space-y-2">
                {subjects.filter((s) => s.examType === 'AL').map((s) => (
                  <div key={s._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{s.name}</span>
                    <span className="text-slate-500">{s.paperCount || 0} Papers</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAPER UPLOAD & EDIT MODAL */}
      {isPaperModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-modal-backdrop">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FaFilePdf className="text-rose-600" />
                <span>{editingPaper ? 'Edit Past Paper PDF Document' : 'Upload New Past Paper PDF'}</span>
              </h3>
              <button onClick={() => setIsPaperModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
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

            <form onSubmit={handlePaperSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={paperFormData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 2025 O/L Mathematics Paper I"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Type *</label>
                  <select
                    value={paperFormData.examType}
                    onChange={(e) => setPaperFormData({ ...paperFormData, examType: e.target.value, level: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  >
                    <option value="OL">G.C.E. O/L</option>
                    <option value="AL">G.C.E. A/L</option>
                    <option value="UNIVERSITY">University</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={paperFormData.subject}
                    onChange={(e) => setPaperFormData({ ...paperFormData, subject: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Year *</label>
                  <input
                    type="number"
                    required
                    value={paperFormData.year}
                    onChange={(e) => setPaperFormData({ ...paperFormData, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Medium *</label>
                  <select
                    value={paperFormData.medium}
                    onChange={(e) => setPaperFormData({ ...paperFormData, medium: e.target.value })}
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
                    value={paperFormData.paperType}
                    onChange={(e) => setPaperFormData({ ...paperFormData, paperType: e.target.value })}
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
                    value={paperFormData.status}
                    onChange={(e) => setPaperFormData({ ...paperFormData, status: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* PDF File Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PDF File {editingPaper ? '(Leave empty to preserve existing file)' : '*'}
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
                    <p className="text-xs font-semibold text-blue-600">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
              </div>

              {/* Copyright confirmation */}
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={paperFormData.permissionConfirmed}
                    onChange={(e) => setPaperFormData({ ...paperFormData, permissionConfirmed: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-amber-950 leading-snug">
                    I explicitly confirm that I have permission to distribute this file on Examora. *
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaperModalOpen(false)}
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
                  {submitting ? 'Uploading to Cloudinary...' : 'Save & Publish Paper'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CREATE SUBJECT MODAL */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Subject</h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={newSubjectData.name}
                  onChange={(e) => setNewSubjectData({ ...newSubjectData, name: e.target.value })}
                  placeholder="e.g. Chemistry"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Level *</label>
                <select
                  value={newSubjectData.examType}
                  onChange={(e) => setNewSubjectData({ ...newSubjectData, examType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold"
                >
                  <option value="OL">G.C.E. O/L</option>
                  <option value="AL">G.C.E. A/L</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Create Subject
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
