"use client";

import { useState } from "react";

const SLICE_COLORS = ["#2fbf71", "#0e7c45"];
const ODD_SLICE_COLOR = "#1a9d5a";
const SPIN_MS = 5000;
const SPIN_TURNS = 6;
const CENTER = 100;
const RIM_RADIUS = 99;
const LIGHT_RADIUS = 92.5;
const LIGHT_COUNT = 24;
const RADIUS = 86;
const LABEL_RADIUS = 56;
const LABEL_MAX_CHARS = 7;
const DEFAULT_NAMES = ["小明", "小華", "小美", "阿強", "小芳", "阿志"].join("\n");

function parseNames(text: string) {
  return text
    .split(/[\n,，]/)
    .map((name) => name.trim())
    .filter(Boolean);
}

// Angles are measured clockwise from 12 o'clock, where the pointer aims.
function pointOnWheel(degrees: number, radius: number) {
  const radians = (degrees * Math.PI) / 180;
  // Rounded so the server and browser agree despite differing trig precision.
  return {
    x: Math.round((CENTER + radius * Math.sin(radians)) * 1000) / 1000,
    y: Math.round((CENTER - radius * Math.cos(radians)) * 1000) / 1000,
  };
}

function slicePath(startDegrees: number, endDegrees: number) {
  const start = pointOnWheel(startDegrees, RADIUS);
  const end = pointOnWheel(endDegrees, RADIUS);
  const largeArc = endDegrees - startDegrees > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function sliceColor(index: number, total: number) {
  // With an odd count the last slice would match the first one it wraps to.
  if (total % 2 === 1 && index === total - 1) {
    return ODD_SLICE_COLOR;
  }
  return SLICE_COLORS[index % SLICE_COLORS.length];
}

function labelFontSize(total: number) {
  if (total <= 8) return 8;
  if (total <= 16) return 6.5;
  if (total <= 30) return 4.5;
  return 3.2;
}

function truncate(name: string) {
  const chars = Array.from(name);
  if (chars.length <= LABEL_MAX_CHARS) return name;
  return `${chars.slice(0, LABEL_MAX_CHARS - 1).join("")}…`;
}

export default function LotteryWheel() {
  const [text, setText] = useState(DEFAULT_NAMES);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [removeWinner, setRemoveWinner] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const names = parseNames(text);
  const sliceAngle = names.length > 0 ? 360 / names.length : 360;
  const canSpin = names.length >= 2 && !spinning;
  const winner = winnerIndex !== null ? names[winnerIndex] : undefined;

  function spin() {
    if (!canSpin) return;

    const index = Math.floor(Math.random() * names.length);
    // Land somewhere inside the slice rather than always dead centre.
    const landing = (index + 0.15 + Math.random() * 0.7) * sliceAngle;
    const delta = (((-landing - rotation) % 360) + 360) % 360;

    setWinnerIndex(index);
    setSpinning(true);
    setRotation(rotation + SPIN_TURNS * 360 + delta);
  }

  function handleSpinEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (!spinning || event.propertyName !== "transform") return;

    setSpinning(false);
    setShowResult(true);
    if (winner !== undefined) {
      setHistory([winner, ...history]);
    }
  }

  function closeResult() {
    if (removeWinner && winnerIndex !== null) {
      setText(names.filter((_, index) => index !== winnerIndex).join("\n"));
    }
    setShowResult(false);
    setWinnerIndex(null);
  }

  return (
    <div className="grid w-full gap-10 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col items-center">
        <div className="relative z-10 aspect-square w-full max-w-md">
          <svg
            viewBox="0 0 200 200"
            aria-hidden
            className="absolute inset-0 h-full w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
          >
            <defs>
              <radialGradient id="wheel-rim" cx="50%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#1f9d5c" />
                <stop offset="100%" stopColor="#064e2b" />
              </radialGradient>
            </defs>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RIM_RADIUS}
              fill="url(#wheel-rim)"
              stroke="#34d399"
              strokeWidth={1}
            />
            {Array.from({ length: LIGHT_COUNT }, (_, index) => {
              const light = pointOnWheel((index * 360) / LIGHT_COUNT, LIGHT_RADIUS);
              return (
                <circle
                  key={index}
                  cx={light.x}
                  cy={light.y}
                  r={2.2}
                  fill={index % 2 === 0 ? "#fde047" : "#ffffff"}
                  className={index % 2 === 0 ? "animate-pulse" : undefined}
                />
              );
            })}
          </svg>

          <div
            onTransitionEnd={handleSpinEnd}
            className="absolute inset-0"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.6, 0.1, 1)`
                : "none",
            }}
          >
            <svg
              viewBox="0 0 200 200"
              role="img"
              aria-label="抽獎轉盤"
              className="h-full w-full"
            >
              {names.length === 0 && (
                <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#0b5c35" />
              )}
              {names.length === 1 && (
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill={SLICE_COLORS[0]}
                />
              )}
              {names.length > 1 &&
                names.map((_, index) => (
                  <path
                    key={index}
                    d={slicePath(index * sliceAngle, (index + 1) * sliceAngle)}
                    fill={sliceColor(index, names.length)}
                    stroke="#bbf7d0"
                    strokeWidth={0.5}
                  />
                ))}
              {names.map((name, index) => (
                <text
                  key={index}
                  x={CENTER + LABEL_RADIUS}
                  y={CENTER}
                  transform={`rotate(${(index + 0.5) * sliceAngle - 90} ${CENTER} ${CENTER})`}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={labelFontSize(names.length)}
                  fontWeight={700}
                  fill="#ffffff"
                >
                  {truncate(name)}
                </text>
              ))}
            </svg>
          </div>

          <button
            type="button"
            onClick={spin}
            disabled={!canSpin}
            className="absolute left-1/2 top-1/2 flex h-[27%] w-[27%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-yellow-200 bg-gradient-to-b from-yellow-300 to-amber-500 text-base font-extrabold leading-tight text-emerald-950 shadow-[0_4px_12px_rgba(0,0,0,0.45)] transition-transform enabled:hover:scale-105 enabled:active:scale-95 disabled:cursor-not-allowed sm:text-xl"
          >
            <span
              aria-hidden
              className="absolute bottom-[calc(100%-2px)] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[10px] border-b-[22px] border-x-transparent border-b-yellow-300 sm:border-x-[13px] sm:border-b-[28px]"
            />
            {spinning ? (
              "抽獎中"
            ) : (
              <span>
                開始
                <br />
                抽獎
              </span>
            )}
          </button>
        </div>

        <div
          aria-hidden
          className="-mt-8 h-20 w-3/5 max-w-[17rem] bg-gradient-to-b from-emerald-600 to-emerald-900 [clip-path:polygon(22%_0,78%_0,100%_100%,0_100%)]"
        />
        <div
          aria-hidden
          className="h-3 w-4/5 max-w-[22rem] rounded-full bg-emerald-700 shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
        />

        {names.length < 2 && (
          <p className="mt-6 text-sm text-emerald-200/70">
            請至少輸入兩個名字才能抽獎
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6 self-start rounded-2xl border border-emerald-400/20 bg-emerald-950/60 p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="names" className="flex items-baseline justify-between">
            <span className="font-semibold text-yellow-300">抽獎名單</span>
            <span className="text-sm text-emerald-200/70">
              共 {names.length} 人
            </span>
          </label>
          <textarea
            id="names"
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={spinning || showResult}
            rows={10}
            placeholder={"一行一個名字\n也可以用逗號分隔"}
            className="w-full resize-y rounded-lg border border-emerald-400/30 bg-black/30 px-3 py-2 leading-7 text-emerald-50 outline-none placeholder:text-emerald-200/40 focus:border-yellow-300 disabled:opacity-60"
          />
          <p className="text-sm text-emerald-200/70">
            一行一個名字，或用逗號分隔。
          </p>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={removeWinner}
            onChange={(event) => setRemoveWinner(event.target.checked)}
            className="h-4 w-4 accent-yellow-400"
          />
          <span>抽中後從名單移除</span>
        </label>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold text-yellow-300">中獎紀錄</span>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-sm text-emerald-200/70 underline-offset-4 hover:underline"
              >
                清除
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-emerald-200/70">還沒有人中獎</p>
          ) : (
            <ol className="flex flex-col gap-1">
              {history.map((name, index) => (
                <li key={index} className="flex gap-2">
                  <span className="w-6 text-right text-emerald-200/70">
                    {history.length - index}.
                  </span>
                  <span>{name}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {showResult && winner !== undefined && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="winner-title"
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 p-6"
        >
          <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border-2 border-yellow-300 bg-gradient-to-b from-emerald-800 to-emerald-950 p-8 text-center shadow-2xl">
            <p id="winner-title" className="text-emerald-100">
              🎉 恭喜中獎
            </p>
            <p className="break-all text-4xl font-extrabold text-yellow-300">
              {winner}
            </p>
            <button
              type="button"
              onClick={closeResult}
              autoFocus
              className="h-12 w-full rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 font-bold text-emerald-950 transition-transform hover:scale-[1.02] active:scale-95"
            >
              確定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
