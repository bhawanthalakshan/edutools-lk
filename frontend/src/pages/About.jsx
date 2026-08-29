import React from 'react';
import { FaInfoCircle, FaGraduationCap, FaTools, FaBrain, FaRocket } from 'react-icons/fa';
import Seo from '../components/Seo';

const About = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <Seo
        title="About Us"
        description="Learn about EduTools LK mission, team, and educational resources platform for Sri Lankan learners."
      />

      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
          <FaInfoCircle className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">About EduTools LK</h1>
          <p className="text-sm font-semibold text-blue-600">"Learn Smart. Achieve More."</p>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-slate-900">Our Mission</h2>
          <p>
            <strong>EduTools LK</strong> is built with a singular mission: to empower students, undergraduates, and lifelong learners across Sri Lanka and globally with free, intuitive digital utilities, syllabus-aligned study guides, and AI-assisted learning resources.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit">
              <FaGraduationCap className="text-xl" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Academic Resources</h3>
            <p className="text-xs text-slate-500">Curated study packs for O/L, A/L, and University streams.</p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl w-fit">
              <FaTools className="text-xl" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Smart Tools</h3>
            <p className="text-xs text-slate-500">Fast GPA, CGPA, Word Counter, and QR code calculators.</p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl w-fit">
              <FaBrain className="text-xl" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">AI Education</h3>
            <p className="text-xs text-slate-500">Ethical AI prompts, tutoring guides, and study frameworks.</p>
          </div>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FaRocket className="text-blue-600 text-lg" />
            <span>Why Choose EduTools LK?</span>
          </h2>
          <p>
            We believe high-quality student utilities should be 100% free, fast, and privacy-respecting. All calculations occur client-side in your browser, guaranteeing instant results without annoying paywalls.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
