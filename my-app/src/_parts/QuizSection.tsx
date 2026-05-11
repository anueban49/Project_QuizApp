"use client";

import { useEffect, useState } from "react";
import { NoteBook } from "./Notebook";
import { Article, useQuizgeek } from "@/providers/QuizgeekProvider";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import ArticleSummary from "./ArticleSummary";
export const QuizSection = () => {
  const { getArticlesHistory, getArticleData, article, history } =
    useQuizgeek();
  const { theme } = useTheme();
  const [view, setView] = useState<Article | null>(null);
  useEffect(() => {
    getArticlesHistory();
    setView(history[0]);
  }, []);
  const [fromOldArticle, setFromOldArticle] = useState(true);
  return (
    <div className="p-10 rounded flex flex-col items-center">
      <div
        className={`w-full flex rounded ${theme === "dark" ? "dark" : "light"}`}
      >
        <Button
          className={`w-1/2 m-1 rounded-2xl ${theme === "dark" ? "bg-slate-700 text-slate-50" : "bg-slate-100 text-slate-700"} inset-shadow-sm ${fromOldArticle ? "inset-shadow-slate-500/50" : "shadow-sm shadow-slate-500/50"} `}
          onClick={() => {
            setFromOldArticle(true);
          }}
        >
          From history
        </Button>
        <Button
          className={`w-1/2 m-1 rounded-2xl ${theme === "dark" ? "bg-slate-700 text-slate-50" : "bg-slate-100 text-slate-700"} inset-shadow-sm ${!fromOldArticle ? "inset-shadow-slate-500/50" : "shadow-sm shadow-slate-500/50"} `}
          onClick={() => {
            setFromOldArticle(false);
          }}
        >
          New Article
        </Button>
      </div>
      {fromOldArticle ? (
        <div className="w-full h-full flex gap-2 p-5">
          <div className="w-100 aspect-1/2 flex flex-col gap-2  overflow-scroll no-scrollbar shadow-sm shadow-slate-500/50 p-5 rounded">
            {history.map((h) => (
              <div
                key={h.id}
                className={`p-2 rounded  ${h.id === view?.id && "inset-shadow-sm inset-shadow-slate-500/50"} `}
                onClick={() => {
                  getArticleData(h.id);
                  setView(h);
                }}
              >
                <h4>{h.title}</h4>
              </div>
            ))}
          </div>
          <div className="w-full h-full relative">
            <NoteBook prop={view as Article} operationable={false} />
            <Button className={`absolute top-10 right-10 ${!view && "hidden"}`}>
              Generate from this article
            </Button>
          </div>
        </div>
      ) : (
        <ArticleSummary />
      )}
    </div>
  );
};
