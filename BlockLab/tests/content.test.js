import { expect, test } from 'vitest';
import { LESSONS, MISSIONS } from '../src/data/course.js';
import { EXPLAIN } from '../src/i18n/explain.js';
import { LESSON_TR, T, UNIT_TR } from '../src/i18n/strings.js';
import { TOYS } from '../src/toys/index.js';

test('every lesson has a toy and 3 quiz questions with a valid answer', () => {
  for (const l of LESSONS) {
    expect(TOYS[l.toy], `${l.id} toy`).toBeTruthy();
    expect(l.quiz).toHaveLength(3);
    for (const q of l.quiz) expect(q.a >= 0 && q.a < q.o.length, `${l.id}: ${q.q}`).toBe(true);
  }
});

test('Thai and Burmese have every interface string English has', () => {
  for (const lang of ['th', 'my']) {
    for (const k of Object.keys(T.en)) if (k !== 'englishNote') expect(k in T[lang], `${lang} is missing "${k}"`).toBe(true);
    for (const k of Object.keys(T.en.steps)) expect(T[lang].steps[k], `${lang} is missing step "${k}"`).toBeTruthy();
  }
});

test('every lesson and unit is translated into Thai and Burmese', () => {
  for (const lang of ['th', 'my']) {
    for (const l of LESSONS) for (const f of ['title', 'hook', 'toyTitle', 'goal']) expect(LESSON_TR[lang][l.id]?.[f], `${lang} ${l.id} ${f}`).toBeTruthy();
    for (const m of MISSIONS) expect(UNIT_TR[lang][m.n], `${lang} unit ${m.n}`).toBeTruthy();
  }
});

test('"Explained simply" exists in all three languages', () => {
  for (const [id, e] of Object.entries(EXPLAIN)) for (const lang of ['en', 'th', 'my']) expect(e[lang]?.length, `${id} ${lang}`).toBeGreaterThan(0);
});
