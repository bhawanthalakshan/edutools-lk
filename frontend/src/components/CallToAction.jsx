import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap, FaTools } from 'react-icons/fa';

const CallToAction = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-14 text-white shadow-2xl text-center relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-400/20 blur-3xl rounded-full"></div>

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <FaGraduationCap className="text-base" /> Start Exploring Today
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Accelerate Your Academic Journey?
            </h2>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Join thousands of Sri Lankan students using EduTools LK daily for free academic calculators, study resources, and digital learning tools.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/tools"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-blue-700 font-bold rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <FaTools />
                <span>Explore Free Tools</span>
              </Link>

              <Link
                to="/education"
                className="w-full sm:w-auto px-8 py-4 bg-blue-700/60 hover:bg-blue-700 text-white font-bold rounded-2xl border border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Access Resources</span>
                <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CallToAction;
