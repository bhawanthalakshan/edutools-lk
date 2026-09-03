import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookReader, FaGraduationCap, FaUniversity, FaCalculator, FaArrowRight, FaFilePdf } from 'react-icons/fa';
import { useScrollReveal } from '../hooks/useScrollReveal';

const FeatureCategories = ({ stats }) => {
  const [sectionRef, isRevealed] = useScrollReveal();

  const categories = [
    {
      icon: <FaBookReader className="text-3xl text-blue-600" />,
      bgIcon: 'bg-blue-50',
      badge: 'Secondary Education',
      title: 'O/L Past Papers',
      description: 'G.C.E. Ordinary Level question papers for Mathematics, Science, ICT, Languages, and History across English, Sinhala, and Tamil mediums.',
      link: '/past-papers/ol',
      statLabel: `${stats?.olPapers || 0} Papers Available`,
      color: 'hover:border-blue-300 hover:shadow-blue-500/10',
      cta: 'View O/L Papers',
      delay: 'delay-100',
    },
    {
      icon: <FaGraduationCap className="text-3xl text-indigo-600" />,
      bgIcon: 'bg-indigo-50',
      badge: 'Advanced Level',
      title: 'A/L Past Papers',
      description: 'G.C.E. Advanced Level examination papers for Physical Science, Biological Science, Commerce, Technology, and Arts streams.',
      link: '/past-papers/al',
      statLabel: `${stats?.alPapers || 0} Papers Available`,
      color: 'hover:border-indigo-300 hover:shadow-indigo-500/10',
      cta: 'View A/L Papers',
      delay: 'delay-200',
    },
    {
      icon: <FaUniversity className="text-3xl text-purple-600" />,
      bgIcon: 'bg-purple-50',
      badge: 'Higher Education',
      title: 'University Past Papers',
      description: 'Undergraduate semester papers and exam resources organized by university, degree course, and specific module code.',
      link: '/past-papers/university',
      statLabel: `${stats?.universityPapers || 0} Papers Available`,
      color: 'hover:border-purple-300 hover:shadow-purple-500/10',
      cta: 'View University Papers',
      delay: 'delay-300',
    },
    {
      icon: <FaCalculator className="text-3xl text-emerald-600" />,
      bgIcon: 'bg-emerald-50',
      badge: 'Student Tools',
      title: 'Calculators & Tools',
      description: 'Free digital tools including GPA Calculator, CGPA Calculator, Percentage Calculator, Age Calculator, and QR Code Generator.',
      link: '/tools',
      statLabel: '6 Free Utilities',
      color: 'hover:border-emerald-300 hover:shadow-emerald-500/10',
      cta: 'Explore Tools',
      delay: 'delay-400',
    },
  ];

  return (
    <section ref={sectionRef} className="py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className={`text-center sm:text-left space-y-2 reveal-hidden ${isRevealed ? 'reveal-visible' : ''}`}>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md">
            <FaFilePdf /> Exam Categories
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Browse Past Papers &amp; Academic Tools
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl">
            Select an academic examination level or study category to explore subjects and paper archives.
          </p>
        </div>

        {/* Categories Cards Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`p-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between group ${cat.color} reveal-hidden ${
                isRevealed ? 'reveal-visible' : ''
              } ${cat.delay}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-4 ${cat.bgIcon} rounded-2xl group-hover:scale-110 transition-transform duration-200`}>
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-3 mt-6">
                <div className="text-xs font-semibold text-slate-400">
                  {cat.statLabel}
                </div>

                <Link
                  to={cat.link}
                  className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all btn-press"
                >
                  <span>{cat.cta}</span>
                  <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeatureCategories;
