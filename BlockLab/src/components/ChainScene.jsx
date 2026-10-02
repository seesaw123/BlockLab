import { useEffect, useMemo, useRef } from 'react';
import { useProgress } from '../context/ProgressContext.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { buildChain } from '../lib/chain.js';
import { readStore, writeStore } from '../lib/storage.js';

const LOOK = {
  start: { front: '#1B2440', side: '#0F1628', top: '#3A4770', ink: '#F2B441' },
  block: { front: '#F2B441', side: '#C98A1F', top: '#F9D98E', ink: '#1B2440' },
  newest: { front: '#7CC4B8', side: '#4E9C90', top: '#B4E0D8', ink: '#1B2440' }
};
const GAP = 112;

function Face({ transform, bg, children }) {
  return <div className="face" style={{ background: bg, transform }}>{children}</div>;
}

function Block({ look, label, hash }) {
  return (
    <>
      <Face transform="rotateY(180deg) translateZ(42px)" bg={look.side} />
      <Face transform="rotateX(-90deg) translateZ(42px)" bg={look.side} />
      <Face transform="rotateY(-90deg) translateZ(42px)" bg={look.side} />
      <Face transform="rotateY(90deg) translateZ(42px)" bg={look.side} />
      <Face transform="rotateX(90deg) translateZ(42px)" bg={look.top} />
      <Face transform="translateZ(42px)" bg={look.front}>
        <b style={{ color: look.ink }}>{label === 'START' ? 'START' : `LESSON ${label}`}</b>
        <span style={{ color: look.ink }}>{hash.slice(0, 8)}</span>
      </Face>
    </>
  );
}

/* The student's own 3D chain. It grows by one mined block per finished
   lesson; new blocks drop in the first time the student sees them.
   Animation writes styles straight to the DOM through refs, so React only
   re-renders when the chain itself changes. */
export function ChainScene() {
  const { finished } = useProgress();
  const reduce = useReducedMotion();
  const blocks = useMemo(() => buildChain(finished.map(l => l.num)), [finished]);
  const stageRef = useRef(null);
  const worldRef = useRef(null);
  const blockRefs = useRef([]);
  const linkRefs = useRef([]);
  const view = useRef({ rx: -16, ry: -24, idle: true, t: 0, drag: null, resume: 0 });

  // Blocks the student has not seen yet fall in, one after another.
  const born = useMemo(() => {
    const seen = Math.max(1, Number(readStore('blocklab-chain-seen', 1)) || 1);
    const t0 = view.current.t;
    return blocks.map((_, i) => (!reduce && i >= seen ? t0 + 20 + (i - seen) * 30 : -1));
  }, [blocks, reduce]);

  useEffect(() => {
    writeStore('blocklab-chain-seen', blocks.length);
  }, [blocks.length]);

  useEffect(() => {
    const S = view.current;
    const n = blocks.length;
    let frameId;
    const progress = i => (born[i] < 0 ? 1 : Math.max(0, Math.min(1, (S.t - born[i]) / 36)));
    const frame = () => {
      S.t += 1;
      if (S.idle && !S.drag && !reduce) {
        S.ry += (-24 + Math.sin(S.t * 0.012) * 20 - S.ry) * 0.04;
        S.rx += (-16 - S.rx) * 0.04;
      }
      const stage = stageRef.current;
      const world = worldRef.current;
      if (stage && world) {
        const span = (n - 1) * GAP + 84;
        const scale = Math.min(1, stage.clientWidth / 600) * Math.min(1, 560 / span);
        world.style.transform = `scale(${scale}) rotateX(${S.rx}deg) rotateY(${S.ry}deg)`;
        blocks.forEach((_, i) => {
          const p = progress(i);
          const y = (reduce ? 0 : Math.sin(S.t * 0.05 + i * 1.3) * 5) - 240 * Math.pow(1 - p, 3);
          const el = blockRefs.current[i];
          if (el) {
            el.style.transform = `translate3d(${(i - (n - 1) / 2) * GAP}px,${y}px,0)`;
            el.style.opacity = p > 0 ? 1 : 0;
          }
          const link = linkRefs.current[i - 1];
          if (i > 0 && link) {
            link.style.transform = `translate3d(${(i - 1 - (n - 1) / 2) * GAP + GAP / 2}px,0,0)`;
            link.style.opacity = p >= 1 ? 1 : 0;
          }
        });
      }
      frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [blocks, born, reduce]);

  useEffect(() => () => clearTimeout(view.current.resume), []);

  // The shadow under the chain is just a little wider than the chain itself.
  const floorWidth = (blocks.length - 1) * GAP + 200;

  const pauseThenResume = () => {
    const S = view.current;
    clearTimeout(S.resume);
    S.resume = setTimeout(() => { S.idle = true; }, 2500);
  };

  const onPointerDown = e => {
    const S = view.current;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    clearTimeout(S.resume);
    S.idle = false;
    S.drag = { x: e.clientX, y: e.clientY, rx: S.rx, ry: S.ry };
    e.currentTarget.classList.add('dragging');
  };
  const onPointerMove = e => {
    const S = view.current;
    if (!S.drag) return;
    S.rx = Math.max(-70, Math.min(40, S.drag.rx - (e.clientY - S.drag.y) * 0.4));
    S.ry = S.drag.ry + (e.clientX - S.drag.x) * 0.4;
  };
  const onPointerUp = e => {
    const S = view.current;
    if (!S.drag) return;
    S.drag = null;
    e.currentTarget.classList.remove('dragging');
    pauseThenResume();
  };
  const onKeyDown = e => {
    const step = { ArrowLeft: [0, -15], ArrowRight: [0, 15], ArrowUp: [10, 0], ArrowDown: [-10, 0] }[e.key];
    if (!step) return;
    e.preventDefault();
    const S = view.current;
    S.idle = false;
    S.rx = Math.max(-70, Math.min(40, S.rx + step[0]));
    S.ry += step[1];
    pauseThenResume();
  };

  return (
    <button
      type="button"
      className="stage"
      ref={stageRef}
      aria-label="A 3D chain of blocks. Drag it, or use the arrow keys, to look around."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div className="world" ref={worldRef}>
        <div className="floor" style={{ width: floorWidth, left: -floorWidth / 2 }} />
        {blocks.slice(1).map((b, i) => (
          <div className="lnk" key={`link-${b.hash}`} ref={el => { linkRefs.current[i] = el; }}>
            <div className="bar" style={{ top: -6, height: 12, transform: 'translateZ(8px)' }} />
            <div className="bar" style={{ top: -6, height: 12, transform: 'translateZ(-8px)' }} />
            <div className="bar" style={{ top: -8, height: 16, background: '#3A4770', transform: 'rotateX(90deg) translateZ(6px)' }} />
          </div>
        ))}
        {blocks.map((b, i) => {
          const look = i === 0 ? LOOK.start : i === blocks.length - 1 ? LOOK.newest : LOOK.block;
          return (
            <div className="blk" key={b.hash} ref={el => { blockRefs.current[i] = el; }} style={{ opacity: born[i] < 0 ? 1 : 0 }}>
              <Block look={look} label={b.label} hash={b.hash} />
            </div>
          );
        })}
      </div>
    </button>
  );
}
