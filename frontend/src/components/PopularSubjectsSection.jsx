import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaArrowRight, FaCalculator, FaFlask, FaLaptopCode, FaAtom, FaVial, FaDna, FaFileInvoiceDollar } from 'react-icons/fa';
import { useScrollReveal } from '../hooks/useScrollReveal';

const iconMap = {
  FaCalculator: <FaCalculator />,
  FaFlask: <FaFlask />,
  FaLaptopCode: <FaLaptopCode />,
  FaAtom: <FaAtom />,
  FaVial: <FaVial />,
  FaDna: <FaDna />,
  FaFileInvoiceDollar: <FaFileInvoiceDollar />,
};

const PopularSubjectsSection = ({ subjects = [] }) => {
  const [sectionRef, isRevealed] = useScrollReveal();
  const popularOl = subjects.filter((s) => s.examType === 'OL').slice(0, 6);
  const popularAl = subjects.filter((s) => s.examType === 'AL').slice(0, 6);

  return (
    <section
      ref={sectionRef}
      className={`py-12 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8 reveal-hidden ${
        isRevealed ? 'reveal-visible' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
            Academic Subjects
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Popular Exam Subjects</h2>
          <p className="text-xs text-slate-500 mt-1">Browse past papers organized by official G.C.E. O/L and A/L subjects.</p>
        </div>

        <Link
          to="/past-papers"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 shrink-0 group btn-press"
        >
          <span>View All Subjects</span>
          <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* O/L & A/L Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* O/L Subjects */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>G.C.E. O/L Popular Subjects</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularOl.length > 0 ? (
              popularOl.map((sub, idx) => (
                <Link
                  key={sub._id || sub.slug}
                  to={`/past-papers/ol/${sub.slug}`}
                  className="p-4 bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 rounded-2xl transition-all hover:-translate-y-0.5 group space-y-2 btn-press"
                >
                  <div className="text-blue-600 text-lg group-hover:scale-110 transition-transform">
                    {iconMap[sub.icon] || <FaBook />}
                  </div>
                  <div className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-600">
                    {sub.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {sub.paperCount || 0} Papers
                  </div>
                </Link>
              ))
            ) : (
              ['Mathematics', 'Science', 'ICT', 'English', 'Sinhala', 'History'].map((name) => (
                <Link
                  key={name}
                  to={`/past-papers/ol/${name.toLowerCase().replace(/ /g, '-')}`}
                  className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 hover:text-blue-600 transition-all hover:-translate-y-0.5"
                >
                  {name}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* A/L Subjects */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>G.C.E. A/L Popular Subjects</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularAl.length > 0 ? (
              popularAl.map((sub, idx) => (
                <Link
                  key={sub._id || sub.slug}
                  to={`/past-papers/al/${sub.slug}`}
                  className="p-4 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200/80 hover:border-indigo-300 rounded-2xl transition-all hover:-translate-y-0.5 group space-y-2 btn-press"
                >
                  <div className="text-indigo-600 text-lg group-hover:scale-110 transition-transform">
                    {iconMap[sub.icon] || <FaBook />}
                  </div>
                  <div className="font-bold text-slate-900 text-xs truncate group-hover:text-indigo-600">
                    {sub.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {sub.paperCount || 0} Papers
                  </div>
                </Link>
              ))
            ) : (
              ['Combined Mathematics', 'Physics', 'Chemistry', 'Biology', 'ICT', 'Accounting'].map((name) => (
                <Link
                  key={name}
                  to={`/past-papers/al/${name.toLowerCase().replace(/ /g, '-')}`}
                  className="p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 hover:text-indigo-600 transition-all hover:-translate-y-0.5"
                >
                  {name}
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PopularSubjectsSection;
