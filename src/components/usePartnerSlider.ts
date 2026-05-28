import { useState, useEffect } from 'react';

export default function usePartnerSlider(total: number, visibleCount: number) {
  const [index, setIndex] = useState(0);
  const max = total - visibleCount;

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((p) => (p >= max ? 0 : p + 1));
    }, 3000);

    return () => clearInterval(id);
  }, [max]);

  return {
    index,
    prev: () => setIndex((p) => (p <= 0 ? max : p - 1)),
    next: () => setIndex((p) => (p >= max ? 0 : p + 1)),
  };
}