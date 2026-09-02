import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUniversity, FaSearch, FaArrowRight, FaGraduationCap, FaBookOpen } from 'react-icons/fa';
import Seo from '../../components/Seo';
import Breadcrumbs from '../../components/Breadcrumbs';
import { getUniversities } from '../../services/pastPaperService';

const UniversityPapersPage = () => {
  const [universities, setUniversities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUniversities()
      .then((res) => setUniversities(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredUnis = universities.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Seo
        title="University Past Papers Sri Lanka | KIU, SLIIT & Campus Exam Resources"
        description="Download undergraduate university past papers, degree module question papers, and semester exam resources for Sri Lankan universities."
      />

      <Breadcrumbs
        items={[
          { label: 'Past Papers', url: '/past-papers' },
          { label: 'University Papers' },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-8 sm:p-12 rounded-3xl text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm text-purple-300">
            <FaUniversity className="text-3xl" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-500/20 px-3 py-1 rounded-lg">
            Undergraduate & Campus Resources
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          University Past Papers Library
        </h1>
        <p className="text-xs sm:text-sm text-purple-100/90 max-w-2xl leading-relaxed">
          Select a university below to browse degree programs, course modules, and semester exam question papers.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search university name (e.g. KIU, SLIIT)..."
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-500 font-medium"
          />
          <FaSearch className="absolute left-3 top-3.5 text-slate-400 text-xs" />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing {filteredUnis.length} Universities
        </div>
      </div>

      {/* Universities Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
          Loading university catalog...
        </div>
      ) : filteredUnis.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnis.map((uni) => (
            <div
              key={uni._id}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <FaUniversity />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                    {uni.description || `Browse undergraduate degree courses and module past papers for ${uni.name}.`}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <FaGraduationCap className="text-purple-500" /> {uni.courseCount || 0} Courses
                  </span>
                  <span className="flex items-center gap-1 font-bold text-purple-600">
                    <FaBookOpen /> {uni.paperCount || 0} Papers
                  </span>
                </div>

                <Link
                  to={`/past-papers/university/${uni.slug}`}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all group-hover:gap-3"
                >
                  <span>Browse Degrees & Modules</span>
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          No universities found matching "{searchQuery}".
        </div>
      )}
    </div>
  );
};

export default UniversityPapersPage;
