

/* Course content: units, lessons and quizzes (English).
   Text in `what`, `real` and `EXPLAIN` may contain <b> tags; it is trusted, static content. */
export const UNITS = [
  { n: 1, title: 'Secret messages', badge: 'Codebreaker', blurb: 'Build a cipher wheel, crack a code, and find out why big keys win.' },
  { n: 2, title: 'Fingerprints for data', badge: 'Hash hero', blurb: 'Feed words into a hash machine and see why it only runs one way.' }
];
export const LATER = [
  ['Unit 3', 'Keys and signatures'], ['Unit 4', 'Chains of blocks'], ['Unit 5', 'Mining'], ['Unit 6', 'Bitcoin for real']
];
export const LESSONS = [
  { id: '1-1', unit: 1, num: '1.1', title: "Caesar's secret", min: 12,
    hook: 'Over 2,000 years ago, Julius Caesar sent orders in a code: every letter moved three places along the alphabet. A spy who grabbed the note saw only nonsense.',
    toyTitle: 'Spin the cipher wheel', goal: 'Decode your friend’s note', toy: 'caesar',
    what: ['The number of places you shift is the <b>key</b>. Turning a message into code is called <b>encrypting</b>; turning it back is <b>decrypting</b>.', 'Anyone who knows the key can read the message. Anyone who doesn’t just sees jumbled letters.'],
    real: 'Bitcoin doesn’t hide messages like this, but it depends on the same idea: a secret number that only you know. Whoever holds the key is in control.',
    quiz: [
      { q: 'With a shift of 3, what does the letter A become?', o: ['B', 'C', 'D', 'Z'], a: 2, why: 'A moves three places: B, C, D.' },
      { q: 'In a Caesar cipher, what is the key?', o: ['The alphabet', 'The shift number', 'The message', 'The paper it’s written on'], a: 1, why: 'The shift number is the secret that locks and unlocks the message.' },
      { q: 'The key is 1. What does IBU decode to?', o: ['JCV', 'HAT', 'CAT', 'ICE'], a: 1, why: 'Move each letter back one: I→H, B→A, U→T.' }
    ] },
  { id: '1-2', unit: 1, num: '1.2', title: 'Crack the code', min: 12,
    hook: 'You find a note that says AOPZ PZ LHZF. You don’t know the key. But a Caesar cipher only has 25 possible keys. Could you just try them all?',
    toyTitle: 'Try every key', goal: 'Find the key that makes sense', toy: 'crack',
    what: ['Trying every possible key is called a <b>brute-force attack</b>. With only 25 keys, you can do it by hand, and a computer does it in less than a millisecond.', 'Codebreakers also use <b>letter frequency</b>: in English, E is the most common letter, so the most common letter in a long code is probably E in disguise.'],
    real: 'Small keys are weak keys. Bitcoin keys are chosen from so many possibilities that brute force would never finish. You’ll see just how many in the next lesson.',
    quiz: [
      { q: 'How many different keys does a Caesar cipher have (not counting a shift of 0)?', o: ['5', '25', '100', 'Millions'], a: 1, why: 'There are 26 letters, so 25 shifts actually change the message.' },
      { q: 'Trying every possible key until one works is called…', o: ['Brute force', 'Hashing', 'Signing', 'Mining'], a: 0, why: 'Brute force means trying everything, one by one.' },
      { q: 'Which letter appears most often in ordinary English text?', o: ['A', 'T', 'E', 'Z'], a: 2, why: 'E is the most common letter in English, which is why codebreakers look for it first.' }
    ] },
  { id: '1-3', unit: 1, num: '1.3', title: 'Bigger keys', min: 10,
    hook: 'A bike lock with 3 dials has 1,000 possible codes. A thief could try them all in an afternoon. What if the lock had a lot more dials?',
    toyTitle: 'Grow the key', goal: 'Find a key that can’t be guessed', toy: 'keysize',
    what: ['Computers store keys as <b>bits</b>: each bit is like a coin flip, 0 or 1. Every bit you add <b>doubles</b> the number of possible keys.', 'Doubling again and again grows fast. A few hundred bits gives more possible keys than there are atoms in a mountain range.'],
    real: 'A Bitcoin private key is a 256-bit number. Guessing someone else’s by brute force would take far longer than the universe has existed.',
    quiz: [
      { q: 'You add one more bit to a key. What happens to the number of possible keys?', o: ['It goes up by 1', 'It doubles', 'It stays the same', 'It halves'], a: 1, why: 'Each bit has 2 choices, so every extra bit doubles the total.' },
      { q: 'Which key is the safest?', o: ['8-bit', '32-bit', '64-bit', '256-bit'], a: 3, why: 'More bits means astronomically more keys to try.' },
      { q: 'Why is a Caesar cipher easy to crack?', o: ['It uses letters', 'It has only 25 keys', 'It is very old', 'It is written by hand'], a: 1, why: 'With so few keys, brute force takes seconds.' }
    ] },
  { id: '2-1', unit: 2, num: '2.1', title: 'The hash machine', min: 12,
    hook: 'Every person has a unique fingerprint. What if every piece of data had one too: every word, every photo, even a whole book?',
    toyTitle: 'Feed the hash machine', goal: 'Make two fingerprints match', toy: 'hash',
    what: ['A <b>hash function</b> turns any input into a fixed-size fingerprint called a <b>hash</b>. The one used here is called SHA-256.', 'Its output is always 64 characters long (256 bits), whether you type one letter or a whole book. And the same input always gives the same hash.'],
    real: 'Bitcoin uses SHA-256 to fingerprint every transaction and every block. If anything inside changes, the fingerprint no longer matches.',
    quiz: [
      { q: 'You hash the word “pizza” today, and again tomorrow. What do you get?', o: ['The same hash', 'A different hash', 'A longer hash', 'Nothing'], a: 0, why: 'Same input, same output, every single time.' },
      { q: 'How many characters long is a SHA-256 hash (written in hex)?', o: ['8', '32', '64', 'It depends on the input'], a: 2, why: 'Always 64 hex characters, which is 256 bits.' },
      { q: 'Compared with the hash of one word, the hash of a whole book is…', o: ['Much longer', 'Exactly the same length', 'Shorter', 'Impossible to make'], a: 1, why: 'Hashes are fixed-size, no matter how big the input is.' }
    ] },
  { id: '2-2', unit: 2, num: '2.2', title: 'The avalanche', min: 12,
    hook: 'Mai sends her team the plan: “hello”. Someone sneaks in and changes just one letter. Could anyone tell? With a hash fingerprint, instantly.',
    toyTitle: 'Change one letter', goal: 'Spot how much the fingerprint changes', toy: 'avalanche',
    what: ['A good hash function mixes every letter into every part of the fingerprint. So one tiny change spreads everywhere, like one snowball setting off an <b>avalanche</b>.', 'On average, changing one letter flips about half of the 256 bits. There is no way to make a small edit and keep a similar hash.'],
    real: 'Each Bitcoin block stores the hash of the block before it. Change one old payment and its hash changes completely, so the next block no longer matches. You’ll build this in Unit 4.',
    quiz: [
      { q: 'You change “cat” to “bat”. What happens to the hash?', o: ['Only the first character changes', 'It stays exactly the same', 'It changes almost completely', 'It gets shorter'], a: 2, why: 'That’s the avalanche effect: a tiny change scrambles the whole fingerprint.' },
      { q: 'Roughly how many of the 256 bits flip when you change one letter?', o: ['1', 'About 10', 'About half', 'All of them'], a: 2, why: 'On average about 128 bits, half of them, flip.' },
      { q: 'Why is the avalanche effect useful?', o: ['It makes hashes shorter', 'Any change, even tiny, is easy to spot', 'It hides the message', 'It makes hashing faster'], a: 1, why: 'Because the fingerprint changes so much, tampering can’t hide.' }
    ] },
  { id: '2-3', unit: 2, num: '2.3', title: 'No way back', min: 15,
    hook: 'Here is a fingerprint: 2cf24dba5fb0a30e… Can you work out which word made it? It’s a five-letter word you’ve seen in this course.',
    toyTitle: 'Try to run it backwards', goal: 'Find a hash that starts with 00', toy: 'oneway',
    what: ['Going forward is easy: input to hash takes a blink. Going backward is impossible except by guessing. That’s why hash functions are called <b>one-way</b>.', 'Finding an input with a special hash, like one starting with 00, also takes guessing. Each hex character has 16 possibilities, so two zeros take about 16 × 16 = 256 tries on average.'],
    real: 'This guessing game is exactly what Bitcoin miners do: they try number after number until a block’s hash starts with enough zeros. You’ll play it for real in Unit 5.',
    quiz: [
      { q: 'You have a hash. How can you find the input that made it?', o: ['Run the hash machine backwards', 'Only by guessing inputs', 'Ask the computer to undo it', 'Read it from the hash'], a: 1, why: 'Hashes are one-way. The only route is guessing and checking.' },
      { q: 'About how many tries does it take to find a hash starting with “00”?', o: ['2', '16', '256', 'A million'], a: 2, why: '16 choices for the first character × 16 for the second = 256.' },
      { q: 'What do Bitcoin miners spend their time doing?', o: ['Digging for coins', 'Guessing numbers until a hash has enough zeros', 'Checking passwords', 'Writing new rules'], a: 1, why: 'Mining is a giant hash-guessing contest.' }
    ] }
];

export const MISSIONS = [
  { n: 1, title: 'Secret messages', blurb: 'Build a cipher wheel, then learn to crack your friends’ codes.', count: 3, live: true },
  { n: 2, title: 'Fingerprints for data', blurb: 'Feed words into a hash machine and see why it can’t run backwards.', count: 3, live: true },
  { n: 3, title: 'Keys and signatures', blurb: 'Make a key pair with clock math and sign your first message.', count: 4 },
  { n: 4, title: 'Chains of blocks', blurb: 'Link blocks together, then try to cheat and watch the chain break.', count: 2 },
  { n: 5, title: 'Mining', blurb: 'Play the guessing game that keeps every computer honest.', count: 3 },
  { n: 6, title: 'Bitcoin for real', blurb: 'Follow one transaction, spot scams, then open the final vault.', count: 3 }
];

export const lessonById = id => LESSONS.find(l => l.id === id);
