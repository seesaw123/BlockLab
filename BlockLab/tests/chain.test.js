import { expect, test } from 'vitest';
import { buildChain } from '../src/lib/chain.js';
import { crackTime } from '../src/lib/keys.js';

test('the chain has a START block plus one mined block per finished lesson', () => {
  const chain = buildChain(['1.1', '1.2']);
  expect(chain.map(b => b.label)).toEqual(['START', '1.1', '1.2']);
  for (const block of chain) expect(block.hash.startsWith('00')).toBe(true);
});

test('each block depends on the one before it', () => {
  const a = buildChain(['1.1']);
  const b = buildChain(['1.2']);
  expect(a[0].hash).toBe(b[0].hash);
  expect(a[1].hash).not.toBe(b[1].hash);
});

test('bigger keys take longer to crack', () => {
  expect(crackTime(8)[1]).toBe('Easy to crack');
  expect(crackTime(256)[1]).toBe('Impossible');
});
