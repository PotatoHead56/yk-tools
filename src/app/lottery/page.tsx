import type { Metadata } from "next";
import Link from "next/link";
import LotteryWheel from "./lottery-wheel";

export const metadata: Metadata = {
  title: "幸運大轉盤 | YK 的小工具箱",
  description: "輸入名單，轉動轉盤抽出中獎者",
};

export default function LotteryPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[radial-gradient(ellipse_at_top,#12643c_0%,#06351f_55%,#021a0f_100%)] font-sans text-emerald-50">
      <main className="flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
        <Link
          href="/"
          className="text-sm text-emerald-200/70 underline-offset-4 hover:underline"
        >
          ← 回工具列表
        </Link>
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="bg-gradient-to-b from-yellow-100 via-yellow-300 to-amber-500 bg-clip-text text-5xl font-black tracking-widest text-transparent drop-shadow-[0_3px_0_rgba(0,0,0,0.35)] sm:text-6xl">
            幸運大轉盤
          </h1>
          <p className="rounded-full bg-black/25 px-4 py-1 text-sm tracking-widest text-yellow-200">
            輸入名單 · 轉出幸運兒
          </p>
        </div>
        <LotteryWheel />
      </main>
    </div>
  );
}
