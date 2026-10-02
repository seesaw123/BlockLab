import { useEffect, useRef, useState } from 'react';
import { sha256 } from '../lib/sha256.js';

const SAMPLES = [
  ['hello', 'hello'],
  ['Hello', 'Hello'],
  ['', 'Nothing at all'],
  ['Once upon a time, in a village between two rivers, there lived a girl who could read any code she found. One day she found a note that no one else could read.', 'A whole story']
];

function gearPath(teeth, r) {
  const pts = [];
  for (let k = 0; k < teeth * 4; k++) {
    const a = (k / (teeth * 4)) * Math.PI * 2;
    const rad = k % 4 < 2 ? r : r * 0.78;
    pts.push(`${(32 + Math.cos(a) * rad).toFixed(1)} ${(32 + Math.sin(a) * rad).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z M40 32a8 8 0 1 0 -16 0a8 8 0 1 0 16 0Z`;
}
const GEAR_A = gearPath(10, 30);
const GEAR_B = gearPath(8, 30);
const asLines = hash => hash.match(/.{1,16}/g).join('\n');

/* Bumps a counter each time `value` changes after the first render, so CSS
   animations restart (the receipt prints again, the gears turn). */
function useReplay(value) {
  const [run, setRun] = useState(0);
  const previous = useRef(value);
  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    setRun(r => r + 1);
  }, [value]);
  return run;
}

/* Lesson 2.1: feed the machine, get a printed SHA-256 receipt. */
export function HashToy() {
  const [input, setInput] = useState('hello');
  const [second, setSecond] = useState('');
  const [busy, setBusy] = useState(false);
  const hashA = sha256(input);
  const hashB = sha256(second);
  const match = hashA === hashB;
  const printA = useReplay(input);
  const printB = useReplay(second);

  useEffect(() => {
    if (!printA) return undefined;
    setBusy(true);
    const id = setTimeout(() => setBusy(false), 750);
    return () => clearTimeout(id);
  }, [printA]);

  return (
    <>
      <div className={`machine ${busy ? 'run' : ''}`}>
        <div className="hopper">
          <label htmlFor="h-in">Feed the machine: type anything</label>
          <input className="input" id="h-in" autoComplete="off" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className="funnel" aria-hidden="true" />
        <div className="mbody" aria-hidden="true">
          <svg className="gear g1" viewBox="0 0 64 64"><path d={GEAR_A} fill="#F2B441" fillRule="evenodd" stroke="#0B1020" strokeWidth="2" /></svg>
          <div className="mlabel"><b>SHA-256</b><span className="lights"><i /><i /><i /></span></div>
          <svg className="gear g2" viewBox="0 0 64 64"><path d={GEAR_B} fill="#7CC4B8" fillRule="evenodd" stroke="#0B1020" strokeWidth="2" /></svg>
        </div>
        <div className="mslot" aria-hidden="true" />
        <div className={`receipt ${printA ? 'print' : ''}`} key={`a${printA}`}>
          <span className="rc-top">FINGERPRINT · {hashA.length} CHARACTERS</span>
          <div className="rc-hash" aria-live="polite">{asLines(hashA)}</div>
        </div>
      </div>

      <div className="row" role="group" aria-label="Try these" style={{ justifyContent: 'center' }}>
        {SAMPLES.map(([text, label]) => (
          <button key={label} type="button" className="btn small ghost" onClick={() => setInput(text)}>{label}</button>
        ))}
      </div>

      <hr className="dash" />
      <p><b>Challenge:</b> make this second machine print the <i>exact same</i> fingerprint as the first one.</p>
      <div className="grid2" style={{ alignItems: 'start' }}>
        <div className="field">
          <label htmlFor="h-in2">Second machine</label>
          <input className="input" id="h-in2" autoComplete="off" placeholder="Type here" value={second} onChange={e => setSecond(e.target.value)} />
        </div>
        <div className={`receipt small ${printB ? 'print' : ''}`} key={`b${printB}`}>
          <span className="rc-top">FINGERPRINT</span>
          <div className="rc-hash">{asLines(hashB)}</div>
          {match && <div className="stamp">MATCH!</div>}
        </div>
      </div>
      {match
        ? <p className="note win"><b>They match!</b> The only way was to type exactly the same thing. Same input, same fingerprint.</p>
        : <p className="note">The fingerprints don’t match yet.</p>}
    </>
  );
}
