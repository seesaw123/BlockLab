import { webcrypto } from 'node:crypto';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';
import { LanguageProvider } from '../src/context/LanguageContext.jsx';
import { BitcoinLabPage } from '../src/pages/BitcoinLabPage.jsx';
import { BitcoinLab } from '../src/state/bitcoin-lab.js';
import { LAB_COPY } from '../src/i18n/lab.js';
import { parseRoute } from '../src/hooks/useHashRoute.js';
if (!globalThis.crypto) globalThis.crypto = webcrypto;
const render = (lab, lang) => renderToString(<LanguageProvider initialLang={lang}><BitcoinLabPage lab={lab} onReset={() => {}} /></LanguageProvider>);
for (const lang of ['en', 'th', 'my']) {
  test(`lab renders empty, funded, pending and confirmed states in ${lang}`, () => {
    const lab = new BitcoinLab();
    expect(render(lab, lang)).toContain(LAB_COPY[lang].title);
    const a = lab.createWallet(), b = lab.createWallet(); lab.fund(a.address);
    const html = render(lab, lang); expect(html).toContain(a.publicKey); expect(html).not.toContain(a.privateKey);
    const tx = lab.send(a.address, b.address, '0.1'); expect(render(lab, lang)).toContain(tx.id);
    lab.mine(); expect(render(lab, lang)).toContain(lab.blocks[0].hash);
  });
}
test('the lab hash route is recognized without changing existing routes', () => {
  expect(parseRoute('#lab')).toEqual({ page: 'lab' });
  expect(parseRoute('#l-1-2')).toEqual({ page: 'lesson', id: '1-2' });
  expect(parseRoute('#about')).toEqual({ page: 'about' });
});
