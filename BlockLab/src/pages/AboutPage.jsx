import { useLang } from '../context/LanguageContext.jsx';

export function AboutPage() {
  const { t } = useLang();
  return (
    <div className="about">
      <div className="about-body">
        <h1 style={{ fontSize: 'clamp(38px, 5vw, 56px)' }}>{t('about')}</h1>
        <section><h2>{t('whyH')}</h2><p>{t('whyP')}</p></section>
        <section><h2>{t('nowH')}</h2><p>{t('nowP')}</p></section>
        <section>
          <h2>{t('futureH')}</h2>
          <ol className="plan">{t('future').map(step => <li key={step}>{step}</li>)}</ol>
        </section>
      </div>
    </div>
  );
}
