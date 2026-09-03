import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaGithub, FaTwitter, FaFacebook, FaEnvelope, FaFilePdf } from 'react-icons/fa';
import { SITE_CONFIG } from '../config/siteConfig';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerRef, isRevealed] = useScrollReveal();

  return (
    <footer
      ref={footerRef}
      className={`bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm mt-20 reveal-hidden ${
        isRevealed ? 'reveal-visible' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Column 1: Brand Header & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Exam<span className="text-blue-400">ora</span>
              </span>
            </Link>
            <p className="text-xs text-blue-400 font-bold tracking-wider uppercase">
              "{SITE_CONFIG.tagline}"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sri Lanka's dedicated past papers &amp; educational platform. Access G.C.E. O/L, G.C.E. A/L, and University past papers, marking schemes, and revision resources.
            </p>
          </div>

          {/* Column 2: Past Papers Navigation */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm tracking-wide flex items-center gap-1.5">
              <FaFilePdf className="text-blue-400 text-xs" />
              <span>Past Papers Library</span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/past-papers" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-semibold text-slate-300">All Past Papers Hub</Link></li>
              <li><Link to="/past-papers/ol" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">O/L Past Papers</Link></li>
              <li><Link to="/past-papers/al" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">A/L Past Papers</Link></li>
              <li><Link to="/past-papers/university" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">University Past Papers</Link></li>
              <li><Link to="/past-papers/ol/mathematics" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">O/L Mathematics Papers</Link></li>
              <li><Link to="/past-papers/al/physics" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">A/L Physics Papers</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform & Legal */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm tracking-wide">Platform &amp; Legal</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/education" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">Educational Streams</Link></li>
              <li><Link to="/tools" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">Student Calculators</Link></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">Blog &amp; Guides</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">About Examora</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">Terms &amp; Conditions</Link></li>
              <li><Link to="/disclaimer" className="hover:text-blue-400 transition-all hover:translate-x-1 inline-block">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Community */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm tracking-wide">Stay Updated</h3>
            <p className="text-xs text-slate-400 mb-3">Get notifications when new examination papers and marking schemes are published.</p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter student email"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                id="footer-newsletter-input"
              />
              <button
                type="button"
                className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 btn-press"
              >
                Join
              </button>
            </div>
            <div className="flex items-center space-x-4 mt-5 text-slate-400">
              <a href="#facebook" aria-label="Facebook" className="hover:text-blue-400 hover:-translate-y-1 transition-all"><FaFacebook className="text-base" /></a>
              <a href="#twitter" aria-label="Twitter" className="hover:text-blue-400 hover:-translate-y-1 transition-all"><FaTwitter className="text-base" /></a>
              <a href="#github" aria-label="GitHub" className="hover:text-blue-400 hover:-translate-y-1 transition-all"><FaGithub className="text-base" /></a>
              <a href="#contact" aria-label="Email" className="hover:text-blue-400 hover:-translate-y-1 transition-all"><FaEnvelope className="text-base" /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {currentYear} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Developed for Sri Lankan Education by{' '}
            <a
              href="https://www.linkedin.com/in/bhawantha-lakshan-056481372/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-300 hover:text-blue-400 transition-colors"
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
