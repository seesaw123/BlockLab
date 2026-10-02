# BlockLab

**Crack the secret math behind Bitcoin.** BlockLab is a free, hands-on website that teaches middle school students (ages 11–14) the cryptography that makes Bitcoin work: keys, hashing, signatures, chains of blocks and mining. Students learn by playing with toys in the browser, in **English, Thai and Burmese**.

This is the **pilot**: Units 1 and 2 (six lessons) are ready. Units 3–6 come next.

Built with **React 19** and **Vite**.

## What's inside

| Unit | Lesson | Activity |
| --- | --- | --- |
| 1 · Secret messages | 1.1 Caesar's secret | Turning cipher wheel, letter tiles, secret note swap with a friend |
| | 1.2 Crack the code | Try all 25 keys, letter-frequency chart, codebreaker race |
| | 1.3 Bigger keys | Bike lock with dials, key size from 1 to 256 bits |
| 2 · Fingerprints for data | 2.1 The hash machine | Hash machine that prints SHA-256 receipts, matching challenge |
| | 2.2 The avalanche | Change one letter and see which bits flip |
| | 2.3 No way back | Guess the word behind a hash, hash slot machine (find `00`) |

Every lesson follows the same steps: hook, try it, what just happened, in real Bitcoin, quick check. Finishing a lesson adds a real mined block to the student's own 3D chain on the home page.

**Safe for kids:** no accounts, no personal data, no trackers, no real money. Progress is saved only in the student's own browser.

## Run it

You need [Node.js](https://nodejs.org) 20.19 or newer.

```bash
npm install       # once
npm run dev       # start the dev server, then open the link it prints
npm test          # run the tests
npm run build     # build the site into dist/
npm run preview   # preview the built site
```

## Project structure

```
index.html                 page shell with <div id="root">
src/
  main.jsx                 starts React and wraps the app in its providers
  App.jsx                  picks the page from the URL hash
  pages/                   HomePage, MapPage, AboutPage, LessonPage
  components/              Header, ChainScene (3D chain), Quiz, ExplainSimply,
                           NoteSwap, Icons, Rich
  toys/                    one component per lesson toy, registered in index.js
  context/
    LanguageContext.jsx    site language, t() and translated titles
    ProgressContext.jsx    finished lessons, saved in localStorage
  hooks/                   useHashRoute, useReducedMotion
  data/course.js           units, lessons, hooks and quizzes (English)
  i18n/
    strings.js             interface text and lesson titles in English, Thai, Burmese
    explain.js             "Explained simply" sections in all three languages
  lib/                     sha256 (written from scratch), Caesar cipher, the
                           mined chain, key-size maths, safe localStorage
  styles/main.css          all styles, light and dark themes
tests/                     Vitest tests
```

### Pages and routing

The site is a single-page app. The URL hash decides what is shown: `#home`, `#map`, `#about` and `#l-1-2` for lesson 1.2. Hash routing needs no server configuration, so the built site works on any static host.

### Language

`useLang()` gives every component the current language and helpers:

```jsx
const { lang, setLang, t, lt, unitTitle } = useLang();
t('mapH');                 // interface text
lt(lesson, 'title');       // a lesson field in the current language
```

### Progress

`useProgress()` gives `isDone(id)`, `markDone(id)`, `reset()`, `count`, `nextLesson` and `unitDone(n)`.

## Adding content

- **Lesson text and quizzes:** `src/data/course.js`. Each quiz question lists its options and the index of the right answer (`a`).
- **Translations:** `src/i18n/strings.js` (interface, lesson titles and hooks) and `src/i18n/explain.js` (kid-friendly explanations). `npm test` fails if a Thai or Burmese string is missing.
- **A new toy:** create `src/toys/MyToy.jsx` exporting a component, add it to `src/toys/index.js` under a name, and set `toy: '<name>'` on the lesson.
- **A new lesson:** add it to `LESSONS` in `src/data/course.js` with a `toy`, three quiz questions, and its Thai and Burmese titles in `LESSON_TR`.

The Thai and Burmese text is a draft and should be reviewed by native-speaking teachers before classroom use.

## Deploy

Pushing to `main` runs the tests, builds the site and publishes it to **GitHub Pages** through `.github/workflows/deploy.yml`. One-time setup: in the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.

The built `dist/` folder also works on Cloudflare Pages, Netlify or Vercel: build command `npm run build`, output directory `dist`.

## Licence

Code is released under the [MIT Licence](LICENSE). The licence for lesson content is still to be decided.

---

Made by [Saw Nyan Lin Tun](https://github.com/SawNyanLinTun), Digital Innovation, Chiang Mai University.
