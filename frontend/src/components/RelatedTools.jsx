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

const allTools = [
  {
    slug: 'gpa-calculator',
    name: 'GPA Calculator',
    description: 'Calculate semester GPA based on subject credits and grades.',
    icon: <FaCalculator className="text-blue-600" />,
    link: '/tools/gpa-calculator',
  },
  {
    slug: 'cgpa-calculator',
    name: 'CGPA Calculator',
    description: 'Compute cumulative CGPA across all academic years.',
    icon: <FaChartLine className="text-purple-600" />,
    link: '/tools/cgpa-calculator',
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate exam percentages, mark ratios, and grade boundaries.',
    icon: <FaPercent className="text-indigo-600" />,
    link: '/tools/percentage-calculator',
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate exact age in years, months, days, and hours.',
    icon: <FaHourglassHalf className="text-amber-600" />,
    link: '/tools/age-calculator',
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in real time.',
    icon: <FaFont className="text-emerald-600" />,
    link: '/tools/word-counter',
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Generate and download custom high-resolution QR codes.',
    icon: <FaQrcode className="text-violet-600" />,
    link: '/tools/qr-code-generator',
  },
];

const RelatedTools = ({ currentToolSlug }) => {
  const filteredTools = allTools.filter((tool) => tool.slug !== currentToolSlug);

  return (
    <section className="mt-16 pt-12 border-t border-slate-200/80">
      <div className="space-y-3 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          More Utilities
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900">Related Student Tools</h2>
        <p className="text-xs text-slate-500">Explore other free calculators and digital utilities on EduTools LK.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.slice(0, 3).map((tool, idx) => (
          <Link
            key={idx}
            to={tool.link}
            className="p-6 bg-white hover:bg-slate-50/80 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="p-3 bg-slate-50 rounded-2xl w-fit mb-3 group-hover:scale-105 transition-transform">
                {tool.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 gap-1.5">
              <span>Try Tool</span>
              <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedTools;
