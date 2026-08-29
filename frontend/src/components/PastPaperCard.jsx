import React from 'react';
import { Link } from 'react-router-dom';
import { FaFilePdf, FaDownload, FaCalendarAlt, FaLanguage, FaFileAlt } from 'react-icons/fa';
import { triggerPastPaperDownload } from '../services/pastPaperService';

// Format bytes into human-readable size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return 'PDF Document';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const PastPaperCard = ({ paper }) => {
  if (!paper) return null;

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    triggerPastPaperDownload(paper._id);
  };

  const getExamBadgeColor = (type) => {
    switch (type) {
      case 'OL':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'AL':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'UNIVERSITY':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group space-y-4">
      
      {/* Top Header Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 shrink-0">
            <FaFilePdf className="text-2xl" />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getExamBadgeColor(paper.examType)}`}>
              {paper.examType}
            </span>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-semibold">
              {paper.medium} Medium
            </span>
          </div>
        </div>

        {/* Paper Title */}
        <Link to={`/past-papers/${paper.slug}`} className="block">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {paper.title}
          </h3>
        </Link>
      </div>

      {/* Meta Specifications */}
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 py-2 border-y border-slate-100">
        <div className="flex items-center gap-1.5">
          <FaFileAlt className="text-slate-400 text-[11px]" />
          <span className="truncate">{paper.subject}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <FaCalendarAlt className="text-slate-400 text-[11px]" />
          <span>{paper.year}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FaLanguage className="text-slate-400 text-[11px]" />
          <span className="truncate">{paper.paperType}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end font-medium text-slate-600">
          <span>{formatFileSize(paper.fileSize)}</span>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <Link
          to={`/past-papers/${paper.slug}`}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          View Details
        </Link>

        <button
          onClick={handleDownload}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <FaDownload className="text-xs" />
          <span>Download PDF</span>
        </button>
      </div>

    </div>
  );
};

export default PastPaperCard;
