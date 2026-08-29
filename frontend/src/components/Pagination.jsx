import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 pt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
          currentPage === 1
            ? 'text-slate-300 bg-slate-100 cursor-not-allowed'
            : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200'
        }`}
      >
        <FaChevronLeft className="text-[10px]" /> Previous
      </button>

      {/* Page Numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
            currentPage === p
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
          currentPage === totalPages
            ? 'text-slate-300 bg-slate-100 cursor-not-allowed'
            : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200'
        }`}
      >
        Next <FaChevronRight className="text-[10px]" />
      </button>
    </div>
  );
};

export default Pagination;
