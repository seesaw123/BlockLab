import { useEffect, useMemo, useState } from 'react';
import { ExplainSimply } from '../components/ExplainSimply.jsx';
import { ArrowIcon, BackIcon, ChainIcon, CheckIcon } from '../components/Icons.jsx';
import { NoteSwap } from '../components/NoteSwap.jsx';
import { Quiz } from '../components/Quiz.jsx';
import { Rich } from '../components/Rich.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { LESSONS, UNITS } from '../data/course.js';
import { EXPLAIN } from '../i18n/explain.js';
import { TOYS } from '../toys/index.js';

/* Highlights the step the student is reading in the side menu. */
function useCurrentStep(ids) {
  const [current, setCurrent] = useState(ids[0]);
  const key = ids.join(',');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const order = key.split(',');
    const inView = new Set();
    // Keep every section that crosses the reading band, then pick the first in lesson order.
    const spy = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) inView.add(e.target.id);
        else inView.delete(e.target.id);
      }
      const first = order.find(id => inView.has(id));
      if (first) setCurrent(first);
    }, { rootMargin: '-20% 0px -55% 0px' });
    order.forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });
    return () => spy.disconnect();
  }, [key]);
  return current;
}

export function LessonPage({ lesson }) {
  const { lang, t, lt, unitTitle } = useLang();
  const { isDone } = useProgress();
  const index = LESSONS.indexOf(lesson);
  const prev = LESSONS[index - 1];
  const next = LESSONS[index + 1];
  const unit = UNITS.find(u => u.n === lesson.unit);
  const Toy = TOYS[lesson.toy];
  const hasSwap = lesson.toy === 'caesar';
  const hasExplain = Boolean(EXPLAIN[lesson.id]);

  const steps = useMemo(
    () => ['hook', 'try', ...(hasSwap ? ['play'] : []), 'what', ...(hasExplain ? ['simple'] : []), 'real', 'check'],
    [hasSwap, hasExplain]
  );
  const current = useCurrentStep(steps);
  const currentIndex = steps.indexOf(current);

  const goTo = id => e => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toyHeading = lang === 'en'
    ? `Try it: ${lesson.toyTitle.charAt(0).toLowerCase()}${lesson.toyTitle.slice(1)}`
    : `${t('steps').try}: ${lt(lesson, 'toyTitle')}`;

  return (
    <div className="lesson">
      <nav className="steps" aria-label="Lesson steps">
        <span className="eyebrow">{t('lesson')} {lesson.num} · {lesson.min} {t('min')}</span>
        {steps.map((id, i) => (
          <a
            key={id}
            href={`#l-${lesson.id}`}
            onClick={goTo(id)}
            className={i === currentIndex ? 'here' : i < currentIndex ? 'past' : undefined}
            aria-current={i === currentIndex ? 'step' : undefined}
          >
            <i>{i < currentIndex && <CheckIcon size={14} />}</i>{t('steps')[id]}
          </a>
        ))}
        <a className="back" href="#map"><BackIcon /> {t('courseMap')}</a>
      </nav>

      <div className="col">
        <section id="hook">
          <span className="eyebrow">{t('unit')(unit.n)} · {unitTitle(unit)}{isDone(lesson.id) ? ` · ${t('lessonDone')}` : ''}</span>
          <h1>{lt(lesson, 'title')}</h1>
          <p className="hook">{lt(lesson, 'hook')}</p>
          {lang !== 'en' && <p className="lang-note">{t('englishNote')}{hasExplain ? ` ${t('englishNoteU1')}` : ''}</p>}
        </section>

        <section id="try">
          <div className="bench">
            <div className="bench-head">
              <h2>{toyHeading}</h2>
              <span className="goal">{t('goal')}: {lt(lesson, 'goal')}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
              <Toy />
            </div>
          </div>
        </section>

        {hasSwap && (
          <section id="play">
            <h2 className="sec">{t('steps').play}</h2>
            <NoteSwap />
          </section>
        )}

        <section id="what">
          <h2 className="sec">{t('steps').what}</h2>
          <div className="prose">{lesson.what.map(p => <Rich key={p} html={p} />)}</div>
        </section>

        {hasExplain && (
          <section id="simple">
            <h2 className="sec">{t('steps').simple}</h2>
            <p style={{ color: 'var(--muted)', fontSize: 17 }}>{t('simpleSub')}</p>
            <ExplainSimply lessonId={lesson.id} />
          </section>
        )}

        <section id="real">
          <div className="real">
            <ChainIcon />
            <div><h2>{t('steps').real}</h2><Rich html={lesson.real} /></div>
          </div>
        </section>

        <section id="check">
          <h2 className="sec">{t('steps').check}</h2>
          <Quiz lesson={lesson} />
        </section>

        <div className="lesson-foot">
          {prev
            ? <a className="prev" href={`#l-${prev.id}`}><BackIcon /> {prev.num} {lt(prev, 'title')}</a>
            : <a className="prev" href="#map"><BackIcon /> {t('courseMap')}</a>}
          <a className="btn" href={next ? `#l-${next.id}` : '#map'}>
            {next ? `${t('nextBtn')}: ${lt(next, 'title')}` : t('backMap')} <ArrowIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
