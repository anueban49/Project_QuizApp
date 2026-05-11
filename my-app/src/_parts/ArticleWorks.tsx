"use client";
import { useEffect, useState } from "react";
import { Article, useQuizgeek } from "@/providers/QuizgeekProvider";
import { NoteBook } from "./Notebook";
import { LoadingScreen } from "./LoadingScreen";

export const ArticlesWorks = () => {
  const { history, getArticlesHistory, getArticleData, loading } =
    useQuizgeek();
  const [view, setView] = useState<Article | null>(null);
  useEffect(() => {
    getArticlesHistory();
  }, []);

  useEffect(() => {
    if (history.length > 0 && !view) {
      setView(history[0]);
    }
  }, [history]);
  return (
    <>
      <div className="w-full h-full flex gap-2 p-5">
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <div className="w-2/5 flex flex-col gap-2 h-full overflow-scroll no-scrollbar">
              {history.map((h) => (
                <div
                  key={h.id}
                  className={`p-2 rounded cursor-pointer transition-colors ${view?.id === h.id && "inset-shadow-sm inset-shadow-slate-500/50"}`}
                  onClick={() => {
                    setView(h);
                  }}
                >
                  {h.title}
                </div>
              ))}
            </div>
            {view ? (
              <NoteBook prop={view as Article} operationable={true} />
            ) : (
              <div>Choose article to view</div>
            )}
          </>
        )}
      </div>
    </>
  );
};
