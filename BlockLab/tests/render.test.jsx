import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';
import { LanguageProvider } from '../src/context/LanguageContext.jsx';
import { ProgressProvider } from '../src/context/ProgressContext.jsx';
import { LESSONS } from '../src/data/course.js';
import { LESSON_TR, T } from '../src/i18n/strings.js';
import { AboutPage } from '../src/pages/AboutPage.jsx';
import { HomePage } from '../src/pages/HomePage.jsx';
import { LessonPage } from '../src/pages/LessonPage.jsx';
import { MapPage } from '../src/pages/MapPage.jsx';

const render = (node, lang, done = {}) => renderToString(
  <LanguageProvider initialLang={lang}>
    <ProgressProvider initialDone={done}>{node}</ProgressProvider>
  </LanguageProvider>
);

for (const lang of ['en', 'th', 'my']) {
  test(`every page renders in ${lang}`, () => {
    expect(render(<HomePage />, lang)).toContain(T[lang].h1);
    expect(render(<MapPage />, lang)).toContain(T[lang].mapH);
    expect(render(<AboutPage />, lang)).toContain(T[lang].futureH);
    for (const l of LESSONS) {
      const title = lang === 'en' ? l.title : LESSON_TR[lang][l.id].title;
      expect(render(<LessonPage lesson={l} />, lang), l.id).toContain(title.replace(/'/g, '&#x27;'));
    }
  });
}

test('the home page shows one chain block per finished lesson, plus START', () => {
  const html = render(<HomePage />, 'en', { '1-1': true, '1-2': true });
  expect(html).toContain('Your chain: 3 blocks');
  expect(html).toContain('LESSON 1.2');
});

test('the course map marks finished lessons and the next one', () => {
  const html = render(<MapPage />, 'en', { '1-1': true }).replace(/<!-- -->/g, '');
  expect(html).toContain('aria-label="Lesson 1.1 Caesar&#x27;s secret, Done"');
  expect(html).toMatch(/class="node next"[^>]*><i>1\.2<\/i>Next: Crack the code/);
});
