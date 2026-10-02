import { useEffect, useRef, useState } from 'react';
import { A, shift } from '../lib/caesar.js';
import { readStore, writeStore } from '../lib/storage.js';

const KEY = 7;
const CODED = shift('THIS IS EASY', KEY);
const LONG_KEY = 4;
const LONG_CODED = shift('MEET ME AT THE TREE NEAR THE GREEN GATE AT SEVEN', LONG_KEY);
const COUNTS = [...LONG_CODED.replace(/[^A-Z]/g, '')].reduce((c, ch) => ({ ...c, [ch]: (c[ch] || 0) + 1 }), {});
const MAX = Math.max(...Object.values(COUNTS));
const RACE_NOTES = ['HELLO FRIEND', 'MEET AT NOON', 'THE CAT IS HIDING', 'BRING SNACKS TO THE PARK', 'KEEPYOURKEYSECRET'];
const fmt = s => `${s.toFixed(1)} s`;

function BruteForce() {
  const [tried, setTried] = useState([]);
  const solved = tried.includes(KEY);
  const pick = k => { if (!solved && !tried.includes(k)) setTried([...tried, k]); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p><b>Part 1.</b> Here is every possible key applied to <span className="mono">{CODED}</span>. Click the one that reads like English.</p>
      <div className="shifts">
        {Array.from({ length: 25 }, (_, i) => i + 1).map(k => (
          <button key={k} type="button" className={`shift ${tried.includes(k) ? (k === KEY ? 'right' : 'wrong') : ''}`} onClick={() => pick(k)}>
            <small>{k}</small><span>{shift(CODED, -k)}</span>
          </button>
        ))}
      </div>
      {solved
        ? <p className="note win"><b>Cracked in {tried.length} {tried.length === 1 ? 'try' : 'tries'}.</b> The key was {KEY}. Brute force wins when there are only 25 keys.</p>
        : <p className="note">Tries so far: {tried.length}</p>}
    </div>
  );
}

function Frequency() {
  const [guess, setGuess] = useState('');
  const k = guess ? (A.indexOf(guess) - 4 + 26) % 26 : null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
      <p><b>Part 2.</b> A longer note is harder to scan by eye. Count the letters instead: the tallest bar is probably E in disguise.</p>
      <div className="slab" style={{ letterSpacing: '.06em' }}>{LONG_CODED}</div>
      <div className="freq" role="img" aria-label="Letter counts in the note">
        {A.split('').map(c => (
          <div key={c}><i className={COUNTS[c] === MAX ? 'top' : ''} style={{ height: `${((COUNTS[c] || 0) / MAX) * 100}%` }} /><span>{c}</span></div>
        ))}
      </div>
      <div className="grid2">
        <div className="field">
          <label htmlFor="k-guess">Which letter stands for E?</label>
          <input className="input" id="k-guess" maxLength={1} autoComplete="off" placeholder="?" value={guess} onChange={e => setGuess(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))} />
        </div>
        <div className="field"><span className="lbl">Result</span><div className="slab">{guess ? `Key ${k}: ${shift(LONG_CODED, -k)}` : 'Type one letter'}</div></div>
      </div>
    </div>
  );
}

function Race() {
  const [race, setRace] = useState(null); // { notes, i, start, sliderKey, locked }
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState(() => Number(readStore('blocklab-race-best', 0)) || null);
  const [result, setResult] = useState(null); // { secs, record }
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!race) return undefined;
    const id = setInterval(() => setElapsed((performance.now() - race.start) / 1000), 100);
    return () => clearInterval(id);
  }, [race?.start]); // eslint-disable-line react-hooks/exhaustive-deps

  // When a note is cracked, show it lit up briefly, then move on.
  useEffect(() => {
    if (!race?.locked) return undefined;
    const id = setTimeout(() => {
      if (race.i + 1 < race.notes.length) {
        setRace({ ...race, i: race.i + 1, sliderKey: 1, locked: false });
        return;
      }
      const secs = (performance.now() - race.start) / 1000;
      const record = !best || secs < best;
      if (record) { setBest(secs); writeStore('blocklab-race-best', secs); }
      setElapsed(secs);
      setResult({ secs, record });
      setRace(null);
    }, 600);
    return () => clearTimeout(id);
  }, [race, best]);

  const start = () => {
    setResult(null);
    setElapsed(0);
    setRace({
      notes: RACE_NOTES.map(m => { const key = 3 + Math.floor(Math.random() * 23); return { key, code: shift(m, key) }; }),
      i: 0, start: performance.now(), sliderKey: 1, locked: false
    });
    setTimeout(() => sliderRef.current?.focus(), 0);
  };

  const slide = k => {
    if (!race || race.locked) return;
    setRace({ ...race, sliderKey: k, locked: k === race.notes[race.i].key });
  };

  const note = race?.notes[race.i];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p><b>Part 3: Codebreaker race.</b> Crack 5 secret notes as fast as you can. Slide the key until the note makes sense, and the next one appears.</p>
      <div className="row">
        <button type="button" className="btn small" onClick={start}>{result ? 'Race again' : 'Start the race'}</button>
        <span className="stat" style={{ fontSize: 30 }}>{fmt(elapsed)}</span>
        <span style={{ fontWeight: 700, color: 'var(--muted)' }}>Your best: {best ? fmt(best) : 'none yet'}</span>
      </div>
      {race && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="eyebrow">Note {race.i + 1} of {race.notes.length}</span>
          <div className="slab" style={{ fontSize: 20, letterSpacing: '.06em' }}>{note.code}</div>
          <div className="field">
            <label htmlFor="r-key">Key: <span className="mono">{race.sliderKey}</span></label>
            <input ref={sliderRef} type="range" id="r-key" min={1} max={25} value={race.sliderKey} onChange={e => slide(Number(e.target.value))} />
          </div>
          <div className="slab">
            {race.locked ? <span className="diff">{shift(note.code, -race.sliderKey)}</span> : shift(note.code, -race.sliderKey)}
          </div>
        </div>
      )}
      {result && (
        <p className="note win race-done" role="status">
          {result.record
            ? <><b>New record: {fmt(result.secs)}!</b> Can you beat it? A computer would crack all five in under a millisecond, which is why real keys need to be much bigger.</>
            : <><b>Finished in {fmt(result.secs)}.</b> Your best is {fmt(best)}. Try again to beat it!</>}
        </p>
      )}
    </div>
  );
}

/* Lesson 1.2: brute force, letter frequency and the codebreaker race. */
export function CrackToy() {
  return (
    <>
      <BruteForce />
      <hr className="dash" />
      <Frequency />
      <hr className="dash" />
      <Race />
    </>
  );
}
