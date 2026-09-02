import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Context & Route Guard
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import MainLayout from './layouts/MainLayout';

// Core Synchronous Pages
import Home from './pages/Home';
import Education from './pages/Education';
import Tools from './pages/Tools';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';

// Lazy-Loaded Education Pages
const EducationStream = lazy(() => import('./pages/education/EducationStream'));
const SubjectDetail = lazy(() => import('./pages/education/SubjectDetail'));

// Lazy-Loaded Hierarchical Past Papers Pages
const PastPapersHub = lazy(() => import('./pages/past-papers/PastPapersHub'));
const OLPapersPage = lazy(() => import('./pages/past-papers/OLPapersPage'));
const OLSubjectPage = lazy(() => import('./pages/past-papers/OLSubjectPage'));
const ALPapersPage = lazy(() => import('./pages/past-papers/ALPapersPage'));
const ALSubjectPage = lazy(() => import('./pages/past-papers/ALSubjectPage'));
const UniversityPapersPage = lazy(() => import('./pages/past-papers/UniversityPapersPage'));
const UniversityDetailPage = lazy(() => import('./pages/past-papers/UniversityDetailPage'));
const PastPaperDetail = lazy(() => import('./pages/past-papers/PastPaperDetail'));

// Lazy-Loaded Article, Search & Info Pages
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));

// Lazy-Loaded Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPastPapers = lazy(() => import('./pages/admin/AdminPastPapers'));
const AdminContactMessages = lazy(() => import('./pages/admin/AdminContactMessages'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Lazy-Loaded Tool Pages
const GpaCalculator = lazy(() => import('./pages/tools/GpaCalculator'));
const CgpaCalculator = lazy(() => import('./pages/tools/CgpaCalculator'));
const PercentageCalculator = lazy(() => import('./pages/tools/PercentageCalculator'));
const AgeCalculator = lazy(() => import('./pages/tools/AgeCalculator'));
const WordCounter = lazy(() => import('./pages/tools/WordCounter'));
const QrCodeGenerator = lazy(() => import('./pages/tools/QrCodeGenerator'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 space-y-3">
    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-xs font-semibold text-slate-500">Loading EduTools LK...</span>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              
              {/* Education Routes */}
              <Route path="education" element={<Education />} />
              <Route path="education/:streamKey" element={<EducationStream />} />
              <Route path="education/:level/:subjectKey" element={<SubjectDetail />} />

              {/* Past Papers Hierarchical Routes */}
              <Route path="past-papers" element={<PastPapersHub />} />
              
              {/* O/L Browsing Routes */}
              <Route path="past-papers/ol" element={<OLPapersPage />} />
              <Route path="past-papers/ol/:subjectSlug" element={<OLSubjectPage />} />

              {/* A/L Browsing Routes */}
              <Route path="past-papers/al" element={<ALPapersPage />} />
              <Route path="past-papers/al/:subjectSlug" element={<ALSubjectPage />} />

              {/* University Browsing Routes */}
              <Route path="past-papers/university" element={<UniversityPapersPage />} />
              <Route path="past-papers/university/:uniSlug" element={<UniversityDetailPage />} />
              <Route path="past-papers/university/:uniSlug/:courseSlug" element={<UniversityDetailPage />} />
              <Route path="past-papers/university/:uniSlug/:courseSlug/:moduleSlug" element={<UniversityDetailPage />} />

              {/* Individual Paper Detail Pages */}
              <Route path="past-papers/detail/:slug" element={<PastPaperDetail />} />
              <Route path="past-papers/:slug" element={<PastPaperDetail />} />

              {/* Tools Routes */}
              <Route path="tools" element={<Tools />} />
              <Route path="tools/gpa-calculator" element={<GpaCalculator />} />
              <Route path="tools/cgpa-calculator" element={<CgpaCalculator />} />
              <Route path="tools/percentage-calculator" element={<PercentageCalculator />} />
              <Route path="tools/age-calculator" element={<AgeCalculator />} />
              <Route path="tools/word-counter" element={<WordCounter />} />
              <Route path="tools/qr-code-generator" element={<QrCodeGenerator />} />

              {/* Blog & Article Reader Routes */}
              <Route path="blog" element={<Blog />} />
              <Route path="article/:slug" element={<ArticleDetail />} />

              {/* Search Route */}
              <Route path="search" element={<SearchResults />} />

              {/* Info & Legal Routes */}
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-conditions" element={<TermsConditions />} />
              <Route path="disclaimer" element={<Disclaimer />} />

              {/* Admin Routes */}
              <Route path="admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute />}>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/articles" element={<AdminDashboard />} />
                <Route path="admin/categories" element={<AdminDashboard />} />
                <Route path="admin/tools" element={<AdminDashboard />} />
                <Route path="admin/past-papers" element={<AdminPastPapers />} />
                <Route path="admin/contact-messages" element={<AdminContactMessages />} />
                <Route path="admin/settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
