import React from 'react';
import { FaCogs, FaDatabase, FaHdd, FaLock, FaCheckCircle } from 'react-icons/fa';
import Seo from '../../components/Seo';

const AdminSettings = () => {
  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Seo title="Platform Settings - Admin" description="EduTools LK platform configuration and storage parameters." />

      <div className="flex items-center gap-3 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="p-3 bg-slate-100 text-slate-700 rounded-2xl border border-slate-200">
          <FaCogs className="text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">System & Storage Settings</h1>
          <p className="text-xs text-slate-500">Platform environment status and storage architecture parameters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Storage Engine Status */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaHdd className="text-blue-600 text-lg" />
            <h2 className="text-base font-bold text-slate-900">PDF File Storage Layer</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold">Active Storage Driver</span>
              <span className="font-bold text-blue-600">Local Filesystem (`/uploads`)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold">Max File Upload Size</span>
              <span className="font-bold text-slate-800">10 MB (Configurable)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold">Allowed File Types</span>
              <span className="font-bold text-emerald-600">PDF Documents (`application/pdf`)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold">Cloud Migration Readiness</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <FaCheckCircle /> S3 / Cloudinary Driver Abstracted
              </span>
            </div>
          </div>
        </div>

        {/* Security Parameters */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaLock className="text-purple-600 text-lg" />
            <h2 className="text-base font-bold text-slate-900">Security & Authentication</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold">Password Encryption</span>
              <span className="font-bold text-purple-600">Bcrypt Salt Factor 10</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold">Session Token</span>
              <span className="font-bold text-slate-800">JWT (30-Day Expiry)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold">Rate Limiting</span>
              <span className="font-bold text-emerald-600">Active (Helmet & Express Rate Limiter)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold">Copyright Protection</span>
              <span className="font-bold text-blue-600">Mandatory Upload Permission Checkbox</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
