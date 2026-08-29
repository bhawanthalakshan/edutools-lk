import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaFilePdf, FaSearch, FaFilter, FaRedo } from 'react-icons/fa';
import Seo from '../../components/Seo';
import PastPaperCard from '../../components/PastPaperCard';
import Pagination from '../../components/Pagination';
import AdPlaceholder from '../../components/AdPlaceholder';
import { getPastPapers } from '../../services/pastPaperService';

const PastPapersHub = () => {
  const location = useLocation();

  // Detect pre-filtered level from route pathname (/past-papers/ol, /past-papers/al, /past-papers/university)
  const getInitialExamType = () => {
    if (location.pathname.includes('/past-papers/ol')) return 'OL';
    if (location.pathname.includes('/past-papers/al')) return 'AL';
    if (location.pathname.includes('/past-papers/university')) return 'UNIVERSITY';
    return '';
  };

  const [examType, setExamType] = useState(getInitialExamType());
  const [stream, setStream] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [medium, setMedium] = useState('');
  const [paperType, setPaperType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [papers, setPapers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sync route changes with examType state
  useEffect(() => {
    setExamType(getInitialExamType());
    setCurrentPage(1);
  }, [location.pathname]);

  // Fetch Past Papers on filter/page change
  useEffect(() => {
    setLoading(true);
    getPastPapers({
      examType,
      stream,
      subject,
      year,
      medium,
      paperType,
      search: searchQuery,
      page: currentPage,
      limit: 9,
    })
      .then((res) => {
        setPapers(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
          setTotalCount(res.pagination.totalPapers || 0);
        }
      })
      .catch((err) => console.error('Failed to fetch past papers:', err))
      .finally(() => setLoading(false));
  }, [examType, stream, subject, year, medium, paperType, searchQuery, currentPage]);

  const handleClearFilters = () => {
    setExamType('');
    setStream('');
    setSubject('');
    setYear('');
    setMedium('');
    setPaperType('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Seo
        title="Past Papers & Study Resources"
        description="Find and download free Sri Lankan G.C.E. O/L, A/L, and University past papers, model papers, and marking schemes."
      />

      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 p-8 sm:p-12 rounded-3xl text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm text-blue-300">
            <FaFilePdf className="text-3xl" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-lg">
            Free PDF Downloads
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Past Papers & Study Resources
        </h1>
        <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl leading-relaxed">
          Find and download official G.C.E. O/L, G.C.E. A/L, and University past papers, model question sets, and revision papers across Sinhala, Tamil, and English mediums.
        </p>

        {/* Quick Level Switch Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
          <Link
            to="/past-papers"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              examType === '' ? 'bg-white text-blue-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            All Levels
          </Link>
          <Link
            to="/past-papers/ol"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              examType === 'OL' ? 'bg-white text-blue-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            O/L Papers
          </Link>
          <Link
            to="/past-papers/al"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              examType === 'AL' ? 'bg-white text-blue-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            A/L Papers
          </Link>
          <Link
            to="/past-papers/university"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              examType === 'UNIVERSITY' ? 'bg-white text-blue-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            University Papers
          </Link>
        </div>
      </div>

      {/* Filter Control Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <FaFilter className="text-blue-600" />
            <span>Filter & Search Past Papers</span>
            <span className="text-slate-400 font-normal">({totalCount} papers found)</span>
          </div>

          <button
            onClick={handleClearFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FaRedo className="text-[10px]" /> Clear All Filters
          </button>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Search Query Input */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by subject or title..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
          </div>

          {/* Exam Type */}
          <select
            value={examType}
            onChange={(e) => {
              setExamType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="">All Exam Levels</option>
            <option value="OL">G.C.E. O/L</option>
            <option value="AL">G.C.E. A/L</option>
            <option value="UNIVERSITY">University</option>
          </select>

          {/* Medium */}
          <select
            value={medium}
            onChange={(e) => {
              setMedium(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="">All Mediums</option>
            <option value="English">English Medium</option>
            <option value="Sinhala">Sinhala Medium</option>
            <option value="Tamil">Tamil Medium</option>
          </select>

          {/* Paper Type */}
          <select
            value={paperType}
            onChange={(e) => {
              setPaperType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="">All Paper Types</option>
            <option value="Past Paper">Past Paper</option>
            <option value="Model Paper">Model Paper</option>
            <option value="Term Test">Term Test</option>
            <option value="Revision Paper">Revision Paper</option>
          </select>

          {/* Year */}
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>

        </div>
      </div>

      {/* Non-intrusive Ad Placement */}
      <AdPlaceholder type="banner" />

      {/* Past Papers Grid / Loading / Empty State */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm animate-pulse">
          Loading past papers catalog...
        </div>
      ) : papers.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <PastPaperCard key={paper._id} paper={paper} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      ) : (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="p-4 bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400 text-2xl">
            <FaFilePdf />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No past papers found matching your criteria</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your active filters or searching for alternative subjects like "Mathematics" or "Physics".
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default PastPapersHub;
