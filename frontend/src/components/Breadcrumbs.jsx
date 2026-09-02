import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import { SITE_CONFIG } from '../config/seoConfig';

const Breadcrumbs = ({ items = [] }) => {
  // Generate JSON-LD BreadcrumbList
  const jsonLdItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_CONFIG.domain,
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.label,
      item: item.url ? `${SITE_CONFIG.domain}${item.url}` : undefined,
    })),
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: jsonLdItems,
  };

  return (
    <nav aria-label="Breadcrumb" className="my-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
        <li className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <FaHome className="text-slate-400 text-xs" />
          <Link to="/">Home</Link>
        </li>

        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <FaChevronRight className="text-[10px] text-slate-300 shrink-0" />
            {item.url ? (
              <Link to={item.url} className="hover:text-blue-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-bold truncate max-w-xs">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
