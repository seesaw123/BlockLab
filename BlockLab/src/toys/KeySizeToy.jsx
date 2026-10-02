import { useState } from 'react';
import { crackTime, formatKeys, humanTime, YEAR } from '../lib/keys.js';

function BikeLock() {
  const [dials, setDials] = useState(3);
  const [grown, setGrown] = useState(false);
  const codes = 10 ** dials;
  const seconds = codes * 5;
  const mood = seconds < 86400
    ? ['thief happy', '“Easy! I’ll be done before dinner.”']
    : seconds < YEAR * 2 ? ['thief', '“Ugh, this will take a while…”'] : ['thief sad', '“I give up!” More dials made the lock safe.'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p><b>Part 1: The bike lock.</b> A thief tries one code every 5 seconds. Add dials and see how long the thief needs to try every code.</p>
      <div className="lockwrap">
        <div className="lockscroll">
          <div className="lock" role="img" aria-label={`Bike lock with ${dials} dials`}>
            <div className="shackle" style={{ width: Math.max(96, dials * 52 - 30) }} />
            <div className="lockbody">
              <div className="dials">
                {Array.from({ length: dials }, (_, i) => {
                  const d = (i * 7 + 3) % 10;
                  return (
                    <div key={i} className={`dial ${grown && i === dials - 1 ? 'new' : ''}`}>
                      <span>{(d + 9) % 10}</span><span className="mid">{d}</span><span>{(d + 1) % 10}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <div className="row">
            <button type="button" className="btn small ghost" disabled={dials <= 1} onClick={() => { setGrown(false); setDials(dials - 1); }}>Remove a dial</button>
            <button type="button" className="btn small" disabled={dials >= 10} onClick={() => { setGrown(true); setDials(dials + 1); }}>Add a dial</button>
          </div>
          <div className="field"><span className="lbl">Possible codes</span><div className="stat">{codes.toLocaleString('en')}</div></div>
          <div className="field"><span className="lbl">Time for the thief to try them all</span><div className="stat" style={{ fontSize: 26 }}>{humanTime(seconds)}</div></div>
          <p className={mood[0]}><b>Thief:</b> {mood[1]}</p>
        </div>
      </div>
    </div>
  );
}

function CoinBits() {
  const [bits, setBits] = useState(8);
  const [time, level] = crackTime(bits);
  const impossible = level === 'Impossible';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p><b>Part 2: Computer keys are coin flips.</b> Each bit is one coin flip, heads or tails. Every extra coin doubles the number of keys.</p>
      <div className="field">
        <label htmlFor="b-bits">Key size: <span className="mono">{bits}</span> coin flips (bits)</label>
        <input type="range" id="b-bits" min={1} max={256} value={bits} onChange={e => setBits(Number(e.target.value))} />
      </div>
      <div className="row" role="group" aria-label="Quick picks">
        {[[5, 'Caesar (about 5 bits)'], [40, '40 bits'], [128, '128 bits'], [256, 'Bitcoin key: 256 bits']].map(([b, label]) => (
          <button key={b} type="button" className="btn small ghost" onClick={() => setBits(b)}>{label}</button>
        ))}
      </div>
      <div className="bits coins" aria-hidden="true">
        {Array.from({ length: 256 }, (_, i) => <i key={i} className={i < bits ? 'on' : ''} />)}
      </div>
      <div className="grid2">
        <div className="field"><span className="lbl">Possible keys</span><div className="stat mono" style={{ fontSize: 24, wordBreak: 'break-all' }}>{formatKeys(bits)}</div></div>
        <div className="field"><span className="lbl">Time to try them all at 1 billion guesses per second</span><div className="stat" style={{ fontSize: 26 }}>{time}</div></div>
      </div>
      <p className={impossible ? 'note win' : 'note'}>
        <b>{level}.</b> {impossible ? 'No computer on Earth could guess this key.' : 'Keep sliding right to make the key safer.'}
      </p>
    </div>
  );
}

/* Lesson 1.3: a bike lock with growing dials, then key size in bits. */
export function KeySizeToy() {
  return (
    <>
      <BikeLock />
      <hr className="dash" />
      <CoinBits />
    </>
  );
}
