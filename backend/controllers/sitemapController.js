const Subject = require('../models/Subject');
const University = require('../models/University');
const Course = require('../models/Course');
const Module = require('../models/Module');
const PastPaper = require('../models/PastPaper');

const BASE_URL = process.env.CLIENT_URL || 'https://edutools-lk.vercel.app';

const generateSitemap = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ active: true });
    const universities = await University.find({ active: true });
    const courses = await Course.find({ active: true }).populate('university');
    const modules = await Module.find({ active: true }).populate({
      path: 'course',
      populate: { path: 'university' },
    });
    const papers = await PastPaper.find({ status: 'published' }).select('slug updatedAt');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static Core Pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/past-papers', priority: '1.0', changefreq: 'daily' },
      { url: '/past-papers/ol', priority: '0.9', changefreq: 'weekly' },
      { url: '/past-papers/al', priority: '0.9', changefreq: 'weekly' },
      { url: '/past-papers/university', priority: '0.9', changefreq: 'weekly' },
      { url: '/education', priority: '0.8', changefreq: 'weekly' },
      { url: '/tools', priority: '0.8', changefreq: 'weekly' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/about', priority: '0.5', changefreq: 'monthly' },
      { url: '/contact', priority: '0.5', changefreq: 'monthly' },
    ];

    staticPages.forEach((p) => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${p.url}</loc>\n`;
      xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
      xml += `    <priority>${p.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Subject URLs
    subjects.forEach((s) => {
      const levelPath = s.examType.toLowerCase();
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/past-papers/${levelPath}/${s.slug}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // University URLs
    universities.forEach((u) => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/past-papers/university/${u.slug}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Course URLs
    courses.forEach((c) => {
      if (c.university) {
        xml += `  <url>\n`;
        xml += `    <loc>${BASE_URL}/past-papers/university/${c.university.slug}/${c.slug}</loc>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
    });

    // Module URLs
    modules.forEach((m) => {
      if (m.course && m.course.university) {
        xml += `  <url>\n`;
        xml += `    <loc>${BASE_URL}/past-papers/university/${m.course.university.slug}/${m.course.slug}/${m.slug}</loc>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
    });

    // Individual Paper URLs
    papers.forEach((paper) => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/past-papers/detail/${paper.slug}</loc>\n`;
      xml += `    <lastmod>${paper.updatedAt ? paper.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    next(error);
  }
};

module.exports = { generateSitemap };
