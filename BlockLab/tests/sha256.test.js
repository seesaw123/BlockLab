import { createHash } from 'node:crypto';
import { expect, test } from 'vitest';
import { sha256 } from '../src/lib/sha256.js';

const real = s => createHash('sha256').update(s).digest('hex');

test('matches the standard SHA-256 for known inputs', () => {
  expect(sha256('hello')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
});

test('matches the standard SHA-256 around block boundaries and in Thai and Burmese', () => {
  const inputs = ['Hello', 'สวัสดี', 'မင်္ဂလာပါ', 'x'.repeat(1000)];
  for (let n = 50; n <= 130; n++) inputs.push('a'.repeat(n));
  for (const s of inputs) expect(sha256(s)).toBe(real(s));
});
