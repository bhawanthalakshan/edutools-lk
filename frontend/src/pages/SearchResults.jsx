import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaBookOpen, FaTools, FaFolder, FaFilePdf, FaArrowRight } from 'react-icons/fa';
import Seo from '../components/Seo';
import ArticleCard from '../components/ArticleCard';
import PastPaperCard from '../components/PastPaperCard';
import { getArticles } from '../services/articleService';
import { getTools } from '../services/toolService';
import { getCategories } from '../services/categoryService';
import { getPastPapers } from '../services/pastPaperService';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [articles, setArticles] = useState([]);
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pastPapers, setPastPapers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Parallel fetch for articles, tools, categories, and past papers
    Promise.all([
      getArticles({ search: query, limit: 12 }).catch(() => ({ data: [] })),
      getTools().catch(() => ({ data: [] })),
      getCategories().catch(() => ({ data: [] })),
      getPastPapers({ search: query, limit: 12 }).catch(() => ({ data: [] })),
    ])
      .then(([artRes, toolRes, catRes, paperRes]) => {
        setArticles(artRes.data || []);
        setPastPapers(paperRes.data || []);

        const qLower = query.toLowerCase();
        const matchedTools = (toolRes.data || []).filter(
          (t) => t.name?.toLowerCase().includes(qLower) || t.description?.toLowerCase().includes(qLower)
        );
        setTools(matchedTools);

        const matchedCats = (catRes.data || []).filter(
          (c) => c.name?.toLowerCase().includes(qLower) || c.description?.toLowerCase().includes(qLower)
        );
        setCategories(matchedCats);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [query]);

  const totalResults = articles.length + tools.length + categories.length + pastPapers.length;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Seo
        title={`Search results for "${query}"`}
        description={`Search results for ${query} across past papers, tools, articles, and educational resources on EduTools LK.`}
      />

      {/* Header Banner */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
          <FaSearch className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Search Results for <span className="text-blue-600">"{query}"</span>
          </h1>
          <p className="text-sm text-slate-500">
            Found {totalResults} total result{totalResults === 1 ? '' : 's'} across EduTools LK.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Results ({totalResults})
        </button>

        <button
          onClick={() => setActiveTab('past-papers')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'past-papers'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Past Papers ({pastPapers.length})
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'articles'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Articles ({articles.length})
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'tools'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tools ({tools.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'categories'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {/* Content Results */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm animate-pulse">
          Searching platform database...
        </div>
      ) : totalResults > 0 ? (
        <div className="space-y-12">
          
          {/* Past Papers Section */}
          {(activeTab === 'all' || activeTab === 'past-papers') && pastPapers.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FaFilePdf className="text-rose-600" />
                <span>Matching Past Papers & Exam PDFs ({pastPapers.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pastPapers.map((paper) => (
                  <PastPaperCard key={paper._id} paper={paper} />
                ))}
              </div>
            </section>
          )}

          {/* Tools Section */}
          {(activeTab === 'all' || activeTab === 'tools') && tools.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FaTools className="text-blue-600" />
                <span>Matching Online Tools ({tools.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tools.map((t) => (
                  <Link
                    key={t._id}
                    to={`/tools/${t.slug}`}
                    className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 gap-1">
                      <span>Open Tool</span>
                      <FaArrowRight className="text-[10px]" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Articles Section */}
          {(activeTab === 'all' || activeTab === 'articles') && articles.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FaBookOpen className="text-indigo-600" />
                <span>Matching Articles & Guides ({articles.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((art) => (
                  <ArticleCard key={art._id} article={art} />
                ))}
              </div>
            </section>
          )}

          {/* Categories Section */}
          {(activeTab === 'all' || activeTab === 'categories') && categories.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FaFolder className="text-purple-600" />
                <span>Matching Resource Categories ({categories.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((c) => (
                  <Link
                    key={c._id}
                    to={`/education/${c.slug}`}
                    className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-purple-300 transition-all group"
                  >
                    <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                      {c.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-purple-600 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      ) : (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <h2 className="text-xl font-bold text-slate-800">No results found for "{query}"</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try checking for spelling errors or searching for broader terms like "Mathematics", "A/L", or "Physics".
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
