/* Caesar cipher and bit helpers */
export const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const shift = (text, k) => text.toUpperCase().replace(/[A-Z]/g, ch => A[(A.indexOf(ch) + k + 26) % 26]);
export const bitsOf = hex => hex.split('').map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('');
