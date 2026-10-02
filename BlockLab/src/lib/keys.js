/* How long it takes to try every key of a given size. */

const UNIVERSE_YEARS = 13.8e9;
export const YEAR = 31557600;

export function formatKeys(bits) {
  const s = (2n ** BigInt(bits)).toString();
  return s.length <= 21 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : `about ${s[0]}.${s.slice(1, 3)} × 10^${s.length - 1}`;
}

/** [time words, how hard] to try every key at a billion guesses per second. */
export function crackTime(bits) {
  const sec = 2 ** bits / 1e9;
  const yr = sec / YEAR;
  if (sec < 1) return ['Less than a second', 'Easy to crack'];
  if (sec < 60) return [`${Math.round(sec)} seconds`, 'Easy to crack'];
  if (sec < 3600) return [`${Math.round(sec / 60)} minutes`, 'Easy to crack'];
  if (sec < 86400) return [`${Math.round(sec / 3600)} hours`, 'Crackable'];
  if (yr < 1) return [`${Math.round(sec / 86400)} days`, 'Crackable'];
  if (yr < 1000) return [`${Math.round(yr)} years`, 'Hard'];
  if (yr < UNIVERSE_YEARS) return [`${yr.toExponential(1).replace('e+', ' × 10^')} years`, 'Very hard'];
  const times = yr / UNIVERSE_YEARS;
  return [`${times < 1e6 ? Math.round(times).toLocaleString('en') : times.toExponential(1).replace('e+', ' × 10^')} × the age of the universe`, 'Impossible'];
}

export function humanTime(sec) {
  if (sec < 60) return `${Math.round(sec)} seconds`;
  if (sec < 3600) return `${Math.round(sec / 60)} minutes`;
  if (sec < 86400) { const h = sec / 3600; return h < 10 ? `${h.toFixed(1)} hours` : `${Math.round(h)} hours`; }
  if (sec < YEAR) return `${Math.round(sec / 86400)} days`;
  return `${Math.round(sec / YEAR).toLocaleString('en')} years`;
}
