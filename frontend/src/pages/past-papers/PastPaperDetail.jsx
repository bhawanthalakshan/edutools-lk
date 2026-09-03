import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaFilePdf, 
  FaDownload, 
  FaArrowLeft, 
  FaArrowRight, 
  FaCalendarAlt, 
  FaLanguage, 
  FaFileAlt, 
  FaEye, 
  FaShieldAlt, 
  FaCheck, 
  FaExclamationTriangle, 
  FaExternalLinkAlt,
  FaCheckCircle,
  FaBookOpen
} from 'react-icons/fa';
import Seo from '../../components/Seo';
import Breadcrumbs from '../../components/Breadcrumbs';
import PastPaperCard from '../../components/PastPaperCard';
import AdPlaceholder from '../../components/AdPlaceholder';
import ReportProblemModal from '../../components/ReportProblemModal';
import { getPastPaperBySlug, triggerPastPaperDownload } from '../../services/pastPaperService';
import { SITE_CONFIG } from '../../config/siteConfig';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return 'PDF Document';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const PastPaperDetail = () => {
  const { slug } = useParams();
  const [paper, setPaper] = useState(null);
  const [relatedPapers, setRelatedPapers] = useState([]);
  const [previousPaper, setPreviousPaper] = useState(null);
  const [nextPaper, setNextPaper] = useState(null);
  const [linkedScheme, setLinkedScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getPastPaperBySlug(slug)
      .then((res) => {
        const item = res.data;
        setPaper(item);
        if (res.related) setRelatedPapers(res.related);
        if (res.previousPaper) setPreviousPaper(res.previousPaper);
        if (res.nextPaper) setNextPaper(res.nextPaper);
        if (res.linkedScheme) setLinkedScheme(res.linkedScheme);
      })
      .catch((err) => {
        console.error(err);
        setError('Past paper document not found or failed to load.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-sm animate-pulse space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <span>Loading document details...</span>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="py-16 max-w-xl mx-auto text-center space-y-4 px-4 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-slate-900">Document Not Found</h1>
        <p className="text-xs text-slate-500">{error || 'The requested past paper could not be located.'}</p>
        <Link
          to="/past-papers"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold btn-press"
        >
          <FaArrowLeft /> Return to Past Papers Directory
        </Link>
      </div>
    );
  }

  const handleDownloadClick = () => {
    triggerPastPaperDownload(paper._id);
    setDownloaded(true);
    setPaper((prev) => ({ ...prev, downloadCount: prev.downloadCount + 1 }));
    setTimeout(() => setDownloaded(false), 3000);
  };

  const levelPath = paper.examType === 'OL' ? '/past-papers/ol' : paper.examType === 'AL' ? '/past-papers/al' : '/past-papers/university';

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in-up">
      <Seo
        title={`${paper.title} PDF Download`}
        description={`Download the ${paper.year} ${paper.examType} ${paper.subject} ${paper.paperType} PDF in ${paper.medium} medium from ${SITE_CONFIG.name}.`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'DigitalDocument',
          name: paper.title,
          description: paper.description || `${paper.title} PDF Document`,
          encodingFormat: 'application/pdf',
          fileFormat: 'application/pdf',
          url: paper.fileUrl,
        }}
      />

      <Breadcrumbs
        items={[
          { label: 'Past Papers', url: '/past-papers' },
          { label: `${paper.examType} Papers`, url: levelPath },
          { label: paper.title },
        ]}
      />

      {/* Main Document Detail Card */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-md space-y-8 animate-scale-up">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex gap-4">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 shrink-0 self-start">
              <FaFilePdf className="text-4xl" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {paper.examType}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                  {paper.medium} Medium
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold">
                  {paper.paperType}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1">
                  <FaCheckCircle className="text-emerald-500" />
                  {paper.verificationStatus || 'Verified Official'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {paper.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Action & Download Section */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-700">Official Document Download</span>
            <p className="text-xs text-slate-500 mt-0.5">Format: PDF Document • {formatFileSize(paper.fileSize)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {linkedScheme && (
              <Link
                to={`/past-papers/${linkedScheme.slug}`}
                className="px-5 py-3.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all btn-press shrink-0"
              >
                <FaBookOpen /> View {linkedScheme.paperType === 'Marking Scheme' ? 'Marking Scheme' : 'Question Paper'}
              </Link>
            )}

            <button
              onClick={handleDownloadClick}
              className={`px-7 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all shrink-0 btn-press ${
                downloaded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
              }`}
            >
              {downloaded ? (
                <>
                  <FaCheck className="text-sm" /> Downloaded
                </>
              ) : (
                <>
                  <FaDownload className="text-sm" /> Download PDF File
                </>
              )}
            </button>
          </div>
        </div>

        {/* Previous & Next Year Quick Jump Controls */}
        {(previousPaper || nextPaper) && (
          <div className="flex items-center justify-between gap-4 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            {previousPaper ? (
              <Link
                to={`/past-papers/${previousPaper.slug}`}
                className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-blue-600 transition-colors"
              >
                <FaArrowLeft className="text-[10px]" />
                <span>← {previousPaper.year} Paper</span>
              </Link>
            ) : (
              <span className="text-slate-400">Earliest year in database</span>
            )}

            <span className="text-slate-300">|</span>

            {nextPaper ? (
              <Link
                to={`/past-papers/${nextPaper.slug}`}
                className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-blue-600 transition-colors"
              >
                <span>{nextPaper.year} Paper →</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            ) : (
              <span className="text-slate-400">Latest year available</span>
            )}
          </div>
        )}

        {/* Specification Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 hover:border-slate-200 transition-colors">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <FaFileAlt /> Subject
            </span>
            <p className="font-bold text-slate-900 text-sm truncate">{paper.subject}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 hover:border-slate-200 transition-colors">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <FaCalendarAlt /> Exam Year
            </span>
            <p className="font-bold text-slate-900 text-sm">{paper.year}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 hover:border-slate-200 transition-colors">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <FaLanguage /> Language
            </span>
            <p className="font-bold text-slate-900 text-sm">{paper.medium}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 hover:border-slate-200 transition-colors">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <FaEye /> Downloads
            </span>
            <p className="font-bold text-blue-600 text-sm">{paper.downloadCount} times</p>
          </div>
        </div>

        {/* Description Body */}
        {paper.description && (
          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-900">Document Details</h2>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {paper.description}
            </p>
          </div>
        )}

        {/* Rights, Source & Problem Report Footer Notice */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-500 space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-2">
            <FaShieldAlt className="text-slate-400 text-sm shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-700">Source Attribution:</span>
              <p>
                Uploaded from: <em>{paper.sourceName || paper.source || 'Department of Examinations Sri Lanka'}</em>.
                {paper.sourceUrl && (
                  <a
                    href={paper.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1.5 text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Official Link <FaExternalLinkAlt className="text-[9px]" />
                  </a>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 shrink-0 self-end sm:self-auto btn-press"
          >
            <FaExclamationTriangle /> Report a problem
          </button>
        </div>

      </div>

      <AdPlaceholder type="banner" />

      {/* Related Papers Section */}
      {relatedPapers.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-extrabold text-slate-900">Related Past Papers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPapers.map((rel) => (
              <PastPaperCard key={rel._id} paper={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Report Problem Modal Dialog */}
      <ReportProblemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        paper={paper}
      />

    </div>
  );
};

export default PastPaperDetail;
