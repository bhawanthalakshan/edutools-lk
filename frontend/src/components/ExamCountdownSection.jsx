import React, { useEffect, useState } from 'react';
import { FaClock, FaCalendarCheck, FaExternalLinkAlt } from 'react-icons/fa';
import { getExamSchedules } from '../services/interactionService';
import { useScrollReveal } from '../hooks/useScrollReveal';

const ExamCountdownSection = () => {
  const [schedules, setSchedules] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeSchedule, setActiveSchedule] = useState(null);
  const [sectionRef, isRevealed] = useScrollReveal();

  useEffect(() => {
    getExamSchedules()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSchedules(res.data);
          setActiveSchedule(res.data[0]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeSchedule || !activeSchedule.startDate) return;

    const targetTime = new Date(activeSchedule.startDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSchedule]);

  if (!activeSchedule) return null;

  return (
    <section
      ref={sectionRef}
      className={`py-8 px-6 sm:px-10 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl border border-blue-800/80 shadow-xl relative overflow-hidden reveal-hidden ${
        isRevealed ? 'reveal-visible' : ''
      }`}
    >
      <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-xs font-bold flex items-center gap-1.5">
              <FaCalendarCheck className="text-xs text-blue-400" /> Verified Examination Timetable
            </span>
            {activeSchedule.officialSourceUrl && (
              <a
                href={activeSchedule.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 font-semibold underline underline-offset-2"
              >
                Official Source <FaExternalLinkAlt className="text-[9px]" />
              </a>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black">{activeSchedule.examTitle}</h3>
          <p className="text-xs text-slate-300">
            Commencing on: <strong>{new Date(activeSchedule.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
          </p>
        </div>

        {/* Countdown Timer Display */}
        <div className="flex items-center gap-3 text-center self-center lg:self-auto">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 min-w-[64px]">
            <div className="text-2xl font-black text-blue-400">{timeLeft.days}</div>
            <div className="text-[10px] text-slate-300 uppercase font-bold">Days</div>
          </div>
          <span className="text-xl font-bold text-slate-500">:</span>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 min-w-[64px]">
            <div className="text-2xl font-black text-indigo-400">{timeLeft.hours}</div>
            <div className="text-[10px] text-slate-300 uppercase font-bold">Hours</div>
          </div>
          <span className="text-xl font-bold text-slate-500">:</span>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 min-w-[64px]">
            <div className="text-2xl font-black text-purple-400">{timeLeft.minutes}</div>
            <div className="text-[10px] text-slate-300 uppercase font-bold">Mins</div>
          </div>
          <span className="text-xl font-bold text-slate-500">:</span>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 min-w-[64px]">
            <div className="text-2xl font-black text-emerald-400">{timeLeft.seconds}</div>
            <div className="text-[10px] text-slate-300 uppercase font-bold">Secs</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExamCountdownSection;
