import { useRef, useState } from 'react';
import { shift } from '../lib/caesar.js';
import { KeyIcon } from './Icons.jsx';

/* Lesson 1.1 "Play with a friend": write a secret note, copy it, and read a
   friend's note with the key they say out loud. Nothing is stored or sent. */
export function NoteSwap() {
  const [msg, setMsg] = useState('');
  const [key, setKey] = useState(7);
  const [incoming, setIncoming] = useState('');
  const [readKey, setReadKey] = useState(7);
  const [status, setStatus] = useState('');
  const outRef = useRef(null);
  const msgRef = useRef(null);

  const secret = msg.trim() ? shift(msg, key) : '';
  const decoded = incoming.trim() ? shift(incoming, -readKey) : '';

  const copy = () => {
    if (!secret) { setStatus('Write a message first.'); msgRef.current?.focus(); return; }
    const selectInstead = () => {
      const range = document.createRange();
      range.selectNodeContents(outRef.current);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      setStatus('Selected. Copy it with Ctrl+C or a long press.');
    };
    try {
      navigator.clipboard.writeText(secret).then(() => setStatus('Copied! Send it to a friend.'), selectInstead);
    } catch {
      selectInstead();
    }
  };

  return (
    <>
      <p style={{ fontSize: 19, maxWidth: '38em' }}>Be a secret agent. Write a note only your friend can read, then swap devices or send it over chat.</p>
      <div className="swap">
        <div className="paper send">
          <span className="eyebrow">Step 1 · Write</span>
          <h3>Your secret note</h3>
          <div className="field">
            <label htmlFor="sw-msg">Your message</label>
            <input ref={msgRef} className="input" id="sw-msg" maxLength={60} autoComplete="off" placeholder="Meet me at the library" value={msg} onChange={e => setMsg(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="sw-key">Pick a key: <span className="mono">{key}</span></label>
            <input type="range" id="sw-key" min={1} max={25} value={key} onChange={e => setKey(Number(e.target.value))} />
          </div>
          <span className="lbl">What your friend will see</span>
          <div ref={outRef} className={`scribble ${secret ? '' : 'empty'}`}>{secret || 'Your secret note appears here'}</div>
          <div className="row">
            <button type="button" className="btn small" onClick={copy}>Copy secret note</button>
            <span role="status" style={{ fontWeight: 700, color: 'var(--muted)', fontSize: 15 }}>{status}</span>
          </div>
        </div>
        <div className="paper recv">
          <span className="eyebrow">Step 2 · Read</span>
          <h3>A note from your friend</h3>
          <div className="field">
            <label htmlFor="sw-in">Paste their secret note</label>
            <input className="input" id="sw-in" autoComplete="off" placeholder="TLLA TL HA AOL SPIYHYF" value={incoming} onChange={e => setIncoming(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="sw-rkey">The key they told you: <span className="mono">{readKey}</span></label>
            <input type="range" id="sw-rkey" min={1} max={25} value={readKey} onChange={e => setReadKey(Number(e.target.value))} />
          </div>
          <span className="lbl">Their real message</span>
          <div className={`scribble ${decoded ? '' : 'empty'}`}>{decoded || 'Paste a note to read it'}</div>
        </div>
      </div>
      <div className="keytip">
        <KeyIcon />
        <span><b>Agent rule:</b> say the key out loud, never write it next to the note. Forgot it? Slide through all 25 keys. That is brute force, the next lesson.</span>
      </div>
    </>
  );
}
