import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaFilePdf, FaSearch, FaFilter, FaRedo, FaDownload, FaEye, FaCalendarAlt } from 'react-icons/fa';
import Seo from '../../components/Seo';
import Breadcrumbs from '../../components/Breadcrumbs';
import AdPlaceholder from '../../components/AdPlaceholder';
import PastPaperCard from '../../components/PastPaperCard';
import { getSubjectBySlug, getPastPapers, triggerPastPaperDownload } from '../../services/pastPaperService';

const OLSubjectPage = () => {
  const { subjectSlug } = useParams();

  const [subject, setSubject] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [mediumFilter, setMediumFilter] = useState('');
  const [paperTypeFilter, setPaperTypeFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    // Fetch Subject Details
    getSubjectBySlug('ol', subjectSlug)
      .then((res) => {
        setSubject(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch subject details:', err);
      });

    // Fetch Papers for this O/L Subject
    getPastPapers({
      examType: 'OL',
      subjectSlug,
      limit: 100,
      sort: '-year',
    })
      .then((res) => {
        setPapers(res.data || []);
      })
      .catch((err) => console.error('Failed to fetch papers:', err))
      .finally(() => setLoading(false));
  }, [subjectSlug]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setYearFilter('');
    setMediumFilter('');
    setPaperTypeFilter('');
  };

  // Filter papers client-side from the subject collection
  const filteredPapers = papers.filter((paper) => {
    const matchSearch =
      !searchQuery ||
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchYear = !yearFilter || paper.year === Number(yearFilter);
    const matchMedium = !mediumFilter || paper.medium.toLowerCase() === mediumFilter.toLowerCase();
    const matchType = !paperTypeFilter || paper.paperType.toLowerCase() === paperTypeFilter.toLowerCase();
    return matchSearch && matchYear && matchMedium && matchType;
  });

  // Group papers by Year in descending order
  const groupedPapers = filteredPapers.reduce((groups, paper) => {
    const y = paper.year || 'Other';
    if (!groups[y]) groups[y] = [];
    groups[y].push(paper);
    return groups;
  }, {});

  const yearsDescending = Object.keys(groupedPapers).sort((a, b) => Number(b) - Number(a));
  const subjectName = subject ? subject.name : subjectSlug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Seo
        title={`2025 O/L ${subjectName} Past Papers & Marking Schemes PDF`}
        description={`Download Sri Lankan G.C.E. O/L ${subjectName} past papers, model question sets, and marking schemes in Sinhala, Tamil, and English mediums.`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `O/L ${subjectName} Past Papers`,
          description: `Download G.C.E. O/L ${subjectName} past papers organized by year.`,
        }}
      />

      <Breadcrumbs
        items={[
          { label: 'Past Papers', url: '/past-papers' },
          { label: 'O/L Past Papers', url: '/past-papers/ol' },
          { label: `${subjectName} Past Papers` },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-10 rounded-3xl text-white shadow-xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-lg">
          O/L Subject Resource
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          O/L {subjectName} Past Papers
        </h1>
        <p className="text-xs sm:text-sm text-blue-100/90 max-w-3xl leading-relaxed">
          Download G.C.E. Ordinary Level {subjectName} examination papers, revision papers, and official marking guidelines in PDF format. Select a year section below to download.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <FaFilter className="text-blue-600" />
            <span>Filter {subjectName} Papers</span>
            <span className="text-slate-400 font-normal">({filteredPapers.length} papers found)</span>
          </div>

          <button
            onClick={handleClearFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
          >
            <FaRedo className="text-[10px]" /> Clear Filters
          </button>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search paper title..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
            />
            <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
          </div>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none"
          >
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>

          <select
            value={mediumFilter}
            onChange={(e) => setMediumFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none"
          >
            <option value="">All Mediums</option>
            <option value="English">English Medium</option>
            <option value="Sinhala">Sinhala Medium</option>
            <option value="Tamil">Tamil Medium</option>
          </select>

          <select
            value={paperTypeFilter}
            onChange={(e) => setPaperTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none"
          >
            <option value="">All Paper Formats</option>
            <option value="Past Paper">Past Paper</option>
            <option value="Model Paper">Model Paper</option>
            <option value="Term Test">Term Test</option>
            <option value="Revision Paper">Revision Paper</option>
          </select>
        </div>
      </div>

      <AdPlaceholder type="banner" />

      {/* Papers Grouped by Year */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
          Loading {subjectName} papers...
        </div>
      ) : yearsDescending.length > 0 ? (
        <div className="space-y-10">
          {yearsDescending.map((yr) => (
            <div key={yr} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <FaCalendarAlt className="text-sm" />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  {yr} {subjectName} Past Papers
                </h2>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {groupedPapers[yr].length} {groupedPapers[yr].length === 1 ? 'Paper' : 'Papers'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedPapers[yr].map((paper) => (
                  <PastPaperCard key={paper._id} paper={paper} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="p-4 bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400 text-2xl">
            <FaFilePdf />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No {subjectName} papers found matching criteria</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your active filters or searching for alternative exam years.
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

export default OLSubjectPage;
