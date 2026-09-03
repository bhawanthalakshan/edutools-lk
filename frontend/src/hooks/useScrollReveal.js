import { useEffect, useRef, useState } from 'react';

export const useScrollReveal = (options = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }) => {
  const elementRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    // If IntersectionObserver is not supported or reduced motion is preferred
    if (!('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsRevealed(true);
        observer.unobserve(node); // Once revealed, stop observing
      }
    }, options);

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [options]);

  return [elementRef, isRevealed];
};

export default useScrollReveal;
