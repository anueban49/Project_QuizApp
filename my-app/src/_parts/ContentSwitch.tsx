"use client";
import { ArticlesArchivePage } from "./ArticlesArchive";
import ArticleSummary from "./ArticleSummary";
import { Quiz } from "./Quiz";
import { useState, useEffect } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useUser } from "@clerk/nextjs";
import { Header } from "./Header";
import { useQuizgeek } from "@/providers/QuizgeekProvider";

//the content switch page has to take the following arguemtns:
//user id.

export const ContentSwitchPage = ({ id }: { id: string }) => {
  const { active } = useQuizgeek();
  const { user } = useUser();

  return (
    <>
      {active === "ArticleSummary" && <ArticleSummary />}
      {active === "ArticlesArchive" && <ArticlesArchivePage/>}
      {active === "QuizSection" && <Quiz />}
    </>
  );
};
