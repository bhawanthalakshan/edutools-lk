import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowRight, FaFilePdf, FaBookReader } from 'react-icons/fa';
import { SITE_CONFIG } from '../config/siteConfig';
import { useCountUp } from '../hooks/useCountUp';

const StatCounter = ({ value, label, color, fallback }) => {
  const animatedValue = useCountUp(value || fallback, 1200);

  return (
    <div className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all duration-300">
      <div className={`text-2xl sm:text-3xl font-extrabold ${color}`}>
        {animatedValue.toLocaleString()}+
      </div>
      <div className="text-xs text-slate-400 font-medium mt-1">{label}</div>
    </div>
  );
};

const HeroSection = ({ stats }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickSearchTags = [
    { label: 'Mathematics', path: '/past-papers/ol/mathematics' },
    { label: 'Physics', path: '/past-papers/al/physics' },
    { label: 'ICT', path: '/past-papers/al/ict' },
    { label: 'Chemistry', path: '/past-papers/al/chemistry' },
    { label: 'Biology', path: '/past-papers/al/biology' },
    { label: 'Accounting', path: '/past-papers/al/accounting' },
    { label: 'O/L Papers', path: '/past-papers/ol' },
    { label: 'A/L Papers', path: '/past-papers/al' },
  ];

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white rounded-3xl shadow-2xl mb-12">
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Top Header Badge */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md animate-fade-in-down">
            <FaFilePdf className="text-blue-400" />
            <span>Sri Lanka's Dedicated Past Papers Library</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight animate-fade-in-up delay-100">
            Sri Lankan Past Papers,{' '}
            <span className="text-gradient-shimmer">
              All in One Place.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-150">
            {SITE_CONFIG.heroSubtitle}
          </p>
        </div>

        {/* Prominent Search Bar with Focus Glow */}
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in-up delay-200">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center group">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects, years, papers (e.g. Mathematics, 2025 O/L)..."
                className="w-full pl-12 pr-36 py-4 sm:py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-sm sm:text-base text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-xl"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-blue-400 transition-colors" />
            </div>

            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 btn-press"
            >
              <span>Search</span>
              <FaArrowRight className="text-xs hidden sm:inline group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Popular Searches:</span>
            {quickSearchTags.map((tag) => (
              <Link
                key={tag.label}
                to={tag.path}
                className="px-3 py-1 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/40 text-slate-300 hover:text-blue-300 rounded-lg text-xs transition-all hover:-translate-y-0.5"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Primary & Secondary Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-fade-in-up delay-250">
          <Link
            to="/past-papers"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 text-sm hover:scale-[1.02] btn-press group"
          >
            <FaFilePdf className="text-base" />
            <span>Browse Past Papers</span>
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/past-papers/ol"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-extrabold border border-white/20 rounded-2xl backdrop-blur-md transition-all flex items-center justify-center gap-2 text-sm btn-press"
          >
            <FaBookReader className="text-blue-400" />
            <span>Explore O/L Papers</span>
          </Link>
        </div>

        {/* Aggregate Stats Summary with Animated Count-Up */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10 text-center max-w-4xl mx-auto animate-fade-in-up delay-300">
          <StatCounter value={stats?.totalPapers} fallback={100} label="Past Papers" color="text-blue-400" />
          <StatCounter value={(stats?.olSubjectsCount || 8) + (stats?.alSubjectsCount || 11)} fallback={19} label="Exam Subjects" color="text-indigo-400" />
          <StatCounter value={stats?.universityCount} fallback={5} label="Universities" color="text-purple-400" />
          <StatCounter value={stats?.totalDownloads} fallback={1000} label="Downloads Serviced" color="text-emerald-400" />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
