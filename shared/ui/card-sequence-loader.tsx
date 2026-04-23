"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { cn } from "@/shared/lib/utils";

export interface CardSequenceLoaderProps {
  className?: string;
}

type LoaderStep = {
  pct: number;
  label: string;
  msg: string;
};

const INITIAL_DELAY_MS = 800;
const MESSAGE_FADE_DURATION_MS = 300;
const FINAL_DELAY_MESSAGE_MS = 6600;

const LOADER_STEPS: readonly LoaderStep[] = [
  {
    pct: 0,
    label: "STEP 1 / 3",
    msg: "생년월일에서 사주팔자를 추출하는 중...",
  },
  {
    pct: 30,
    label: "STEP 1 / 3",
    msg: "생년월일에서 사주팔자를 추출하는 중...",
  },
  {
    pct: 55,
    label: "STEP 2 / 3",
    msg: "음양오행과 십신을 분석하는 중...",
  },
  {
    pct: 80,
    label: "STEP 3 / 3",
    msg: "질문 목적에 맞는 문장으로 다듬는 중...",
  },
  {
    pct: 100,
    label: "STEP 3 / 3",
    msg: "거의 다 됐어요 ✦",
  },
] as const;

const STEP_CHANGE_SCHEDULE = [
  INITIAL_DELAY_MS + 600,
  INITIAL_DELAY_MS + 600 + 1600,
  INITIAL_DELAY_MS + 600 + 1600 + 1400,
  INITIAL_DELAY_MS + 600 + 1600 + 1400 + 1000,
] as const;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  return prefersReducedMotion;
}

export function CardSequenceLoader({ className }: CardSequenceLoaderProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [stepMessage, setStepMessage] = useState(LOADER_STEPS[0].msg);
  const [isMessageFading, setIsMessageFading] = useState(false);
  const [showDelayedMessage, setShowDelayedMessage] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current;

    const updateStep = (nextStepIndex: number) => {
      const nextStep = LOADER_STEPS[nextStepIndex];
      setStepIndex(nextStepIndex);
      setShowDelayedMessage(false);

      if (prefersReducedMotion) {
        setIsMessageFading(false);
        setStepMessage(nextStep.msg);
        return;
      }

      setIsMessageFading(true);

      const messageTimer = window.setTimeout(() => {
        setStepMessage(nextStep.msg);
        setIsMessageFading(false);
      }, MESSAGE_FADE_DURATION_MS);

      timeoutIds.push(messageTimer);
    };

    STEP_CHANGE_SCHEDULE.forEach((time, index) => {
      const stepTimer = window.setTimeout(() => {
        updateStep(index + 1);
      }, time);

      timeoutIds.push(stepTimer);
    });

    const delayedMessageTimer = window.setTimeout(() => {
      setShowDelayedMessage(true);
    }, FINAL_DELAY_MESSAGE_MS);

    timeoutIds.push(delayedMessageTimer);

    return () => {
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutIdsRef.current = [];
    };
  }, [prefersReducedMotion]);

  const activeStep = LOADER_STEPS[stepIndex];
  const progressStyle = {
    width: `${activeStep.pct}%`,
  } satisfies CSSProperties;

  return (
    <div
      className={cn("relative w-full", className)}
      role="status"
      aria-live="polite"
    >
      <div className="loader-shell">
        <div className="loader-content">
          <div className="loader-orb-wrap" aria-hidden="true">
            <div className="loader-orb-glow" />
            <div className="loader-ring loader-ring--outer" />
            <div className="loader-ring loader-ring--mid" />
            <div className="loader-ring loader-ring--inner" />
            <div className="loader-core">
              <span className="loader-core-dot" />
            </div>
          </div>

          <h2 className="loader-title">사주를 읽고 있습니다</h2>

          <div className="loader-copy-block">
            <p
              className={cn("loader-step-message", isMessageFading && "is-fading")}
            >
              {stepMessage}
            </p>
            {showDelayedMessage ? (
              <p className="loader-delayed-message">마무리하고 있습니다</p>
            ) : null}
          </div>

          <div className="loader-progress-wrap">
            <div className="loader-progress-track">
              <div className="loader-progress-fill" style={progressStyle} />
            </div>
            <div className="loader-progress-label">
              <span className="loader-progress-step-text">{activeStep.label}</span>
              <span className="loader-progress-pct">{activeStep.pct}%</span>
            </div>
          </div>

          <p className="loader-hint">브라우저에서만 동작 · 서버 전송 없음</p>
        </div>
      </div>

      <span className="sr-only">
        {activeStep.label} {activeStep.pct}% {stepMessage}
        {showDelayedMessage ? " 마무리하고 있습니다" : ""}
      </span>

      <style jsx>{`
        .loader-shell {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: calc(var(--radius-3xl) * 0.95);
          border: 1px solid
            color-mix(in oklch, var(--primary) 10%, var(--border) 90%);
          background: linear-gradient(
            180deg,
            color-mix(in oklch, var(--background) 84%, var(--card) 16%) 0%,
            color-mix(in oklch, var(--background) 72%, var(--card) 28%) 100%
          );
          box-shadow:
            0 24px 54px color-mix(in oklch, var(--primary) 10%, transparent),
            inset 0 1px 0 color-mix(in oklch, var(--background) 86%, transparent);
        }

        .loader-shell::before {
          content: "";
          position: absolute;
          top: -4.5rem;
          right: -3rem;
          width: 11rem;
          height: 11rem;
          border-radius: 999px;
          background: var(--hero-halo);
          filter: blur(82px);
          pointer-events: none;
        }

        .loader-shell::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 1px solid color-mix(in oklch, var(--background) 40%, transparent);
          pointer-events: none;
        }

        .loader-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(1.75rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 2rem);
          text-align: center;
        }

        .loader-orb-wrap {
          position: relative;
          width: 140px;
          height: 140px;
          margin-bottom: 32px;
        }

        .loader-ring {
          position: absolute;
          inset: 0;
          border: 1px solid transparent;
          border-radius: 50%;
        }

        .loader-ring--outer {
          border-color: color-mix(
            in oklch,
            var(--hero-ornament) 24%,
            transparent
          );
          animation: loader-spin-cw 12s linear infinite;
        }

        .loader-ring--mid {
          inset: 12px;
          border-color: color-mix(
            in oklch,
            var(--hero-ornament) 18%,
            transparent
          );
          border-style: dashed;
          animation: loader-spin-ccw 8s linear infinite;
        }

        .loader-ring--inner {
          inset: 28px;
          border-color: color-mix(in oklch, var(--primary) 18%, transparent);
          animation: loader-spin-cw 5s linear infinite;
        }

        .loader-ring--outer::before,
        .loader-ring--outer::after,
        .loader-ring--mid::before {
          content: "";
          position: absolute;
          width: 4px;
          height: 4px;
          top: 50%;
          left: -2px;
          border-radius: 50%;
          background: var(--hero-dust);
          transform: translateY(-50%);
          box-shadow: 0 0 10px color-mix(in oklch, var(--hero-dust) 72%, transparent);
        }

        .loader-ring--outer::after {
          left: auto;
          right: -2px;
          opacity: 0.5;
        }

        .loader-ring--mid::before {
          top: -1.5px;
          left: 50%;
          width: 3px;
          height: 3px;
          transform: translateX(-50%);
        }

        .loader-orb-glow {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            color-mix(in oklch, var(--hero-halo) 92%, transparent) 0%,
            color-mix(in oklch, var(--accent) 12%, transparent) 38%,
            transparent 70%
          );
          animation: loader-glow-pulse 3s ease-in-out infinite;
        }

        .loader-core {
          position: absolute;
          inset: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background:
            radial-gradient(
              circle at 34% 32%,
              color-mix(in oklch, var(--hero-halo) 90%, transparent) 0%,
              color-mix(in oklch, var(--accent) 20%, transparent) 36%,
              transparent 72%
            ),
            color-mix(in oklch, var(--background) 84%, var(--card) 16%);
          box-shadow:
            inset 0 1px 0 color-mix(in oklch, var(--background) 90%, transparent),
            0 18px 30px color-mix(in oklch, var(--primary) 8%, transparent);
        }

        .loader-core-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--hero-dust);
          box-shadow:
            0 0 0 8px color-mix(in oklch, var(--hero-halo) 28%, transparent),
            0 0 18px color-mix(in oklch, var(--hero-dust) 72%, transparent);
          animation: loader-breathe 3s ease-in-out infinite;
        }

        .loader-title {
          margin-bottom: 10px;
          color: var(--foreground);
          font-family: var(--app-font-heading), sans-serif;
          font-size: clamp(1.4rem, 1.28rem + 0.45vw, 1.75rem);
          font-weight: 700;
          line-height: 1.4;
          animation: loader-fade-in 0.8s ease forwards 0.3s;
        }

        .loader-copy-block {
          min-height: 46px;
          margin-bottom: 26px;
        }

        .loader-step-message {
          min-height: 22px;
          color: color-mix(in oklch, var(--foreground) 70%, var(--muted-foreground) 30%);
          font-family: var(--app-font-sans), sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.65;
          opacity: 1;
          transition: opacity 0.3s ease;
          animation: loader-fade-in 0.8s ease forwards 0.5s;
        }

        .loader-step-message.is-fading {
          opacity: 0;
        }

        .loader-delayed-message {
          margin-top: 8px;
          color: color-mix(in oklch, var(--muted-foreground) 74%, transparent);
          font-family: var(--app-font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          animation: loader-fade-in 0.35s ease forwards;
        }

        .loader-progress-wrap {
          width: 100%;
          animation: loader-fade-in 0.8s ease forwards 0.6s;
        }

        .loader-progress-track {
          position: relative;
          height: 2px;
          margin-bottom: 10px;
          overflow: visible;
          border-radius: 2px;
          background: color-mix(in oklch, var(--primary) 10%, transparent);
        }

        .loader-progress-fill {
          position: relative;
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(
            90deg,
            color-mix(in oklch, var(--primary) 18%, transparent),
            color-mix(in oklch, var(--hero-ornament) 88%, var(--primary) 12%)
          );
          transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .loader-progress-fill::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -3px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--hero-dust);
          transform: translateY(-50%);
          box-shadow: 0 0 10px color-mix(in oklch, var(--hero-dust) 74%, transparent);
        }

        .loader-progress-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .loader-progress-step-text,
        .loader-progress-pct {
          color: color-mix(in oklch, var(--foreground) 56%, var(--primary) 44%);
          font-family: var(--app-font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
        }

        .loader-progress-pct {
          color: color-mix(in oklch, var(--muted-foreground) 84%, var(--primary) 16%);
          letter-spacing: 0.05em;
        }

        .loader-hint {
          margin-top: 18px;
          color: color-mix(in oklch, var(--muted-foreground) 76%, transparent);
          text-align: center;
          font-family: var(--app-font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          animation: loader-fade-in 1s ease forwards 1.2s;
        }

        @keyframes loader-spin-cw {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes loader-spin-ccw {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes loader-breathe {
          0%,
          100% {
            transform: scale(0.92);
            opacity: 0.7;
          }

          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }

        @keyframes loader-glow-pulse {
          0%,
          100% {
            transform: scale(0.92);
            opacity: 0.56;
          }

          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        @keyframes loader-fade-in {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader-ring--outer,
          .loader-ring--mid,
          .loader-ring--inner,
          .loader-orb-glow,
          .loader-core-dot {
            animation: none !important;
          }

          .loader-step-message,
          .loader-progress-wrap,
          .loader-title,
          .loader-hint,
          .loader-delayed-message {
            animation: none !important;
            opacity: 1 !important;
          }

          .loader-step-message {
            transition: none;
          }

          .loader-progress-fill {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
