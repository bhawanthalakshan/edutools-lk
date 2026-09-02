import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaSearch, 
  FaArrowRight, 
  FaSquareRootAlt, 
  FaAtom, 
  FaVial, 
  FaDna, 
  FaLaptopCode, 
  FaFileInvoiceDollar, 
  FaBriefcase, 
  FaCoins, 
  FaCogs, 
  FaMicroscope, 
  FaLeaf 
} from 'react-icons/fa';
import Seo from '../../components/Seo';
import Breadcrumbs from '../../components/Breadcrumbs';
import { getSubjects } from '../../services/pastPaperService';

const ICON_MAP = {
  FaSquareRootAlt: <FaSquareRootAlt />,
  FaAtom: <FaAtom />,
  FaVial: <FaVial />,
  FaDna: <FaDna />,
  FaLaptopCode: <FaLaptopCode />,
  FaFileInvoiceDollar: <FaFileInvoiceDollar />,
  FaBriefcase: <FaBriefcase />,
  FaCoins: <FaCoins />,
  FaCogs: <FaCogs />,
  FaMicroscope: <FaMicroscope />,
  FaLeaf: <FaLeaf />,
};

const ALPapersPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSubjects({ examType: 'AL' })
      .then((res) => {
        setSubjects(res.data || []);
      })
      .catch((err) => console.error('Failed to fetch A/L subjects:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Seo
        title="G.C.E. A/L Past Papers Sri Lanka | Advanced Level PDF Downloads"
        description="Download free Sri Lankan G.C.E. A/L Physics, Chemistry, Biology, Combined Maths, ICT, Accounting, and Technology past papers and marking schemes."
      />

      <Breadcrumbs
        items={[
          { label: 'Past Papers', url: '/past-papers' },
          { label: 'A/L Past Papers' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 p-8 sm:p-12 rounded-3xl text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm text-indigo-300">
            <FaGraduationCap className="text-3xl" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-lg">
            G.C.E. Advanced Level
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          A/L Past Papers Library
        </h1>
        <p className="text-xs sm:text-sm text-indigo-100/90 max-w-2xl leading-relaxed">
          Select an Advanced Level subject below to browse examination question papers (Paper I & II), model papers, and marking schemes across Science, Commerce, Arts, and Technology streams.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search A/L subjects (e.g. Physics, Chemistry, Combined Maths)..."
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
          />
          <FaSearch className="absolute left-3 top-3.5 text-slate-400 text-xs" />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing {filteredSubjects.length} A/L Subjects
        </div>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
          Loading A/L subjects catalog...
        </div>
      ) : filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSubjects.map((subject) => (
            <div
              key={subject._id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {ICON_MAP[subject.icon] || <FaGraduationCap />}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {subject.description || `Download G.C.E. A/L ${subject.name} past papers, marking schemes, and revision kits.`}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="text-indigo-600 font-bold">{subject.paperCount || 0} Papers</span>
                  {subject.latestYear && <span>Latest: {subject.latestYear}</span>}
                </div>

                <Link
                  to={`/past-papers/al/${subject.slug}`}
                  className="w-full py-2.5 bg-slate-900 group-hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
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
          No A/L subjects matching "{searchQuery}".
        </div>
      )}
    </div>
  );
};

export default ALPapersPage;
