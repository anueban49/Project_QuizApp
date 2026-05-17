"use client";

import { useEffect, useState } from "react";
import { NoteBook } from "./Notebook";
import { Article, useQuizgeek } from "@/providers/QuizgeekProvider";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { Quiz } from "./Quiz";
import ArticleSummary from "./ArticleSummary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
type OptionType = {
  difficulty?: "easy" | "medium" | "hard";
  size?: "2" | "3" | "4" | "5" | "6";
  userApiKey?: string;
  language?: string;
};
export const QuizSection = () => {
  const {
    getArticlesHistory,
    getArticleData,
    history,
    generateQuiz,
    getSavedQuiz,
    setActive,
  } = useQuizgeek();
  const { theme } = useTheme();
  const [view, setView] = useState<Article | null>(null);
  const [mode, setMode] = useState<"intermission" | "quizzing">("intermission");
  const [options, setOptions] = useState<OptionType>({
    difficulty: "medium",
    size: "3",
    userApiKey: "",
    language: "english",
  });
  useEffect(() => {
    setActive("QuizSection");
    getArticlesHistory();
  }, []);

  useEffect(() => {
    if (!view && history.length > 0) {
      setView(history[0]);
    }
  }, [history, view]);
  const [fromOldArticle, setFromOldArticle] = useState(true);
  if (mode === "intermission") {
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
        <div className="w-full p-5">
          <h3>Options</h3>
          <div className="flex gap-3 mx-2">
            <Select
              defaultValue="medium"
              value={options.difficulty}
              onValueChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  difficulty: val as OptionType["difficulty"],
                }))
              }
            >
              <SelectTrigger
                className={`w-[180] ${theme === "dark" ? "dark text-slate-400" : "bg-white text-slate-700"}`}
              >
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select
              defaultValue="3"
              value={options.size}
              onValueChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  size: val as OptionType["size"],
                }))
              }
            >
              <SelectTrigger
                className={`w-[100] ${theme === "dark" ? "dark text-slate-400" : "bg-white text-slate-700"}`}
              >
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
            <Input
              className={`w-full ${theme === "dark" ? "dark" : "bg-white"}`}
              value={options.userApiKey}
              placeholder="Optional API key. Visit https://aistudio.google.com to get your custom API key"
              onChange={(e) => {
                setOptions((prev) => ({
                  ...prev,
                  userApiKey: e.target.value,
                }));
              }}
            ></Input>
            <Select
              value={options.language}
              onValueChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  language: val as OptionType["language"],
                }))
              }
            >
              <SelectTrigger
                className={`${theme === "dark" ? "dark text-slate-400" : "bg-white text-slate-700"}`}
              >
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Mongolian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {history ? (
          <>
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
                  <div className="absolute top-5 right-5 flex gap-2">
                    <Button
                      disabled={!view}
                      onClick={async () => {
                        const loaded = await getSavedQuiz(view?.id as string);
                        if (loaded) {
                          setMode("quizzing");
                        } else {
                          window.alert("No saved quiz found for this article.");
                        }
                      }}
                      className={`rounded-2xl ${theme === "dark" ? "bg-slate-700 text-slate-50" : "bg-slate-100 text-slate-700"}`}
                    >
                      Load saved quiz
                    </Button>
                    <Button
                      disabled={!view}
                      onClick={async () => {
                        await generateQuiz({
                          articleId: view?.id as string,
                          size: options.size,
                          difficulty: options.difficulty,
                          userApiKey: options.userApiKey,
                          language: options.language,
                        });
                        setMode("quizzing");
                      }}
                      className={`rounded-2xl ${theme === "dark" ? "bg-slate-700 text-slate-50" : "bg-slate-100 text-slate-700"}`}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <ArticleSummary />
            )}
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center text-slate-300">
            No history found
          </div>
        )}
      </div>
    );
  }
  if (mode === "quizzing") {
    return (
      <>
        <Quiz articleId={view?.id as string} />
      </>
    );
  }
};
