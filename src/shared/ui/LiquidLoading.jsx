'use client';

import React, { useState, useEffect } from 'react';

export const LiquidLoading = () => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(0);
  const [heights, setHeights] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [droplets, setDroplets] = useState([false, false, false, false, false, false, false]);

  const colors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-purple-500',
    'from-cyan-400 to-blue-500',
    'from-green-400 to-cyan-400',
    'from-yellow-400 to-green-400',
    'from-orange-400 to-yellow-400',
    'from-red-500 to-orange-400',
  ];

  const shadowColors = [
    '#a855f7',
    '#3b82f6',
    '#06b6d4',
    '#10b981',
    '#eab308',
    '#f97316',
    '#ef4444',
  ];

  useEffect(() => {
    setMounted(true);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) * 0.001;
      setTime(elapsed);

      setHeights((prev) =>
        prev.map((_, index) => {
          const maxHeight = 80;
          const delay = index * 0.8;
          const primaryWave = Math.sin(elapsed + delay);
          const bounceWave = Math.sin(elapsed * 4 + delay) * 0.15;
          const ripple = Math.sin(elapsed * 8 + delay) * 0.05;
          const combinedWave = primaryWave + bounceWave + ripple;
          return maxHeight * combinedWave;
        })
      );

      setDroplets((prev) =>
        prev.map((_, index) => {
          const delay = index * 0.8;
          const waveValue = Math.sin(elapsed + delay);
          return waveValue > 0.8;
        })
      );
    }, 32);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-end space-x-3 sm:space-x-4 p-4 sm:p-8 justify-center min-h-[140px]" />
    );
  }

  return (
    <div className="flex items-end space-x-3 sm:space-x-4 p-4 sm:p-8 justify-center min-h-[140px]">
      {heights.map((height, index) => {
        const shadowColor = shadowColors[index] || '#a855f7';
        const isDropletActive = droplets[index];

        return (
          <div key={index} className="relative flex flex-col items-center">
            {/* Droplet with liquid physics */}
            <div
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r ${colors[index]} mb-2 sm:mb-3 transition-all duration-500 ease-out ${
                isDropletActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                filter: 'blur(0.5px)',
                transform: isDropletActive
                  ? `translateY(${Math.sin(time * 8 + index * 0.5) * 3}px) scale(${
                      0.8 + Math.sin(time * 6 + index * 0.3) * 0.4
                    })`
                  : 'translateY(10px) scale(0.5)',
                boxShadow: isDropletActive ? `0 0 15px ${shadowColor}40` : 'none',
              }}
            />

            {/* Main liquid bar with enhanced physics */}
            <div
              className={`w-7 sm:w-10 bg-gradient-to-t ${colors[index]} rounded-full transition-all duration-200 ease-out relative overflow-hidden shadow-lg`}
              style={{
                height: `${Math.abs(height)}px`,
                transform: height < 0 ? 'scaleY(-1)' : 'scaleY(1)',
                transformOrigin: 'bottom',
                filter: 'blur(0.3px)',
                boxShadow: `0 0 20px ${shadowColor}50, inset 0 0 20px rgba(255,255,255,0.1)`,
              }}
            >
              {/* Liquid surface tension effect */}
              <div
                className="absolute top-0 left-0 right-0 h-3 sm:h-4 bg-gradient-to-b from-white/40 to-transparent rounded-full"
                style={{
                  transform: `translateY(${Math.sin(time * 3 + index * 0.5) * 1}px) scaleY(${
                    0.8 + Math.sin(time * 4 + index * 0.3) * 0.3
                  })`,
                }}
              />

              {/* Liquid wave effect */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-t from-white/30 via-white/10 to-transparent"
                style={{
                  transform: `translateY(${Math.sin(time * 2 + index * 0.5) * 2}px)`,
                }}
              />

              {/* Shimmer effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
                style={{
                  transform: `translateX(${Math.sin(time * 1.5 + index * 0.7) * 8}px)`,
                  width: '140%',
                  left: '-20%',
                }}
              />

              {/* Bubble effect */}
              <div
                className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/30 rounded-full"
                style={{
                  top: `${20 + Math.sin(time * 3 + index * 0.8) * 10}%`,
                  left: `${30 + Math.sin(time * 2 + index * 0.6) * 20}%`,
                  transform: `scale(${0.5 + Math.sin(time * 4 + index * 0.4) * 0.5})`,
                  opacity: Math.sin(time * 5 + index * 0.9) * 0.3 + 0.3,
                }}
              />
            </div>

            {/* Enhanced base droplet with liquid physics */}
            <div
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r ${colors[index]} mt-2 transition-all duration-300`}
              style={{
                opacity: Math.sin(time * 3 + index * 0.9) * 0.4 + 0.6,
                transform: `scale(${0.6 + Math.sin(time * 2 + index * 0.6) * 0.4}) translateY(${
                  Math.sin(time * 4 + index * 0.8) * 1
                }px)`,
                filter: 'blur(0.2px)',
                boxShadow: `0 2px 8px ${shadowColor}40`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LiquidLoading;
