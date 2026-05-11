"use client";
import { useTheme } from "@/providers/ThemeProvider";
import { LoaderCircle } from "lucide-react";
export const LoadingScreen = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`${theme === "dark" ? "dark" : "light"} w-full h-full min-h-100 flex items-center justify-center`}
    >
      <LoaderCircle
        className={`animate-spin duration-300 ease-in-out ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}
      />
    </div>
  );
};
