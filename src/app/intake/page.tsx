'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Send } from 'lucide-react';

type IntakeAnswer = {
  id: string;
  question: string;
  answer: string;
};

const QUESTIONS: IntakeAnswer[] = [
  { id: 'eventType', question: 'What type of event do you want to host?', answer: '' },
  { id: 'attendees', question: 'How many guests are you expecting?', answer: '' },
  { id: 'vibe', question: 'Describe the vibe or aesthetic you are aiming for.', answer: '' },
  { id: 'budget', question: 'What is your approximate budget range?', answer: '' },
  { id: 'timeline', question: 'When are you planning to launch this experience?', answer: '' },
  { id: 'locationFlex', question: 'How flexible are you on location or city?', answer: '' },
  { id: 'features', question: 'Any non-negotiable features or services you need?', answer: '' },
];

const INITIAL_STATE: Record<string, string> = QUESTIONS.reduce(
  (acc, curr) => ({ ...acc, [curr.id]: '' }),
  {} as Record<string, string>
);

export default function IntakePage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [sessionSecret, setSessionSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[stepIndex];

  const isComplete = useMemo(
    () => QUESTIONS.every((q) => answers[q.id]?.trim().length),
    [answers]
  );

  const handleChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]?.trim()) return;
    setStepIndex((idx) => Math.min(idx + 1, QUESTIONS.length - 1));
  };

  const handlePrev = () => {
    setStepIndex((idx) => Math.max(idx - 1, 0));
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/chatkit/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intake: QUESTIONS.map((q) => ({ id: q.id, question: q.question, answer: answers[q.id] })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create AI session');
      }

      const payload = await response.json();
      setSessionSecret(payload?.client_secret ?? null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unable to start AI questionnaire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-[#f5f5f5]">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <span className="text-xs uppercase tracking-[0.35em] text-white/40">DesignLabz AI intake</span>
        </div>
      </header>

      <main className="flex flex-1 justify-center px-6 py-10">
        <div className="flex w-full max-w-5xl flex-col gap-10 md:flex-row">
          <aside className="md:w-64">
            <h1 className="text-2xl font-semibold text-white">Tell us about your event</h1>
            <p className="mt-2 text-sm text-white/60">
              We translate these answers into DesignLabz prompts and campaign tasks. Complete the sequence and we’ll
              open an AI planning session tailored to your responses.
            </p>
            <Progress steps={QUESTIONS.length} current={stepIndex} />
          </aside>

          <section className="flex-1">
            <div className="flex h-full flex-col justify-between gap-8 rounded-[28px] border border-white/10 bg-gradient-to-b from-white/5 via-black/20 to-black/30 p-8 shadow-[0_0_50px_rgba(0,0,0,0.4)]">
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.4em] text-white/50">Question {stepIndex + 1}</div>
                <h2 className="text-2xl font-semibold text-white">{currentQuestion.question}</h2>
                <textarea
                  className="min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-white/30 focus:ring-2 focus:ring-white/15"
                  value={answers[currentQuestion.id]}
                  onChange={(event) => handleChange(event.target.value)}
                  placeholder="Type your response here"
                />
                <div className="flex items-center justify-between text-xs text-white/50">
                  <button
                    onClick={handlePrev}
                    disabled={stepIndex === 0}
                    className="rounded-full border border-white/10 px-4 py-2 uppercase tracking-[0.35em] text-white/60 transition disabled:opacity-30"
                  >
                    Back
                  </button>
                  <button
                    onClick={stepIndex === QUESTIONS.length - 1 ? handleSubmit : handleNext}
                    disabled={!answers[currentQuestion.id]?.trim() || loading}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-white/15 disabled:opacity-30"
                  >
                    {stepIndex === QUESTIONS.length - 1 ? 'Submit' : 'Next'}
                    {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                  {error}
                </div>
              )}

              {sessionSecret && (
                <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
                  <div className="text-xs uppercase tracking-[0.35em] text-white/50">AI Session Ready</div>
                  <p>
                    Your answers are saved. Launch the AI assistant to refine layouts, ask follow-ups, or request a
                    campaign playbook.
                  </p>
                  <code className="block rounded-xl bg-black/40 px-3 py-3 text-xs text-white/80">
                    client_secret: {sessionSecret}
                  </code>
                </div>
              )}
            </div>

            <SummaryPanel answers={answers} />
          </section>
        </div>
      </main>
    </div>
  );
}

function Progress({ steps, current }: { steps: number; current: number }) {
  return (
    <div className="mt-8 space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/40">
        <span>progress</span>
        <span>
          {current + 1} / {steps}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white/70 transition-all"
          style={{ width: `${((current + 1) / steps) * 100}%` }}
        />
      </div>
    </div>
  );
}

function SummaryPanel({ answers }: { answers: Record<string, string> }) {
  return (
    <section className="mt-8 rounded-[24px] border border-white/10 bg-black/25 p-6 text-sm text-white/65">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Quick Summary</h3>
        <Send className="h-4 w-4 text-white/50" />
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.35em] text-white/40">working canvas</p>
      <div className="mt-3 space-y-2">
        {QUESTIONS.map((question) => (
          <div key={question.id} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
            <div className="text-[11px] uppercase tracking-[0.35em] text-white/40">{question.question}</div>
            <p className="mt-1 text-sm text-white/70">
              {answers[question.id] ? answers[question.id] : <span className="text-white/30">Awaiting input…</span>}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
