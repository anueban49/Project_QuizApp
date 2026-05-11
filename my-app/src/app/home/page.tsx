"use client";
import { Header } from "@/_parts/Header";
import { useState } from "react";
import { ContentSwitchPage } from "@/_parts/ContentSwitch";
interface Conversation {
  timeStamp: Date;
  messages: Messages[];
}
type Messages = {
  role: "user" | "agent";
  content: string;
};
type userInterface = "ArticlesArchive" | "QuizSection";
export default function Page() {
    useState<userInterface>("ArticlesArchive");
  return (
    <>
      <div className="w-full h-full flex flex-col items-center transition-colors px-10 p-2">
        <Header />
        <div className="w-full h-7/8">
          <ContentSwitchPage />
        </div>
      </div>
    </>
  );
}
