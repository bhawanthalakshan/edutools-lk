import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaTag, FaArrowLeft, FaBookOpen, FaShareAlt } from 'react-icons/fa';
import Seo from '../components/Seo';
import ArticleCard from '../components/ArticleCard';
import AdPlaceholder from '../components/AdPlaceholder';
import { getArticleBySlug, getArticles } from '../services/articleService';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getArticleBySlug(slug)
      .then((res) => {
        const art = res.data;
        setArticle(art);

        // Fetch related articles from same category
        if (art && art.category) {
          const categorySlug = art.category.slug || art.category;
          getArticles({ category: categorySlug, limit: 3 })
            .then((relRes) => {
              const filtered = (relRes.data || []).filter((a) => a._id !== art._id);
              setRelatedArticles(filtered.slice(0, 3));
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Article not found or failed to load.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-sm animate-pulse">
        Loading article reader...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-16 max-w-xl mx-auto text-center space-y-4 px-4">
        <h1 className="text-2xl font-bold text-slate-900">Article Not Found</h1>
        <p className="text-xs text-slate-500">{error || 'The requested article could not be located.'}</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          <FaArrowLeft /> Return to Blog
        </Link>
      </div>
    );
  }

  const categoryName = article.category?.name || 'General';
  const categorySlug = article.category?.slug || '';
  const dateStr = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <article className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Seo
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.excerpt}
      />

      {/* Back Link */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <FaArrowLeft className="text-[10px]" /> Back to Blog & Articles
      </Link>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/education/${categorySlug}`}
            className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold uppercase tracking-wider"
          >
            {categoryName}
          </Link>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
          {article.title}
        </h1>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-y border-slate-200/80 py-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <FaUser className="text-blue-600" />
            <span>{article.author || 'EduTools LK Team'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt className="text-slate-400" />
            <span>{dateStr}</span>
          </div>
        </div>

        {/* Ad Placement Below Article Title */}
        <AdPlaceholder type="banner" />
      </header>

      {/* Featured Banner / Image */}
      {article.featuredImage ? (
        <div className="rounded-3xl overflow-hidden shadow-lg max-h-96">
          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-64 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-blue-200 font-semibold">
            <span>{categoryName}</span>
            <span>{dateStr}</span>
          </div>
          <div className="text-white/20 text-8xl self-end">
            <FaBookOpen />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
        {article.excerpt && (
          <p className="text-lg text-slate-900 font-semibold italic border-l-4 border-blue-600 pl-4 py-1">
            "{article.excerpt}"
          </p>
        )}

        <div className="space-y-4 whitespace-pre-line text-slate-800">
          {article.content}
        </div>

        {/* Ad Placement Mid-Article */}
        <AdPlaceholder type="inline" />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
              <FaTag /> Tags:
            </span>
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel._id} article={rel} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default ArticleDetail;
