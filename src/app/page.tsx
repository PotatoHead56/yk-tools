import Link from "next/link";

const tools = [
  {
    href: "/lottery",
    name: "抽獎轉盤",
    tagline: "誰是今天的幸運兒？",
    description: "貼上名單，轉動轉盤，讓指針決定中獎的人。",
    features: ["名單即時更新到轉盤", "抽中後可自動移出名單", "保留中獎紀錄"],
    card: "from-[#12643c] to-[#042414] ring-emerald-400/30 hover:ring-emerald-300/70",
    accent: "text-yellow-300",
    art: (
      <div className="relative h-24 w-24 rounded-full border-4 border-emerald-300/70 bg-[repeating-conic-gradient(#2fbf71_0_60deg,#0e7c45_60deg_120deg)] shadow-lg transition-transform duration-700 group-hover:rotate-[150deg]">
        <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-100 bg-amber-400" />
      </div>
    ),
  },
  {
    href: "/pomodoro",
    name: "番茄鐘",
    tagline: "一次只做一件事。",
    description: "專注 25 分鐘、休息 5 分鐘，用節奏把事情做完。",
    features: ["專注、短休息、長休息", "時間長度可自訂", "分頁標題顯示剩餘時間"],
    card: "from-[#c2463a] to-[#5e1710] ring-rose-300/30 hover:ring-rose-200/70",
    accent: "text-rose-100",
    art: (
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" aria-hidden className="h-full w-full -rotate-90">
          <circle
            cx={50}
            cy={50}
            r={42}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={8}
          />
          <circle
            cx={50}
            cy={50}
            r={42}
            fill="none"
            stroke="#ffffff"
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={264}
            strokeDashoffset={80}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold">
          25:00
        </span>
      </div>
    ),
  },
  {
    href: "/fortune",
    name: "好運抽籤",
    tagline: "今天的運勢如何？",
    description: "搖一搖籤筒，從大吉到大凶，隨機抽出今天的籤。",
    features: ["七種籤，每次隨機", "工作、財運、感情、健康", "幸運色、數字與宜忌"],
    card: "from-[#8f2a22] to-[#2e0806] ring-amber-300/30 hover:ring-amber-200/70",
    accent: "text-yellow-300",
    art: (
      <div className="flex h-24 w-16 -rotate-6 flex-col items-center justify-center rounded-md border-2 border-[#a3271f] bg-[#fbf3dc] text-2xl font-black leading-8 text-[#c8102e] shadow-lg transition-transform duration-300 group-hover:rotate-3">
        <span>大</span>
        <span>吉</span>
      </div>
    ),
  },
];

const highlights = ["免安裝", "免登入", "打開就能用"];

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#0b1020] font-sans text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-indigo-600/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-40 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/20 blur-3xl"
      />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b1020]/70 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-lg">
              🧰
            </span>
            <span className="hidden sm:inline">YK 的小工具箱</span>
          </Link>
          <nav aria-label="工具" className="flex items-center gap-1 text-sm">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-full px-3 py-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                {tool.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 pb-20 pt-24 text-center sm:pt-32">
          <p className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm tracking-widest text-indigo-200">
            YK&apos;S TOOLBOX
          </p>
          <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
              YK 的小工具箱
            </span>
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-300">
            抽獎、專注、看運勢。
            <br />
            三個簡單好用的小工具，需要的時候打開就能用。
          </p>
          <ul className="flex flex-wrap justify-center gap-2 text-sm text-slate-300">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10"
              >
                ✓ {item}
              </li>
            ))}
          </ul>
          <a
            href="#tools"
            className="flex h-14 items-center rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-10 text-lg font-bold shadow-lg shadow-indigo-900/50 transition-transform hover:scale-105 active:scale-95"
          >
            看看有哪些工具 ↓
          </a>
        </section>

        <section
          id="tools"
          aria-labelledby="tools-title"
          className="mx-auto flex w-full max-w-6xl scroll-mt-24 flex-col gap-10 px-6 pb-28"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 id="tools-title" className="text-3xl font-bold sm:text-4xl">
              工具箱裡有什麼
            </h2>
            <p className="text-slate-400">挑一個，馬上開始。</p>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {tools.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className={`group flex h-full flex-col gap-6 rounded-3xl bg-gradient-to-br p-8 shadow-xl ring-1 transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${tool.card}`}
                >
                  <div className="flex h-28 items-center justify-center">
                    {tool.art}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className={`text-sm font-semibold ${tool.accent}`}>
                      {tool.tagline}
                    </p>
                    <h3 className="text-2xl font-bold">{tool.name}</h3>
                    <p className="leading-7 text-white/80">{tool.description}</p>
                  </div>
                  <ul className="flex flex-col gap-2 text-sm text-white/80">
                    {tool.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span className={tool.accent}>●</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto flex items-center gap-2 font-bold">
                    開始使用
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-bold">🧰 YK 的小工具箱</p>
            <p className="text-sm text-slate-400">
              一些讓日常更順手的小工具。
            </p>
          </div>
          <nav aria-label="頁尾" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="text-slate-300 underline-offset-4 hover:text-white hover:underline"
              >
                {tool.name}
              </Link>
            ))}
          </nav>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
          © YK 的小工具箱
        </p>
      </footer>
    </div>
  );
}
