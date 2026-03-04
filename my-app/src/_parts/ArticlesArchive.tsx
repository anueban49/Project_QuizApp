"use client";
import { useEffect, useState } from "react";
import { useQuizgeek } from "@/providers/QuizgeekProvider";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
export const ArticlesArchivePage = () => {
  const { article, active, setActive, getArticleData } = useQuizgeek();
  //is it neceassary to get the userId from the context. -> because most functions are already operating using the userId within the context.

  return (
    <>
      <div className={`flex flex-col gap-4 max-w-7xl p-10`}>
        <h3>{article?.title}</h3>
        <p>{article?.createdAt as any}</p>
        <div className={``}>
          <h4>Summarized Content</h4>
          <p> {article?.sumArticle}</p>
        </div>
        <h4>Original</h4>
        {article?.orgArticle}
      </div>
      <Button
        onClick={() => {
          setActive("QuizSection");
          getArticleData(article?.id as string)
        }}
      >
        Quiz
      </Button>
    </>
  );
};
