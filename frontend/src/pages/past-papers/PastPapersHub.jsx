import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFilePdf, 
  FaGraduationCap, 
  FaBookReader, 
  FaUniversity, 
  FaArrowRight, 
  FaClock, 
  FaDownload, 
  FaCheckCircle,
  FaFileSignature,
  FaCloudUploadAlt
} from 'react-icons/fa';
import Seo from '../../components/Seo';
import Breadcrumbs from '../../components/Breadcrumbs';
import AdPlaceholder from '../../components/AdPlaceholder';
import PastPaperCard from '../../components/PastPaperCard';
import ExamCountdownSection from '../../components/ExamCountdownSection';
import RequestPaperModal from '../../components/RequestPaperModal';
import ContributePaperModal from '../../components/ContributePaperModal';
import { getPastPapers, getPastPaperStats } from '../../services/pastPaperService';

const PastPapersHub = () => {
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
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPastPaperStats().catch(() => null),
      getPastPapers({ limit: 6, sort: '-createdAt' }).catch(() => ({ data: [] })),
    ]).then(([statsRes, recentRes]) => {
      if (statsRes?.data) setStats(statsRes.data);
      if (recentRes?.data) setRecentPapers(recentRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in-up">
      <Seo
        title="Past Papers & Marking Schemes - G.C.E. O/L, A/L & University"
        description="Download free Sri Lankan G.C.E. O/L, G.C.E. A/L, and University past papers, model papers, and marking schemes in Sinhala, Tamil, and English mediums."
      />

      <Breadcrumbs items={[{ label: 'Past Papers' }]} />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-14 rounded-3xl text-white shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <FaCheckCircle className="text-blue-400" />
          <span>Verified Exam Papers Database</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Sri Lankan Past Papers Library
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Access high-quality PDF downloads of past examination question papers, marking schemes, and model papers for Ordinary Level, Advanced Level, and University courses.
        </p>

        {/* Aggregate Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">{stats.totalPapers}+</div>
            <div className="text-xs text-slate-400 font-medium">Total Past Papers</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{stats.olSubjectsCount + stats.alSubjectsCount}+</div>
            <div className="text-xs text-slate-400 font-medium">Exam Subjects</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">{stats.universityCount || 3}+</div>
            <div className="text-xs text-slate-400 font-medium">Universities</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{stats.totalDownloads}+</div>
            <div className="text-xs text-slate-400 font-medium">Downloads Serviced</div>
          </div>
        </div>
      </div>

      {/* Exam Countdown Widget */}
      <ExamCountdownSection />

      {/* 3 Main Category Cards (O/L, A/L, University) */}
      <div className="space-y-4">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Browse Exam Levels</h2>
          <p className="text-xs text-slate-500">Select an academic level to browse subjects and paper archives.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: O/L */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <FaBookReader />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  Secondary Education
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">O/L Past Papers</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  G.C.E. Ordinary Level question papers for Mathematics, Science, ICT, Languages, and History across English, Sinhala, and Tamil mediums.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{stats.olPapers || 0} Papers Available</span>
                <span>{stats.olSubjectsCount || 8}+ Subjects</span>
              </div>

              <Link
                to="/past-papers/ol"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all group-hover:gap-3"
              >
                <span>View O/L Papers</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>

          {/* Card 2: A/L */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <FaGraduationCap />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  Advanced Level
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">A/L Past Papers</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  G.C.E. Advanced Level examination papers for Physical Science, Biological Science, Commerce, Technology, and Arts streams.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{stats.alPapers || 0} Papers Available</span>
                <span>{stats.alSubjectsCount || 11}+ Subjects</span>
              </div>

              <Link
                to="/past-papers/al"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all group-hover:gap-3"
              >
                <span>View A/L Papers</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>

          {/* Card 3: University */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <FaUniversity />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                  Higher Education
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">University Papers</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Undergraduate semester papers and exam resources organized by university, degree course, and specific module code.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{stats.universityPapers || 0} Papers Available</span>
                <span>{stats.universityCount || 3}+ Universities</span>
              </div>

              <Link
                to="/past-papers/university"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all group-hover:gap-3"
              >
                <span>View University Papers</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AdPlaceholder type="banner" />

      {/* Community Request & Contribute Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-7 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
              <FaFileSignature />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Can't Find a Paper?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Can't find a specific past paper, marking scheme, or model paper? Submit a request and our team will work to locate and publish it.
            </p>
          </div>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all btn-press"
          >
            <FaFileSignature /> Request a Missing Paper
          </button>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-7 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
              <FaCloudUploadAlt />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Have a Paper We're Missing?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Help fellow students by contributing a past paper you have. Your uploaded document will be reviewed by our team before being published.
            </p>
          </div>
          <button
            onClick={() => setIsContributeModalOpen(true)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all btn-press"
          >
            <FaCloudUploadAlt /> Contribute a Paper
          </button>
        </div>
      </div>

      {/* Capped Recent Uploads Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FaClock className="text-blue-600" />
              <span>Recently Uploaded Past Papers</span>
            </h2>
            <p className="text-xs text-slate-500">Latest past paper additions added to the Examora archive.</p>
          </div>
          <Link
            to="/past-papers/ol"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
          >
            <span>View All Papers</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
            Loading recent papers catalog...
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
      </div>

      {/* Request Paper Modal */}
      <RequestPaperModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />

      {/* Contribute Paper Modal */}
      <ContributePaperModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
      />

    </div>
  );
};

export default PastPapersHub;
