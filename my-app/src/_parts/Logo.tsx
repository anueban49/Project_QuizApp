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
          className={`${theme === "dark" ? "bg-white" : "light"} aspect-square object-fit p-2 rounded-full flex justify-baseline`}
        >
          <img src="/owl.svg" className="w-10 h-10 aspect-square" />
        </div>
        QuizGeek
      </div>
    </>
  );
};
