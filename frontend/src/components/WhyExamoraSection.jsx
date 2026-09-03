import React from 'react';
import { FaLockOpen, FaSearch, FaFolderOpen, FaFilePdf, FaDownload, FaMobileAlt } from 'react-icons/fa';
import { SITE_CONFIG } from '../config/siteConfig';
import { useScrollReveal } from '../hooks/useScrollReveal';

const WhyExamoraSection = () => {
  const [sectionRef, isRevealed] = useScrollReveal();

  const benefits = [
    {
      icon: <FaLockOpen className="text-xl text-blue-600" />,
      title: '100% Free Access',
      description: 'Download past papers and marking schemes with zero hidden subscription fees or paywalls.',
      delay: 'delay-100',
    },
    {
      icon: <FaSearch className="text-xl text-indigo-600" />,
      title: 'Fast Instant Search',
      description: 'Locate examination question papers quickly by subject, year, medium, or paper type.',
      delay: 'delay-150',
    },
    {
      icon: <FaFolderOpen className="text-xl text-purple-600" />,
      title: 'Clean Academic Hierarchy',
      description: 'Browse neatly organized categories for O/L, A/L, and University module archives.',
      delay: 'delay-200',
    },
    {
      icon: <FaFilePdf className="text-xl text-rose-600" />,
      title: 'Seamless PDF Viewer',
      description: 'Preview high-quality PDF document pages directly inside your browser before downloading.',
      delay: 'delay-250',
    },
    {
      icon: <FaDownload className="text-xl text-emerald-600" />,
      title: 'Direct PDF Downloads',
      description: 'Single-click high speed downloads saved straight to your phone, tablet, or PC.',
      delay: 'delay-300',
    },
    {
      icon: <FaMobileAlt className="text-xl text-amber-600" />,
      title: 'Mobile-Optimized Experience',
      description: 'Clean responsive interface built specifically for smartphone and mobile student study sessions.',
      delay: 'delay-400',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`py-12 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden reveal-hidden ${
        isRevealed ? 'reveal-visible' : ''
      }`}
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="space-y-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
            Why Choose {SITE_CONFIG.name}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built for Sri Lankan Students
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Streamlining past paper discovery and exam revision across O/L, A/L, and University studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className={`p-6 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-3 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 reveal-hidden ${
                isRevealed ? 'reveal-visible' : ''
              } ${b.delay}`}
            >
              <div className="p-3 bg-slate-900 rounded-xl w-fit border border-slate-700">
                {b.icon}
              </div>
              <h3 className="text-base font-bold text-white">{b.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyExamoraSection;
