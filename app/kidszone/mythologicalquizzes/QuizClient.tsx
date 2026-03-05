"use client";
import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';

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
      .then((data: any) => {
        if (!mounted) return;
        // Normalize data shape: support { questions: { ... } } and arrays
        let list: any[] = [];
        if (Array.isArray(data)) list = data;
        else if (data && Array.isArray(data.questions)) list = data.questions;
        else if (data && data.questions && typeof data.questions === 'object') list = Object.values(data.questions);
        else list = [];

        // Normalize option keys to uppercase A/B/C/D and answer to uppercase
        const normalized: Question[] = list.map((q: any, idx: number) => ({
          id: typeof q.id === 'number' ? q.id : idx + 1,
          question: q.question || q.title || '',
          options: {
            A: q.options?.A || q.options?.a || '',
            B: q.options?.B || q.options?.b || '',
            C: q.options?.C || q.options?.c || '',
            D: q.options?.D || q.options?.d || ''
          },
          answer: (String(q.answer || '').toUpperCase() || 'A') as keyof Options
        }));

        setQuestionsPool(normalized);
        const indices = sampleIndices(normalized.length, Math.min(10, normalized.length));
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
        <h2 className="text-2xl md:text-3xl mb-4">{ns?.readyTitle || 'Ready?'}</h2>
        <h3 className="text-base md:text-2xl">{(ns?.readyDescription || 'This quiz has {count} questions, time {time}').replace('{count}', String(qList.length)).replace('{time}', fmtTime(timeLeft))}</h3>
        <div className="flex items-center justify-between mt-6">
          <button className="cursor-pointer group md:inline-flex px-4 py-2 bg-white/10 backdrop-blur-md
                    hover:bg-white/20 border-2 border-amber-500/50 hover:border-white
                    text-amber-500  text-md md:text-lg rounded-full shadow-lg hover:shadow-xl
                    transition-all duration-300 transform hover:-translate-y-1 no-underline" onClick={restart}>
            <span>{ns?.shuffle || 'Shuffle'}</span>
          </button>
          <button className="cursor-pointer group relative md:inline-flex px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600
                    hover:from-amber-600 hover:to-orange-700 text-white  text-md md:text-lg rounded-full shadow-xl hover:shadow-2xl
                    transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden" onClick={() => setStarted(true)}>
            <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <span>{ns?.start || 'Start'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div>
        <h2 className="text-2xl md:text-3xl">{ns?.resultsTitle || 'Results'}</h2>
        <div className="flex items-center justify-between my-6">
          <div className="text-base">{ns?.yourScore || 'Your score:'} <strong>{score}</strong> / {qList.length}</div>
          <div className="text-base">{ns?.timeTaken || 'Time taken:'} {fmtTime(10 * 60 - timeLeft)}</div>
        </div>
        <div>
          {qList.map((q, idx) => (
            <div key={q.id}>
              <div className="text-base font-semibold">{idx + 1}. {q.question}</div>
              <div className="text-md md:text-lg ml-4 my-2">
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
        <div className="mt-6">
          <button className="cursor-pointer group relative md:inline-flex px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600
                    hover:from-amber-600 hover:to-orange-700 text-white  text-md md:text-lg rounded-full shadow-xl hover:shadow-2xl
                    transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden" onClick={restart}>
            <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <span>{ns?.restart || 'Restart'}</span>
          </button>
        </div>
      </div>
    );
  }

  const q = qList[current];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-base md:text-2xl font-semibold">{(ns?.questionCounter || 'Question {current} / {total}').replace('{current}', String(current + 1)).replace('{total}', String(qList.length))}</div>
        <div className=''>{ns?.timeLeftLabel || 'Time left:'} {fmtTime(timeLeft)}</div>
      </div>

      <div className="flex flex-col justify-start items-start gap-6">
        <div className="text-base md:text-2xl font-bold">{q.question}</div>
        <div className="text-base md:text-2xl font-semibold mt-4 flex flex-col gap-3">
          {(['A', 'B', 'C', 'D'] as (keyof Options)[]).map((k) => {
            const isSelected = answers[q.id] === k;
            return (
              <button
                className={
                  `cursor-pointer group md:inline-flex px-4 py-2 border-2 text-md md:text-lg rounded-full shadow-lg transition-all duration-300 transform no-underline ` +
                  (isSelected
                    ? 'bg-amber-400 text-white border-amber-600 scale-105 ring-2 ring-amber-300'
                    : 'bg-white/10 backdrop-blur-md hover:bg-white/20 border-amber-500/50 hover:border-white text-amber-500 hover:shadow-xl hover:-translate-y-1')
                }
                key={k}
                onClick={() => selectOption(k)}
              >
                <strong>{k}.</strong> {q.options[k]}
              </button>
            );
          })}
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between my-6">
            <button className="cursor-pointer group relative md:inline-flex px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600
                  hover:from-amber-600 hover:to-orange-700 text-white  text-md md:text-lg rounded-full shadow-xl hover:shadow-2xl
                  transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden" onClick={goPrev} disabled={current === 0}>
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <span>{ns?.previous || 'Previous'}</span>
            </button>
            <button className="cursor-pointer group relative md:inline-flex px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600
                  hover:from-amber-600 hover:to-orange-700 text-white  text-md md:text-lg rounded-full shadow-xl hover:shadow-2xl
                  transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden" onClick={goNext}>
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <span>{current < qList.length - 1 ? (ns?.next || 'Next') : (ns?.finish || 'Finish')}</span>
            </button>
          </div>
          <div>
            {(ns?.answered || 'Answered {answered} / {total}').replace('{answered}',
              String(Object.keys(answers).length)).replace('{total}',
                String(qList.length))}</div>
        </div>
      </div>
    </div>
  );
}