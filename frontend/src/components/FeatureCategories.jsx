import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaCalculator, FaTools, FaBrain, FaArrowRight } from 'react-icons/fa';

const FeatureCategories = () => {
  const features = [
    {
      icon: <FaGraduationCap className="text-2xl text-blue-600" />,
      bgIcon: 'bg-blue-50',
      title: 'Educational Resources',
      description: 'Comprehensive study materials, past paper archives, exam revision notes, and subject guides.',
      link: '/education',
      color: 'hover:border-blue-300 hover:shadow-blue-500/10',
    },
    {
      icon: <FaCalculator className="text-2xl text-purple-600" />,
      bgIcon: 'bg-purple-50',
      title: 'Smart Calculators',
      description: 'Instant academic and mathematical calculators designed to compute GPA, CGPA, and percentages.',
      link: '/tools',
      color: 'hover:border-purple-300 hover:shadow-purple-500/10',
    },
    {
      icon: <FaTools className="text-2xl text-indigo-600" />,
      bgIcon: 'bg-indigo-50',
      title: 'Free Digital Tools',
      description: 'Utility tools including age calculators, word counters, QR code generators, and text tools.',
      link: '/tools',
      color: 'hover:border-indigo-300 hover:shadow-indigo-500/10',
    },
    {
      icon: <FaBrain className="text-2xl text-violet-600" />,
      bgIcon: 'bg-violet-50',
      title: 'AI Learning',
      description: 'AI-driven study guides, prompt libraries, and tutoring tools to supercharge your study routine.',
      link: '/ai-learning',
      color: 'hover:border-violet-300 hover:shadow-violet-500/10',
    },
  ];

  return (
    <section className="py-16 bg-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Explore Platform Categories
          </h2>
          <p className="text-base text-slate-600">
            Tailored tools and academic resources designed to enhance your learning productivity.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Link
              key={idx}
              to={feature.link}
              className={`group p-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between ${feature.color}`}
            >
              <div>
                <div className={`p-4 ${feature.bgIcon} w-fit rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:text-purple-600 transition-colors gap-2">
                <span>Browse Category</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeatureCategories;
