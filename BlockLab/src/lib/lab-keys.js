// Educational secp256k1 only. BigInt arithmetic is NOT constant-time; never use
// this implementation or the displayed disposable keys with real funds.
// Parameters: Standards for Efficient Cryptography 2 (SEC 2), section 2.4.1.
import { sha256 } from './sha256.js';
const P = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn;
export const N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
const G = { x: 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n, y: 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n };
const mod = (x, m = P) => ((x % m) + m) % m;
function pow(x, n, m = P) { let r = 1n; for (x = mod(x, m); n; n >>= 1n, x = x * x % m) if (n & 1n) r = r * x % m; return r; }
const inv = (x, m = P) => { if (!mod(x, m)) throw Error('Zero inverse'); return pow(x, m - 2n, m); };
function add(a, b) {
  if (!a) return b; if (!b) return a;
  if (a.x === b.x && mod(a.y + b.y) === 0n) return null;
  const s = a.x === b.x ? mod(3n * a.x * a.x * inv(2n * a.y)) : mod((b.y - a.y) * inv(b.x - a.x));
  const x = mod(s * s - a.x - b.x); return { x, y: mod(s * (a.x - x) - a.y) };
}
function multiply(n, point = G) { let r = null; for (; n; n >>= 1n, point = add(point, point)) if (n & 1n) r = add(r, point); return r; }
const hex = n => n.toString(16).padStart(64, '0');
function scalar(key) {
  if (!/^[0-9a-f]{64}$/i.test(key)) throw Error('Invalid private key');
  const d = BigInt('0x' + key); if (d < 1n || d >= N) throw Error('Invalid private key'); return d;
}
export function randomPrivateKey() {
  if (!globalThis.crypto?.getRandomValues) throw Error('Secure randomness unavailable');
  for (;;) {
    const key = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
    const d = BigInt('0x' + key); if (d > 0n && d < N) return key;
  }
}
export function publicKey(privateKey) {
  const q = multiply(scalar(privateKey)); return (q.y & 1n ? '03' : '02') + hex(q.x);
}
function decode(key) {
  if (!/^(02|03)[0-9a-f]{64}$/i.test(key)) throw Error('Invalid public key');
  const x = BigInt('0x' + key.slice(2)); if (x >= P) throw Error('Invalid public key');
  let y = pow(mod(x * x * x + 7n), (P + 1n) / 4n);
  if (mod(y * y) !== mod(x * x * x + 7n)) throw Error('Invalid public key');
  if (Number(y & 1n) !== Number(key.slice(0, 2)) - 2) y = P - y;
  return { x, y };
}
export function sign(message, privateKey) {
  const d = scalar(privateKey), z = BigInt('0x' + sha256(message));
  for (;;) {
    const k = scalar(randomPrivateKey()), r = mod(multiply(k).x, N); if (!r) continue;
    let s = mod(inv(k, N) * (z + r * d), N); if (!s) continue;
    if (s > N / 2n) s = N - s; return hex(r) + hex(s);
  }
}
export function verify(message, signature, key) {
  try {
    if (!/^[0-9a-f]{128}$/i.test(signature)) return false;
    const r = BigInt('0x' + signature.slice(0, 64)), s = BigInt('0x' + signature.slice(64));
    if (r < 1n || r >= N || s < 1n || s >= N) return false;
    const w = inv(s, N), z = BigInt('0x' + sha256(message));
    const q = add(multiply(mod(z * w, N)), multiply(mod(r * w, N), decode(key)));
    return !!q && mod(q.x, N) === r;
  } catch { return false; }
}
export function makeKeys() {
  const privateKey = randomPrivateKey(), pub = publicKey(privateKey);
  // Intentionally NOT a Bitcoin address: no mainnet/testnet encoding.
  return { privateKey, publicKey: pub, address: 'lab_' + sha256(pub).slice(0, 32) };
}
