import React from 'react';
import { FaExclamationCircle, FaShieldAlt } from 'react-icons/fa';
import Seo from '../components/Seo';

const Disclaimer = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <Seo
        title="Disclaimer & Copyright Safety"
        description="EduTools LK Legal Disclaimer regarding calculation results, past paper copyright safety, and DMCA takedown procedures."
      />

      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200">
          <FaExclamationCircle className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Disclaimer & Copyright Safety</h1>
          <p className="text-sm text-slate-500">Effective Date: August 29, 2026</p>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Educational Information Disclaimer</h2>
          <p>
            The calculators, GPA estimation models, study articles, and past paper documents provided on <strong>EduTools LK</strong> are published in good faith for general information and non-commercial student learning purposes only. Official examination transcripts and degree classifications should always be verified directly with your university or examination body.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Copyright & Intellectual Property Safety Policy</h2>
          <p>
            EduTools LK strictly respects intellectual property rights. All past paper PDF documents and educational resource files hosted on our platform are submitted by authorized administrators who have explicitly confirmed distribution permissions or are sourced from publicly distributed past examination materials for educational study purposes.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li>We do NOT perform automated scraping or unauthorized downloading of proprietary copyrighted documents.</li>
            <li>All document uploads require administrator confirmation of non-commercial educational distribution rights.</li>
          </ul>
        </section>

        <section className="space-y-3 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FaShieldAlt className="text-blue-600" />
            <span>3. DMCA & Copyright Takedown Request Notice</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            If you are a copyright owner or authorized representative and believe that any material hosted on EduTools LK infringes upon your copyright, please contact our team immediately via our <a href="/contact" className="text-blue-600 font-bold hover:underline">Contact Form</a> with:
          </p>
          <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1 pl-2 font-medium">
            <li>Identification of the copyrighted document or material claimed to be infringed.</li>
            <li>URL link to the exact past paper or resource page on EduTools LK.</li>
            <li>Your contact information (name, email address, and institutional position).</li>
          </ol>
          <p className="text-xs text-slate-500 pt-1">
            Upon receipt of a valid notice, we will promptly review and remove or restrict access to the identified material within 48 business hours.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. External Links Disclaimer</h2>
          <p>
            EduTools LK may contain links to external websites. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external sites.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Disclaimer;
