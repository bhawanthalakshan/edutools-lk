import React from 'react';
import { FaBrain, FaRobot, FaTerminal, FaMagic } from 'react-icons/fa';

const AILearning = () => {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-violet-50 text-violet-600 rounded-2xl border border-violet-200">
          <FaBrain className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">AI Learning Hub</h1>
          <p className="text-sm text-slate-500">Smart AI study prompts, guides, and learning assistants.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'AI Study Assistant', desc: 'Generate flashcards, study outlines, and exam review questions.', icon: <FaRobot className="text-blue-600" /> },
          { title: 'AI Prompt Library', desc: 'Curated prompts for academic research and writing assistance.', icon: <FaTerminal className="text-purple-600" /> },
          { title: 'AI Integration Guides', desc: 'Learn how to use AI tools responsibly for homework and learning.', icon: <FaMagic className="text-amber-500" /> },
        ].map((item, idx) => (
          <div key={idx} className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-2xl w-fit text-2xl">{item.icon}</div>
            <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AILearning;
