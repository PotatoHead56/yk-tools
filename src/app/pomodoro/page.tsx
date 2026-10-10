import type { Metadata } from "next";
import PomodoroTimer from "./pomodoro-timer";

export const metadata: Metadata = {
  title: "番茄鐘 | YK 的小工具箱",
  description: "專注 25 分鐘、休息 5 分鐘的番茄工作法計時器",
};

export default function PomodoroPage() {
  return <PomodoroTimer />;
}
