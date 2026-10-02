import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { sha256 } from '../lib/sha256.js';

const TARGET = sha256('hello');
const HEX = '0123456789abcdef';
const randomHex = () => HEX[Math.floor(Math.random() * 16)];
const sleep = ms => new Promise(r => setTimeout(r, ms));

function GuessTheWord() {
  const [draft, setDraft] = useState('');
  const [guesses, setGuesses] = useState(0);
  const [last, setLast] = useState(null); // { word, hash }
  const found = last?.hash === TARGET;

  const submit = e => {
    e.preventDefault();
    if (!draft || found || draft === last?.word) return;
    setGuesses(g => g + 1);
    setLast({ word: draft, hash: sha256(draft) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p><b>Part 1.</b> Which word makes this fingerprint?</p>
      <div className="slab">{TARGET}</div>
      <form className="grid2" onSubmit={submit}>
        <div className="field">
          <label htmlFor="o-guess">Your guess (press Enter)</label>
          <input className="input" id="o-guess" autoComplete="off" placeholder="Type a word" value={draft} onChange={e => setDraft(e.target.value)} onBlur={submit} />
        </div>
        <div className="field"><span className="lbl">Its fingerprint</span><div className="slab" style={{ fontSize: 14 }}>{last?.hash ?? ''}</div></div>
      </form>
      {found
        ? <p className="note win"><b>Got it in {guesses} {guesses === 1 ? 'guess' : 'guesses'}!</b> You found it by guessing, not by running the machine backwards. That’s the only way.</p>
        : <p className="note">Guesses so far: {guesses}.{last ? ' No match.' : ''} Hint: it’s the first word we hashed, all lowercase.</p>}
    </div>
  );
}

function SlotMachine() {
  const reduce = useReducedMotion();
  const [reels, setReels] = useState({ a: '?', b: '?', spinning: false });
  const [n, setN] = useState(0);
  const [tries, setTries] = useState(0);
  const [hash, setHash] = useState(null);
  const [won, setWon] = useState(false);
  const [busy, setBusy] = useState(false);
  const alive = useRef(true);
  const state = useRef({ n: 0, tries: 0, won: false });
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  // One pull: the next number, a new hash, and a short reel spin.
  const pull = async frames => {
    const s = state.current;
    if (s.won) { s.won = false; s.tries = 0; s.n = Math.floor(Math.random() * 100000); setWon(false); }
    s.n += 1; s.tries += 1;
    const h = sha256(`BlockLab${s.n}`);
    if (!reduce) {
      for (let f = 0; f < frames && alive.current; f++) {
        setReels({ a: randomHex(), b: randomHex(), spinning: true });
        await sleep(40);
      }
    }
    if (!alive.current) return true;
    setReels({ a: h[0], b: h[1], spinning: false });
    setN(s.n); setTries(s.tries); setHash(h);
    if (h.startsWith('00')) { s.won = true; setWon(true); }
    return s.won;
  };

  const pullOnce = async () => { setBusy(true); await pull(8); if (alive.current) setBusy(false); };
  const autoSpin = async () => {
    setBusy(true);
    if (state.current.won) await pull(2);
    for (let i = 0; i < 50 && alive.current && !state.current.won; i++) await pull(2);
    if (alive.current) setBusy(false);
  };

  const reelClass = ch => `reel${reels.spinning ? ' spin' : ch === '0' ? ' hit' : ''}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p><b>Part 2: The hash slot machine.</b> Each pull adds the next number to the word <span className="mono">BlockLab</span> and makes a new fingerprint. You win when it starts with <span className="mono">00</span>.</p>
      <div className="slots">
        <div className="slot-top"><b>Hash slot machine</b><span>Jackpot = 0 0</span></div>
        <div className="reels" aria-hidden="true"><div className={reelClass(reels.a)}>{reels.a}</div><div className={reelClass(reels.b)}>{reels.b}</div></div>
        <div className="slab" style={{ fontSize: 14 }}>
          <span className="same">BlockLab</span>{n} →{' '}
          {hash ? (hash.startsWith('00') ? <><span className="diff">00</span>{hash.slice(2)}</> : hash) : 'pull the lever to start'}
        </div>
        <div className="row">
          <button type="button" className="btn" disabled={busy} onClick={pullOnce}>Pull the lever</button>
          <button type="button" className="btn small ghost" disabled={busy} onClick={autoSpin}>Auto-spin 50</button>
          <span className="tries">Tries: <span className="mono">{tries}</span></span>
        </div>
      </div>
      {won
        ? <p className="note win" role="status"><b>Jackpot after {tries} {tries === 1 ? 'try' : 'tries'}!</b> On average it takes about 256. Bitcoin miners play this same game, with far more zeros. Pull again to start a new hunt.</p>
        : <p className="note" role="status">Each pull is a brand-new guess. There’s no shortcut.</p>}
    </div>
  );
}

/* Lesson 2.3: hashes only run one way, so the only route back is guessing. */
export function OneWayToy() {
  return (
    <>
      <GuessTheWord />
      <hr className="dash" />
      <SlotMachine />
    </>
  );
}
