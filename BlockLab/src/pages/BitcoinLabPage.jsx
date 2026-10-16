import { useReducer, useState } from 'react';
import { useLang } from '../context/LanguageContext.jsx';
import { guidedLabText, labText } from '../i18n/lab.js';
import { ArrowIcon } from '../components/Icons.jsx';
import { FEE, formatBTC, transactionMessage } from '../state/bitcoin-lab.js';
import '../styles/lab.css';

const STEP_LABELS = ['meet', 'fund', 'send', 'wait', 'confirm'];

function ProgressStep({ index, current, label }) {
  const state = index < current ? 'done' : index === current ? 'active' : 'upcoming';
  return <li className={`guided-progress-step is-${state}`} aria-current={state === 'active' ? 'step' : undefined}>
    <span className="guided-progress-dot" aria-hidden="true">{state === 'done' ? '✓' : index}</span>
    <span>{label}</span>
  </li>;
}

function WalletCard({ name, role, balance, availableLabel }) {
  return <article className="guided-wallet">
    <div className="guided-wallet-head">
      <div className="guided-person"><span className="guided-avatar" aria-hidden="true">{name[0]}</span><strong>{name}</strong></div>
      <span>{role}</span>
    </div>
    <strong className="guided-balance">{balance} BTC</strong>
    <span className="guided-wallet-help">{availableLabel}</span>
  </article>;
}

function TechnicalDetails({ lab, copy, onReset }) {
  const alice = lab.wallets[0];
  const bob = lab.wallets[1];
  const tx = lab.mempool[0] || lab.blocks.at(-1)?.transactions[0];
  return <details className="guided-details">
    <summary>{copy.details}</summary>
    <div className="guided-detail-grid">
      <div><strong>{copy.feeLabel}</strong><code>{formatBTC(FEE)} BTC</code></div>
      <div><strong>{copy.networkLabel}</strong><span>{lab.blocks.length ? copy.confirmed : tx ? copy.pending : copy.notSent}</span></div>
      {alice && <div><strong>Alice · {copy.address}</strong><code>{alice.address}</code></div>}
      {bob && <div><strong>Bob · {copy.address}</strong><code>{bob.address}</code></div>}
      {alice && <div><strong>Alice · Public key</strong><code>{alice.publicKey}</code></div>}
      {bob && <div><strong>Bob · Public key</strong><code>{bob.publicKey}</code></div>}
      {tx && <><div><strong>{copy.transactionId}</strong><code>{tx.id}</code></div><div><strong>{copy.signature}</strong><code>{tx.signature}</code></div><div><strong>JSON</strong><code>{transactionMessage(tx)}</code></div></>}
      {lab.blocks.at(-1) && <div><strong>Block hash</strong><code>{lab.blocks.at(-1).hash}</code></div>}
    </div>
    <p>{copy.technicalNote}</p>
    <button type="button" className="guided-btn guided-btn-secondary" onClick={onReset}>{copy.reset}</button>
  </details>;
}

export function BitcoinLabPage({ lab, onReset }) {
  const { lang } = useLang();
  const copy = guidedLabText(lang);
  const legacyCopy = labText(lang);
  const [, refresh] = useReducer(n => n + 1, 0);
  const [step, setStep] = useState(1);
  const [notice, setNotice] = useState(null);

  const stepCopy = copy.steps[step - 1];
  const tx = lab.mempool[0] || lab.blocks.at(-1)?.transactions[0];
  const expectedChange = tx?.outputs.find(output => output.address === lab.wallets[0]?.address)?.sats;
  const balances = step === 4
    ? [expectedChange ? (expectedChange / 100000000).toFixed(3) : '0.900', '0.000']
    : [0, 1].map(index => {
      const wallet = lab.wallets[index];
      return wallet ? (lab.balance(wallet.address) / 100000000).toFixed(3) : '0.000';
    });

  function runAction() {
    try {
      if (step === 1) {
        while (lab.wallets.length < 2) lab.createWallet();
      } else if (step === 2) {
        if (!lab.wallets[0]) while (lab.wallets.length < 2) lab.createWallet();
        if (!lab.wallets[0].funded) lab.fund(lab.wallets[0].address);
      } else if (step === 3) {
        if (!lab.mempool.length && !lab.blocks.length) lab.send(lab.wallets[0]?.address, lab.wallets[1]?.address, '0.1');
      } else if (step === 4) {
        if (lab.mempool.length) lab.mine();
      } else {
        setNotice({ kind: 'finished' });
        return;
      }
      refresh();
      setNotice({ kind: 'success', step });
      setStep(current => Math.min(5, current + 1));
    } catch (error) {
      const key = ({ amount: 'amountError', balance: 'balanceError', wallet: 'walletError' })[error.message] || 'error';
      setNotice({ kind: 'error', key });
    }
  }

  function goBack() {
    setNotice(null);
    setStep(current => Math.max(1, current - 1));
  }

  const noticeText = notice?.kind === 'success' ? copy.steps[notice.step - 1].success
    : notice?.kind === 'error' ? legacyCopy[notice.key]
      : notice?.kind === 'finished' ? copy.finished : '';

  return <section className="guided-lab-page">
    <header className="guided-story-intro">
      <span className="guided-eyebrow">{copy.eyebrow}</span>
      <h1>{copy.title}</h1>
      <p>{copy.intro}</p>
    </header>

    <ol className="guided-progress" aria-label={copy.progressLabel}>
      {STEP_LABELS.map((key, index) => <ProgressStep key={key} index={index + 1} current={step} label={copy.progress[key]} />)}
    </ol>

    <section className="guided-step-card">
      <header className="guided-step-head">
        <span className="guided-action-icon" aria-hidden="true"><ArrowIcon /></span>
        <div><h2>{stepCopy.title}</h2><p>{stepCopy.description}</p></div>
      </header>

      <div className="guided-wallet-transfer">
        <WalletCard name="Alice" role={stepCopy.aliceRole} balance={balances[0]} availableLabel={copy.available} />
        <span className="guided-transfer-arrow" aria-hidden="true"><ArrowIcon /></span>
        <WalletCard name="Bob" role={stepCopy.bobRole} balance={balances[1]} availableLabel={copy.available} />
      </div>

      <div className="guided-status-row"><strong>{stepCopy.statusLabel}</strong><span>{stepCopy.statusValue}</span></div>
      <div className="guided-tip"><strong>{stepCopy.tipLabel}</strong><p>{stepCopy.tip}</p></div>
      <p className="guided-notice" role="status" aria-live="polite">{noticeText}</p>

      <div className="guided-actions">
        <button type="button" className="guided-btn guided-btn-secondary" onClick={goBack} disabled={step === 1}>{stepCopy.back}</button>
        <button type="button" className="guided-btn guided-btn-primary" onClick={runAction}>{stepCopy.primary}</button>
      </div>

      <TechnicalDetails lab={lab} copy={copy} onReset={onReset} />
    </section>
  </section>;
}
