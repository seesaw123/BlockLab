import { useReducer, useState } from 'react';
import { useLang } from '../context/LanguageContext.jsx';
import { labText } from '../i18n/lab.js';
import { verify } from '../lib/lab-keys.js';
import { FEE, formatBTC, transactionMessage } from '../state/bitcoin-lab.js';
import '../styles/lab.css';

function KeyValue({ label, value }) {
  return <div className="lab-key"><span>{label}</span><code>{value}</code></div>;
}
function Transfer({ tx, lab, c, confirmations, onTamper }) {
  return <article className="lab-tx">
    <div className="lab-row"><strong>{lab.wallets.find(w => w.address === tx.from)?.name} → {lab.wallets.find(w => w.address === tx.to)?.name}</strong><span>{formatBTC(tx.amount)} BTC</span></div>
    <p className="lab-status">{c.signed}{confirmations ? ` · ${c.confirmations}: ${confirmations}` : ''}</p>
    <details><summary>{c.details}</summary>
      <KeyValue label="ID (simulation)" value={tx.id} />
      <KeyValue label="ECDSA r || s" value={tx.signature} />
      <KeyValue label={c.public} value={tx.publicKey} />
      <KeyValue label="JSON" value={transactionMessage(tx)} />
      <p>{c.inputCount}: {tx.inputs.length} · {c.change}: {formatBTC(tx.outputs.filter(o => o.address === tx.from).reduce((sum, o) => sum + o.sats, 0))} BTC</p>
    </details>
    <button type="button" className="btn ghost lab-small" onClick={() => onTamper(tx)}>{c.tamper}</button>
  </article>;
}
export function BitcoinLabPage({ lab, onReset }) {
  const { lang } = useLang(), c = labText(lang);
  const [, refresh] = useReducer(n => n + 1, 0);
  const [notice, setNotice] = useState('');
  const [revealed, setRevealed] = useState([]);
  const [resetting, setResetting] = useState(false);
  const [sender, setSender] = useState(0), [amount, setAmount] = useState('0.1');
  function act(fn, success) {
    try { fn(); setNotice(success); } catch (e) {
      setNotice(({ amount: 'amountError', balance: 'balanceError', wallet: 'walletError' })[e.message] || (e.message.includes('randomness') ? 'unsupported' : 'error'));
    }
    refresh();
  }
  function tamper(tx) {
    const altered = { ...tx, outputs: tx.outputs.map((o, i) => i === 0 ? { ...o, sats: o.sats + 1 } : o) };
    setNotice(!verify(transactionMessage(altered), tx.signature, tx.publicKey) ? 'tampered' : 'error');
  }
  return <section className="lab-page">
    <header className="lab-heading"><span className="tag">{c.badge}</span><h1>{c.title}</h1><p className="lede">{c.intro}</p></header>
    <aside className="lab-warning">{c.warning}</aside>
    <ol className="lab-steps">{c.steps.map(s => <li key={s}>{s}</li>)}</ol>
    <p className="lab-notice" role="status" aria-live="polite">{c[notice] || ''}</p>
    <div className="lab-wallets">{['Alice', 'Bob'].map((name, i) => {
      const w = lab.wallets[i];
      return <article className="lab-panel" key={name}>
        <div className="lab-row"><h2>{name}</h2><span className="lab-avatar" aria-hidden="true">{name[0]}</span></div>
        {w ? <>
          <div className="lab-balance"><strong>{formatBTC(lab.balance(w.address))}</strong><span> BTC · {c.available}</span></div>
          <p>{c.pending}: {formatBTC(lab.pending(w.address))} BTC</p>
          <KeyValue label={c.address} value={w.address} /><KeyValue label={c.public} value={w.publicKey} />
          <button type="button" className="btn ghost lab-small" aria-expanded={revealed.includes(i)} onClick={() => setRevealed(prev => prev.includes(i) ? prev.filter(v => v !== i) : [...prev, i])}>{revealed.includes(i) ? c.hide : c.reveal}</button>
          {revealed.includes(i) && <KeyValue label={c.private} value={w.privateKey} />}
          <p className="lab-help">{c.keyHelp}</p>
          <button type="button" className="btn" disabled={w.funded} onClick={() => act(() => lab.fund(w.address), 'successFund')}>{c.fund}</button>
          <details><summary>{c.utxos}</summary>{lab.utxos.filter(u => u.address === w.address && !u.locked).map(u => <KeyValue key={u.id} label={`${formatBTC(u.sats)} BTC`} value={u.id} />)}</details>
        </> : <><p>{c.emptyWallet}</p><button type="button" className="btn" disabled={i !== lab.wallets.length} onClick={() => act(() => lab.createWallet(), 'successWallet')}>{c.create}</button></>}
      </article>;
    })}</div>
    <div className="lab-grid">
      <section className="lab-panel"><h2>{c.send}</h2>
        <form onSubmit={e => { e.preventDefault(); act(() => lab.send(lab.wallets[sender]?.address, lab.wallets[1 - sender]?.address, amount), 'successSend'); }}>
          <label htmlFor="lab-from">{c.sender}</label><select id="lab-from" value={sender} disabled={lab.wallets.length < 2} onChange={e => setSender(Number(e.target.value))}><option value={0}>Alice</option><option value={1}>Bob</option></select>
          <label htmlFor="lab-to">{c.receiver}</label><input id="lab-to" value={sender ? 'Alice' : 'Bob'} readOnly />
          <label htmlFor="lab-amount">{c.amount}</label><input id="lab-amount" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} required autoComplete="off" />
          <p className="lab-help">{c.fee}</p><button className="btn" type="submit" disabled={lab.wallets.length < 2}>{c.send}</button>
        </form>
      </section>
      <section className="lab-panel"><div className="lab-row"><h2>{c.pool} <span className="pill">{lab.mempool.length}</span></h2><button type="button" className="btn" onClick={() => act(() => lab.mine(), 'successMine')}>{c.mine}</button></div>
        {lab.mempool.length ? lab.mempool.map(tx => <Transfer key={tx.id} tx={tx} lab={lab} c={c} onTamper={tamper} />) : <p className="lab-empty">{c.empty}</p>}
      </section>
    </div>
    <section className="lab-panel"><h2>{c.blocks}</h2>
      {lab.blocks.length ? [...lab.blocks].reverse().map(b => <details className="lab-block" key={b.height} open>
        <summary>{c.block} #{b.height} · {b.transactions.length} {c.transfers}</summary>
        <KeyValue label="Hash (simulation)" value={b.hash} /><KeyValue label="Previous hash" value={b.previous} />
        {b.transactions.map(tx => <Transfer key={tx.id} tx={tx} lab={lab} c={c} confirmations={lab.blocks.length - b.height + 1} onTamper={tamper} />)}
      </details>) : <p>{c.noBlocks}</p>}
    </section>
    <details className="lab-panel"><summary>{c.limitsTitle}</summary><p>{c.limits}</p></details>
    <footer className="lab-footer"><p>{c.resetNote}</p>
      {resetting ? <div role="group" aria-label={c.resetQuestion}><p>{c.resetQuestion}</p><button type="button" className="btn" onClick={onReset}>{c.confirmReset}</button>{' '}<button type="button" className="btn ghost" onClick={() => setResetting(false)}>{c.cancel}</button></div> : <button type="button" className="btn ghost" onClick={() => setResetting(true)}>{c.reset}</button>}
    </footer>
  </section>;
}
