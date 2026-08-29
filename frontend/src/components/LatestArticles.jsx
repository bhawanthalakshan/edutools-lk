import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaArrowRight, FaBookOpen } from 'react-icons/fa';

const LatestArticles = () => {
  const articles = [
    {
      title: 'Top 10 Study Techniques for G.C.E. A/L Exam Success',
      category: 'Study Guides',
      date: 'Aug 24, 2026',
      description: 'Discover active recall, spaced repetition, and timetable structuring methods proven to boost exam scores.',
      gradient: 'from-blue-600 to-indigo-600',
      link: '/blog',
    },
    {
      title: 'How to Calculate Your GPA Accurately for University Applications',
      category: 'Student Tools',
      date: 'Aug 20, 2026',
      description: 'A complete step-by-step breakdown of credit weighting, grade points, and GPA formula calculations.',
      gradient: 'from-purple-600 to-pink-600',
      link: '/blog',
    },
    {
      title: 'Ethical AI Tools Every Student Should Master in 2026',
      category: 'AI Learning',
      date: 'Aug 15, 2026',
      description: 'Leveraging modern AI assistants for research outline preparation and study material summary creation.',
      gradient: 'from-emerald-600 to-teal-600',
      link: '/blog',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Blog & Insights
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Latest Articles & Guides
            </h2>
            <p className="text-base text-slate-600">
              Insights, revision strategies, and educational tech tutorials updated weekly.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors w-fit"
          >
            <span>View All Articles</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Article Image Placeholder Container */}
                <div className={`h-44 bg-gradient-to-tr ${article.gradient} p-6 flex flex-col justify-between relative overflow-hidden`}>
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/20 text-white rounded-lg backdrop-blur-md border border-white/20">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-white/80 flex items-center gap-1 font-medium">
                      <FaCalendarAlt /> {article.date}
                    </span>
                  </div>

                  <div className="z-10 text-white/30 text-6xl self-end">
                    <FaBookOpen />
                  </div>
                </div>

                {/* Article Card Body */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {article.description}
                  </p>
                </div>
              </div>

              {/* Read More Footer Link */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  to={article.link}
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 group-hover:text-purple-600 transition-colors"
                >
                  <span>Read Article</span>
                  <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LatestArticles;
