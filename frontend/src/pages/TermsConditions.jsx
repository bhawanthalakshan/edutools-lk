import React from 'react';
import { FaFileContract } from 'react-icons/fa';
import Seo from '../components/Seo';
import { SITE_CONFIG } from '../config/siteConfig';

const TermsConditions = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <Seo
        title="Terms and Conditions"
        description={`${SITE_CONFIG.name} Terms & Conditions governing educational platform usage, past paper downloads, and intellectual property guidelines.`}
      />

      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
          <FaFileContract className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Terms & Conditions</h1>
          <p className="text-sm text-slate-500">Effective Date: September 2026</p>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong>{SITE_CONFIG.name}</strong> (<code>{SITE_CONFIG.domain}</code>), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please discontinue using the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Past Paper Usage & Disclaimer</h2>
          <p>
            All examination past papers, marking schemes, and revision materials provided on {SITE_CONFIG.name} are intended solely for personal study, exam practice, and non-commercial educational reference. Official exam papers remain the intellectual property of their respective examination authorities or educational institutions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Platform Intellectual Property</h2>
          <p>
            Unless otherwise stated, {SITE_CONFIG.name} and/or its creators own the branding, website design, and code for all custom platform elements. All rights reserved.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. User Conduct & Responsibilities</h2>
          <p>
            Users agree not to misuse platform services, attempt automated scraping of PDF resources without permission, or engage in activity that disrupts server infrastructure.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
