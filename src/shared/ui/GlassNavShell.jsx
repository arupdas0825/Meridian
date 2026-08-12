'use client';

export function GlassNavShell({ children, className = '' }) {
  return (
    <nav
      className={`relative border border-[color-mix(in_srgb,var(--ink-900)_8%,transparent)]
                  bg-[color-mix(in_srgb,var(--surface-1)_55%,transparent)]
                  backdrop-blur-[20px] backdrop-saturate-[1.6] shadow-e3
                  supports-[not(backdrop-filter:blur(1px))]:bg-surface-1
                  ${className}`}
    >
      {children}
    </nav>
  );
}
