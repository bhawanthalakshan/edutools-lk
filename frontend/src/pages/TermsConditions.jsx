import React from 'react';
import { FaFileContract } from 'react-icons/fa';
import Seo from '../components/Seo';

const TermsConditions = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <Seo
        title="Terms and Conditions"
        description="EduTools LK Terms & Conditions governing educational platform usage, intellectual property, and guidelines."
      />

      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
          <FaFileContract className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Terms & Conditions</h1>
          <p className="text-sm text-slate-500">Effective Date: August 29, 2026</p>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong>EduTools LK</strong> (<code>https://edutools.lk</code>), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please discontinue using the website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Educational & Non-Commercial Use</h2>
          <p>
            All educational resources, study guides, calculators, and AI assistance tools provided on EduTools LK are intended solely for personal, academic, and non-commercial educational use.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Intellectual Property Rights</h2>
          <p>
            Unless otherwise stated, EduTools LK and/or its licensors own the intellectual property rights for all material on EduTools LK. All intellectual property rights are reserved.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. User Conduct & Responsibilities</h2>
          <p>
            Users agree not to misuse platform services, attempt unauthorized access to backend APIs or admin endpoints, or engage in activity that disrupts server availability.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
