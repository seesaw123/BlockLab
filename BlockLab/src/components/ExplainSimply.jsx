import { useRef } from 'react';
import { useLang } from '../context/LanguageContext.jsx';
import { EXPLAIN } from '../i18n/explain.js';
import { LANGS } from '../i18n/strings.js';
import { Rich } from './Rich.jsx';

/* Kid-friendly explanation with English / Thai / Burmese tabs. */
export function ExplainSimply({ lessonId }) {
  const { explainLang, setExplainLang } = useLang();
  const tabRefs = useRef({});
  const data = EXPLAIN[lessonId];
  const idea = data[`${explainLang}Idea`];

  const onKeyDown = (e, i) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const code = LANGS[(i + d + LANGS.length) % LANGS.length][0];
    setExplainLang(code);
    tabRefs.current[code]?.focus();
  };

  return (
    <div className="simple">
      <div className="tabs" role="tablist" aria-label="Language">
        {LANGS.map(([code, , name], i) => (
          <button
            key={code}
            ref={el => { tabRefs.current[code] = el; }}
            type="button"
            role="tab"
            id={`tab-${code}`}
            lang={code}
            aria-selected={code === explainLang}
            aria-controls="simple-panel"
            tabIndex={code === explainLang ? 0 : -1}
            onClick={() => setExplainLang(code)}
            onKeyDown={e => onKeyDown(e, i)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="simple-body" id="simple-panel" role="tabpanel" aria-labelledby={`tab-${explainLang}`} lang={explainLang}>
        {data[explainLang].map(p => <Rich key={p} html={p} />)}
        {idea && <div className="big-idea"><b>{idea[0]}</b><p>{idea[1]}</p></div>}
      </div>
    </div>
  );
}
