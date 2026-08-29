import React, { useState } from 'react';
import { FaChartLine, FaPlus, FaTrash, FaRedo, FaUniversity, FaCheckCircle } from 'react-icons/fa';
import RelatedTools from '../../components/RelatedTools';

const initialSemesters = [
  { id: 1, name: 'Semester 1', gpa: 3.8, credits: 16 },
  { id: 2, name: 'Semester 2', gpa: 3.6, credits: 18 },
  { id: 3, name: 'Semester 3', gpa: 3.75, credits: 15 },
];

const CgpaCalculator = () => {
  const [semesters, setSemesters] = useState(initialSemesters);

  const handleAddSemester = () => {
    const newId = semesters.length > 0 ? Math.max(...semesters.map((s) => s.id)) + 1 : 1;
    setSemesters([...semesters, { id: newId, name: `Semester ${newId}`, gpa: 3.5, credits: 15 }]);
  };

  const handleRemoveSemester = (id) => {
    if (semesters.length <= 1) return;
    setSemesters(semesters.filter((s) => s.id !== id));
  };

  const handleSemesterChange = (id, field, value) => {
    setSemesters(
      semesters.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            [field]: field === 'gpa' ? Math.min(4.0, Math.max(0, Number(value) || 0)) : Math.max(1, Number(value) || 0),
          };
        }
        return s;
      })
    );
  };

  const handleReset = () => {
    setSemesters(initialSemesters);
  };

  // Calculate Cumulative CGPA
  const totalCredits = semesters.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);
  const totalGpaPoints = semesters.reduce((sum, s) => sum + (Number(s.gpa) || 0) * (Number(s.credits) || 0), 0);

  const cgpa = totalCredits > 0 ? (totalGpaPoints / totalCredits).toFixed(2) : '0.00';

  const getClassHonours = (val) => {
    const num = Number(val);
    if (num >= 3.7) return { label: 'First Class Honours', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
    if (num >= 3.3) return { label: 'Second Class Upper', color: 'bg-blue-50 text-blue-600 border-blue-200' };
    if (num >= 3.0) return { label: 'Second Class Lower', color: 'bg-purple-50 text-purple-600 border-purple-200' };
    if (num >= 2.0) return { label: 'General Pass', color: 'bg-amber-50 text-amber-600 border-amber-200' };
    return { label: 'Fail / Needs Improvement', color: 'bg-rose-50 text-rose-600 border-rose-200' };
  };

  const honours = getClassHonours(cgpa);

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Tool Header */}
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl border border-purple-200">
          <FaChartLine className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">CGPA Calculator</h1>
          <p className="text-sm text-slate-500">Calculate overall Cumulative GPA across all academic semesters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Form Column */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FaUniversity className="text-purple-600" />
              <span>Semester GPA & Credit Entry</span>
            </h2>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FaRedo className="text-[10px]" /> Reset
            </button>
          </div>

          <div className="space-y-3">
            {semesters.map((sem) => (
              <div key={sem.id} className="grid grid-cols-12 gap-3 items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                {/* Semester Name */}
                <div className="col-span-5 sm:col-span-5">
                  <input
                    type="text"
                    value={sem.name}
                    onChange={(e) => handleSemesterChange(sem.id, 'name', e.target.value)}
                    placeholder="Semester Name"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Semester GPA */}
                <div className="col-span-3 sm:col-span-3">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={sem.gpa}
                    onChange={(e) => handleSemesterChange(sem.id, 'gpa', e.target.value)}
                    placeholder="GPA (0-4.0)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Semester Credits */}
                <div className="col-span-3 sm:col-span-3">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={sem.credits}
                    onChange={(e) => handleSemesterChange(sem.id, 'credits', e.target.value)}
                    placeholder="Credits"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Remove Button */}
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => handleRemoveSemester(sem.id)}
                    disabled={semesters.length <= 1}
                    className={`p-2 rounded-xl text-xs transition-colors ${
                      semesters.length <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                    aria-label="Remove semester"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddSemester}
            className="w-full py-3 bg-purple-50 hover:bg-purple-100 text-purple-600 font-semibold rounded-2xl text-xs border border-purple-200/80 transition-colors flex items-center justify-center gap-2"
          >
            <FaPlus /> Add Another Semester
          </button>
        </div>

        {/* Results Summary Column */}
        <div className="lg:col-span-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-purple-200 border-b border-purple-800/80 pb-3">Cumulative CGPA</h2>

          <div className="text-center py-4 space-y-2">
            <span className="text-xs uppercase tracking-widest text-purple-300 font-semibold">Overall CGPA</span>
            <div className="text-5xl font-black tracking-tight text-white">{cgpa}</div>
            <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full border ${honours.color}`}>
              {honours.label}
            </span>
          </div>

          <div className="space-y-3 pt-4 border-t border-purple-800/80 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Total Accumulated Credits:</span>
              <span className="font-bold text-white">{totalCredits}</span>
            </div>
            <div className="flex justify-between">
              <span>Semesters Calculated:</span>
              <span className="font-bold text-white">{semesters.length}</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-purple-200 flex items-center gap-2">
            <FaCheckCircle className="text-emerald-400 shrink-0" />
            <span>Multi-semester credit weighted calculation.</span>
          </div>
        </div>

      </div>

      {/* Related Tools */}
      <RelatedTools currentToolSlug="cgpa-calculator" />
    </div>
  );
};

export default CgpaCalculator;
