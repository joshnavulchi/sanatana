"use client";
import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE } from '../../../lib/i18n';
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';

type Options = { A: string; B: string; C: string; D: string };
type Question = { id: number; question: string; options: Options; answer: keyof Options };

function sampleIndices(total: number, count: number): number[] {
  const arr = Array.from({ length: total }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

export default function QuizClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('quiz');
  const [questionsPool, setQuestionsPool] = useState<Question[] | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, keyof Options>>({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/locales/en/questions.json')
      .then((r) => r.json())
      .then((data: Question[]) => {
        if (!mounted) return;
        setQuestionsPool(data);
        const indices = sampleIndices(data.length, 10);
        setSelectedIdx(indices);
      })
      .catch((err) => console.error('Failed to load questions', err));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [finished, started]);

  const qList = useMemo(() => {
    if (!questionsPool || selectedIdx.length === 0) return [] as Question[];
    return selectedIdx.map((i) => questionsPool[i]);
  }, [questionsPool, selectedIdx]);

  function selectOption(opt: keyof Options) {
    if (finished) return;
    const qid = qList[current].id;
    setAnswers((prev) => ({ ...prev, [qid]: opt }));
  }

  function goNext() {
    if (current < qList.length - 1) setCurrent(current + 1);
    else setFinished(true);
  }

  function goPrev() {
    if (current > 0) setCurrent(current - 1);
  }

  function restart() {
    if (!questionsPool) return;
    const indices = sampleIndices(questionsPool.length, 10);
    setSelectedIdx(indices);
    setAnswers({});
    setCurrent(0);
    setFinished(false);
    setTimeLeft(10 * 60);
    setStarted(false);
  }

  const score = useMemo(() => {
    if (!qList || qList.length === 0) return 0;
    let s = 0;
    for (const q of qList) {
      const a = answers[q.id];
      if (a && a === q.answer) s++;
    }
    return s;
  }, [answers, qList]);

  function fmtTime(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  const loc = locale || DEFAULT_LOCALE;
  if (!questionsPool) return <div>{ns?.loading || 'Loading...'}</div>;
  if (qList.length === 0) return <div>{ns?.preparing || 'Preparing quiz...'}</div>;

  if (!started) {
    return (
      <div>
        <h2 className="h4">{ns?.readyTitle || 'Ready?'}</h2>
        <p>{(ns?.readyDescription || 'This quiz has {count} questions, time {time}').replace('{count}', String(qList.length)).replace('{time}', fmtTime(timeLeft))}</p>
        <div>
          <button className="btn btn-primary" onClick={() => setStarted(true)}>{ns?.start || 'Start'}</button>
          <button className="btn btn-outline" onClick={restart}>{ns?.shuffle || 'Shuffle'}</button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div>
        <h2 className="h4">{ns?.resultsTitle || 'Results'}</h2>
        <div>{ns?.yourScore || 'Your score:'} <strong>{score}</strong> / {qList.length}</div>
        <div>{ns?.timeTaken || 'Time taken:'} {fmtTime(10 * 60 - timeLeft)}</div>
        <div>
          {qList.map((q, idx) => (
            <div key={q.id}>
              <div>{idx + 1}. {q.question}</div>
              <div>
                {(['A', 'B', 'C', 'D'] as (keyof Options)[]).map((k) => {
                  const correct = k === q.answer;
                  const chosen = answers[q.id] === k;
                  return (
                    <div key={k}>
                      <strong>{k}.</strong> {q.options[k]} {correct ? ` (${ns?.correctLabel || 'Correct'})` : chosen ? ` (${ns?.yourChoiceLabel || 'Your choice'})` : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div>
          <button className="btn btn-primary" onClick={restart}>{ns?.restart || 'Restart'}</button>
        </div>
      </div>
    );
  }

  const q = qList[current];

  return (
    <div>
      <div>
        <div>{(ns?.questionCounter || 'Question {current} / {total}').replace('{current}', String(current + 1)).replace('{total}', String(qList.length))}</div>
        <div>{ns?.timeLeftLabel || 'Time left:'} {fmtTime(timeLeft)}</div>
      </div>

      <div>
        <div>{q.question}</div>
        <div>
          {(['A', 'B', 'C', 'D'] as (keyof Options)[]).map((k) => (
            <button
              className="btn btn-primary"
              key={k}
              onClick={() => selectOption(k)}
            >
              <strong>{k}.</strong> {q.options[k]}
            </button>
          ))}
        </div>

        <div>
          <div>
            <button className="btn btn-primary" onClick={goPrev} disabled={current === 0}>{ns?.previous || 'Previous'}</button>
            <button className="btn btn-primary" onClick={goNext}>{current < qList.length - 1 ? (ns?.next || 'Next') : (ns?.finish || 'Finish')}</button>
          </div>
          <div>{(ns?.answered || 'Answered {answered} / {total}').replace('{answered}', String(Object.keys(answers).length)).replace('{total}', String(qList.length))}</div>
        </div>
      </div>
    </div>
  );
}
