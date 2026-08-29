import React, { useEffect, useState } from 'react';
import { FaBookOpen, FaSearch, FaFilter } from 'react-icons/fa';
import Seo from '../components/Seo';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import { getArticles } from '../services/articleService';
import { getCategories } from '../services/categoryService';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch Categories on mount
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  // Fetch Articles when category, search query, or page changes
  useEffect(() => {
    setLoading(true);
    getArticles({
      category: selectedCategory,
      search: searchQuery,
      page: currentPage,
      limit: 6,
    })
      .then((res) => {
        setArticles(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
          setTotalCount(res.pagination.totalArticles || 0);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, currentPage]);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Seo
        title="Blog & Educational Articles"
        description="Read top study guides, exam preparation advice, and AI tool tutorials for students."
      />

      {/* Blog Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-200">
            <FaBookOpen className="text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">EduTools LK Blog</h1>
            <p className="text-sm text-slate-500">Articles, revision guides, and technology insights for learners.</p>
          </div>
        </div>

        {/* Real-time Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search articles by keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-2xs"
          />
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
        </form>
      </div>

      {/* Category Pills Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-2">
          <FaFilter className="text-[10px]" /> Filter:
        </span>

        <button
          onClick={() => handleCategorySelect('')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === ''
              ? 'bg-indigo-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Articles
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategorySelect(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.slug
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Articles Grid / Loading / Empty State */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm animate-pulse">
          Fetching articles...
        </div>
      ) : articles.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      ) : (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <h2 className="text-xl font-bold text-slate-800">No articles matched your criteria</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or category selection to browse available guides.
          </p>
        </div>
      )}
    </div>
  );
};

export default Blog;
