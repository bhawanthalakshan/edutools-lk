import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaFilePdf } from 'react-icons/fa';
import Seo from '../components/Seo';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <Seo title="404 Page Not Found" description="The page you requested could not be found on Examora." />
      <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl mb-4 border border-amber-200">
        <FaExclamationTriangle className="text-4xl" />
      </div>
      <h1 className="text-6xl font-black text-slate-900">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-slate-500 max-w-md mt-2 text-xs leading-relaxed">
        The page or past paper route you requested does not exist or may have been updated.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-colors shadow-md"
        >
          <FaHome /> Return to Home
        </Link>
        <Link
          to="/past-papers"
          className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition-colors shadow-md"
        >
          <FaFilePdf /> Browse Past Papers
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
