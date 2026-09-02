import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBookReader, 
  FaSearch, 
  FaArrowRight, 
  FaCalculator, 
  FaFlask, 
  FaLaptopCode, 
  FaBook, 
  FaLanguage, 
  FaLandmark 
} from 'react-icons/fa';
import Seo from '../../components/Seo';
import Breadcrumbs from '../../components/Breadcrumbs';
import { getSubjects } from '../../services/pastPaperService';

const ICON_MAP = {
  FaCalculator: <FaCalculator />,
  FaFlask: <FaFlask />,
  FaLaptopCode: <FaLaptopCode />,
  FaBook: <FaBook />,
  FaLanguage: <FaLanguage />,
  FaLandmark: <FaLandmark />,
};

const OLPapersPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSubjects({ examType: 'OL' })
      .then((res) => {
        setSubjects(res.data || []);
      })
      .catch((err) => console.error('Failed to fetch O/L subjects:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Seo
        title="G.C.E. O/L Past Papers Sri Lanka | Ordinary Level Papers PDF Download"
        description="Download G.C.E. O/L Mathematics, Science, ICT, Sinhala, English, and History past papers, model question sets, and marking schemes in PDF format."
      />

      <Breadcrumbs
        items={[
          { label: 'Past Papers', url: '/past-papers' },
          { label: 'O/L Past Papers' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-12 rounded-3xl text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm text-blue-300">
            <FaBookReader className="text-3xl" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-lg">
            G.C.E. Ordinary Level
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          O/L Past Papers Library
        </h1>
        <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
          Select an Ordinary Level subject below to browse past examination papers, model question sets, and marking schemes organized by exam year and medium.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search O/L subjects (e.g. Mathematics, Science)..."
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
          />
          <FaSearch className="absolute left-3 top-3.5 text-slate-400 text-xs" />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing {filteredSubjects.length} O/L Subjects
        </div>
      </div>

      {/* Subject Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
          Loading O/L subjects catalog...
        </div>
      ) : filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSubjects.map((subject) => (
            <div
              key={subject._id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {ICON_MAP[subject.icon] || <FaBookReader />}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {subject.description || `Download G.C.E. O/L ${subject.name} past papers and model papers.`}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="text-blue-600 font-bold">{subject.paperCount || 0} Papers</span>
                  {subject.latestYear && <span>Latest: {subject.latestYear}</span>}
                </div>

                <Link
                  to={`/past-papers/ol/${subject.slug}`}
                  className="w-full py-2.5 bg-slate-900 group-hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>View Papers</span>
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          No O/L subjects matching "{searchQuery}".
        </div>
      )}
    </div>
  );
};

export default OLPapersPage;
