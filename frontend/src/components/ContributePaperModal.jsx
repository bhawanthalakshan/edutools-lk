import React, { useState } from 'react';
import { FaTimes, FaCloudUploadAlt, FaCheckCircle, FaFilePdf } from 'react-icons/fa';
import { submitPaperContribution } from '../services/interactionService';

const ContributePaperModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    examType: 'OL',
    subject: '',
    year: new Date().getFullYear(),
    medium: 'Sinhala',
    paperType: 'Past Paper',
    notes: '',
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF document files are allowed.');
        setPdfFile(null);
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setError('PDF file size must be less than 25 MB.');
        setPdfFile(null);
        return;
      }
      setError('');
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      setError('Please select a PDF document file to upload.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', pdfFile);
      uploadData.append('name', formData.name);
      uploadData.append('email', formData.email);
      uploadData.append('examType', formData.examType);
      uploadData.append('subject', formData.subject);
      uploadData.append('year', formData.year);
      uploadData.append('medium', formData.medium);
      uploadData.append('paperType', formData.paperType);
      uploadData.append('notes', formData.notes);

      await submitPaperContribution(uploadData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-modal-backdrop">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <FaCloudUploadAlt className="text-2xl" />
            <h3 className="text-lg font-bold text-slate-900">Have a Paper We're Missing?</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <FaTimes />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <FaCheckCircle className="text-4xl text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-extrabold text-slate-900">Contribution Uploaded!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Thank you for contributing! Your document has entered pending review. Once verified by admins, it will be published to Examora.
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
                <label className="block font-semibold text-slate-700 mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Nimal Perera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="For credit & confirmation"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exam Level *</label>
                <select
                  value={formData.examType}
                  onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                  className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="OL">G.C.E. O/L</option>
                  <option value="AL">G.C.E. A/L</option>
                  <option value="UNIVERSITY">University</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Year *</label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medium *</label>
                <select
                  value={formData.medium}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
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
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Past Paper">Past Paper</option>
                  <option value="Marking Scheme">Marking Scheme</option>
                  <option value="Model Paper">Model Paper</option>
                  <option value="Revision Paper">Revision Paper</option>
                </select>
              </div>
            </div>

            {/* PDF Upload File Input */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Upload PDF File *</label>
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors text-center space-y-2 relative cursor-pointer">
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FaFilePdf className="text-3xl text-rose-500 mx-auto" />
                {pdfFile ? (
                  <div className="font-bold text-slate-900">
                    {pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                ) : (
                  <div className="text-slate-500">
                    <span className="font-bold text-indigo-600">Click to select PDF</span> or drag and drop file here (Max 25 MB)
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contribution Notes (Optional)</label>
              <input
                type="text"
                placeholder="Teacher name, school, or source attribution..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
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
                className={`px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md btn-press ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <FaCloudUploadAlt /> {submitting ? 'Uploading to Review...' : 'Submit Contribution'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ContributePaperModal;
