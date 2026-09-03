import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import Seo from '../components/Seo';
import { SITE_CONFIG } from '../config/siteConfig';

const PrivacyPolicy = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <Seo
        title="Privacy Policy"
        description={`${SITE_CONFIG.name} Privacy Policy detailing user data protection, past paper downloading privacy, and cookies guidelines.`}
      />

      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
          <FaShieldAlt className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Effective Date: September 2026</p>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Introduction</h2>
          <p>
            At <strong>{SITE_CONFIG.name}</strong> ("we", "our", or "us"), reachable at <code>{SITE_CONFIG.domain}</code>, accessible student privacy is one of our highest priorities. This Privacy Policy document outlines the types of information collected and recorded by {SITE_CONFIG.name} and how we use it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Past Paper Access & Downloading</h2>
          <p>
            Viewing and downloading past examination question papers on {SITE_CONFIG.name} does not require account registration or personal identity submission. Document downloads are served directly via Cloudinary infrastructure securely.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Information We Collect</h2>
          <p>
            We collect minimal personal data when you interact with our platform services:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li><strong>Contact Form Data:</strong> Name, email address, subject, and message submitted voluntarily via our contact form.</li>
            <li><strong>Log Files & Telemetry:</strong> Standard web server log data including IP address, browser type, ISP, operating system, date/time stamp, and referring pages for security and performance optimization.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Third-Party Services</h2>
          <p>
            We may partner with non-intrusive third-party advertising networks or analytics tools to measure performance and support platform operations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Contact Information</h2>
          <p>
            If you have questions or require more information about our Privacy Policy, please reach out via our <a href="/contact" className="text-blue-600 font-semibold hover:underline">Contact Form</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
