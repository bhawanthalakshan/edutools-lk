import React, { useState } from 'react';
import { FaHourglassHalf, FaCalendarAlt, FaRedo, FaGift, FaClock } from 'react-icons/fa';
import RelatedTools from '../../components/RelatedTools';

const AgeCalculator = () => {
  const [dob, setDob] = useState('2000-01-15');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  const handleReset = () => {
    setDob('2000-01-15');
    setTargetDate(new Date().toISOString().split('T')[0]);
  };

  // Detailed Age Calculation Logic
  const calculateAgeDetails = () => {
    const birth = new Date(dob);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      return { valid: false };
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total Days difference
    const diffTime = Math.abs(target - birth);
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;

    // Next Birthday Countdown
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday - target) / (1000 * 60 * 60 * 24));

    return {
      valid: true,
      years,
      months,
      days,
      totalDays,
      totalHours,
      daysToNextBday,
    };
  };

  const age = calculateAgeDetails();

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Tool Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200">
            <FaHourglassHalf className="text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Age Calculator</h1>
            <p className="text-sm text-slate-500">Calculate exact age in years, months, days, total hours, and birthday countdown.</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <FaRedo className="text-[10px]" /> Reset Dates
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Date Inputs Column */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaCalendarAlt className="text-amber-600" />
            <span>Select Dates</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age at Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {age.valid ? (
            <>
              {/* Primary Age Display */}
              <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-4 text-center">
                <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">Exact Calculated Age</span>
                <div className="flex justify-center items-baseline gap-3">
                  <span className="text-5xl font-black text-white">{age.years}</span>
                  <span className="text-slate-300 text-lg font-bold">Years</span>
                  <span className="text-4xl font-bold text-amber-300">{age.months}</span>
                  <span className="text-slate-300 text-sm">Months</span>
                  <span className="text-3xl font-bold text-orange-400">{age.days}</span>
                  <span className="text-slate-300 text-xs">Days</span>
                </div>
              </div>

              {/* Detail Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-200/90 text-center space-y-1 shadow-2xs">
                  <FaClock className="text-amber-500 mx-auto text-xl" />
                  <div className="text-xl font-bold text-slate-900">{age.totalDays.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500">Total Days</div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200/90 text-center space-y-1 shadow-2xs">
                  <FaClock className="text-orange-500 mx-auto text-xl" />
                  <div className="text-xl font-bold text-slate-900">{age.totalHours.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500">Total Hours</div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200/90 text-center space-y-1 shadow-2xs">
                  <FaGift className="text-rose-500 mx-auto text-xl" />
                  <div className="text-xl font-bold text-slate-900">{age.daysToNextBday}</div>
                  <div className="text-[11px] text-slate-500">Days to Next Birthday</div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center text-rose-700 text-sm">
              Please enter a valid Date of Birth prior to the Target Date.
            </div>
          )}
        </div>

      </div>

      {/* Related Tools */}
      <RelatedTools currentToolSlug="age-calculator" />
    </div>
  );
};

export default AgeCalculator;
