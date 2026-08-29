import React, { useState } from 'react';
import { FaPercent, FaRedo, FaCheckCircle, FaCalculator } from 'react-icons/fa';
import RelatedTools from '../../components/RelatedTools';

const PercentageCalculator = () => {
  // Mode 1: Obtained / Total Percentage
  const [obtained, setObtained] = useState('85');
  const [total, setTotal] = useState('100');

  // Mode 2: Percentage of Number (What is X% of Y?)
  const [percentVal, setPercentVal] = useState('15');
  const [numberVal, setNumberVal] = useState('200');

  const handleReset = () => {
    setObtained('85');
    setTotal('100');
    setPercentVal('15');
    setNumberVal('200');
  };

  // Calculations
  const obtainedNum = Number(obtained) || 0;
  const totalNum = Number(total) || 0;
  const percentageResult = totalNum > 0 ? ((obtainedNum / totalNum) * 100).toFixed(2) : '0.00';

  const percentValNum = Number(percentVal) || 0;
  const numberValNum = Number(numberVal) || 0;
  const percentOfNumberResult = ((percentValNum / 100) * numberValNum).toFixed(2);

  // Grade Letter Estimation
  const getGradeEstimate = (pct) => {
    const val = Number(pct);
    if (val >= 90) return 'A+ (Outstanding)';
    if (val >= 80) return 'A (Excellent)';
    if (val >= 70) return 'B (Good)';
    if (val >= 60) return 'C (Pass)';
    if (val >= 50) return 'D (Marginal)';
    return 'F (Fail)';
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Tool Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-200">
            <FaPercent className="text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Percentage Calculator</h1>
            <p className="text-sm text-slate-500">Calculate exam score percentages, grade ratios, and percentage values.</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <FaRedo className="text-[10px]" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Exam Score Percentage */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              <FaCalculator className="text-indigo-600" />
              <span>Exam Score Percentage</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Obtained Marks</label>
                <input
                  type="number"
                  value={obtained}
                  onChange={(e) => setObtained(e.target.value)}
                  placeholder="e.g. 85"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Marks</label>
                <input
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Result Banner */}
          <div className="p-6 bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-2xl text-center space-y-2 mt-4">
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">Calculated Percentage</span>
            <div className="text-4xl font-black">{percentageResult}%</div>
            <div className="text-xs font-medium text-emerald-400">
              Grade Estimate: {getGradeEstimate(percentageResult)}
            </div>
          </div>
        </div>

        {/* Card 2: Percentage of a Number */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              <FaPercent className="text-purple-600" />
              <span>Percentage of a Value</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">What is X% ?</label>
                <input
                  type="number"
                  value={percentVal}
                  onChange={(e) => setPercentVal(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Of Value Y ?</label>
                <input
                  type="number"
                  value={numberVal}
                  onChange={(e) => setNumberVal(e.target.value)}
                  placeholder="e.g. 200"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Result Banner */}
          <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl text-center space-y-2 mt-4">
            <span className="text-xs uppercase tracking-wider text-purple-200 font-semibold">{percentVal}% of {numberVal}</span>
            <div className="text-4xl font-black">{percentOfNumberResult}</div>
            <div className="text-xs text-purple-200 flex items-center justify-center gap-1">
              <FaCheckCircle className="text-emerald-400" />
              <span>Instant Real-Time Math Calculation</span>
            </div>
          </div>
        </div>

      </div>

      {/* Related Tools */}
      <RelatedTools currentToolSlug="percentage-calculator" />
    </div>
  );
};

export default PercentageCalculator;
