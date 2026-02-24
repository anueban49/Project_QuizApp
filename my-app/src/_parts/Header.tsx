"use client";
import { ReactNode } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Eclipse } from "lucide-react";
import { Logo } from "./Logo";
import { ContentSideBar } from "./ContentSideBar";
import { useClerk, UserButton } from "@clerk/nextjs";
export const Header = () => {
  const { toggleTheme, theme } = useTheme();
  return (
    <>
      <div
        className={`w-full h-20 flex justify-between items-center px-10 py-5 shadow-sm ${theme === "dark" ? "shadow-black" : "shadow-gray-400"}`}
      >
        <Logo />
        <div className="flex gap-2">
          <div className="flex gap-5">
            <Button
              size={"icon"}
              className={`rounded-full shadow-md ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100 color-black"}`}
              onClick={() => {
                toggleTheme();
              }}
            >
              <Eclipse className={`${theme === "dark" ? "" : "text-black"}`} />
            </Button>
          </div>
          <ContentSideBar />
          <UserButton />
        </div>
      </div>
    </>
  );
};
