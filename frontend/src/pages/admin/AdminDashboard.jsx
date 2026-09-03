import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBookOpen, 
  FaFolder, 
  FaTools, 
  FaFilePdf,
  FaDownload,
  FaCheckCircle,
  FaEyeSlash,
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSignOutAlt, 
  FaTimes, 
  FaSave,
  FaSync,
  FaEnvelope,
  FaCogs
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('articles');

  // Dashboard Stat Counters
  const [stats, setStats] = useState({
    articlesCount: 0,
    categoriesCount: 0,
    toolsCount: 0,
    pastPapersCount: 0,
    publishedPapersCount: 0,
    draftPapersCount: 0,
    totalDownloadsCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Entities Data
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tools, setTools] = useState([]);
  const [pastPapers, setPastPapers] = useState([]);

  // Modals & Forms State
  const [modalType, setModalType] = useState(null); // 'article', 'category', 'tool', or null
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form Fields State
  const [articleForm, setArticleForm] = useState({ title: '', slug: '', excerpt: '', content: '', category: '', tags: '', status: 'published' });
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '', type: 'general' });
  const [toolForm, setToolForm] = useState({ name: '', slug: '', description: '', category: '', status: 'active' });

  // Fetch Dashboard Metrics & Data
  const fetchDashboardData = async () => {
    setLoadingStats(true);
    try {
      const [artRes, catRes, toolRes, paperRes] = await Promise.all([
        api.get('/articles?all=true&limit=100').catch(() => ({ data: { data: [] } })),
        api.get('/categories').catch(() => ({ data: { data: [] } })),
        api.get('/tools?all=true').catch(() => ({ data: { data: [] } })),
        api.get('/past-papers?all=true&limit=200').catch(() => ({ data: { data: [] } })),
      ]);

      const arts = artRes.data?.data || [];
      const cats = catRes.data?.data || [];
      const tls = toolRes.data?.data || [];
      const papers = paperRes.data?.data || [];

      const publishedCount = papers.filter((p) => p.status === 'published').length;
      const draftCount = papers.filter((p) => p.status === 'draft').length;
      const downloadsSum = papers.reduce((sum, p) => sum + (p.downloadCount || 0), 0);

      setArticles(arts);
      setCategories(cats);
      setTools(tls);
      setPastPapers(papers);

      setStats({
        articlesCount: artRes.data?.pagination?.totalArticles || arts.length,
        categoriesCount: cats.length,
        toolsCount: tls.length,
        pastPapersCount: papers.length,
        publishedPapersCount: publishedCount,
        draftPapersCount: draftCount,
        totalDownloadsCount: downloadsSum,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Modal Handlers
  const openCreateModal = (type) => {
    setModalType(type);
    setEditingItem(null);
    setFormError('');
    setFormSuccess('');

    if (type === 'article') {
      setArticleForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: categories[0]?._id || '',
        tags: '',
        status: 'published',
      });
    } else if (type === 'category') {
      setCategoryForm({ name: '', slug: '', description: '', type: 'general' });
    } else if (type === 'tool') {
      setToolForm({ name: '', slug: '', description: '', category: categories[0]?._id || '', status: 'active' });
    }
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setFormError('');
    setFormSuccess('');

    if (type === 'article') {
      setArticleForm({
        title: item.title || '',
        slug: item.slug || '',
        excerpt: item.excerpt || '',
        content: item.content || '',
        category: item.category?._id || item.category || '',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
        status: item.status || 'published',
      });
    } else if (type === 'category') {
      setCategoryForm({
        name: item.name || '',
        slug: item.slug || '',
        description: item.description || '',
        type: item.type || 'general',
      });
    } else if (type === 'tool') {
      setToolForm({
        name: item.name || '',
        slug: item.slug || '',
        description: item.description || '',
        category: item.category?._id || item.category || '',
        status: item.status || 'active',
      });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
  };

  const handleTitleToSlug = (title, formType) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (formType === 'article') setArticleForm((prev) => ({ ...prev, title, slug }));
    if (formType === 'category') setCategoryForm((prev) => ({ ...prev, name: title, slug }));
    if (formType === 'tool') setToolForm((prev) => ({ ...prev, name: title, slug }));
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingItem) {
        await api.put(`/articles/${editingItem._id}`, articleForm);
        setFormSuccess('Article updated successfully!');
      } else {
        await api.post('/articles', articleForm);
        setFormSuccess('Article created successfully!');
      }
      fetchDashboardData();
      setTimeout(closeModal, 1200);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save article.');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingItem) {
        await api.put(`/categories/${editingItem._id}`, categoryForm);
        setFormSuccess('Category updated successfully!');
      } else {
        await api.post('/categories', categoryForm);
        setFormSuccess('Category created successfully!');
      }
      fetchDashboardData();
      setTimeout(closeModal, 1200);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save category.');
    }
  };

  const handleSaveTool = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingItem) {
        await api.put(`/tools/${editingItem._id}`, toolForm);
        setFormSuccess('Tool updated successfully!');
      } else {
        await api.post('/tools', toolForm);
        setFormSuccess('Tool created successfully!');
      }
      fetchDashboardData();
      setTimeout(closeModal, 1200);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save tool.');
    }
  };

  const handleToggleArticleStatus = async (id) => {
    try {
      await api.patch(`/articles/${id}/status`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      if (type === 'article') await api.delete(`/articles/${id}`);
      if (type === 'category') await api.delete(`/categories/${id}`);
      if (type === 'tool') await api.delete(`/tools/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Seo title="Admin Control Center" description="Control panel for managing EduTools LK content and platform assets." />

      {/* Admin Top Header & Navigation Links */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
              Examora Admin Portal
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              Welcome back, {user?.name || 'Administrator'}
            </h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Refresh Stats"
            >
              <FaSync className={loadingStats ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={logout}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-rose-200 transition-colors"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>

        {/* Quick Admin Section Links Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
          <Link
            to="/admin/dashboard"
            className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/past-papers"
            className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors border border-rose-200"
          >
            Past Papers System
          </Link>
          <Link
            to="/admin/contact-messages"
            className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Contact Messages
          </Link>
          <Link
            to="/admin/settings"
            className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            System Settings
          </Link>
        </div>
      </div>

      {/* 7 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Past Papers */}
        <div className="p-5 bg-gradient-to-br from-rose-600 to-red-700 text-white rounded-3xl shadow-md space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-200">Total Past Papers</span>
            <FaFilePdf className="text-lg text-rose-200" />
          </div>
          <div className="text-3xl font-black">{stats.pastPapersCount}</div>
          <p className="text-[10px] text-rose-200">
            {stats.publishedPapersCount} Published • {stats.draftPapersCount} Drafts
          </p>
        </div>

        {/* Card 2: Downloads */}
        <div className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl shadow-md space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Total Downloads</span>
            <FaDownload className="text-lg text-emerald-200" />
          </div>
          <div className="text-3xl font-black">{stats.totalDownloadsCount}</div>
          <p className="text-[10px] text-emerald-200">PDF document downloads</p>
        </div>

        {/* Card 3: Articles */}
        <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-md space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Total Articles</span>
            <FaBookOpen className="text-lg text-blue-200" />
          </div>
          <div className="text-3xl font-black">{stats.articlesCount}</div>
          <p className="text-[10px] text-blue-200">Published guides & posts</p>
        </div>

        {/* Card 4: Categories & Tools */}
        <div className="p-5 bg-gradient-to-br from-purple-600 to-violet-700 text-white rounded-3xl shadow-md space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">Tools & Categories</span>
            <FaTools className="text-lg text-purple-200" />
          </div>
          <div className="text-3xl font-black">{stats.toolsCount + stats.categoriesCount}</div>
          <p className="text-[10px] text-purple-200">{stats.toolsCount} Tools • {stats.categoriesCount} Categories</p>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'articles'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaBookOpen /> Manage Articles ({articles.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'categories'
                ? 'bg-white text-purple-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaFolder /> Manage Categories ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'tools'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaTools /> Manage Tools ({tools.length})
          </button>
        </div>

        {/* Tab 1: Articles */}
        {activeTab === 'articles' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Articles Management</h2>
              <button
                onClick={() => openCreateModal('article')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <FaPlus /> Create New Article
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.map((art) => (
                    <tr key={art._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{art.title}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                          {art.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{art.author || 'EduTools Team'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleArticleStatus(art._id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
                          title="Publish / Unpublish"
                        >
                          {art.status === 'published' ? <FaEyeSlash className="text-amber-600 inline" /> : <FaCheckCircle className="text-emerald-600 inline" />}
                        </button>
                        <button
                          onClick={() => openEditModal('article', art)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-semibold transition-colors"
                        >
                          <FaEdit className="inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('article', art._id)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-semibold transition-colors"
                        >
                          <FaTrash className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Categories */}
        {activeTab === 'categories' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Categories Management</h2>
              <button
                onClick={() => openCreateModal('category')}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <FaPlus /> Create New Category
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{cat.name}</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{cat.slug}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-600 rounded-md font-bold">
                          {cat.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{cat.description}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal('category', cat)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-semibold transition-colors"
                        >
                          <FaEdit className="inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('category', cat._id)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-semibold transition-colors"
                        >
                          <FaTrash className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Tools */}
        {activeTab === 'tools' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Tools Management</h2>
              <button
                onClick={() => openCreateModal('tool')}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <FaPlus /> Create New Tool
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Tool Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tools.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{t.name}</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{t.slug}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-md font-bold">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal('tool', t)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-semibold transition-colors"
                        >
                          <FaEdit className="inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('tool', t._id)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-semibold transition-colors"
                        >
                          <FaTrash className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* CRUD Form Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-modal-backdrop">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900 capitalize">
                {editingItem ? `Edit ${modalType}` : `Create New ${modalType}`}
              </h3>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
                <FaTimes className="text-base" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
                {formSuccess}
              </div>
            )}

            {/* Article Form */}
            {modalType === 'article' && (
              <form onSubmit={handleSaveArticle} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) => handleTitleToSlug(e.target.value, 'article')}
                    placeholder="Article title"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={articleForm.slug}
                    onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={articleForm.category}
                      onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={articleForm.status}
                      onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Excerpt</label>
                  <input
                    type="text"
                    value={articleForm.excerpt}
                    onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                    placeholder="Short summary excerpt"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Content</label>
                  <textarea
                    rows="5"
                    required
                    value={articleForm.content}
                    onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                    placeholder="Full article content text..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <FaSave /> Save Article
                  </button>
                </div>
              </form>
            )}

            {/* Category Form */}
            {modalType === 'category' && (
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => handleTitleToSlug(e.target.value, 'category')}
                    placeholder="Category name"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={categoryForm.type}
                    onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  >
                    <option value="education">education</option>
                    <option value="tool">tool</option>
                    <option value="ai">ai</option>
                    <option value="general">general</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Short description"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <FaSave /> Save Category
                  </button>
                </div>
              </form>
            )}

            {/* Tool Form */}
            {modalType === 'tool' && (
              <form onSubmit={handleSaveTool} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tool Name</label>
                  <input
                    type="text"
                    required
                    value={toolForm.name}
                    onChange={(e) => handleTitleToSlug(e.target.value, 'tool')}
                    placeholder="Tool name"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={toolForm.slug}
                    onChange={(e) => setToolForm({ ...toolForm, slug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={toolForm.description}
                    onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                    placeholder="Tool description"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <FaSave /> Save Tool
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
