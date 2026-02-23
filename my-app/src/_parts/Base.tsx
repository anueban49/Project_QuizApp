"use client";
import { ReactNode } from "react";
import { Header } from "./Header";
export const Base = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div
        className={`Base w-screen h-screen flex flex-col gap-2 items-center`}
      >
        <div
          className={`w-full h-full flex flex-col items-center max-w-400 gap-10`}
        >
          {children}
        </div>
      </div>
    </>
  );
};
