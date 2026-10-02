import { ChainScene } from '../components/ChainScene.jsx';
import { ArrowIcon, ShieldIcon } from '../components/Icons.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { LESSONS, MISSIONS } from '../data/course.js';

function MissionCard({ mission }) {
  const { t, unitTitle, unitBlurb } = useLang();
  const { isDone } = useProgress();
  const lessons = LESSONS.filter(l => l.unit === mission.n);
  const doneCount = lessons.filter(l => isDone(l.id)).length;
  const status = !mission.live
    ? t('soon')
    : doneCount === mission.count ? t('doneBadge') : doneCount ? t('xDone')(doneCount, mission.count) : t('openNow');
  const body = (
    <>
      <span className={`eyebrow ${mission.live ? '' : 'dim'}`}>{t('unit')(mission.n)} · {t('lessonsN')(mission.count)}</span>
      <h3>{unitTitle(mission)}</h3>
      <p>{unitBlurb(mission)}</p>
      <span className="foot">{status}</span>
    </>
  );
  if (!mission.live) return <div className="mission soon">{body}</div>;
  const target = lessons.find(l => !isDone(l.id)) ?? lessons[0];
  return <a className="mission" href={`#l-${target.id}`}>{body}</a>;
}

export function HomePage() {
  const { t, lt } = useLang();
  const { count, nextLesson } = useProgress();
  const ctaLabel = count === 0 ? t('start1') : nextLesson ? `${t('cont')}: ${nextLesson.num} ${lt(nextLesson, 'title')}` : t('replay');

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="tag">{t('tag')}</span>
          <h1>{t('h1')}</h1>
          <p className="lede">{t('lede')}</p>
          <div className="cta">
            <a className="btn" href={`#l-${(nextLesson ?? LESSONS[0]).id}`}>{ctaLabel} <ArrowIcon /></a>
            <a className="btn ghost" href="#map">{t('seeMap')}</a>
          </div>
        </div>
        <div className="chain">
          <ChainScene />
          <div className="chain-ctl">
            <span className="chain-count">{t('chainYours')(count + 1)}</span>
            <span>{t('chainHint')}</span>
          </div>
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div className="section-head">
          <h2>{t('missions')}</h2>
          <a href="#map" style={{ fontWeight: 700 }}>{t('fullMap')}</a>
        </div>
        <div className="missions">
          {MISSIONS.map(m => <MissionCard key={m.n} mission={m} />)}
        </div>
      </section>

      <section className="safety">
        <ShieldIcon />
        <div style={{ flex: 1, minWidth: 220 }}>
          <h3>{t('safetyH')}</h3>
          <p>{t('safetyP')}</p>
        </div>
      </section>

      <footer className="site-foot"><span>{t('foot1')}</span><span>{t('foot2')}</span></footer>
    </>
  );
}
