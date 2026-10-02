import { useLang } from '../context/LanguageContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { LANGS } from '../i18n/strings.js';
import { LogoIcon } from './Icons.jsx';

export function Header({ page }) {
  const { lang, setLang, t } = useLang();
  const { count, total } = useProgress();
  return (
    <header className="topbar">
      <div className="wrap topbar-in">
        <a className="logo" href="#home" aria-label="BlockLab home">
          <LogoIcon />
          BlockLab <span className="pill">Pilot</span>
        </a>
        <nav className="nav" aria-label="Main">
          <a href="#map" aria-current={page === 'map' ? 'page' : undefined}>{t('course')}</a>
          <a href="#about" aria-current={page === 'about' ? 'page' : undefined}>{t('about')}</a>
        </nav>
        <div className="meter">
          <span>{t('meter')(count, total)}</span>
          <div className="meter-bar" aria-hidden="true"><i style={{ width: `${(count / total) * 100}%` }} /></div>
        </div>
        <div className="langs" role="group" aria-label="Language">
          {LANGS.map(([code, label]) => (
            <button key={code} type="button" lang={code} aria-pressed={lang === code} onClick={() => setLang(code)}>{label}</button>
          ))}
        </div>
      </div>
    </header>
  );
}
