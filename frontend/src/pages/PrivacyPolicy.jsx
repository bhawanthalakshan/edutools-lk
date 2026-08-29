import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import Seo from '../components/Seo';

const PrivacyPolicy = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <Seo
        title="Privacy Policy"
        description="EduTools LK Privacy Policy detailing user data protection, client-side tool privacy, and cookies guidelines."
      />

      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
          <FaShieldAlt className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Effective Date: August 29, 2026</p>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Introduction</h2>
          <p>
            At <strong>EduTools LK</strong> ("we", "our", or "us"), reachable at <code>https://edutools.lk</code>, accessible student privacy is one of our highest priorities. This Privacy Policy document outlines the types of information collected and recorded by EduTools LK and how we use it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Client-Side Tool Processing</h2>
          <p>
            All online calculators and utilities available on EduTools LK (including GPA Calculator, CGPA Calculator, Percentage Calculator, Age Calculator, Word Counter, and QR Code Generator) execute calculations locally within your web browser. We do not store or transmit your personal input data to external servers when you use these calculators.
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
          <h2 className="text-lg font-bold text-slate-900">4. Advertising & Third-Party Partners</h2>
          <p>
            We may partner with third-party advertising networks, such as Google AdSense, to display non-intrusive advertisements on our website. These partners may use cookies, web beacons, and JavaScript to measure ad effectiveness and personalize advertising content.
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
