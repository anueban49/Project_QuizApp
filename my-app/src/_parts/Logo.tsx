"use client";
import { useTheme } from "@/providers/ThemeProvider";
export const Logo = () => {
  const { theme } = useTheme();
  return (
    <>
      <div
        className={`flex gap-2 justify-center items-center text-4xl font-bold ${theme === "dark" ? "dark" : "light"}`}
      >
        <div
          className={`${theme === "dark" ? "bg-slate-400" : "bg-slate-50 "} aspect-square object-fit p-3 rounded-full flex justify-baseline`}
        >
          <img src="/owl.svg" className="w-8 h-8 aspect-square" />
        </div>
        <p className={` ${theme === "dark" ? "text-slate-300" : "text-slate-700"} xs:text-sm`}>Quiz App</p>
      </div>
    </>
  );
};
