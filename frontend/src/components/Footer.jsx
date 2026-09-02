import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaGithub, FaTwitter, FaFacebook, FaEnvelope, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Column 1: Brand Header & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl shadow-md">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                EduTools <span className="text-blue-400">LK</span>
              </span>
            </Link>
            <p className="text-xs text-purple-300 font-semibold tracking-wider uppercase">
              "Learn Smart. Achieve More."
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students and learners across Sri Lanka with free online calculators, academic resources, and AI learning tools.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/education" className="hover:text-blue-400 transition-colors">Educational Resources</Link></li>
              <li><Link to="/tools" className="hover:text-blue-400 transition-colors">Free Digital Tools</Link></li>
              <li><Link to="/ai-learning" className="hover:text-blue-400 transition-colors">AI Learning Hub</Link></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog & Guides</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">Legal</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/disclaimer" className="hover:text-blue-400 transition-colors">Disclaimer</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About EduTools LK</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Community */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">Subscribe & Connect</h3>
            <p className="text-xs text-slate-400 mb-3">Receive weekly updates on new tools and study resources.</p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter student email"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                id="footer-newsletter-input"
              />
              <button
                type="button"
                className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Join
              </button>
            </div>
            <div className="flex items-center space-x-4 mt-5 text-slate-400">
              <a href="#facebook" aria-label="Facebook" className="hover:text-blue-400 transition-colors"><FaFacebook className="text-base" /></a>
              <a href="#twitter" aria-label="Twitter" className="hover:text-blue-400 transition-colors"><FaTwitter className="text-base" /></a>
              <a href="#github" aria-label="GitHub" className="hover:text-blue-400 transition-colors"><FaGithub className="text-base" /></a>
              <a href="#contact" aria-label="Email" className="hover:text-blue-400 transition-colors"><FaEnvelope className="text-base" /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {currentYear} EduTools LK. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Developed by{' '}
            <a
              href="https://www.linkedin.com/in/bhawantha-lakshan-056481372/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-300 hover:text-blue-400 transition-colors"
            >
              Bhawantha Lakshan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
