'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { CalendarDays, Clock, X } from 'lucide-react';
import { Button } from './Button';

export function DateTimePicker({ value, onChange, placeholder = 'Set due date' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const date = value ? new Date(value) : null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleDaySelect = (day) => {
    if (!day) return;
    const merged = date ? new Date(day) : new Date(day);
    if (date) {
      merged.setHours(date.getHours(), date.getMinutes(), 0, 0);
    } else {
      merged.setHours(12, 0, 0, 0);
    }
    onChange(merged.toISOString());
  };

  const handleTimeChange = (e) => {
    if (!e.target.value) return;
    const [h, m] = e.target.value.split(':').map(Number);
    const merged = date ? new Date(date) : new Date();
    merged.setHours(h, m, 0, 0);
    onChange(merged.toISOString());
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  const formattedLabel = date
    ? date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : placeholder;

  return (
    <div className="relative inline-block" ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className="gap-2 h-9 px-3 text-xs border-line bg-surface-0 hover:bg-surface-2 transition-colors"
      >
        <CalendarDays className="w-3.5 h-3.5 text-primary" />
        <span className={date ? 'font-medium text-ink-900' : 'text-ink-600'}>
          {formattedLabel}
        </span>
        {date && (
          <span
            role="button"
            onClick={handleClear}
            className="ml-1 p-0.5 rounded-full hover:bg-surface-2 text-ink-600 hover:text-ink-900"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 sm:left-auto sm:right-0 z-50 mt-2 rounded-2xl border border-line bg-surface-1 shadow-e3 p-4 text-ink-900 w-[310px]"
            style={{
              '--rdp-accent-color': 'hsl(var(--primary))',
              '--rdp-accent-background-color': 'hsl(var(--primary) / 0.15)',
              '--rdp-day-height': '34px',
              '--rdp-day-width': '34px',
            }}
          >
            <div className="flex justify-center meridian-day-picker">
              <DayPicker
                mode="single"
                selected={date ?? undefined}
                onSelect={handleDaySelect}
                className="text-xs m-0"
              />
            </div>

            <div className="flex items-center gap-2 mt-3 border-t border-line pt-3">
              <Clock className="w-4 h-4 text-ink-600 shrink-0" />
              <input
                type="time"
                value={date ? date.toTimeString().slice(0, 5) : '12:00'}
                onChange={handleTimeChange}
                className="flex-1 rounded-lg border border-line bg-surface-0 px-2 py-1 text-xs text-ink-900 font-mono-data focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button size="sm" type="button" onClick={() => setOpen(false)} className="text-xs h-7 px-3">
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
