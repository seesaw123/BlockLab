import { Fragment, useState } from 'react';
import { ArrowIcon, BADGE_ICONS, CheckIcon, LockIcon } from '../components/Icons.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { LESSONS, MISSIONS } from '../data/course.js';

function LessonNode({ lesson }) {
  const { t, lt } = useLang();
  const { isDone, nextLesson } = useProgress();
  const title = lt(lesson, 'title');
  if (isDone(lesson.id)) {
    return <a className="node done" href={`#l-${lesson.id}`} aria-label={`${t('lesson')} ${lesson.num} ${title}, ${t('stDone')}`}><CheckIcon /></a>;
  }
  if (nextLesson?.id === lesson.id) {
    return <a className="node next" href={`#l-${lesson.id}`}><i>{lesson.num}</i>{t('next')}: {title}</a>;
  }
  return <a className="node" href={`#l-${lesson.id}`} aria-label={`${t('lesson')} ${lesson.num} ${title}`}>{lesson.num}</a>;
}

function UnitRow({ mission }) {
  const { t, unitTitle } = useLang();
  const { isDone, nextLesson } = useProgress();

  if (!mission.live) {
    const nums = Array.from({ length: mission.count }, (_, i) => `${mission.n}.${i + 1}`);
    return (
      <div className="urow soon">
        <div className="uname"><span className="eyebrow dim">{t('unit')(mission.n)} · {t('afterPilot')}</span><h2>{unitTitle(mission)}</h2></div>
        <div className="track">
          {nums.map((num, i) => (
            <Fragment key={num}>
              {i > 0 && <span className="link" />}
              {mission.n === 6 && i === nums.length - 1
                ? <span className="node vault"><LockIcon />{num} {t('vault')}</span>
                : <span className="node">{num}</span>}
            </Fragment>
          ))}
        </div>
        <span className="count">0 / {mission.count}</span>
      </div>
    );
  }

  const lessons = LESSONS.filter(l => l.unit === mission.n);
  const doneCount = lessons.filter(l => isDone(l.id)).length;
  const current = nextLesson?.unit === mission.n;
  const state = doneCount === lessons.length ? t('stDone') : current ? t('stProg') : t('stOpen');
  return (
    <div className={`urow ${current ? 'current' : ''}`}>
      <div className="uname"><span className="eyebrow">{t('unit')(mission.n)} · {state}</span><h2>{unitTitle(mission)}</h2></div>
      <div className="track">
        {lessons.map((l, i) => (
          <Fragment key={l.id}>
            {i > 0 && <span className={`link ${isDone(l.id) || nextLesson?.id === l.id ? 'on' : ''}`} />}
            <LessonNode lesson={l} />
          </Fragment>
        ))}
      </div>
      <span className="count">{doneCount} / {lessons.length}</span>
    </div>
  );
}

function ResetButton() {
  const { t } = useLang();
  const { reset } = useProgress();
  const [asking, setAsking] = useState(false);
  if (!asking) return <button type="button" className="linkbtn" onClick={() => setAsking(true)}>{t('reset')}</button>;
  return (
    <span className="confirm">
      {t('resetQ')}{' '}
      <button type="button" className="btn small" onClick={() => { reset(); setAsking(false); }}>{t('erase')}</button>
      <button type="button" className="btn small ghost" onClick={() => setAsking(false)}>{t('keep')}</button>
    </span>
  );
}

export function MapPage() {
  const { t } = useLang();
  const { count, total, nextLesson, unitDone } = useProgress();
  const badges = [['Codebreaker', unitDone(1)], ['Hash hero', unitDone(2)], ['Key keeper', false]];

  return (
    <div className="map">
      <div className="rows">
        <h1>{t('mapH')}</h1>
        <details className="station-folder" open>
          <summary className="station-summary">
            <svg className="station-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9V6a2 2 0 0 1 2-2h7l4 5h11a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
              <path d="M3 10h26" />
            </svg>
            <span className="station-name">Station-1</span>
          </summary>
          <div className="station-units">
            {MISSIONS.map(m => <UnitRow key={m.n} mission={m} />)}
          </div>
        </details>
      </div>
      <aside className="side">
        <div className="progress-card">
          <span style={{ fontWeight: 700, color: 'var(--slab-dim)' }}>{t('progress')}</span>
          <span className="big">{t('meter')(count, total)}</span>
          <div className="pbar"><i style={{ width: `${(count / total) * 100}%` }} /></div>
          <small>{t('progNote')}</small>
          {nextLesson && (
            <a className="btn small" href={`#l-${nextLesson.id}`} style={{ background: '#F2B441', borderColor: '#F2B441', color: '#1B2440', boxShadow: 'none' }}>
              {count ? t('cont') : t('startBtn')} {nextLesson.num} <ArrowIcon />
            </a>
          )}
        </div>
        <div className="badges">
          <h3>{t('badges')}</h3>
          <div className="badge-grid">
            {badges.map(([name, won]) => (
              <div key={name} className={`badge ${won ? 'won' : ''}`}><i>{BADGE_ICONS[name]}</i>{t(name)}</div>
            ))}
          </div>
          <ResetButton />
        </div>
      </aside>
    </div>
  );
}

