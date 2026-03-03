"use client";
import { ArticlesArchivePage } from "./ArticlesArchive";
import ArticleSummary from "./ArticleSummary";
import { Quiz } from "./Quiz";
import { useQuizgeek } from "@/providers/QuizgeekProvider";

//the content switch page has to take the following arguemtns:
//user id.

export const ContentSwitchPage = ({ id }: { id: string }) => {
  const { active } = useQuizgeek();

  return (
    <>
      {active === "ArticleSummary" && <ArticleSummary />}
      {active === "ArticlesArchive" && <ArticlesArchivePage/>}
      {active === "QuizSection" && <Quiz />}
    </>
  );
};
