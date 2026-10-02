import { useState } from 'react';
import { useProgress } from '../context/ProgressContext.jsx';

/* Three multiple-choice questions. Getting all three right marks the lesson
   done, which also adds a block to the student's chain. */
export function Quiz({ lesson }) {
  const { isDone, markDone, unitDone, badgeFor } = useProgress();
  // per question: { right: bool, wrong: Set of option indexes tried }
  const [answers, setAnswers] = useState(() => lesson.quiz.map(() => ({ right: false, wrong: [] })));

  const choose = (qi, oi) => {
    const next = answers.map((a, i) => {
      if (i !== qi || a.right) return a;
      return oi === lesson.quiz[qi].a ? { ...a, right: true } : { ...a, wrong: [...a.wrong, oi] };
    });
    setAnswers(next);
    if (next.every(a => a.right)) markDone(lesson.id);
  };

  const complete = answers.every(a => a.right) || isDone(lesson.id);

  return (
    <div className="quiz">
      {lesson.quiz.map((q, qi) => {
        const a = answers[qi];
        const lastWrong = !a.right && a.wrong.length > 0;
        return (
          <div className="q" key={q.q}>
            <p className="ask">{qi + 1}. {q.q}</p>
            <div className="opts">
              {q.o.map((option, oi) => {
                const state = a.right && oi === q.a ? 'right' : a.wrong.includes(oi) ? 'wrong' : '';
                return (
                  <button key={option} type="button" className={`opt ${state}`} disabled={a.right} onClick={() => choose(qi, oi)}>
                    {option}
                  </button>
                );
              })}
            </div>
            {a.right && <p className="feedback right"><b>Correct.</b> {q.why}</p>}
            {lastWrong && <p className="feedback wrong"><b>Not quite.</b> Have another go.</p>}
          </div>
        );
      })}
      {complete && (
        <p className="note win">
          <b>Lesson {lesson.num} complete.</b>{' '}
          {unitDone(lesson.unit) ? `You won the ${badgeFor(lesson.unit)} badge!` : 'Your progress is saved on this device.'}{' '}
          A new block joined your chain on the <a href="#home">home page</a>.
        </p>
      )}
    </div>
  );
}
