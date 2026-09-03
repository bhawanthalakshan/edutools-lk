// Centralized Brand, Site, and Domain Configuration for Examora

const CUSTOM_DOMAIN = 'https://examora.lk';
const FALLBACK_DOMAIN = 'https://edutools-lk.vercel.app';

// Detect active production domain dynamically via VITE_SITE_URL or fallback
export const getActiveDomain = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/$/, '');
  }
  return FALLBACK_DOMAIN;
};

export const SITE_CONFIG = {
  name: 'Examora',
  legacyName: 'EduTools LK',
  tagline: 'Find. Practice. Achieve.',
  heroHeadline: 'Sri Lankan Past Papers, All in One Place',
  heroSubtitle: 'Find O/L, A/L and University past papers by subject, year, medium and paper type.',
  customDomain: CUSTOM_DOMAIN,
  fallbackDomain: FALLBACK_DOMAIN,
  get domain() {
    return getActiveDomain();
  },
  defaultTitle: 'Past Papers Sri Lanka | O/L, A/L & University | Examora',
  defaultDescription: 'Find Sri Lankan G.C.E. O/L, G.C.E. A/L, and University past papers by subject, year, medium and paper type. View and download past papers easily on Examora.',
  defaultOgImage: `${getActiveDomain()}/favicon.svg`,
  twitterHandle: '@ExamoraLK',
  contactEmail: 'support@examora.lk',
};

export const getCanonicalUrl = (pathname = '') => {
  const cleanPath = pathname.split('?')[0].split('#')[0];
  const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${SITE_CONFIG.domain}${formattedPath}`;
};

export const getPageTitle = (pageTitle) => {
  if (!pageTitle) return SITE_CONFIG.defaultTitle;
  if (pageTitle.includes(SITE_CONFIG.name)) return pageTitle;
  return `${pageTitle} | ${SITE_CONFIG.name}`;
};
