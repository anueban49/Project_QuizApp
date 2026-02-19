"use client";
import { ReactNode } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { ContentSideBar } from "./ContentSideBar";

const Header = () => {
  return (
    <>
      <div className="w-full h-10 bg-gray-200">
        <ContentSideBar />
      </div>
    </>
  );
};

export const Base = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <div
        className={`w-screen h-screen flex flex-col gap-2 p-10 justify-center`}
      >
        <div className={``}></div>
      </div>
    </>
  );
};
