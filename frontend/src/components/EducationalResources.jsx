import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookReader, FaGraduationCap, FaUniversity, FaCode, FaArrowRight } from 'react-icons/fa';

const EducationalResources = () => {
  const categories = [
    {
      title: 'O/L Resources',
      badge: 'Ordinary Level',
      description: 'Past papers, model marking schemes, and subject summaries for G.C.E. O/L examination preparation.',
      icon: <FaBookReader className="text-2xl text-blue-600" />,
      color: 'from-blue-500/10 to-indigo-500/10',
      border: 'hover:border-blue-300',
      link: '/education',
    },
    {
      title: 'A/L Resources',
      badge: 'Advanced Level',
      description: 'Science, Commerce, Arts, and Technology stream papers, revision guides, and teacher guidebooks.',
      icon: <FaGraduationCap className="text-2xl text-purple-600" />,
      color: 'from-purple-500/10 to-pink-500/10',
      border: 'hover:border-purple-300',
      link: '/education',
    },
    {
      title: 'University Resources',
      badge: 'Higher Education',
      description: 'Lecture notes, reference materials, research templates, and degree module guides across faculties.',
      icon: <FaUniversity className="text-2xl text-emerald-600" />,
      color: 'from-emerald-500/10 to-teal-500/10',
      border: 'hover:border-emerald-300',
      link: '/education',
    },
    {
      title: 'IT & Programming',
      badge: 'Tech Skills',
      description: 'Web development tutorials, Python programming basics, software engineering roadmaps, and cheat sheets.',
      icon: <FaCode className="text-2xl text-amber-600" />,
      color: 'from-amber-500/10 to-orange-500/10',
      border: 'hover:border-amber-300',
      link: '/education',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Study Hub
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Educational Resources by Stream
          </h2>
          <p className="text-base text-slate-600">
            Curated syllabus-aligned study materials for secondary, high school, and undergraduate students.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((item, idx) => (
            <div
              key={idx}
              className={`p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm transition-all duration-300 ${item.border} hover:shadow-xl relative overflow-hidden flex flex-col justify-between group`}
            >
              {/* Top Accent Gradient Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color}`}></div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:text-purple-600 transition-colors"
                >
                  <span>Explore Resources</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EducationalResources;
