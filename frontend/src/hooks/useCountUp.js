import { useEffect, useState } from 'react';

export const useCountUp = (targetValue = 0, duration = 1200, startImmediately = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = Number(targetValue) || 0;
    if (end === 0 || !startImmediately) {
      setCount(end);
      return;
    }

    let startTime = null;
    let animationFrameId = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing: easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, duration, startImmediately]);

  return count;
};

export default useCountUp;
