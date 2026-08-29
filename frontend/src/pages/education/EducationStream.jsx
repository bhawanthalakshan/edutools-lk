import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGraduationCap, FaArrowLeft, FaBookReader, FaUniversity, FaCode } from 'react-icons/fa';
import Seo from '../../components/Seo';
import ArticleCard from '../../components/ArticleCard';
import { getArticles } from '../../services/articleService';
import { getCategoryBySlug } from '../../services/categoryService';

const streamMetaMap = {
  ol: {
    slug: 'o-l',
    title: 'Ordinary Level (O/L) Resources',
    badge: 'O/L Stream',
    icon: <FaBookReader className="text-3xl text-blue-600" />,
    description: 'Past papers, model marking schemes, and subject summaries for G.C.E. O/L examinations.',
  },
  al: {
    slug: 'a-l',
    title: 'Advanced Level (A/L) Resources',
    badge: 'A/L Stream',
    icon: <FaGraduationCap className="text-3xl text-purple-600" />,
    description: 'Science, Commerce, Arts, and Technology stream papers, revision guides, and teacher guidebooks.',
  },
  university: {
    slug: 'university',
    title: 'University Resources',
    badge: 'Undergraduate',
    icon: <FaUniversity className="text-3xl text-emerald-600" />,
    description: 'Lecture notes, reference materials, research templates, and degree module guides across faculties.',
  },
  'it-programming': {
    slug: 'it-programming',
    title: 'IT & Programming Tutorials',
    badge: 'Tech Skills',
    icon: <FaCode className="text-3xl text-amber-600" />,
    description: 'Web development tutorials, Python programming basics, software engineering roadmaps, and cheat sheets.',
  },
};

const EducationStream = () => {
  const { streamKey } = useParams();
  const meta = streamMetaMap[streamKey] || streamMetaMap['ol'];

  const [articles, setArticles] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Fetch Category info & Articles in parallel
    Promise.all([
      getCategoryBySlug(meta.slug).catch(() => null),
      getArticles({ category: meta.slug, limit: 12 }),
    ])
      .then(([catRes, artRes]) => {
        if (catRes && catRes.data) setCategoryInfo(catRes.data);
        setArticles(artRes.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [streamKey]);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Seo
        title={meta.title}
        description={categoryInfo?.description || meta.description}
      />

      {/* Navigation Back */}
      <Link
        to="/education"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <FaArrowLeft className="text-[10px]" /> Back to All Educational Resources
      </Link>

      {/* Stream Header */}
      <div className="flex items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          {meta.icon}
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            {meta.badge}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">{meta.title}</h1>
          <p className="text-xs text-slate-500 max-w-2xl">{categoryInfo?.description || meta.description}</p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Stream Articles & Resources ({articles.length})</h2>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm animate-pulse">
            Loading stream resources...
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <ArticleCard key={art._id} article={art} />
            ))}
          </div>
        ) : (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <h3 className="text-lg font-bold text-slate-800">No resources found for this category yet.</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our academic team is currently preparing study packs for this stream. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationStream;
