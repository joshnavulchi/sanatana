"use client";
import { useEffect, useMemo, useState } from "react";

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
  const [questionsPool, setQuestionsPool] = useState<Question[] | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, keyof Options>>({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let mounted = true;
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const lang = params ? params.get('lang') : null;
      const url = lang ? `/locales/${encodeURIComponent(lang)}/questions.json` : '/locales/en/questions.json';
      fetch(url)
        .then((r) => r.json())
        .then((data: any) => {
          if (!mounted) return;
          let list: any[] = [];
          if (Array.isArray(data)) list = data;
          else if (data && Array.isArray(data.questions)) list = data.questions;
          else if (data && data.questions && typeof data.questions === 'object') list = Object.values(data.questions);
          else list = [];

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

          if (!mounted) return;
          setQuestionsPool(normalized);
          const indices = sampleIndices(normalized.length, Math.min(10, normalized.length));
          setSelectedIdx(indices);
        })
        .catch((err) => console.error('Failed to load questions', err));
    } catch (e) {
      console.error('Failed to build questions fetch URL', e);
    }
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

  if (!questionsPool) return <div>Loading questions…</div>;
  if (qList.length === 0) return <div>Preparing quiz…</div>;

  if (!started) {
    return (
      <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl">Ready for the Quiz?</h2>
        <p>You will be asked {qList.length} random questions. You have {fmtTime(timeLeft)} to complete the quiz.</p>
        <div className="flex gap-3">
          <button className="group relative md:inline-flex px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600
                    hover:from-amber-600 hover:to-orange-700 text-white text-lg rounded-full shadow-xl hover:shadow-2xl
                    transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden" onClick={() => setStarted(true)}>
            <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <span>Start Quiz</span>
          </button>
          <button className="group md:inline-flex px-8 py-4 bg-white/10 backdrop-blur-md
                    hover:bg-white/20 border-2 border-white/50 hover:border-white
                    text-white text-lg rounded-full shadow-lg hover:shadow-xl
                    transition-all duration-300 transform hover:-translate-y-1 no-underline" onClick={restart}>Shuffle Questions</button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl">Quiz Results</h2>
        <div>Your score: <strong>{score}</strong> / {qList.length}</div>
        <div>Time taken: {fmtTime(10 * 60 - timeLeft)}</div>
        <div className="space-y-3">
          {qList.map((q, idx) => (
            <div key={q.id} className="border rounded">
              <div>{idx + 1}. {q.question}</div>
              <div>
                {(['A', 'B', 'C', 'D'] as (keyof Options)[]).map((k) => {
                  const correct = k === q.answer;
                  const chosen = answers[q.id] === k;
                  return (
                    <div key={k} className={`inline-block ${correct ? 'text-green-700' : chosen ? 'text-red-700' : ''}`}>
                      <strong>{k}.</strong> {q.options[k]} {correct ? ' (Correct)' : chosen ? ' (Your choice)' : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="group relative md:inline-flex px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600
                    hover:from-amber-600 hover:to-orange-700 text-white text-lg rounded-full shadow-xl hover:shadow-2xl
                    transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden" onClick={restart}>
            <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <span className="relative flex">Restart Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  const q = qList[current];

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center">
        <div>Question {current + 1} / {qList.length}</div>
        <div className="font-mono">Time left: {fmtTime(timeLeft)}</div>
      </div>

      <div className="border rounded">
        <div className="text-2xl md:text-3xl">{q.question}</div>
        <div className="flex flex-col gap-2">
          {(['A', 'B', 'C', 'D'] as (keyof Options)[]).map((k) => (
            <button
              className="btn btn-primary"
              key={k}
              onClick={() => selectOption(k)}>
              <strong>{k}.</strong> {q.options[k]}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <div>
            <button className="group relative md:inline-flex px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600
                    hover:from-amber-600 hover:to-orange-700 text-white text-lg rounded-full shadow-xl hover:shadow-2xl
                    transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden" onClick={goPrev} disabled={current === 0}>
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <span>Previous</span>
            </button>
            <button className="group md:inline-flex px-8 py-4 bg-white/10 backdrop-blur-md
                    hover:bg-white/20 border-2 border-white/50 hover:border-white
                    text-white text-lg rounded-full shadow-lg hover:shadow-xl
                    transition-all duration-300 transform hover:-translate-y-1 no-underline" onClick={goNext}>
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <span>{current < qList.length - 1 ? 'Next' : 'Finish'}</span>
            </button>
          </div>
          <div className="text-gray-600">Answered: {Object.keys(answers).length} / {qList.length}</div>
        </div>
      </div>
    </div>
  );
}
