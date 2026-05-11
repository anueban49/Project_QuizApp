"use client";
import { ArticlesWorks } from "./ArticleWorks";
import ArticleSummary from "./ArticleSummary";
import { useQuizgeek } from "@/providers/QuizgeekProvider";
import { QuizSection } from "./QuizSection";

//the content switch page has to take the following arguemtns:
//user id.

export const ContentSwitchPage = () => {
  const { active } = useQuizgeek();

  return (
    <>
      {active === "ArticlesArchive" && <ArticlesWorks />}
      {active === "ArticleSummary" && <ArticleSummary />}
      {active === "QuizSection" && <QuizSection />}
    </>
  );
};
