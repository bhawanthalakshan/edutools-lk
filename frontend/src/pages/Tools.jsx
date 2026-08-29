import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTools, 
  FaCalculator, 
  FaChartLine, 
  FaPercent, 
  FaHourglassHalf, 
  FaFont, 
  FaQrcode, 
  FaArrowRight 
} from 'react-icons/fa';

const Tools = () => {
  const tools = [
    {
      name: 'GPA Calculator',
      desc: 'Semester Grade Point Average computation with credit weighting',
      icon: <FaCalculator className="text-blue-600" />,
      link: '/tools/gpa-calculator',
      tag: 'Academic',
    },
    {
      name: 'CGPA Calculator',
      desc: 'Cumulative GPA tracker across all academic semesters',
      icon: <FaChartLine className="text-purple-600" />,
      link: '/tools/cgpa-calculator',
      tag: 'Academic',
    },
    {
      name: 'Percentage Calculator',
      desc: 'Score percentage, grade ratio math, and percentage values',
      icon: <FaPercent className="text-indigo-600" />,
      link: '/tools/percentage-calculator',
      tag: 'Math',
    },
    {
      name: 'Age Calculator',
      desc: 'Exact age in years, months, days, and birthday countdown',
      icon: <FaHourglassHalf className="text-amber-600" />,
      link: '/tools/age-calculator',
      tag: 'Utility',
    },
    {
      name: 'Word Counter',
      desc: 'Live word, character, sentence, and paragraph counter',
      icon: <FaFont className="text-emerald-600" />,
      link: '/tools/word-counter',
      tag: 'Writing',
    },
    {
      name: 'QR Code Generator',
      desc: 'Custom high-resolution QR code generator with PNG download',
      icon: <FaQrcode className="text-violet-600" />,
      link: '/tools/qr-code-generator',
      tag: 'Utility',
    },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl border border-purple-200">
          <FaTools className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Free Online Tools Suite</h1>
          <p className="text-sm text-slate-500">Academic calculators, writing utilities, and student tools.</p>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((t, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-50 rounded-2xl w-fit text-xl group-hover:scale-105 transition-transform">
                  {t.icon}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {t.tag}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                {t.name}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <Link
                to={t.link}
                className="w-full py-2.5 px-4 bg-slate-50 group-hover:bg-purple-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-purple-600 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Open Tool</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Tools;
