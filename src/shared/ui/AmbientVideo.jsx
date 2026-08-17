'use client';

import { useEffect, useRef } from 'react';

export function AmbientVideo({
  src = '/Media/meridian%20video.mp4',
  className = '',
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set muted DOM properties directly for cross-browser autoplay compliance
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;

    const playVideo = () => {
      if (video.paused) {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch(() => {
            // Autoplay policy fallback
          });
        }
      }
    };

    // Immediate attempt
    playVideo();

    // Event listener fallbacks when video buffer is ready
    video.addEventListener('canplay', playVideo);
    video.addEventListener('loadeddata', playVideo);
    video.addEventListener('loadedmetadata', playVideo);

    // Fallback on first user interaction if browser restricted unprompted playback
    const handleFirstInteraction = () => {
      playVideo();
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true });

    return () => {
      video.removeEventListener('canplay', playVideo);
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('loadedmetadata', playVideo);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Video Background Layer - High Clarity Full-Bleed (z-index: 0) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-90 transition-opacity duration-500"
        style={{
          mixBlendMode: 'normal',
        }}
      >
        <source src={src} type="video/mp4" />
        <source src="/media/meridian%20video.mp4" type="video/mp4" />
        <source src="/media/meridian video.mp4" type="video/mp4" />
      </video>

      {/* Subtle bottom edge feather layer (z-index: 1) - Preserves video clarity across the hero */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 75%, color-mix(in srgb, var(--surface-0) 50%, transparent) 90%, var(--surface-0) 100%)',
        }}
      />
    </div>
  );
}

export default AmbientVideo;


