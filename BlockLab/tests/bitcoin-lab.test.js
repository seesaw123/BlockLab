import { test } from 'vitest';
import assert from 'node:assert/strict';
import { webcrypto, createECDH, createPublicKey, createPrivateKey, verify as opensslVerify, sign as opensslSign } from 'node:crypto';
import { publicKey, sign, verify, N } from '../src/lib/lab-keys.js';
import { BitcoinLab, parseBTC, transactionMessage, FEE } from '../src/state/bitcoin-lab.js';
import { LAB_COPY } from '../src/i18n/lab.js';
if (!globalThis.crypto) globalThis.crypto = webcrypto;
const d = '0'.repeat(63) + '1';
function opensslKeys(key) {
  const e = createECDH('secp256k1'); e.setPrivateKey(Buffer.from(key, 'hex'));
  const raw = e.getPublicKey(null, 'uncompressed');
  const jwk = { kty: 'EC', crv: 'secp256k1', x: raw.subarray(1, 33).toString('base64url'), y: raw.subarray(33).toString('base64url') };
  return { publicKey: createPublicKey({ key: jwk, format: 'jwk' }), privateKey: createPrivateKey({ key: { ...jwk, d: Buffer.from(key, 'hex').toString('base64url') }, format: 'jwk' }), compressed: e.getPublicKey('hex', 'compressed') };
}
test('secp256k1 derivation and signatures agree with OpenSSL', () => {
  for (const key of [d, (N - 1n).toString(16), '5'.repeat(64)]) {
    const standard = opensslKeys(key), pub = publicKey(key), message = 'BlockLab — စမ်းသပ် / ทดลอง';
    assert.equal(pub, standard.compressed);
    const signature = sign(message, key);
    assert.ok(opensslVerify('sha256', Buffer.from(message), { key: standard.publicKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(signature, 'hex')));
    const reference = opensslSign('sha256', Buffer.from(message), { key: standard.privateKey, dsaEncoding: 'ieee-p1363' }).toString('hex');
    assert.ok(verify(message, reference, pub));
    assert.ok(!verify(message + '!', signature, pub));
    assert.ok(!verify(message, signature, publicKey(key === d ? '2'.repeat(64) : d)));
  }
  assert.throws(() => publicKey('0'.repeat(64)));
  assert.throws(() => publicKey(N.toString(16)));
  assert.equal(verify('x', '0'.repeat(128), publicKey(d)), false);
  assert.equal(verify('x', 'f'.repeat(128), '02' + 'f'.repeat(64)), false);
});
test('amounts use satoshis and reject invalid precision and values', () => {
  assert.equal(parseBTC('0.00000001'), 1); assert.equal(parseBTC('0.1'), 10000000);
  for (const input of ['0', '-1', '1e2', 'NaN', '0.000000001', '21000001', '', ' 1']) assert.throws(() => parseBTC(input));
});
test('pending inputs cannot be spent twice; mine credits recipient and change', () => {
  const s = new BitcoinLab(), alice = s.createWallet(), bob = s.createWallet();
  assert.throws(() => s.createWallet()); s.fund(alice.address);
  assert.throws(() => s.fund(alice.address));
  const tx = s.send(alice.address, bob.address, '0.1');
  assert.ok(s.valid(tx)); assert.equal(s.balance(alice.address), 0); assert.equal(s.balance(bob.address), 0);
  assert.equal(s.pending(bob.address), 10000000);
  assert.throws(() => s.send(alice.address, bob.address, '0.1'));
  assert.throws(() => s.send(bob.address, alice.address, '0.01'));
  const altered = { ...tx, outputs: tx.outputs.map((o, i) => i ? o : { ...o, sats: o.sats + 1 }) };
  assert.equal(s.valid(altered), false); assert.ok(s.valid(tx));
  const first = s.mine(); assert.equal(s.mempool.length, 0);
  assert.equal(s.balance(bob.address), 10000000); assert.equal(s.balance(alice.address), 90000000 - FEE);
  assert.equal(s.utxos.reduce((a, u) => a + u.sats, 0), 100000000 - FEE);
  s.send(bob.address, alice.address, '0.05'); const second = s.mine(); assert.equal(second.previous, first.hash);
  assert.equal(s.balance(bob.address), 5000000 - FEE);
  assert.equal(s.utxos.reduce((a, u) => a + u.sats, 0), 100000000 - 2 * FEE);
});
test('invalid requests do not change balances, mempool or spendability', () => {
  const s = new BitcoinLab(), a = s.createWallet(), b = s.createWallet(); s.fund(a.address);
  for (const [from, to, amount] of [[a.address, b.address, '1'], [a.address, a.address, '0.1'], [a.address, 'lab_unknown', '0.1'], [a.address, b.address, '-1']]) assert.throws(() => s.send(from, to, amount));
  assert.equal(s.balance(a.address), 100000000); assert.equal(s.mempool.length, 0);
  const tx = s.send(a.address, b.address, '0.1'); const original = tx.signature; tx.signature = '0'.repeat(128);
  assert.throws(() => s.mine()); assert.equal(s.blocks.length, 0); assert.equal(s.mempool.length, 1);
  tx.signature = original; assert.ok(verify(transactionMessage(tx), tx.signature, tx.publicKey)); s.mine();
});
test('all lab text is present in English, Thai and Burmese', () => {
  for (const lang of ['th', 'my']) for (const key of Object.keys(LAB_COPY.en)) assert.ok(LAB_COPY[lang][key], `${lang}.${key}`);
});
