"use client";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Book, BoxesIcon, Eclipse, SparkleIcon } from "lucide-react";
import { Logo } from "./Logo";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { OperationType, useQuizgeek } from "@/providers/QuizgeekProvider";
export const Header = () => {
  const { toggleTheme, theme } = useTheme();
  const { setActive, active } = useQuizgeek();

  const Btns = [
    {
      name: "ArticleSummary" as OperationType,
      icon: (
        <SparkleIcon className={`${theme === "dark" ? "" : "text-black"}`} />
      ),
      onClick: () => {
        setActive("ArticleSummary");
      },
    },
    {
      name: "ArticlesArchive" as OperationType,
      icon: <Book className={`${theme === "dark" ? "" : "text-black"}`} />,
      onClick: () => {
        setActive("ArticlesArchive");
      },
    },
    {
      name: "QuizSection" as OperationType,
      icon: <BoxesIcon className={`${theme === "dark" ? "" : "text-black"}`} />,
      onClick: () => {
        setActive("QuizSection");
      },
    },
    {
      name: null,
      icon: (
        <Eclipse
          className={`${theme === "dark" ? "color-black" : "text-black"}`}
        />
      ),
      onClick: () => {
        toggleTheme();
      },
    },
    {
      name: null,
      icon: <UserButton />,
      onClick: () => {
        console.log("user");
      },
    },
  ];
  return (
    <>
      <div
        className={`w-full h-20 flex self-start justify-between rounded-2xl items-center px-10 py-5 shadow-sm ${theme === "dark" ? "shadow-black" : "shadow-gray-400"}`}
      >
        <Logo />
        <div className="flex gap-2">
          <div className="flex gap-2">
            {Btns.map((btn, index) => (
              <Button
                key={index}
                size={"icon"}
                className={`rounded-full shadow-md  ${theme === "dark" ? "bg-slate-800" : "bg-slate-100 color-black"} ${active === btn.name && "hidden"}`}
                onClick={btn.onClick}
              >
                {btn.icon}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
