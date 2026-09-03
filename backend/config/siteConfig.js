// Backend Centralized Domain & Site Config for Examora

const CUSTOM_DOMAIN = 'https://examora.lk';
const FALLBACK_DOMAIN = 'https://edutools-lk.vercel.app';

const getClientUrl = () => {
  if (process.env.CLIENT_URL) {
    return process.env.CLIENT_URL.replace(/\/$/, '');
  }
  return FALLBACK_DOMAIN;
};

module.exports = {
  SITE_NAME: 'Examora',
  LEGACY_NAME: 'EduTools LK',
  CUSTOM_DOMAIN,
  FALLBACK_DOMAIN,
  getClientUrl,
};
