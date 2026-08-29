import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBookReader, FaUniversity, FaCode, FaArrowRight, FaSearch } from 'react-icons/fa';
import Seo from '../components/Seo';
import ArticleCard from '../components/ArticleCard';
import { getArticles } from '../services/articleService';

const Education = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getArticles({ limit: 6 })
      .then((res) => {
        setArticles(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const streams = [
    {
      title: 'O/L Resources',
      badge: 'Ordinary Level',
      description: 'Past papers, marking schemes, and revision notes for G.C.E. O/L students.',
      icon: <FaBookReader className="text-2xl text-blue-600" />,
      color: 'border-blue-200 hover:border-blue-400',
      link: '/education/ol',
    },
    {
      title: 'A/L Resources',
      badge: 'Advanced Level',
      description: 'Combined Maths, Physics, Chemistry, Biology, Commerce & Arts study packs.',
      icon: <FaGraduationCap className="text-2xl text-purple-600" />,
      color: 'border-purple-200 hover:border-purple-400',
      link: '/education/al',
    },
    {
      title: 'University Resources',
      badge: 'Higher Education',
      description: 'Undergraduate lecture notes, reference books, and GPA calculation guides.',
      icon: <FaUniversity className="text-2xl text-emerald-600" />,
      color: 'border-emerald-200 hover:border-emerald-400',
      link: '/education/university',
    },
    {
      title: 'IT & Programming',
      badge: 'Tech Skills',
      description: 'Web development tutorials, Python programming roadmaps, and code cheat sheets.',
      icon: <FaCode className="text-2xl text-amber-600" />,
      color: 'border-amber-200 hover:border-amber-400',
      link: '/education/it-programming',
    },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <Seo title="Educational Resources" description="Syllabus-aligned study materials, exam past papers, and university guides." />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-200">
            <FaGraduationCap /> Sri Lankan Syllabus Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Educational Resources & Study Packs
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Select your academic stream to access curated past papers, revision notes, and guides.
          </p>
        </div>
      </div>

      {/* Stream Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {streams.map((s, idx) => (
          <Link
            key={idx}
            to={s.link}
            className={`p-7 bg-white rounded-3xl border ${s.color} shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-105 transition-transform">
                  {s.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {s.badge}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {s.title}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:text-purple-600 transition-colors gap-1.5">
              <span>View Stream Content</span>
              <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Dynamic Articles List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-900">Latest Academic Guides & Articles</h2>
          <Link to="/blog" className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline">
            <span>View All Articles</span> <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm animate-pulse">Loading study resources...</div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <ArticleCard key={art._id} article={art} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-500 text-sm">
            No educational articles found at this moment.
          </div>
        )}
      </div>

    </div>
  );
};

export default Education;
