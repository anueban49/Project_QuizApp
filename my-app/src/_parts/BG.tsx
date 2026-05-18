"use client";
import { useTheme } from "@/providers/ThemeProvider";
export const BG = () => {
  const { theme } = useTheme();
  return (

    <div className={theme === "dark" ? "BGdark" : "BG"}></div>

  );
};
