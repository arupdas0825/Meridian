'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

export function AnimatedNumber({ value, formatter = (v) => Math.round(v).toLocaleString(), className }) {
  const nodeRef = useRef(null);
  const prevValue = useRef(typeof value === 'number' ? value : 0);

  useEffect(() => {
    if (value === null || value === undefined) return;
    const node = nodeRef.current;
    const start = typeof prevValue.current === 'number' ? prevValue.current : 0;
    const end = typeof value === 'number' ? value : 0;

    const controls = animate(start, end, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        if (node) node.textContent = formatter(latest);
      },
    });
    prevValue.current = end;
    return () => controls.stop();
  }, [value, formatter]);

  return (
    <span ref={nodeRef} className={className}>
      {value !== null && value !== undefined ? formatter(value) : '—'}
    </span>
  );
}
