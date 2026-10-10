"use client";

import { useState } from "react";
import {
  ASPECTS,
  AVOID,
  DIRECTIONS,
  GOOD_FOR,
  LEVELS,
  LUCKY_COLORS,
  type Tier,
} from "./fortunes";

type Fortune = {
  number: number;
  date: string;
  level: string;
  tier: Tier;
  summary: string;
  aspects: { name: string; text: string }[];
  luckyColor: string;
  luckyNumber: number;
  direction: string;
  goodFor: string[];
  avoid: string[];
};

const STICK_OFFSETS = [-22, -11, 0, 11, 22];
const SLIP_COUNT = 100;

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function pickTwo<T>(items: T[]) {
  const first = Math.floor(Math.random() * items.length);
  const second =
    (first + 1 + Math.floor(Math.random() * (items.length - 1))) % items.length;
  return [items[first], items[second]];
}

function pickLevel() {
  const totalWeight = LEVELS.reduce((sum, level) => sum + level.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const level of LEVELS) {
    roll -= level.weight;
    if (roll < 0) return level;
  }
  return LEVELS[LEVELS.length - 1];
}

function drawFortune(): Fortune {
  const level = pickLevel();
  return {
    number: 1 + Math.floor(Math.random() * SLIP_COUNT),
    date: new Date().toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }),
    level: level.name,
    tier: level.tier,
    summary: pick(level.summaries),
    aspects: ASPECTS.map((aspect) => ({
      name: aspect.name,
      text: pick(aspect.texts[level.tier]),
    })),
    luckyColor: pick(LUCKY_COLORS),
    luckyNumber: 1 + Math.floor(Math.random() * 99),
    direction: pick(DIRECTIONS),
    goodFor: pickTwo(GOOD_FOR),
    avoid: pickTwo(AVOID),
  };
}

export default function FortuneDraw() {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [shaking, setShaking] = useState(false);

  function draw() {
    if (shaking) return;
    setFortune(drawFortune());
    setShaking(true);
  }

  const revealed = fortune !== null && !shaking;

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div
        onAnimationEnd={() => setShaking(false)}
        className={`w-32 origin-bottom ${shaking ? "animate-omikuji-shake" : ""}`}
      >
        <svg
          viewBox="0 0 120 200"
          aria-hidden
          className="w-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
        >
          {STICK_OFFSETS.map((offset, index) => (
            <g key={index} transform={`rotate(${offset / 2} 60 120)`}>
              <rect
                x={57 + offset}
                y={14 + Math.abs(offset) / 2}
                width={6}
                height={70}
                rx={2}
                fill="#f3e3bf"
              />
              <rect
                x={57 + offset}
                y={14 + Math.abs(offset) / 2}
                width={6}
                height={12}
                rx={2}
                fill="#c8102e"
              />
            </g>
          ))}
          <rect x={20} y={56} width={80} height={136} rx={10} fill="#a3271f" />
          <rect x={20} y={56} width={80} height={12} rx={6} fill="#e3b341" />
          <rect x={20} y={180} width={80} height={12} rx={6} fill="#e3b341" />
          <rect x={40} y={80} width={40} height={88} rx={4} fill="#fbf3dc" />
          {["御", "神", "籤"].map((char, index) => (
            <text
              key={char}
              x={60}
              y={102 + index * 25}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={20}
              fontWeight={700}
              fill="#7a1a14"
            >
              {char}
            </text>
          ))}
        </svg>
      </div>

      <button
        type="button"
        onClick={draw}
        disabled={shaking}
        className="h-14 rounded-full bg-gradient-to-b from-yellow-200 to-amber-400 px-12 text-lg font-bold text-[#5c130f] shadow-lg transition-transform enabled:hover:scale-105 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {shaking ? "搖籤中…" : fortune ? "再抽一次" : "抽一支籤"}
      </button>

      {!fortune && (
        <p className="text-sm text-amber-100/70">
          靜下心來，想著今天的自己，然後抽一支籤。
        </p>
      )}

      {revealed && (
        <article
          aria-live="polite"
          className="flex w-full max-w-md animate-slip-in flex-col gap-6 rounded-lg border-4 border-double border-[#a3271f] bg-[#fbf3dc] p-8 text-[#3b1d12] shadow-2xl"
        >
          <header className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm tracking-widest text-[#8a5a44]">
              第 {fortune.number} 籤 · {fortune.date}
            </p>
            <p
              className={`text-7xl font-black tracking-widest ${
                fortune.tier === "bad" ? "text-zinc-800" : "text-[#c8102e]"
              }`}
            >
              {fortune.level}
            </p>
            <p className="text-lg leading-8">{fortune.summary}</p>
          </header>

          <dl className="flex flex-col gap-3 border-y border-[#a3271f]/30 py-5">
            {fortune.aspects.map((aspect) => (
              <div key={aspect.name} className="flex gap-3">
                <dt className="shrink-0 font-bold text-[#a3271f]">
                  {aspect.name}
                </dt>
                <dd>{aspect.text}</dd>
              </div>
            ))}
          </dl>

          <dl className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-[#8a5a44]">幸運色</dt>
              <dd className="font-bold">{fortune.luckyColor}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-[#8a5a44]">幸運數字</dt>
              <dd className="font-bold">{fortune.luckyNumber}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-[#8a5a44]">幸運方位</dt>
              <dd className="font-bold">{fortune.direction}</dd>
            </div>
          </dl>

          <dl className="flex flex-col gap-2">
            <div className="flex gap-3">
              <dt className="shrink-0 font-bold text-[#c8102e]">宜</dt>
              <dd>{fortune.goodFor.join("、")}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="shrink-0 font-bold text-zinc-800">忌</dt>
              <dd>{fortune.avoid.join("、")}</dd>
            </div>
          </dl>
        </article>
      )}
    </div>
  );
}
