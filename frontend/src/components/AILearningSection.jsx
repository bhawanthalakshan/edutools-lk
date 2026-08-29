import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaBook, FaTerminal, FaArrowRight, FaMagic } from 'react-icons/fa';

const AILearningSection = () => {
  const aiItems = [
    {
      title: 'AI Tools',
      badge: 'Smart Assist',
      description: 'Discover specialized AI tools tailored for study summaries, math step solving, and language grammar refinement.',
      icon: <FaRobot className="text-2xl text-blue-600" />,
      link: '/ai-learning',
    },
    {
      title: 'AI Guides',
      badge: 'Step-by-Step',
      description: 'Learn how to effectively integrate ChatGPT, Claude, and Gemini into your academic study routines safely.',
      icon: <FaBook className="text-2xl text-purple-600" />,
      link: '/ai-learning',
    },
    {
      title: 'Prompt Library',
      badge: 'Curated Prompts',
      description: 'Browse pre-engineered prompts for flashcard creation, exam revision practice, and essay structuring.',
      icon: <FaTerminal className="text-2xl text-indigo-600" />,
      link: '/ai-learning',
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-purple-500/5 blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/20 blur-2xl rounded-full"></div>

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-md border border-white/10">
              <FaMagic className="text-yellow-400" />
              <span>Next-Gen Learning</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Master the Future of AI-Powered Education
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Unlock productivity frameworks and artificial intelligence utilities designed specifically to enhance learning efficiency.
            </p>
          </div>
        </div>

        {/* AI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiItems.map((item, idx) => (
            <div
              key={idx}
              className="p-7 bg-slate-50 hover:bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200/60 shadow-xs group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200/60">
                <Link
                  to={item.link}
                  className="w-full py-2.5 px-4 bg-white group-hover:bg-purple-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-purple-600 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Explore {item.title}</span>
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

export default AILearningSection;
