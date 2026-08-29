import React, { useState } from 'react';
import { FaCalculator, FaPlus, FaTrash, FaRedo, FaGraduationCap, FaCheckCircle } from 'react-icons/fa';
import RelatedTools from '../../components/RelatedTools';

const GRADE_POINTS = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

const initialSubjects = [
  { id: 1, name: 'Subject 1', credits: 3, grade: 'A' },
  { id: 2, name: 'Subject 2', credits: 4, grade: 'B+' },
  { id: 3, name: 'Subject 3', credits: 3, grade: 'A-' },
];

const GpaCalculator = () => {
  const [subjects, setSubjects] = useState(initialSubjects);

  const handleAddSubject = () => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map((s) => s.id)) + 1 : 1;
    setSubjects([...subjects, { id: newId, name: `Subject ${newId}`, credits: 3, grade: 'A' }]);
  };

  const handleRemoveSubject = (id) => {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleSubjectChange = (id, field, value) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            [field]: field === 'credits' ? Math.max(1, Number(value) || 0) : value,
          };
        }
        return s;
      })
    );
  };

  const handleReset = () => {
    setSubjects(initialSubjects);
  };

  // Calculate Weighted GPA
  const totalCredits = subjects.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);
  const totalGradePoints = subjects.reduce((sum, s) => {
    const points = GRADE_POINTS[s.grade] ?? 0;
    return sum + points * (Number(s.credits) || 0);
  }, 0);

  const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';

  // Degree Classification Helper
  const getClassHonours = (val) => {
    const num = Number(val);
    if (num >= 3.7) return { label: 'First Class Honours', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
    if (num >= 3.3) return { label: 'Second Class Upper', color: 'bg-blue-50 text-blue-600 border-blue-200' };
    if (num >= 3.0) return { label: 'Second Class Lower', color: 'bg-purple-50 text-purple-600 border-purple-200' };
    if (num >= 2.0) return { label: 'General Pass', color: 'bg-amber-50 text-amber-600 border-amber-200' };
    return { label: 'Fail / Needs Improvement', color: 'bg-rose-50 text-rose-600 border-rose-200' };
  };

  const honours = getClassHonours(gpa);

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Tool Header */}
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
          <FaCalculator className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">GPA Calculator</h1>
          <p className="text-sm text-slate-500">Compute your semester Grade Point Average with weighted course credits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Form Column */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FaGraduationCap className="text-blue-600" />
              <span>Subject & Grade Entry</span>
            </h2>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FaRedo className="text-[10px]" /> Reset
            </button>
          </div>

          <div className="space-y-3">
            {subjects.map((sub, idx) => (
              <div key={sub.id} className="grid grid-cols-12 gap-3 items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                {/* Subject Name */}
                <div className="col-span-5 sm:col-span-5">
                  <input
                    type="text"
                    value={sub.name}
                    onChange={(e) => handleSubjectChange(sub.id, 'name', e.target.value)}
                    placeholder="Subject Name"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Credits */}
                <div className="col-span-3 sm:col-span-3">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={sub.credits}
                    onChange={(e) => handleSubjectChange(sub.id, 'credits', e.target.value)}
                    placeholder="Credits"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Grade Selection */}
                <div className="col-span-3 sm:col-span-3">
                  <select
                    value={sub.grade}
                    onChange={(e) => handleSubjectChange(sub.id, 'grade', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>
                        {g} ({GRADE_POINTS[g].toFixed(1)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remove Button */}
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => handleRemoveSubject(sub.id)}
                    disabled={subjects.length <= 1}
                    className={`p-2 rounded-xl text-xs transition-colors ${
                      subjects.length <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                    aria-label="Remove subject"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddSubject}
            className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-2xl text-xs border border-blue-200/80 transition-colors flex items-center justify-center gap-2"
          >
            <FaPlus /> Add Another Subject
          </button>
        </div>

        {/* Results Summary Column */}
        <div className="lg:col-span-4 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-blue-200 border-b border-blue-800/80 pb-3">GPA Result</h2>

          <div className="text-center py-4 space-y-2">
            <span className="text-xs uppercase tracking-widest text-blue-300 font-semibold">Semester GPA</span>
            <div className="text-5xl font-black tracking-tight text-white">{gpa}</div>
            <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full border ${honours.color}`}>
              {honours.label}
            </span>
          </div>

          <div className="space-y-3 pt-4 border-t border-blue-800/80 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Total Course Credits:</span>
              <span className="font-bold text-white">{totalCredits}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Grade Points:</span>
              <span className="font-bold text-white">{totalGradePoints.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Subjects Evaluated:</span>
              <span className="font-bold text-white">{subjects.length}</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-blue-200 flex items-center gap-2">
            <FaCheckCircle className="text-emerald-400 shrink-0" />
            <span>Calculated using standard 4.0 credit point scale.</span>
          </div>
        </div>

      </div>

      {/* Related Tools */}
      <RelatedTools currentToolSlug="gpa-calculator" />
    </div>
  );
};

export default GpaCalculator;
