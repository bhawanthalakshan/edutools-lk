// Centralized SEO and Domain Configuration for EduTools LK
export const SITE_CONFIG = {
  name: 'EduTools LK',
  domain: 'https://edutools-lk.vercel.app',
  defaultTitle: 'EduTools LK — Past Papers, Education & Student Utilities',
  defaultDescription: 'Download free Sri Lankan G.C.E. O/L, G.C.E. A/L, and University past papers, marking schemes, and student tools on EduTools LK.',
  defaultOgImage: 'https://edutools-lk.vercel.app/favicon.svg',
  twitterHandle: '@EduToolsLK',
};

export const getCanonicalUrl = (pathname = '') => {
  const cleanPath = pathname.split('?')[0].split('#')[0];
  const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${SITE_CONFIG.domain}${formattedPath}`;
};
