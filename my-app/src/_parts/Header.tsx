"use client";
import { ReactNode } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Eclipse } from "lucide-react";
import { Logo } from "./Logo";
export const Header = ({ children }: { children: ReactNode }) => {
  const { toggleTheme } = useTheme();
  return (
    <>
      <div
        className={`w-full h-20 flex justify-between items-center px-10 py-5`}
      >
        <Logo />
        <div className="flex gap-5">
          {children}
          <Button
            size={"icon"}
            className={`rounded-full`}
            onClick={() => {
              toggleTheme();
            }}
          >
            <Eclipse />
          </Button>
        </div>
      </div>
    </>
  );
};
