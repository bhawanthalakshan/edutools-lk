import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalculator, FaBrain, FaBookReader, FaMagic, FaCheckCircle } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Subtle Mesh & Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider shadow-xs">
              <FaMagic className="text-purple-600 animate-pulse" />
              <span>Smart Education Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Learn Smarter.{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Achieve More.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
              Free educational resources, smart calculators, digital tools and AI learning guides for students and learners.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/tools"
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Explore Tools</span>
                <FaArrowRight className="text-sm" />
              </Link>

              <Link
                to="/education"
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-2xl shadow-xs transition-all duration-200 flex items-center justify-center gap-2 hover:border-slate-300"
              >
                <span>Start Learning</span>
                <FaBookReader className="text-slate-400 text-sm" />
              </Link>
            </div>

            {/* Platform Highlights */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <span className="text-2xl font-bold text-slate-900 block">100% Free</span>
                <span className="text-xs text-slate-500">No registration fees</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 block">Fast Tools</span>
                <span className="text-xs text-slate-500">Instant calculations</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 block">AI Ready</span>
                <span className="text-xs text-slate-500">Smart student guides</span>
              </div>
            </div>

          </div>

          {/* Right Column - Visual Abstract Tech Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Central Visual Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                      <FaCalculator className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">GPA Calculator</h3>
                      <p className="text-xs text-slate-500">Instant Grade Computation</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-lg border border-emerald-200">
                    Active Tool
                  </span>
                </div>

                {/* Abstract Interactive Graphic Bars */}
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>Semester Performance</span>
                      <span className="text-blue-600 font-bold">3.85 GPA</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full w-[90%]"></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>AI Smart Quiz Preparation</span>
                      <span className="text-purple-600 font-bold">Completed</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full w-[100%]"></div>
                    </div>
                  </div>
                </div>

                {/* Mini Features List */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-500" />
                    <span>Real-time Sri Lankan Syllabus Alignment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-500" />
                    <span>100% Client-Side Privacy Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 (Top Right) */}
              <div className="absolute -top-6 -right-6 bg-purple-600 text-white p-4 rounded-2xl shadow-lg shadow-purple-500/30 flex items-center gap-3 animate-bounce duration-[3000ms] hidden sm:flex z-20">
                <FaBrain className="text-2xl" />
                <div>
                  <p className="text-xs font-semibold">AI Learning</p>
                  <p className="text-[10px] text-purple-200">Smart Prompt Guides</p>
                </div>
              </div>

              {/* Floating Badge 2 (Bottom Left) */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-slate-200 text-slate-900 p-4 rounded-2xl shadow-lg flex items-center gap-3 hidden sm:flex z-20">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <FaMagic className="text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold">Free Tools Hub</p>
                  <p className="text-[10px] text-slate-500">6+ Student Utilities</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
