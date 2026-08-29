import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl mb-4 border border-amber-200">
        <FaExclamationTriangle className="text-4xl" />
      </div>
      <h1 className="text-6xl font-black text-slate-900">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-slate-500 max-w-md mt-2 text-sm">
        The page you requested does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-2xl transition-colors shadow-md"
      >
        <FaHome /> Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
