import React, { useState } from 'react';
import { FaFont, FaCopy, FaTrash, FaCheck, FaBookOpen } from 'react-icons/fa';
import RelatedTools from '../../components/RelatedTools';

const WordCounter = () => {
  const [text, setText] = useState(
    'EduTools LK is an educational resources and free online tools platform for students and learners. "Learn Smart. Achieve More."'
  );
  const [copied, setCopied] = useState(false);

  // Calculations
  const trimText = text.trim();
  const words = trimText === '' ? 0 : trimText.split(/\s+/).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = trimText === '' ? 0 : (text.match(/[^.!?]+[.!?]+/g) || [text]).length;
  const paragraphs = trimText === '' ? 0 : text.split(/\n+/).filter((p) => p.trim() !== '').length;
  const readingTimeMinutes = Math.ceil(words / 200);

  // Actions
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  const handleUppercase = () => {
    setText(text.toUpperCase());
  };

  const handleLowercase = () => {
    setText(text.toLowerCase());
  };

  const handleTitleCase = () => {
    setText(
      text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    );
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Tool Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200">
            <FaFont className="text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Word Counter</h1>
            <p className="text-sm text-slate-500">Live text metrics for essays, research papers, and assignments.</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <FaTrash className="text-[10px]" /> Clear Text
        </button>
      </div>

      {/* Metrics Bar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-center">
          <div className="text-2xl font-black text-emerald-600">{words}</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase mt-0.5">Words</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-center">
          <div className="text-2xl font-black text-blue-600">{characters}</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase mt-0.5">Characters</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-center">
          <div className="text-2xl font-black text-purple-600">{charactersNoSpaces}</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase mt-0.5">No Spaces</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-center">
          <div className="text-2xl font-black text-indigo-600">{sentences}</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase mt-0.5">Sentences</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-center">
          <div className="text-2xl font-black text-amber-600">{paragraphs}</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase mt-0.5">Paragraphs</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-center">
          <div className="text-2xl font-black text-rose-600 flex items-center justify-center gap-1">
            <FaBookOpen className="text-sm" /> {readingTimeMinutes} m
          </div>
          <div className="text-[11px] font-medium text-slate-500 uppercase mt-0.5">Reading Time</div>
        </div>
      </div>

      {/* Main Text Editor Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700">Type or paste your text below:</span>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleUppercase}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
            >
              UPPERCASE
            </button>
            <button
              onClick={handleLowercase}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
            >
              lowercase
            </button>
            <button
              onClick={handleTitleCase}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
            >
              Title Case
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows="10"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text here to analyze words, characters, and sentences..."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:outline-none focus:border-emerald-500 font-sans leading-relaxed resize-y"
        ></textarea>
      </div>

      {/* Related Tools */}
      <RelatedTools currentToolSlug="word-counter" />
    </div>
  );
};

export default WordCounter;
