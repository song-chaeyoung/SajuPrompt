import type { CSSProperties } from "react";

import { cn } from "@/shared/lib/utils";

type CardSequenceLoaderSize = "sm" | "md" | "lg";
type CardSequenceLoaderColorVariant = "default" | "muted" | "transparent";

export interface CardSequenceLoaderProps {
  size?: CardSequenceLoaderSize;
  speed?: number;
  colorVariant?: CardSequenceLoaderColorVariant;
  className?: string;
}

type LoaderStyle = CSSProperties & Record<`--${string}`, string>;

type TilePreset = {
  x: string;
  y: string;
  scale: string;
  rotate: string;
  activeRotate: string;
  zIndex: number;
  delayMultiplier: number;
};

const SIZE_STYLES: Record<CardSequenceLoaderSize, LoaderStyle> = {
  sm: {
    "--loader-stage-width": "calc(var(--space-4xl) * 1.02)",
    "--loader-stage-height": "calc(var(--space-4xl) * 0.88)",
    "--loader-card-width": "calc(var(--space-2xl) * 0.82)",
    "--loader-card-height": "calc(var(--space-2xl) * 0.98)",
    "--loader-card-radius": "var(--radius-2xl)",
    "--loader-depth": "calc(var(--space-xs) * 0.78)",
    "--loader-lift": "calc(var(--space-2xs) * -1.6)",
    "--loader-gloss-height": "32%",
    "--loader-edge-inset": "11%",
  },
  md: {
    "--loader-stage-width": "calc(var(--space-4xl) * 1.18)",
    "--loader-stage-height": "calc(var(--space-4xl) * 1.02)",
    "--loader-card-width": "calc(var(--space-2xl) * 0.98)",
    "--loader-card-height": "calc(var(--space-2xl) * 1.18)",
    "--loader-card-radius": "var(--radius-3xl)",
    "--loader-depth": "calc(var(--space-xs) * 0.96)",
    "--loader-lift": "calc(var(--space-xs) * -1.48)",
    "--loader-gloss-height": "34%",
    "--loader-edge-inset": "12%",
  },
  lg: {
    "--loader-stage-width": "calc(var(--space-4xl) * 1.36)",
    "--loader-stage-height": "calc(var(--space-4xl) * 1.18)",
    "--loader-card-width": "calc(var(--space-2xl) * 1.16)",
    "--loader-card-height": "calc(var(--space-2xl) * 1.38)",
    "--loader-card-radius": "calc(var(--radius-3xl) * 1.02)",
    "--loader-depth": "calc(var(--space-sm) * 0.82)",
    "--loader-lift": "calc(var(--space-sm) * -1.18)",
    "--loader-gloss-height": "35%",
    "--loader-edge-inset": "13%",
  },
};

const COLOR_STYLES: Record<CardSequenceLoaderColorVariant, LoaderStyle> = {
  default: {
    "--loader-face-top":
      "color-mix(in oklch, var(--color-surface) 82%, var(--color-bg) 18%)",
    "--loader-face-bottom":
      "color-mix(in oklch, var(--color-surface-muted) 74%, var(--color-bg) 26%)",
    "--loader-face-mid":
      "color-mix(in oklch, var(--color-surface) 76%, var(--color-surface-muted) 24%)",
    "--loader-border":
      "color-mix(in oklch, var(--color-border) 72%, var(--color-text) 7%)",
    "--loader-inner-line":
      "color-mix(in oklch, var(--color-bg) 78%, var(--color-text) 8%)",
    "--loader-highlight":
      "color-mix(in oklch, var(--color-bg) 88%, transparent)",
    "--loader-shade":
      "color-mix(in oklch, var(--color-primary) 18%, transparent)",
    "--loader-edge":
      "color-mix(in oklch, var(--color-surface-muted) 86%, var(--color-text) 8%)",
    "--loader-edge-shadow":
      "color-mix(in oklch, var(--color-primary) 12%, transparent)",
    "--loader-brass-rim":
      "color-mix(in oklch, var(--color-accent) 38%, transparent)",
    "--loader-brass-glow":
      "color-mix(in oklch, var(--color-accent-soft) 94%, transparent)",
    "--loader-shadow-rest":
      "0 20px 26px color-mix(in oklch, var(--color-text) 7%, transparent), 0 7px 10px color-mix(in oklch, var(--color-text) 3%, transparent)",
    "--loader-shadow-active":
      "0 26px 36px color-mix(in oklch, var(--color-text) 11%, transparent), 0 10px 16px color-mix(in oklch, var(--color-text) 5%, transparent), 0 0 0 1px color-mix(in oklch, var(--color-accent) 18%, transparent), 0 0 30px color-mix(in oklch, var(--color-accent-soft) 88%, transparent)",
    "--loader-ambient":
      "color-mix(in oklch, var(--color-primary) 9%, transparent)",
    "--loader-ambient-brass":
      "color-mix(in oklch, var(--color-accent-soft) 74%, transparent)",
  },
  muted: {
    "--loader-face-top":
      "color-mix(in oklch, var(--color-surface) 74%, var(--color-bg) 26%)",
    "--loader-face-bottom":
      "color-mix(in oklch, var(--color-surface-muted) 78%, var(--color-bg) 22%)",
    "--loader-face-mid":
      "color-mix(in oklch, var(--color-surface-muted) 30%, var(--color-surface) 70%)",
    "--loader-border":
      "color-mix(in oklch, var(--color-border) 76%, var(--color-text) 5%)",
    "--loader-inner-line":
      "color-mix(in oklch, var(--color-bg) 72%, var(--color-text) 8%)",
    "--loader-highlight":
      "color-mix(in oklch, var(--color-bg) 84%, transparent)",
    "--loader-shade":
      "color-mix(in oklch, var(--color-primary) 14%, transparent)",
    "--loader-edge":
      "color-mix(in oklch, var(--color-surface-muted) 88%, var(--color-text) 6%)",
    "--loader-edge-shadow":
      "color-mix(in oklch, var(--color-primary) 9%, transparent)",
    "--loader-brass-rim":
      "color-mix(in oklch, var(--color-accent) 28%, transparent)",
    "--loader-brass-glow":
      "color-mix(in oklch, var(--color-accent-soft) 78%, transparent)",
    "--loader-shadow-rest":
      "0 18px 24px color-mix(in oklch, var(--color-text) 6%, transparent), 0 6px 10px color-mix(in oklch, var(--color-text) 3%, transparent)",
    "--loader-shadow-active":
      "0 24px 33px color-mix(in oklch, var(--color-text) 9%, transparent), 0 8px 14px color-mix(in oklch, var(--color-text) 5%, transparent), 0 0 0 1px color-mix(in oklch, var(--color-accent) 14%, transparent), 0 0 26px color-mix(in oklch, var(--color-accent-soft) 78%, transparent)",
    "--loader-ambient":
      "color-mix(in oklch, var(--color-primary) 7%, transparent)",
    "--loader-ambient-brass":
      "color-mix(in oklch, var(--color-accent-soft) 62%, transparent)",
  },
  transparent: {
    "--loader-face-top":
      "color-mix(in oklch, var(--color-surface) 62%, transparent)",
    "--loader-face-bottom":
      "color-mix(in oklch, var(--color-surface-muted) 68%, transparent)",
    "--loader-face-mid":
      "color-mix(in oklch, var(--color-surface) 56%, var(--color-surface-muted) 44%)",
    "--loader-border":
      "color-mix(in oklch, var(--color-border) 58%, transparent)",
    "--loader-inner-line":
      "color-mix(in oklch, var(--color-bg) 50%, transparent)",
    "--loader-highlight":
      "color-mix(in oklch, var(--color-bg) 72%, transparent)",
    "--loader-shade":
      "color-mix(in oklch, var(--color-primary) 11%, transparent)",
    "--loader-edge":
      "color-mix(in oklch, var(--color-surface-muted) 72%, transparent)",
    "--loader-edge-shadow":
      "color-mix(in oklch, var(--color-primary) 8%, transparent)",
    "--loader-brass-rim":
      "color-mix(in oklch, var(--color-accent) 24%, transparent)",
    "--loader-brass-glow":
      "color-mix(in oklch, var(--color-accent-soft) 72%, transparent)",
    "--loader-shadow-rest":
      "0 18px 24px color-mix(in oklch, var(--color-text) 6%, transparent)",
    "--loader-shadow-active":
      "0 24px 34px color-mix(in oklch, var(--color-text) 9%, transparent), 0 0 0 1px color-mix(in oklch, var(--color-accent) 12%, transparent), 0 0 24px color-mix(in oklch, var(--color-accent-soft) 76%, transparent)",
    "--loader-ambient":
      "color-mix(in oklch, var(--color-primary) 6%, transparent)",
    "--loader-ambient-brass":
      "color-mix(in oklch, var(--color-accent-soft) 56%, transparent)",
  },
};

const TILE_PRESETS: readonly TilePreset[] = [
  {
    x: "-34%",
    y: "-9%",
    scale: "0.92",
    rotate: "-12deg",
    activeRotate: "-10deg",
    zIndex: 1,
    delayMultiplier: 0,
  },
  {
    x: "32%",
    y: "-13%",
    scale: "0.9",
    rotate: "11deg",
    activeRotate: "9deg",
    zIndex: 2,
    delayMultiplier: 1,
  },
  {
    x: "-16%",
    y: "12%",
    scale: "1",
    rotate: "-5deg",
    activeRotate: "-3deg",
    zIndex: 4,
    delayMultiplier: 2,
  },
  {
    x: "17%",
    y: "8%",
    scale: "0.98",
    rotate: "6deg",
    activeRotate: "4deg",
    zIndex: 3,
    delayMultiplier: 3,
  },
] as const;

export function CardSequenceLoader({
  size = "md",
  speed = 1.4,
  colorVariant = "default",
  className,
}: CardSequenceLoaderProps) {
  const clampedSpeed = Math.min(1.6, Math.max(1.2, speed));
  const rootStyle = {
    ...SIZE_STYLES[size],
    ...COLOR_STYLES[colorVariant],
    "--loader-duration": `${clampedSpeed}s`,
  } satisfies LoaderStyle;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={rootStyle}
      role="status"
      aria-live="polite"
    >
      <div data-slot="loader-stage" className="relative">
        <div data-slot="loader-ground" aria-hidden="true" />

        {TILE_PRESETS.map((tile, index) => (
          <div
            key={index}
            data-slot="loader-tile"
            data-static-depth={index}
            className="absolute left-1/2 top-1/2"
            style={
              {
                "--tile-x": tile.x,
                "--tile-y": tile.y,
                "--tile-scale": tile.scale,
                "--tile-rotate": tile.rotate,
                "--tile-active-rotate": tile.activeRotate,
                animationDelay: `${tile.delayMultiplier * 0.14}s`,
                zIndex: tile.zIndex,
              } as LoaderStyle
            }
          >
            <div data-slot="loader-tile-shell" className="relative">
              <div data-slot="loader-tile-face" className="absolute inset-0" />
              <div data-slot="loader-tile-rim" className="absolute inset-0" />
              <div data-slot="loader-tile-gloss" className="absolute inset-0" />
              <div data-slot="loader-tile-edge" className="absolute inset-x-0 bottom-0" />
              <div data-slot="loader-tile-reflection" className="absolute inset-0" />
              <div data-slot="loader-tile-core" className="absolute inset-0" />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">질문을 정리하는 중입니다.</span>

      <style jsx>{`
        [data-slot="loader-stage"] {
          width: var(--loader-stage-width);
          height: var(--loader-stage-height);
          isolation: isolate;
          pointer-events: none;
        }

        [data-slot="loader-ground"] {
          position: absolute;
          left: 50%;
          bottom: 6%;
          width: 74%;
          height: 24%;
          transform: translateX(-50%);
          border-radius: 999px;
          background:
            radial-gradient(
              ellipse at center,
              var(--loader-ambient) 0%,
              transparent 72%
            ),
            radial-gradient(
              ellipse at 50% 42%,
              var(--loader-ambient-brass) 0%,
              transparent 58%
            );
          filter: blur(10px);
          opacity: 0.88;
        }

        [data-slot="loader-tile"] {
          width: var(--loader-card-width);
          height: calc(var(--loader-card-height) + var(--loader-depth));
          transform:
            translate3d(
              calc(-50% + var(--tile-x)),
              calc(-50% + var(--tile-y)),
              0
            )
            rotate(var(--tile-rotate))
            scale(var(--tile-scale));
          opacity: 0.92;
          transform-origin: center center;
          will-change: transform, filter;
          animation: loader-tile-float var(--loader-duration)
            cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }

        [data-slot="loader-tile-shell"] {
          position: relative;
          width: var(--loader-card-width);
          height: calc(var(--loader-card-height) + var(--loader-depth));
          filter: drop-shadow(var(--loader-shadow-rest));
        }

        [data-slot="loader-tile-face"],
        [data-slot="loader-tile-rim"],
        [data-slot="loader-tile-gloss"],
        [data-slot="loader-tile-reflection"],
        [data-slot="loader-tile-core"] {
          border-radius: var(--loader-card-radius);
        }

        [data-slot="loader-tile-face"] {
          height: var(--loader-card-height);
          border: 1px solid var(--loader-border);
          background:
            linear-gradient(
              180deg,
              var(--loader-face-top) 0%,
              var(--loader-face-mid) 54%,
              var(--loader-face-bottom) 100%
            );
          box-shadow:
            inset 0 1px 0 color-mix(in oklch, var(--loader-highlight) 86%, transparent),
            inset 0 -1px 0 color-mix(in oklch, var(--loader-edge-shadow) 44%, transparent),
            inset 0 -10px 16px color-mix(in oklch, var(--loader-shade) 55%, transparent),
            inset 0 10px 14px color-mix(in oklch, var(--loader-highlight) 58%, transparent);
          overflow: hidden;
        }

        [data-slot="loader-tile-face"]::before {
          content: "";
          position: absolute;
          left: 10%;
          right: 12%;
          top: 9%;
          height: var(--loader-gloss-height);
          border-radius: calc(var(--loader-card-radius) * 0.74);
          background:
            linear-gradient(
              180deg,
              color-mix(in oklch, var(--loader-highlight) 94%, transparent) 0%,
              color-mix(in oklch, var(--loader-highlight) 34%, transparent) 58%,
              transparent 100%
            );
          opacity: 0.92;
          transform: translateY(-3%);
        }

        [data-slot="loader-tile-face"]::after {
          content: "";
          position: absolute;
          inset: 16% 15%;
          border-radius: calc(var(--loader-card-radius) * 0.66);
          background:
            linear-gradient(
              180deg,
              color-mix(in oklch, var(--loader-inner-line) 68%, transparent) 0%,
              color-mix(in oklch, var(--loader-inner-line) 12%, transparent) 100%
            );
          mask:
            linear-gradient(180deg, #000 0 0) top / 68% 10% no-repeat,
            linear-gradient(180deg, #000 0 0) center / 54% 8% no-repeat,
            linear-gradient(180deg, #000 0 0) bottom 28% center / 60% 8% no-repeat;
          opacity: 0.62;
        }

        [data-slot="loader-tile-rim"] {
          height: var(--loader-card-height);
          box-shadow:
            inset 0 0 0 1px color-mix(in oklch, var(--loader-border) 74%, transparent),
            inset 0 0 0 2px color-mix(in oklch, var(--loader-brass-rim) 42%, transparent);
          opacity: 0.62;
        }

        [data-slot="loader-tile-gloss"] {
          height: var(--loader-card-height);
          background:
            radial-gradient(
              circle at 24% 18%,
              color-mix(in oklch, var(--loader-highlight) 88%, transparent) 0%,
              transparent 36%
            ),
            radial-gradient(
              circle at 78% 84%,
              color-mix(in oklch, var(--loader-shade) 44%, transparent) 0%,
              transparent 42%
            );
          mix-blend-mode: screen;
          opacity: 0.8;
        }

        [data-slot="loader-tile-edge"] {
          left: var(--loader-edge-inset);
          right: var(--loader-edge-inset);
          height: var(--loader-depth);
          border-bottom-left-radius: calc(var(--loader-card-radius) * 0.84);
          border-bottom-right-radius: calc(var(--loader-card-radius) * 0.84);
          background:
            linear-gradient(
              180deg,
              color-mix(in oklch, var(--loader-edge) 92%, var(--loader-face-bottom) 8%) 0%,
              color-mix(in oklch, var(--loader-edge-shadow) 56%, var(--loader-edge) 44%) 100%
            );
          box-shadow:
            inset 0 1px 0 color-mix(in oklch, var(--loader-highlight) 28%, transparent),
            0 6px 10px color-mix(in oklch, var(--loader-edge-shadow) 18%, transparent);
          transform: translateY(8%);
          opacity: 0.92;
        }

        [data-slot="loader-tile-reflection"] {
          height: var(--loader-card-height);
          background:
            linear-gradient(
              118deg,
              transparent 0%,
              color-mix(in oklch, var(--loader-highlight) 32%, transparent) 36%,
              transparent 58%
            );
          opacity: 0.46;
        }

        [data-slot="loader-tile-core"] {
          height: var(--loader-card-height);
          box-shadow:
            inset 0 0 0 1px color-mix(in oklch, var(--loader-inner-line) 18%, transparent),
            inset 0 -18px 18px color-mix(in oklch, var(--loader-shade) 20%, transparent),
            inset 0 12px 12px color-mix(in oklch, var(--loader-highlight) 18%, transparent);
          opacity: 0.66;
        }

        @keyframes loader-tile-float {
          0%,
          100% {
            transform:
              translate3d(
                calc(-50% + var(--tile-x)),
                calc(-50% + var(--tile-y)),
                0
              )
              rotate(var(--tile-rotate))
              scale(var(--tile-scale));
          }

          18%,
          34% {
            transform:
              translate3d(
                calc(-50% + var(--tile-x)),
                calc(-50% + var(--tile-y) + var(--loader-lift)),
                0
              )
              rotate(var(--tile-active-rotate))
              scale(calc(var(--tile-scale) + 0.035));
          }

          48% {
            transform:
              translate3d(
                calc(-50% + var(--tile-x)),
                calc(-50% + var(--tile-y) + calc(var(--loader-lift) * 0.42)),
                0
              )
              rotate(calc((var(--tile-rotate) + var(--tile-active-rotate)) / 2))
              scale(calc(var(--tile-scale) + 0.018));
          }

          70% {
            transform:
              translate3d(
                calc(-50% + var(--tile-x)),
                calc(-50% + var(--tile-y)),
                0
              )
              rotate(var(--tile-rotate))
              scale(calc(var(--tile-scale) + 0.008));
          }
        }

        [data-slot="loader-tile"] [data-slot="loader-tile-shell"] {
          transition:
            filter 240ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 240ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-slot="loader-tile"][data-static-depth="1"]
          [data-slot="loader-tile-face"],
        [data-slot="loader-tile"][data-static-depth="3"]
          [data-slot="loader-tile-face"] {
          background:
            linear-gradient(
              180deg,
              color-mix(in oklch, var(--loader-face-top) 88%, var(--color-bg) 12%) 0%,
              color-mix(in oklch, var(--loader-face-mid) 88%, var(--loader-face-top) 12%) 52%,
              color-mix(in oklch, var(--loader-face-bottom) 92%, var(--loader-face-mid) 8%) 100%
            );
        }

        [data-slot="loader-tile"][data-static-depth="0"]
          [data-slot="loader-tile-shell"],
        [data-slot="loader-tile"][data-static-depth="3"]
          [data-slot="loader-tile-shell"] {
          opacity: 0.92;
        }

        [data-slot="loader-tile"][data-static-depth="1"]
          [data-slot="loader-tile-shell"] {
          opacity: 0.86;
        }

        [data-slot="loader-tile"][data-static-depth="2"]
          [data-slot="loader-tile-shell"] {
          opacity: 1;
        }

        [data-slot="loader-tile"][data-static-depth="0"] {
          animation-name: loader-tile-float, loader-tile-light;
          animation-duration: var(--loader-duration), var(--loader-duration);
          animation-timing-function:
            cubic-bezier(0.22, 1, 0.36, 1),
            cubic-bezier(0.22, 1, 0.36, 1);
          animation-iteration-count: infinite, infinite;
        }

        [data-slot="loader-tile"][data-static-depth="1"],
        [data-slot="loader-tile"][data-static-depth="2"],
        [data-slot="loader-tile"][data-static-depth="3"] {
          animation-name: loader-tile-float;
        }

        @keyframes loader-tile-light {
          0%,
          100% {
            filter: none;
          }

          18%,
          34% {
            filter: drop-shadow(var(--loader-shadow-active));
          }

          48% {
            filter: drop-shadow(
              0 22px 30px color-mix(in oklch, var(--color-text) 10%, transparent)
            );
          }
        }

        [data-slot="loader-tile"][data-static-depth="1"]
          [data-slot="loader-tile-shell"],
        [data-slot="loader-tile"][data-static-depth="2"]
          [data-slot="loader-tile-shell"],
        [data-slot="loader-tile"][data-static-depth="3"]
          [data-slot="loader-tile-shell"] {
          animation: loader-shell-light var(--loader-duration)
            cubic-bezier(0.22, 1, 0.36, 1) infinite;
          animation-delay: inherit;
        }

        @keyframes loader-shell-light {
          0%,
          100% {
            filter: drop-shadow(var(--loader-shadow-rest));
          }

          18%,
          34% {
            filter: drop-shadow(var(--loader-shadow-active));
          }

          52% {
            filter: drop-shadow(
              0 22px 30px color-mix(in oklch, var(--color-text) 10%, transparent)
            );
          }
        }

        [data-slot="loader-tile"][data-static-depth="1"]
          [data-slot="loader-tile-rim"],
        [data-slot="loader-tile"][data-static-depth="2"]
          [data-slot="loader-tile-rim"] {
          opacity: 0.78;
        }

        [data-slot="loader-tile"][data-static-depth="2"]
          [data-slot="loader-tile-gloss"] {
          opacity: 0.92;
        }

        @media (prefers-reduced-motion: reduce) {
          [data-slot="loader-tile"],
          [data-slot="loader-tile-shell"] {
            animation: none !important;
          }

          [data-slot="loader-stage"] {
            transform: translateY(0);
          }

          [data-slot="loader-ground"] {
            opacity: 0.72;
          }

          [data-slot="loader-tile"][data-static-depth="0"] {
            transform:
              translate3d(
                calc(-50% + var(--tile-x)),
                calc(-50% + var(--tile-y)),
                0
              )
              rotate(var(--tile-rotate))
              scale(calc(var(--tile-scale) - 0.02));
          }

          [data-slot="loader-tile"][data-static-depth="1"] {
            transform:
              translate3d(
                calc(-50% + var(--tile-x)),
                calc(-50% + var(--tile-y) + calc(var(--loader-lift) * 0.16)),
                0
              )
              rotate(var(--tile-active-rotate))
              scale(calc(var(--tile-scale) + 0.01));
          }

          [data-slot="loader-tile"][data-static-depth="2"] {
            transform:
              translate3d(
                calc(-50% + var(--tile-x)),
                calc(-50% + var(--tile-y) + calc(var(--loader-lift) * 0.28)),
                0
              )
              rotate(var(--tile-active-rotate))
              scale(calc(var(--tile-scale) + 0.025));
          }

          [data-slot="loader-tile"][data-static-depth="3"] {
            transform:
              translate3d(
                calc(-50% + var(--tile-x)),
                calc(-50% + var(--tile-y) + calc(var(--loader-lift) * 0.1)),
                0
              )
              rotate(var(--tile-rotate))
              scale(var(--tile-scale));
          }

          [data-slot="loader-tile-shell"] {
            filter: drop-shadow(var(--loader-shadow-rest));
          }
        }
      `}</style>
    </div>
  );
}
