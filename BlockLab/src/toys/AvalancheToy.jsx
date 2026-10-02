import { useState } from 'react';
import { bitsOf } from '../lib/caesar.js';
import { sha256 } from '../lib/sha256.js';

/* Lesson 2.2: change one letter and see how many bits of the hash flip. */
export function AvalancheToy() {
  const [a, setA] = useState('hello');
  const [b, setB] = useState('Hello');
  const ha = sha256(a);
  const hb = sha256(b);
  const bitsA = bitsOf(ha);
  const bitsB = bitsOf(hb);
  const flipped = [...bitsA].map((bit, i) => bit !== bitsB[i]);
  const flips = flipped.filter(Boolean).length;
  const chars = [...hb].filter((c, i) => c !== ha[i]).length;
  const same = a === b;

  return (
    <>
      <div className="grid2">
        <div className="field"><label htmlFor="v-a">Message A</label><input className="input" id="v-a" autoComplete="off" value={a} onChange={e => setA(e.target.value)} /></div>
        <div className="field"><label htmlFor="v-b">Message B</label><input className="input" id="v-b" autoComplete="off" value={b} onChange={e => setB(e.target.value)} /></div>
      </div>
      <div className="field"><span className="lbl">Fingerprint A</span><div className="slab">{ha}</div></div>
      <div className="field">
        <span className="lbl">Fingerprint B · <span style={{ color: 'var(--ink)' }}>highlighted characters changed</span></span>
        <div className="slab">{[...hb].map((c, i) => <span key={i} className={c === ha[i] ? 'same' : 'diff'}>{c}</span>)}</div>
      </div>
      <div className="field">
        <span className="lbl">Bits that flipped (256 in total)</span>
        <div className="bits" aria-hidden="true">{flipped.map((on, i) => <i key={i} className={on ? 'on' : ''} />)}</div>
      </div>
      {same
        ? <p className="note">The messages are the same, so the fingerprints are identical. Change one letter in Message B.</p>
        : <p className="note win"><b>{flips} of 256 bits flipped</b> and {chars} of 64 characters changed. That’s the avalanche.</p>}
    </>
  );
}
