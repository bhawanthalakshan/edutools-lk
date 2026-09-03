import React from 'react';
import { FaInfoCircle, FaGraduationCap, FaTools, FaFilePdf, FaRocket } from 'react-icons/fa';
import Seo from '../components/Seo';
import { SITE_CONFIG } from '../config/siteConfig';

const About = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <Seo
        title="About Examora"
        description="Learn about Examora mission, past paper library, and education platform for Sri Lankan learners."
      />

      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
          <FaInfoCircle className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">About {SITE_CONFIG.name}</h1>
          <p className="text-sm font-bold text-blue-600">"{SITE_CONFIG.tagline}"</p>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-slate-900">Our Mission</h2>
          <p>
            <strong>{SITE_CONFIG.name}</strong> is built with a clear mission: to provide Sri Lankan students, undergraduates, and teachers with free, instant access to high-quality G.C.E. O/L, G.C.E. A/L, and University past examination papers, marking schemes, and academic study resources.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit">
              <FaFilePdf className="text-xl" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Past Paper Archives</h3>
            <p className="text-xs text-slate-500">Comprehensive paper downloads for O/L, A/L, and University modules.</p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl w-fit">
              <FaGraduationCap className="text-xl" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Academic Hierarchy</h3>
            <p className="text-xs text-slate-500">Organized cleanly by subject, year, medium, and paper type.</p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl w-fit">
              <FaTools className="text-xl" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Student Tools</h3>
            <p className="text-xs text-slate-500">GPA calculators, CGPA tools, and academic utilities.</p>
          </div>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FaRocket className="text-blue-600 text-lg" />
            <span>Why Choose Examora?</span>
          </h2>
          <p>
            We believe examination preparation should be accessible and seamless. Examora provides fast PDF viewing, single-click downloads, responsive search, and organized examination categories without paywalls.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
