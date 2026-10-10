import type { Metadata } from "next";
import Link from "next/link";
import FortuneDraw from "./fortune-draw";

export const metadata: Metadata = {
  title: "好運抽籤 | YK 的小工具箱",
  description: "隨機抽一支籤，看看今天的運勢",
};

export default function FortunePage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[radial-gradient(ellipse_at_top,#8f2a22_0%,#5c130f_55%,#2e0806_100%)] font-sans text-amber-50">
      <main className="flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
        <Link
          href="/"
          className="text-sm text-amber-100/70 underline-offset-4 hover:underline"
        >
          ← 回工具列表
        </Link>
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="bg-gradient-to-b from-yellow-100 via-yellow-300 to-amber-500 bg-clip-text text-5xl font-black tracking-widest text-transparent drop-shadow-[0_3px_0_rgba(0,0,0,0.35)] sm:text-6xl">
            好運抽籤
          </h1>
          <p className="rounded-full bg-black/25 px-4 py-1 text-sm tracking-widest text-yellow-200">
            抽一支籤 · 看今日運勢
          </p>
        </div>
        <FortuneDraw />
      </main>
    </div>
  );
}
