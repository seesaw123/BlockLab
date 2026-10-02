import { expect, test } from 'vitest';
import { bitsOf, shift } from '../src/lib/caesar.js';

test('shift encrypts and decrypts', () => {
  expect(shift('HELLO', 3)).toBe('KHOOR');
  expect(shift('KHOOR', -3)).toBe('HELLO');
  expect(shift('xyz', 3)).toBe('ABC');
  expect(shift('Meet me!', 0)).toBe('MEET ME!');
});

test('the lesson examples decode correctly', () => {
  expect(shift('AOPZ PZ LHZF', -7)).toBe('THIS IS EASY');
  expect(shift('TLLA TL HA AOL SPIYHYF', -7)).toBe('MEET ME AT THE LIBRARY');
});

test('bitsOf turns hex into 4 bits per character', () => {
  expect(bitsOf('0f')).toBe('00001111');
  expect(bitsOf('a'.repeat(64))).toHaveLength(256);
});
