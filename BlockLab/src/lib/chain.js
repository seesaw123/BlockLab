import { sha256 } from './sha256.js';

/* The student's own block chain: one START block plus one block per finished
   lesson. Every block is really mined, so its hash starts with "00", and each
   block's hash depends on the block before it. */

export function mineHash(label, prev) {
  let nonce = 0;
  let h;
  do {
    h = sha256(`${label}|${prev}|${nonce++}`);
  } while (!h.startsWith('00'));
  return h;
}

const cache = new Map();

export function buildChain(lessonNums) {
  let prev = '0'.repeat(64);
  return ['START', ...lessonNums].map(label => {
    const key = `${label}|${prev}`;
    if (!cache.has(key)) cache.set(key, mineHash(label, prev));
    prev = cache.get(key);
    return { label, hash: prev };
  });
}
