import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { LESSONS, UNITS } from '../data/course.js';
import { readStore, writeStore } from '../lib/storage.js';

const ProgressContext = createContext(null);
const KEY = 'blocklab-pilot-progress';

/* Which lessons the student has finished. Stored only in this browser:
   no accounts and no personal data. */
export function ProgressProvider({ children, initialDone }) {
  const [done, setDone] = useState(() => initialDone ?? readStore(KEY, {}));

  const markDone = useCallback(id => {
    setDone(prev => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      writeStore(KEY, next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setDone({});
    writeStore(KEY, {});
  }, []);

  const value = useMemo(() => {
    const isDone = id => Boolean(done[id]);
    const finished = LESSONS.filter(l => isDone(l.id));
    return {
      isDone,
      markDone,
      reset,
      finished,
      count: finished.length,
      total: LESSONS.length,
      nextLesson: LESSONS.find(l => !isDone(l.id)) ?? null,
      unitDone: n => LESSONS.filter(l => l.unit === n).every(l => isDone(l.id)),
      badgeFor: n => UNITS.find(u => u.n === n)?.badge
    };
  }, [done, markDone, reset]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
