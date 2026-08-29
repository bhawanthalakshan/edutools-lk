import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGraduationCap, FaArrowLeft, FaFilePdf, FaBookOpen, FaArrowRight } from 'react-icons/fa';
import Seo from '../../components/Seo';
import PastPaperCard from '../../components/PastPaperCard';
import ArticleCard from '../../components/ArticleCard';
import { getPastPapers } from '../../services/pastPaperService';
import { getArticles } from '../../services/articleService';

const SubjectDetail = () => {
  const { level, subjectKey } = useParams(); // level = 'ol' or 'al'
  
  // Format subject title e.g. "mathematics" -> "Mathematics"
  const formattedSubject = subjectKey
    ? subjectKey.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Subject';

  const examType = level?.toUpperCase() === 'AL' ? 'AL' : 'OL';
  const levelBadge = examType === 'AL' ? 'G.C.E. A/L' : 'G.C.E. O/L';

  const [papers, setPapers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      getPastPapers({ examType, subject: formattedSubject, limit: 6 }).catch(() => ({ data: [] })),
      getArticles({ search: formattedSubject, limit: 3 }).catch(() => ({ data: [] })),
    ])
      .then(([papersRes, artRes]) => {
        setPapers(papersRes.data || []);
        setArticles(artRes.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [level, subjectKey]);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Seo
        title={`${levelBadge} ${formattedSubject} Past Papers & Study Resources`}
        description={`Free ${levelBadge} ${formattedSubject} past papers, model papers, marking schemes, and revision guides on EduTools LK.`}
      />

      {/* Back Link */}
      <Link
        to={`/education/${level}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <FaArrowLeft className="text-[10px]" /> Back to {levelBadge} Resources
      </Link>

      {/* Subject Banner Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shrink-0">
            <FaGraduationCap className="text-3xl" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
              {levelBadge} Stream
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">{formattedSubject} Resources</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Past papers, model papers, syllabus breakdown, and study guides for {levelBadge} {formattedSubject}.
            </p>
          </div>
        </div>

        <Link
          to={`/past-papers?examType=${examType}&subject=${encodeURIComponent(formattedSubject)}`}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-xs"
        >
          <span>Browse All {formattedSubject} Papers</span>
          <FaArrowRight className="text-xs" />
        </Link>
      </div>

      {/* Section 1: Past Papers Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FaFilePdf className="text-rose-600" />
            <span>{formattedSubject} Past Papers & Model Papers</span>
          </h2>

          <Link
            to={`/past-papers?examType=${examType}&subject=${encodeURIComponent(formattedSubject)}`}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            View All ({papers.length})
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm animate-pulse">
            Loading subject papers...
          </div>
        ) : papers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <PastPaperCard key={paper._id} paper={paper} />
            ))}
          </div>
        ) : (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <h3 className="text-base font-bold text-slate-800">No past papers found specifically for {formattedSubject} yet.</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our academic team is currently processing official paper uploads. You can also search our full database.
            </p>
            <Link
              to="/past-papers"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Search All Past Papers
            </Link>
          </div>
        )}
      </div>

      {/* Section 2: Study Notes & Guides Articles */}
      {articles.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FaBookOpen className="text-indigo-600" />
            <span>Study Guides & Revision Articles</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <ArticleCard key={art._id} article={art} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default SubjectDetail;
