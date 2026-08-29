import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaUser, FaClock } from 'react-icons/fa';
import Seo from '../../components/Seo';
import api from '../../services/api';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/contact')
      .then((res) => {
        setMessages(res.data?.data || []);
      })
      .catch((err) => console.error('Failed to load contact messages:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Seo title="Contact Messages - Admin" description="View user contact form inquiries and feedback." />

      <div className="flex items-center gap-3 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
          <FaEnvelope className="text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">User Contact Messages</h1>
          <p className="text-xs text-slate-500">Inquiries and tool suggestions submitted by students.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm animate-pulse">
            Fetching user messages...
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg._id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-blue-600 text-xs" />
                    <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                    <span className="text-xs text-slate-500">({msg.email})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <FaClock />
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Subject: {msg.subject}
                  </span>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            No contact messages received yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactMessages;
