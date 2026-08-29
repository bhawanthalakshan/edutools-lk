import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalculator, 
  FaChartLine, 
  FaPercent, 
  FaHourglassHalf, 
  FaFont, 
  FaQrcode, 
  FaArrowRight 
} from 'react-icons/fa';

const PopularTools = () => {
  const tools = [
    {
      name: 'GPA Calculator',
      description: 'Calculate semester Grade Point Average based on course credits and grades.',
      icon: <FaCalculator className="text-xl text-blue-600" />,
      tag: 'Academic',
      link: '/tools/gpa-calculator',
    },
    {
      name: 'CGPA Calculator',
      description: 'Compute overall Cumulative GPA across all academic years effortlessly.',
      icon: <FaChartLine className="text-xl text-purple-600" />,
      tag: 'Academic',
      link: '/tools/cgpa-calculator',
    },
    {
      name: 'Percentage Calculator',
      description: 'Quickly calculate exam score percentages, marks distribution, and grade ratios.',
      icon: <FaPercent className="text-xl text-indigo-600" />,
      tag: 'Math',
      link: '/tools/percentage-calculator',
    },
    {
      name: 'Age Calculator',
      description: 'Calculate exact age in years, months, days, and hours for official applications.',
      icon: <FaHourglassHalf className="text-xl text-amber-600" />,
      tag: 'Utility',
      link: '/tools/age-calculator',
    },
    {
      name: 'Word Counter',
      description: 'Count words, characters, sentences, and paragraphs for essays and research papers.',
      icon: <FaFont className="text-xl text-emerald-600" />,
      tag: 'Writing',
      link: '/tools/word-counter',
    },
    {
      name: 'QR Code Generator',
      description: 'Generate high-quality custom QR codes for study links, assignments, and portfolios.',
      icon: <FaQrcode className="text-xl text-violet-600" />,
      tag: 'Utility',
      link: '/tools/qr-code-generator',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Popular Utilities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Free Online Tools & Calculators
            </h2>
            <p className="text-base text-slate-600">
              Built for speed, accuracy, and student convenience. Instant real-time calculations.
            </p>
          </div>

          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors w-fit"
          >
            <span>View All Tools</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className="group p-6 bg-slate-50 hover:bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-200/60 group-hover:scale-105 transition-transform">
                    {tool.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-lg">
                    {tool.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <Link
                  to={tool.link}
                  className="w-full py-2.5 px-4 bg-white group-hover:bg-blue-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-blue-600 rounded-xl text-xs font-semibold shadow-2xs transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Open Tool</span>
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PopularTools;
