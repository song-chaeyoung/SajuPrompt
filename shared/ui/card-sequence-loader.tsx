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

type StarPreset = CSSProperties & Record<`--${string}`, string>;

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

const STAR_PRESETS: readonly StarPreset[] = Array.from(
  { length: 50 },
  (_, index) => {
    const top = ((index * 37) % 100) + ((index % 5) * 0.4);
    const left = ((index * 53 + 17) % 100) + ((index % 3) * 0.28);
    const size = 0.4 + ((index * 29) % 180) / 100;
    const duration = 3 + ((index * 41) % 400) / 100;
    const delay = ((index * 19) % 60) / 10;
    const opacity = 0.1 + ((index * 23) % 45) / 100;

    return {
      width: `${size.toFixed(2)}px`,
      height: `${size.toFixed(2)}px`,
      top: `${Math.min(top, 99).toFixed(2)}%`,
      left: `${Math.min(left, 99).toFixed(2)}%`,
      "--star-duration": `${duration.toFixed(2)}s`,
      "--star-delay": `${delay.toFixed(2)}s`,
      "--star-opacity": opacity.toFixed(2),
    } satisfies StarPreset;
  },
);

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
      <div className="loader-phone-frame">
        <div className="loader-bg" />

        <div className="loader-stars" aria-hidden="true">
          {STAR_PRESETS.map((style, index) => (
            <span key={index} className="loader-star" style={style} />
          ))}
        </div>

        <div className="loader-content">
          <div className="loader-orb-wrap" aria-hidden="true">
            <div className="loader-orb-glow" />
            <div className="loader-ring loader-ring--outer" />
            <div className="loader-ring loader-ring--mid" />
            <div className="loader-ring loader-ring--inner" />
            <div className="loader-orb-center">
              <span className="loader-orb-glyph">☯</span>
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
        </div>

        <p className="loader-hint">브라우저에서만 동작 · 서버 전송 없음</p>
      </div>

      <span className="sr-only">
        {activeStep.label} {activeStep.pct}% {stepMessage}
        {showDelayedMessage ? " 마무리하고 있습니다" : ""}
      </span>

      <style jsx>{`
        .loader-phone-frame {
          --loader-ink: #1a1410;
          --loader-paper: #f5f0e8;
          --loader-paper-dim: rgba(245, 240, 232, 0.5);
          --loader-paper-faint: rgba(245, 240, 232, 0.15);
          --loader-gold: #c9a84c;
          --loader-gold-dim: rgba(201, 168, 76, 0.3);
          position: relative;
          width: min(390px, 100%);
          min-height: 844px;
          margin: 40px auto;
          overflow: hidden;
          border-radius: 48px;
          background: var(--loader-ink);
          box-shadow:
            0 0 0 1px rgba(201, 168, 76, 0.2),
            0 40px 120px rgba(0, 0, 0, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .loader-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(
              ellipse 70% 50% at 50% 40%,
              rgba(140, 100, 40, 0.22) 0%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 50% 40% at 20% 80%,
              rgba(80, 40, 20, 0.3) 0%,
              transparent 60%
            ),
            linear-gradient(170deg, #12100d 0%, #1e1810 40%, #0e0c09 100%);
        }

        .loader-stars {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
        }

        .loader-star {
          position: absolute;
          display: block;
          border-radius: 999px;
          background: var(--loader-gold);
          opacity: 0;
          animation: loader-twinkle var(--star-duration) ease-in-out infinite
            var(--star-delay);
        }

        .loader-content {
          position: relative;
          z-index: 10;
          display: flex;
          min-height: 844px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 36px;
          text-align: center;
        }

        .loader-orb-wrap {
          position: relative;
          width: 160px;
          height: 160px;
          margin-bottom: 48px;
        }

        .loader-ring {
          position: absolute;
          inset: 0;
          border: 1px solid transparent;
          border-radius: 50%;
        }

        .loader-ring--outer {
          border-color: rgba(201, 168, 76, 0.2);
          animation: loader-spin-cw 12s linear infinite;
        }

        .loader-ring--mid {
          inset: 14px;
          border-color: rgba(201, 168, 76, 0.15);
          border-style: dashed;
          animation: loader-spin-ccw 8s linear infinite;
        }

        .loader-ring--inner {
          inset: 30px;
          border-color: rgba(201, 168, 76, 0.25);
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
          background: var(--loader-gold);
          transform: translateY(-50%);
          box-shadow: 0 0 6px var(--loader-gold);
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
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(201, 168, 76, 0.12) 0%,
            transparent 70%
          );
          animation: loader-glow-pulse 3s ease-in-out infinite;
        }

        .loader-orb-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-orb-glyph {
          color: var(--loader-paper);
          font-family: var(--font-loader-title), serif;
          font-size: 36px;
          filter: drop-shadow(0 0 12px rgba(201, 168, 76, 0.5));
          animation: loader-breathe 3s ease-in-out infinite;
        }

        .loader-title {
          margin-bottom: 12px;
          color: var(--loader-paper);
          font-family: var(--font-loader-title), serif;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.4;
          animation: loader-fade-in 0.8s ease forwards 0.3s;
        }

        .loader-copy-block {
          min-height: 40px;
          margin-bottom: 40px;
        }

        .loader-step-message {
          min-height: 22px;
          color: var(--loader-paper-dim);
          font-family: var(--font-loader-body), serif;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.7;
          opacity: 1;
          transition: opacity 0.3s ease;
          animation: loader-fade-in 0.8s ease forwards 0.5s;
        }

        .loader-step-message.is-fading {
          opacity: 0;
        }

        .loader-delayed-message {
          margin-top: 8px;
          color: rgba(245, 240, 232, 0.36);
          font-family: var(--font-loader-mono), monospace;
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
          background: rgba(201, 168, 76, 0.1);
        }

        .loader-progress-fill {
          position: relative;
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(
            90deg,
            var(--loader-gold-dim),
            var(--loader-gold)
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
          background: var(--loader-gold);
          transform: translateY(-50%);
          box-shadow: 0 0 8px var(--loader-gold);
        }

        .loader-progress-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .loader-progress-step-text,
        .loader-progress-pct {
          color: rgba(201, 168, 76, 0.5);
          font-family: var(--font-loader-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
        }

        .loader-progress-pct {
          color: rgba(201, 168, 76, 0.4);
          letter-spacing: 0.05em;
        }

        .loader-hint {
          position: absolute;
          right: 0;
          bottom: 52px;
          left: 0;
          z-index: 10;
          color: var(--loader-paper-faint);
          text-align: center;
          font-family: var(--font-loader-mono), monospace;
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
            transform: scale(0.9);
            opacity: 0.5;
          }

          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        @keyframes loader-twinkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.5);
          }

          50% {
            opacity: var(--star-opacity);
            transform: scale(1);
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

        @media (max-width: 430px) {
          .loader-phone-frame {
            width: 100%;
            min-height: 100dvh;
            margin: 0;
            border-radius: 0;
          }

          .loader-content {
            min-height: 100dvh;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader-star,
          .loader-ring--outer,
          .loader-ring--mid,
          .loader-ring--inner,
          .loader-orb-glow,
          .loader-orb-glyph {
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
