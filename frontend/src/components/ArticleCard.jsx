import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaArrowRight, FaBookOpen } from 'react-icons/fa';

const ArticleCard = ({ article }) => {
  if (!article) return null;

  const categoryName = article.category?.name || 'General';
  const categorySlug = article.category?.slug || '';
  const dateStr = article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'Recent';

  return (
    <article className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header Image or Gradient Banner */}
        {article.featuredImage ? (
          <div className="h-48 overflow-hidden relative">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-900/80 text-white rounded-lg backdrop-blur-md">
              {categoryName}
            </span>
          </div>
        ) : (
          <div className="h-44 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/20 text-white rounded-lg backdrop-blur-md border border-white/20">
                {categoryName}
              </span>
              <span className="text-[11px] text-white/90 flex items-center gap-1 font-medium">
                <FaCalendarAlt /> {dateStr}
              </span>
            </div>

            <div className="z-10 text-white/20 text-6xl self-end">
              <FaBookOpen />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1"><FaUser className="text-slate-400" /> {article.author || 'EduTools Team'}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><FaCalendarAlt className="text-slate-400" /> {dateStr}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
            <Link to={`/article/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {article.excerpt || article.content?.substring(0, 140) + '...'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/article/${article.slug}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 group-hover:text-purple-600 transition-colors"
        >
          <span>Read Article</span>
          <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
