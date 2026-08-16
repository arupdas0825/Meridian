'use client';

import { useEffect, useRef } from 'react';

export function AmbientVideo({
  src = '/media/atlas%20showcase.mp4',
  poster = '/media/atlas showcase-poster.jpg',
  className = '',
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback for strict browser autoplay
      });
    }
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Video Background Layer - Clear Visibility */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-50 dark:opacity-60 transition-opacity duration-700"
      >
        <source src={src} type="video/mp4" />
        <source src="/media/atlas-showcase.mp4" type="video/mp4" />
      </video>

      {/* Subtle Readability Safe Zone - Light gradient that keeps center text readable while preserving full video visibility */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, color-mix(in srgb, var(--surface-0) 30%, transparent) 0%, color-mix(in srgb, var(--surface-0) 12%, transparent) 55%, transparent 100%)',
        }}
      />
    </div>
  );
}

export default AmbientVideo;
