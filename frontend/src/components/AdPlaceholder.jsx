import React from 'react';

/**
 * AdPlaceholder - Reusable Google AdSense-Ready Ad Slot Component
 * @param {string} type - 'banner' | 'rectangle' | 'inline' | 'sidebar'
 * @param {string} slotId - Optional AdSense slot ID for future monetization
 * @param {string} clientPublisherId - Optional AdSense ca-pub ID
 */
const AdPlaceholder = ({ type = 'banner', slotId, clientPublisherId, className = '' }) => {
  // If publisher ID is provided in future, render Google AdSense ins tag
  if (clientPublisherId && slotId) {
    return (
      <div className={`my-6 flex justify-center ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={clientPublisherId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    );
  }

  // Non-intrusive AdSense-ready placeholder container for layout monetization readiness
  return (
    <div
      className={`my-6 p-4 rounded-2xl border border-dashed border-slate-300/80 bg-slate-100/60 text-center flex flex-col items-center justify-center transition-colors ${className}`}
      aria-label="Advertisement Slot"
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Advertisement
      </span>
    </div>
  );
};

export default AdPlaceholder;
