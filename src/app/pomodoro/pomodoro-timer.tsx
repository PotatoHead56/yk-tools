"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";

type Mode = "focus" | "short" | "long";

const MODES: { key: Mode; label: string; hint: string; background: string }[] = [
  { key: "focus", label: "專注", hint: "專心做一件事", background: "bg-[#b23a2e]" },
  { key: "short", label: "短休息", hint: "起來動一動", background: "bg-[#2f7d6d]" },
  { key: "long", label: "長休息", hint: "好好放鬆一下", background: "bg-[#2f5f8a]" },
];
const DEFAULT_MINUTES: Record<Mode, number> = { focus: 25, short: 5, long: 15 };
const FOCUS_PER_CYCLE = 4;
const MAX_MINUTES = 180;
const TICK_MS = 250;
const RING_RADIUS = 90;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const CHIME_NOTES = [660, 880, 1100];

function formatTime(milliseconds: number) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function playChime() {
  const context = new AudioContext();
  CHIME_NOTES.forEach((frequency, index) => {
    const startAt = context.currentTime + index * 0.25;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.3, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.22);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.25);
  });
  setTimeout(() => context.close(), 1500);
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("focus");
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [remaining, setRemaining] = useState(DEFAULT_MINUTES.focus * 60_000);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [task, setTask] = useState("");
  const [autoStart, setAutoStart] = useState(false);
  const [sound, setSound] = useState(true);
  // Counting down to a fixed end time keeps the clock right in throttled tabs.
  const endAtRef = useRef(0);

  const current = MODES.find((item) => item.key === mode) ?? MODES[0];
  const total = minutes[mode] * 60_000;
  const progress = Math.min(1, Math.max(0, remaining / total));
  const time = formatTime(remaining);
  const cycleCount = mode === "long" ? FOCUS_PER_CYCLE : completed % FOCUS_PER_CYCLE;

  function enterMode(next: Mode, keepRunning: boolean) {
    const duration = minutes[next] * 60_000;
    endAtRef.current = Date.now() + duration;
    setMode(next);
    setRemaining(duration);
    setRunning(keepRunning);
  }

  function advance(countFocus: boolean) {
    if (mode !== "focus") {
      enterMode("focus", autoStart);
      return;
    }
    const nextCompleted = countFocus ? completed + 1 : completed;
    setCompleted(nextCompleted);
    const cycleDone = countFocus && nextCompleted % FOCUS_PER_CYCLE === 0;
    enterMode(cycleDone ? "long" : "short", autoStart);
  }

  const onTick = useEffectEvent(() => {
    const left = endAtRef.current - Date.now();
    if (left > 0) {
      setRemaining(left);
      return;
    }
    if (sound) playChime();
    advance(true);
  });

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => onTick(), TICK_MS);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    const original = document.title;
    document.title = `${time} · ${current.label} | YK 的小工具箱`;
    return () => {
      document.title = original;
    };
  }, [time, current.label]);

  function toggle() {
    if (running) {
      setRemaining(Math.max(0, endAtRef.current - Date.now()));
      setRunning(false);
      return;
    }
    endAtRef.current = Date.now() + remaining;
    setRunning(true);
  }

  function changeMinutes(key: Mode, value: string) {
    const parsed = Math.floor(Number(value));
    const next = Number.isFinite(parsed)
      ? Math.min(MAX_MINUTES, Math.max(1, parsed))
      : 1;
    setMinutes({ ...minutes, [key]: next });
    if (key === mode && !running) {
      setRemaining(next * 60_000);
    }
  }

  return (
    <div
      className={`flex flex-1 flex-col items-center font-sans text-white transition-colors duration-700 ${current.background}`}
    >
      <main className="flex w-full max-w-xl flex-1 flex-col gap-8 px-6 py-10">
        <Link
          href="/"
          className="self-start text-sm text-white/70 underline-offset-4 hover:underline"
        >
          ← 回工具列表
        </Link>

        <h1 className="text-center text-3xl font-semibold tracking-tight">
          番茄鐘
        </h1>

        <div className="flex justify-center gap-2 rounded-full bg-black/15 p-1">
          {MODES.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => enterMode(item.key, false)}
              aria-pressed={item.key === mode}
              className={`h-10 flex-1 rounded-full text-sm font-semibold transition-colors ${
                item.key === mode
                  ? "bg-white text-zinc-900"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-xs">
          <svg viewBox="0 0 200 200" aria-hidden className="h-full w-full -rotate-90">
            <circle
              cx={100}
              cy={100}
              r={RING_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={8}
            />
            <circle
              cx={100}
              cy={100}
              r={RING_RADIUS}
              fill="none"
              stroke="#ffffff"
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - progress)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span
              role="timer"
              className="font-mono text-6xl font-bold tabular-nums sm:text-7xl"
            >
              {time}
            </span>
            <span className="text-sm text-white/80">{current.hint}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div
            className="flex gap-2"
            aria-label={`本輪已完成 ${cycleCount} / ${FOCUS_PER_CYCLE} 個番茄`}
          >
            {Array.from({ length: FOCUS_PER_CYCLE }, (_, index) => (
              <span
                key={index}
                className={`h-3 w-3 rounded-full ${
                  index < cycleCount ? "bg-white" : "bg-white/25"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-white/80">已完成 {completed} 個番茄</p>
        </div>

        <input
          type="text"
          value={task}
          onChange={(event) => setTask(event.target.value)}
          placeholder="這個番茄要專注做什麼？"
          aria-label="專注的事項"
          className="h-12 w-full rounded-xl bg-black/15 px-4 text-center outline-none placeholder:text-white/50 focus:bg-black/25"
        />

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => enterMode(mode, false)}
            className="h-12 rounded-full bg-black/15 px-5 text-sm font-semibold transition-colors hover:bg-black/25"
          >
            重設
          </button>
          <button
            type="button"
            onClick={toggle}
            className="h-14 w-40 rounded-full bg-white text-lg font-bold text-zinc-900 shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            {running ? "暫停" : "開始"}
          </button>
          <button
            type="button"
            onClick={() => advance(false)}
            className="h-12 rounded-full bg-black/15 px-5 text-sm font-semibold transition-colors hover:bg-black/25"
          >
            跳過
          </button>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-black/15 p-6">
          <span className="font-semibold">設定</span>
          <div className="grid grid-cols-3 gap-3">
            {MODES.map((item) => (
              <label key={item.key} className="flex flex-col gap-1 text-sm">
                <span className="text-white/80">{item.label}（分）</span>
                <input
                  type="number"
                  min={1}
                  max={MAX_MINUTES}
                  value={minutes[item.key]}
                  onChange={(event) => changeMinutes(item.key, event.target.value)}
                  className="h-10 w-full rounded-lg bg-black/20 px-3 outline-none focus:bg-black/30"
                />
              </label>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(event) => setAutoStart(event.target.checked)}
              className="h-4 w-4 accent-white"
            />
            <span>時間到後自動開始下一階段</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sound}
              onChange={(event) => setSound(event.target.checked)}
              className="h-4 w-4 accent-white"
            />
            <span>時間到時播放提示音</span>
          </label>
        </div>
      </main>
    </div>
  );
}
