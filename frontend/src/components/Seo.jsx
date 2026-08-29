import { useEffect } from 'react';

const Seo = ({ title, description, image, type = 'website' }) => {
  useEffect(() => {
    const baseTitle = 'EduTools LK';
    const tagline = 'Learn Smart. Achieve More.';
    const fullTitle = title ? `${title} | ${baseTitle} - ${tagline}` : `${baseTitle} - ${tagline}`;
    const defaultDesc = 'EduTools LK is an educational resources and free online tools platform for students and learners in Sri Lanka.';
    const finalDesc = description || defaultDesc;
    const currentUrl = window.location.href;
    const defaultOgImage = 'https://edutools.lk/favicon.svg';
    const finalOgImage = image || defaultOgImage;

    // 1. Document Title
    document.title = fullTitle;

    // Helper function to set or create meta tag
    const setMetaTag = (selector, propertyName, propertyValue, contentValue) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(propertyName, propertyValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // 2. Standard Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', finalDesc);

    // 3. Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', finalDesc);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', finalOgImage);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', baseTitle);

    // 4. Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);
  }, [title, description, image, type]);

  return null;
};

export default Seo;
