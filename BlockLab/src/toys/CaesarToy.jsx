import { useState } from 'react';
import { A, shift } from '../lib/caesar.js';

const SECRET = 'MEET ME AT LUNCH';
const FRIEND_KEY = 5;
const CODED = shift(SECRET, FRIEND_KEY);
const angleOf = i => (i / 26) * Math.PI * 2 - Math.PI / 2;

function CipherWheel({ shiftBy }) {
  return (
    <svg className="wheel" viewBox="0 0 300 300" role="img" aria-label={`Cipher wheel turned to key ${shiftBy}`}>
      <circle cx="150" cy="150" r="146" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
      <circle cx="150" cy="150" r="104" fill="var(--amber-soft)" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="150" cy="24" r="15" fill="var(--amber)" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="150" cy="66" r="15" fill="var(--card)" stroke="var(--ink)" strokeWidth="2" />
      <path d="M150 40v10" stroke="var(--ink)" strokeWidth="2.5" />
      {A.split('').map((ch, i) => (
        <text key={ch} x={150 + Math.cos(angleOf(i)) * 126} y={150 + Math.sin(angleOf(i)) * 126 + 5} textAnchor="middle" fontSize="14" fill={i === 0 ? '#1B2440' : 'var(--ink)'}>{ch}</text>
      ))}
      {/* the inner ring turns backwards by the key, so the top shows A -> A+key */}
      <g className="inner" style={{ transform: `rotate(${(-shiftBy * 360) / 26}deg)` }}>
        {A.split('').map((ch, i) => (
          <text key={ch} x={150 + Math.cos(angleOf(i)) * 84} y={150 + Math.sin(angleOf(i)) * 84 + 5} textAnchor="middle" fontSize="14" fill="var(--teal)">{ch}</text>
        ))}
      </g>
      <circle cx="150" cy="150" r="62" fill="var(--card)" stroke="var(--ink)" strokeWidth="2" />
      <text x="150" y="144" textAnchor="middle" fontSize="12" fill="var(--muted)" style={{ fontFamily: 'var(--body)' }}>key</text>
      <text x="150" y="174" textAnchor="middle" fontSize="30" fill="var(--ink)">{shiftBy}</text>
    </svg>
  );
}

/* Lesson 1.1: turn the cipher wheel, watch letters change, crack a friend's note. */
export function CaesarToy() {
  const [key, setKey] = useState(3);
  const [msg, setMsg] = useState('Hello friend');
  const [tryKey, setTryKey] = useState(1);
  const cracked = tryKey === FRIEND_KEY;

  return (
    <>
      <div className="wheel-wrap">
        <CipherWheel shiftBy={key} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <div className="field">
            <label htmlFor="c-key">Key (shift): <span className="mono">{key}</span></label>
            <input type="range" id="c-key" min={1} max={25} value={key} onChange={e => setKey(Number(e.target.value))} />
          </div>
          <div className="field">
            <label htmlFor="c-msg">Your message</label>
            <input className="input" id="c-msg" maxLength={40} autoComplete="off" value={msg} onChange={e => setMsg(e.target.value)} />
          </div>
          <div className="tiles" aria-hidden="true">
            {msg.toUpperCase().slice(0, 24).split('').map((ch, i) => (/[A-Z]/.test(ch)
              ? <div className="tile" key={i}><span>{ch}</span><span>{shift(ch, key)}</span></div>
              : <div className="tile gap" key={i} />))}
          </div>
          <div className="field"><span className="lbl">Encrypted</span><div className="slab">{shift(msg, key) || ' '}</div></div>
        </div>
      </div>
      <hr className="dash" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p><b>Your friend passed you this note.</b> Find the key they used to read it.</p>
        <div className="slab" style={{ fontSize: 20, letterSpacing: '.08em' }}>{CODED}</div>
        <div className="grid2">
          <div className="field">
            <label htmlFor="c-fkey">Try a key: <span className="mono">{tryKey}</span></label>
            <input type="range" id="c-fkey" min={1} max={25} value={tryKey} onChange={e => setTryKey(Number(e.target.value))} />
          </div>
          <div className="field"><span className="lbl">Decrypted with that key</span><div className="slab">{shift(CODED, -tryKey)}</div></div>
        </div>
        {cracked
          ? <p className="note win"><b>Cracked it!</b> The key was {FRIEND_KEY}. The note says: {SECRET}.</p>
          : <p className="note">Slide the key until the note makes sense.</p>}
      </div>
    </>
  );
}
