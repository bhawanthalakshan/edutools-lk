import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import { createContentReport } from '../services/interactionService';

const ReportProblemModal = ({ isOpen, onClose, paper }) => {
  const [reason, setReason] = useState('Wrong paper');
  const [details, setDetails] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !paper) return null;

  const reasons = [
    'Wrong paper',
    'Wrong year',
    'Wrong subject',
    'Wrong medium',
    'Broken PDF',
    'Duplicate',
    'Incorrect metadata',
    'Copyright concern',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await createContentReport({
        paperId: paper._id,
        paperTitle: paper.title,
        reason,
        details,
        userEmail,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-modal-backdrop">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-scale-up">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-rose-600">
            <FaExclamationTriangle className="text-xl" />
            <h3 className="text-lg font-bold text-slate-900">Report a Problem</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <FaTimes />
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-3">
            <FaCheckCircle className="text-4xl text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-extrabold text-slate-900">Report Received!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Thank you for letting us know! Our moderation team will inspect this past paper file.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <span className="text-slate-500 font-semibold block mb-1">Target Document:</span>
              <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-200/80 truncate">
                {paper.title}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Problem Reason *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-rose-500"
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Problem Details (Optional)</label>
              <textarea
                rows="3"
                placeholder="Explain what is wrong with this paper or PDF link..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-rose-500"
              ></textarea>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Email (Optional)</label>
              <input
                type="email"
                placeholder="If you would like a resolution follow-up"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold btn-press"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md btn-press ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <FaPaperPlane /> {submitting ? 'Sending Report...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ReportProblemModal;
