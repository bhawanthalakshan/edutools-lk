import React, { useState } from 'react';
import { FaTimes, FaFileSignature, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import { createPaperRequest } from '../services/interactionService';

const RequestPaperModal = ({ isOpen, onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    examType: initialData.examType || 'OL',
    subject: initialData.subject || '',
    year: initialData.year || new Date().getFullYear(),
    medium: initialData.medium || 'Sinhala',
    paperType: initialData.paperType || 'Past Paper',
    university: initialData.university || '',
    course: initialData.course || '',
    module: initialData.module || '',
    email: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await createPaperRequest(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-modal-backdrop">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-blue-600">
            <FaFileSignature className="text-xl" />
            <h3 className="text-lg font-bold text-slate-900">Request a Missing Paper</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <FaTimes />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <FaCheckCircle className="text-4xl text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-extrabold text-slate-900">Request Submitted!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Thank you! Our administrators will locate this past paper and notify you via email when added.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exam Level *</label>
                <select
                  value={formData.examType}
                  onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="OL">G.C.E. O/L</option>
                  <option value="AL">G.C.E. A/L</option>
                  <option value="UNIVERSITY">University</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exam Year *</label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mathematics, Physics, Chemistry..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medium *</label>
                <select
                  value={formData.medium}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="Sinhala">Sinhala Medium</option>
                  <option value="Tamil">Tamil Medium</option>
                  <option value="English">English Medium</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resource Type</label>
                <select
                  value={formData.paperType}
                  onChange={(e) => setFormData({ ...formData, paperType: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="Past Paper">Past Paper</option>
                  <option value="Marking Scheme">Marking Scheme</option>
                  <option value="Model Paper">Model Paper</option>
                  <option value="Revision Paper">Revision Paper</option>
                </select>
              </div>
            </div>

            {formData.examType === 'UNIVERSITY' && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">University</label>
                  <input
                    type="text"
                    placeholder="e.g. KIU"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course</label>
                  <input
                    type="text"
                    placeholder="e.g. BSc SE"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Module</label>
                  <input
                    type="text"
                    placeholder="e.g. Web Tech"
                    value={formData.module}
                    onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Email Address *</label>
              <input
                type="email"
                required
                placeholder="We will notify you when paper is published"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Additional Notes (Optional)</label>
              <textarea
                rows="2"
                placeholder="Mention specific paper part (Paper I, Paper II, MCQ)..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
              ></textarea>
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
                className={`px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md btn-press ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <FaPaperPlane /> {submitting ? 'Submitting...' : 'Submit Paper Request'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default RequestPaperModal;
