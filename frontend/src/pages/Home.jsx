import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaFire, FaArrowRight, FaFilePdf, FaGraduationCap } from 'react-icons/fa';
import Seo from '../components/Seo';
import HeroSection from '../components/HeroSection';
import FeatureCategories from '../components/FeatureCategories';
import PopularSubjectsSection from '../components/PopularSubjectsSection';
import WhyExamoraSection from '../components/WhyExamoraSection';
import PastPaperCard from '../components/PastPaperCard';
import AdPlaceholder from '../components/AdPlaceholder';
import { getPastPapers, getPastPaperStats, getSubjects } from '../services/pastPaperService';

const Home = () => {
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
  const [recentPapers, setRecentPapers] = useState([]);
  const [popularPapers, setPopularPapers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPastPaperStats().catch(() => null),
      getPastPapers({ limit: 6, sort: '-createdAt' }).catch(() => ({ data: [] })),
      getPastPapers({ limit: 6, sort: '-downloadCount' }).catch(() => ({ data: [] })),
      getSubjects({ all: false }).catch(() => ({ data: [] })),
    ])
      .then(([statsRes, recentRes, popularRes, subjectsRes]) => {
        if (statsRes?.data) setStats(statsRes.data);
        if (recentRes?.data) setRecentPapers(recentRes.data);
        if (popularRes?.data) setPopularPapers(popularRes.data);
        if (subjectsRes?.data) setSubjects(subjectsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <Seo
        title="Past Papers Sri Lanka | O/L, A/L & University"
        description="Find Sri Lankan G.C.E. O/L, G.C.E. A/L, and University past papers by subject, year, medium and paper type. View and download past papers easily on Examora."
      />

      {/* 1. Hero Section */}
      <HeroSection stats={stats} />

      {/* 2. Past Papers Categories Section */}
      <FeatureCategories stats={stats} />

      {/* 3. Popular Subjects Section */}
      <PopularSubjectsSection subjects={subjects} />

      <AdPlaceholder type="banner" />

      {/* 4. Recently Added Past Papers (Capped to 4-6 Papers) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <FaClock className="text-blue-600 text-xl" />
              <span>Recently Added Past Papers</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Latest past paper uploads added to the Examora library.</p>
          </div>

          <Link
            to="/past-papers"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 shrink-0"
          >
            <span>View All Past Papers</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
            Loading recent papers...
          </div>
        ) : recentPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPapers.slice(0, 6).map((paper) => (
              <PastPaperCard key={paper._id} paper={paper} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            No papers uploaded yet. Check back soon!
          </div>
        )}
      </section>

      {/* 5. Popular / Most Downloaded Papers Section */}
      {popularPapers.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <FaFire className="text-amber-500 text-xl" />
                <span>Most Downloaded Papers</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">High-demand G.C.E. O/L, A/L, and University past papers.</p>
            </div>

            <Link
              to="/past-papers"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 shrink-0"
            >
              <span>Explore Library</span>
              <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularPapers.slice(0, 6).map((paper) => (
              <PastPaperCard key={paper._id} paper={paper} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Why Examora Section */}
      <WhyExamoraSection />

      {/* 7. Final Strong Past Papers CTA Banner */}
      <section className="p-8 sm:p-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl text-white shadow-xl text-center space-y-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Find Your Past Paper Now
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
            Access thousands of Sri Lankan O/L, A/L, and University examination question papers in PDF format.
          </p>

          <div className="pt-4">
            <Link
              to="/past-papers"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-extrabold text-sm rounded-2xl shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
            >
              <FaFilePdf className="text-blue-600 text-base" />
              <span>Browse All Past Papers</span>
              <FaArrowRight className="text-xs text-slate-500" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
