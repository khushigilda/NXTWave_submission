import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Loader2, AlertCircle, RotateCcw, Edit3 } from 'lucide-react';
import { PROBLEM_CATEGORIES } from '../config';
import { generateBlueprint } from '../projectGenerator';
import { trackEvent } from '../analytics';
import type { ChallengeState, GeneratedBlueprint } from '../storage';
import {
  saveChallengeState,
  loadChallengeState,
  clearChallengeState,
  createInitialChallengeState,
} from '../storage';
import ProjectBlueprint from './ProjectBlueprint';
import WorkshopRegistrationCTA from './WorkshopRegistrationCTA';
import ReferralShare from './ReferralShare';
import './ChallengeWizard.css';

export default function ChallengeWizard() {
  const [state, setState] = useState<ChallengeState>(() => {
    return loadChallengeState() || createInitialChallengeState();
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ChallengeState, string>>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    saveChallengeState(state);
  }, [state]);

  function update(patch: Partial<ChallengeState>) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  function validateStep1(): boolean {
    const newErrors: typeof errors = {};
    if (!state.problemDescription.trim() || state.problemDescription.trim().length < 20) {
      newErrors.problemDescription = 'Please describe the problem in at least 20 characters.';
    }
    if (!state.category) {
      newErrors.category = 'Please select a category or describe your own problem.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleGenerateBlueprint() {
    setError(null);
    setLoading(true);
    try {
      trackEvent('problem_submitted', { category: state.category });
      const blueprint: GeneratedBlueprint = await generateBlueprint(state);
      update({ blueprint, step: 3, completedAt: new Date().toISOString() });
      trackEvent('blueprint_generated', { category: state.category });
    } catch (err) {
      setError('Something went wrong generating your blueprint. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleStartChallenge() {
    trackEvent('challenge_started', { source: 'wizard' });
    update({ step: 1 });
  }

  function handleStep1Next() {
    if (!validateStep1()) return;
    update({ step: 2 });
  }

  function handleReset() {
    clearChallengeState();
    const fresh = createInitialChallengeState();
    setState(fresh);
    setErrors({});
    setError(null);
    setShowResetConfirm(false);
  }

  // ── Step 0: Welcome ──────────────────────────────────────────
  if (state.step === 0) {
    return (
      <div className="wizard">
        <div className="wizard__welcome">
          <p className="section-eyebrow">60-MINUTE BUILD CHALLENGE</p>
          <h1>Your First AI Project Starts Here.</h1>
          <p className="wizard__welcome-text">
            Choose a real problem, shape your idea with AI, and walk away with a project blueprint
            you can actually build. No perfect idea required.
          </p>
          <button className="btn btn--primary btn--lg" onClick={handleStartChallenge} id="wizard-begin-btn">
            Begin the Challenge
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // ── Blueprint view (Step 3) ──────────────────────────────────
  if (state.step === 3 && state.blueprint) {
    return (
      <div className="wizard">
        <div className="wizard__header">
          <div className="wizard__progress">
            <ProgressDots current={3} total={3} />
          </div>
          <div className="wizard__header-actions">
            <button className="btn btn--ghost btn--sm" onClick={() => update({ step: 2 })} id="wizard-edit-btn">
              <Edit3 size={15} />
              Edit My Idea
            </button>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setShowResetConfirm(true)}
              id="wizard-restart-btn"
            >
              <RotateCcw size={15} />
              Start Again
            </button>
          </div>
        </div>

        {showResetConfirm && (
          <div className="wizard__confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirm restart">
            <div className="wizard__confirm-card card">
              <h3>Start again?</h3>
              <p className="text-muted mt-2">
                This will clear your current challenge inputs and blueprint. This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-5">
                <button className="btn btn--primary" onClick={handleReset} id="confirm-reset-btn">
                  Yes, start again
                </button>
                <button className="btn btn--secondary" onClick={() => setShowResetConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <ProjectBlueprint blueprint={state.blueprint} category={state.category} />

        <div className="wizard__post-blueprint">
          <WorkshopRegistrationCTA />
          <ReferralShare referralCode={state.referralCode} />
        </div>
      </div>
    );
  }

  // ── Step 1: Problem selection ────────────────────────────────
  if (state.step === 1) {
    return (
      <div className="wizard">
        <div className="wizard__header">
          <div className="wizard__progress">
            <ProgressDots current={1} total={3} />
          </div>
          <span className="wizard__step-label">Step 1 of 3 — Choose a Problem</span>
        </div>

        <div className="wizard__body card">
          <h2 className="wizard__question">What problem would you like your AI project to solve?</h2>
          <p className="text-muted mt-2 mb-5">Select a category, then describe the problem in your own words.</p>

          <div className="wizard__categories">
            {PROBLEM_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn${state.category === cat.id ? ' category-btn--selected' : ''}`}
                onClick={() => {
                  update({ category: cat.id });
                  setErrors((e) => ({ ...e, category: undefined }));
                }}
                id={`category-${cat.id}`}
              >
                <span className="category-btn__icon">{cat.icon}</span>
                <span className="category-btn__label">{cat.label}</span>
              </button>
            ))}
          </div>
          {errors.category && <p className="form-error mt-2"><AlertCircle size={13} />{errors.category}</p>}

          <div className="form-group mt-5">
            <label className="form-label" htmlFor="problem-desc">
              Describe the problem in your own words
              <span> — be specific, this shapes your blueprint</span>
            </label>
            <textarea
              id="problem-desc"
              className="form-textarea"
              rows={4}
              placeholder="Students find it difficult to revise several subjects before exams, especially when deadlines overlap and they don't know where to start."
              value={state.problemDescription}
              onChange={(e) => {
                update({ problemDescription: e.target.value });
                setErrors((err) => ({ ...err, problemDescription: undefined }));
              }}
            />
            {errors.problemDescription && (
              <p className="form-error"><AlertCircle size={13} />{errors.problemDescription}</p>
            )}
          </div>

          <div className="wizard__footer">
            <button className="btn btn--primary" onClick={handleStep1Next} id="step1-next-btn">
              Continue
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Project definition ───────────────────────────────
  return (
    <div className="wizard">
      <div className="wizard__header">
        <div className="wizard__progress">
          <ProgressDots current={2} total={3} />
        </div>
        <span className="wizard__step-label">Step 2 of 3 — Define Your Project</span>
      </div>

      <div className="wizard__body card">
        <h2 className="wizard__question">Let's shape your idea</h2>
        <p className="text-muted mt-2 mb-5">
          Answer what you can — all fields are optional, but the more you fill in, the more specific your blueprint will be.
        </p>

        <div className="wizard__problem-summary">
          <span className="wizard__problem-label">Your problem:</span>
          <span className="wizard__problem-text">{state.problemDescription}</span>
          <button className="btn btn--ghost btn--sm" onClick={() => update({ step: 1 })}>
            <Edit3 size={13} /> Change
          </button>
        </div>

        <div className="wizard__fields">
          <div className="form-group">
            <label className="form-label" htmlFor="target-user">
              Who experiences this problem? <span>(optional)</span>
            </label>
            <input
              id="target-user"
              className="form-input"
              placeholder="e.g. Final-year engineering students, first-time job seekers"
              value={state.targetUser}
              onChange={(e) => update({ targetUser: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="what-should-do">
              What should the project help them do? <span>(optional)</span>
            </label>
            <input
              id="what-should-do"
              className="form-input"
              placeholder="e.g. Create a personalised revision schedule in seconds"
              value={state.whatShouldDo}
              onChange={(e) => update({ whatShouldDo: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="user-input">
              What information will the user provide to the project? <span>(optional)</span>
            </label>
            <input
              id="user-input"
              className="form-input"
              placeholder="e.g. Subject names, exam dates, hours available per day"
              value={state.userInput}
              onChange={(e) => update({ userInput: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="expected-output">
              What result should the project give back? <span>(optional)</span>
            </label>
            <input
              id="expected-output"
              className="form-input"
              placeholder="e.g. A day-by-day revision timetable with time blocks"
              value={state.expectedOutput}
              onChange={(e) => update({ expectedOutput: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <div className="toast toast--error mt-4">
            <AlertCircle size={18} />
            {error}
            <button className="btn btn--ghost btn--sm" onClick={handleGenerateBlueprint}>Retry</button>
          </div>
        )}

        <div className="wizard__footer">
          <button className="btn btn--secondary" onClick={() => update({ step: 1 })} id="step2-back-btn">
            <ChevronLeft size={18} /> Back
          </button>
          <button
            className="btn btn--primary"
            onClick={handleGenerateBlueprint}
            disabled={loading}
            id="generate-blueprint-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Generating blueprint…
              </>
            ) : (
              <>
                Help Me Shape My Idea
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="progress-dots" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`progress-dot${i < current ? ' progress-dot--done' : ''}${i === current - 1 ? ' progress-dot--current' : ''}`}
        />
      ))}
      <span className="progress-dots__label">{current}/{total}</span>
    </div>
  );
}
